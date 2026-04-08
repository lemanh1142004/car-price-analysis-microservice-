from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import numpy as np
import re
import traceback

app = FastAPI(title="AI Service - Car Analytics")

DB_URL = "postgresql+psycopg2://postgres:123456@localhost:5432/car_db"
engine = create_engine(DB_URL)

SEGMENT_LABELS = [
    "Phân khúc phổ thông",
    "Phân khúc trung cấp",
    "Phân khúc cao cấp",
]


def parse_price_to_vnd(value):
    if value is None or pd.isna(value):
        return np.nan

    text = str(value).strip().lower()
    if not text:
        return np.nan

    text = text.replace(",", ".")
    nums = re.findall(r"\d+(?:\.\d+)?", text)
    if not nums:
        return np.nan

    number = float(nums[0])

    if "tỷ" in text or "ty" in text:
        return number * 1_000_000_000
    if "triệu" in text or "trieu" in text:
        return number * 1_000_000
    if "nghìn" in text or "nghin" in text or "ngàn" in text or "ngan" in text:
        return number * 1_000

    digits = re.sub(r"[^\d]", "", text)
    if digits:
        return float(digits)

    return number


def parse_number(value):
    if value is None or pd.isna(value):
        return np.nan

    text = str(value).strip().lower()
    if not text:
        return np.nan

    digits = re.sub(r"[^\d]", "", text)
    if not digits:
        return np.nan

    return float(digits)


def extract_brand(title):
    if title is None or pd.isna(title):
        return "Unknown"
    text = str(title).strip()
    if not text:
        return "Unknown"
    return text.split()[0]


def load_cars():
    query = """
        SELECT
            id,
            ma_tin,
            tieu_de,
            url,
            url_hinh_anh,
            ngay_dang,
            nam_sx,
            xuat_xu,
            dia_diem,
            kieu_dang,
            so_km_da_di,
            hop_so,
            tinh_trang,
            nhien_lieu,
            gia
        FROM public.du_lieu_oto
    """
    return pd.read_sql(query, engine)


def preprocess(df: pd.DataFrame):
    df = df.copy()

    if df.empty:
        return df

    df["brand"] = df["tieu_de"].apply(extract_brand)
    df["price_value"] = df["gia"].apply(parse_price_to_vnd)
    df["year_value"] = df["nam_sx"].apply(parse_number)
    df["mileage_value"] = df["so_km_da_di"].apply(parse_number)

    if df["price_value"].notna().sum() == 0:
        df["price_value"] = 0
    else:
        df["price_value"] = df["price_value"].fillna(df["price_value"].median())

    if df["year_value"].notna().sum() == 0:
        df["year_value"] = 0
    else:
        df["year_value"] = df["year_value"].fillna(df["year_value"].median())

    if df["mileage_value"].notna().sum() == 0:
        df["mileage_value"] = 0
    else:
        df["mileage_value"] = df["mileage_value"].fillna(df["mileage_value"].median())

    text_cols = [
        "ma_tin", "tieu_de", "url", "url_hinh_anh", "ngay_dang", "xuat_xu",
        "dia_diem", "kieu_dang", "hop_so", "tinh_trang", "nhien_lieu", "gia"
    ]
    for col in text_cols:
        df[col] = df[col].fillna("")

    return df

def cluster_cars(df: pd.DataFrame, n_clusters: int = 3):
    df = preprocess(df)

    if len(df) == 0:
        return df

    X = df[["price_value", "year_value", "mileage_value"]].copy()
    X = X.replace([np.inf, -np.inf], np.nan).fillna(0)

    unique_points = len(X.drop_duplicates())
    k = min(n_clusters, len(df), unique_points)

    if k <= 1:
        df["cluster"] = 0
        df["segment_id"] = 0
        return df

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = KMeans(n_clusters=k, random_state=42, n_init=10)
    df["cluster"] = model.fit_predict(X_scaled)

    cluster_price_order = (
        df.groupby("cluster")["price_value"]
        .mean()
        .sort_values()
        .index
        .tolist()
    )

    cluster_mapping = {old_cluster: idx for idx, old_cluster in enumerate(cluster_price_order)}
    df["segment_id"] = df["cluster"].map(cluster_mapping).fillna(0).astype(int)

    return df


@app.get("/")
def home():
    return {"message": "AI Service is running"}


@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-service"}


@app.get("/debug/db")
def debug_db():
    try:
        df = load_cars()
        return {
            "count": int(len(df)),
            "columns": df.columns.tolist(),
            "sample": df.head(3).fillna("").to_dict(orient="records")
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/segments")
def get_segments():
    try:
        df = load_cars()
        df = cluster_cars(df, n_clusters=3)

        if df.empty:
            return []

        segments = []
        grouped = df.groupby("segment_id")

        for segment_id, group in grouped:
            avg_price = float(group["price_value"].fillna(0).mean())
            min_price = float(group["price_value"].fillna(0).min())
            max_price = float(group["price_value"].fillna(0).max())

            top_brands = (
                group["brand"]
                .fillna("Unknown")
                .value_counts()
                .head(3)
                .index
                .tolist()
            )

            seg_id = int(segment_id) if pd.notna(segment_id) else 0
            name = SEGMENT_LABELS[seg_id] if seg_id < len(SEGMENT_LABELS) else f"Phân khúc {seg_id}"

            segments.append({
                "segmentId": seg_id,
                "name": name,
                "minPrice": min_price,
                "maxPrice": max_price,
                "avgPrice": avg_price,
                "count": int(len(group)),
                "topBrands": top_brands,
            })

        return sorted(segments, key=lambda x: x["avgPrice"])
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/segments/{segment_id}/cars")
def get_cars_by_segment(segment_id: int):
    try:
        df = load_cars()
        df = cluster_cars(df, n_clusters=3)

        if df.empty:
            return []

        filtered = df[df["segment_id"] == segment_id].copy()

        if filtered.empty:
            return []

        result = []
        for _, row in filtered.iterrows():
            result.append({
                "id": int(row["id"]),
                "maTin": row["ma_tin"],
                "tieuDe": row["tieu_de"],
                "url": row["url"],
                "urlHinhAnh": row["url_hinh_anh"],
                "ngayDang": row["ngay_dang"],
                "namSX": row["nam_sx"],
                "xuatXu": row["xuat_xu"],
                "diaDiem": row["dia_diem"],
                "kieuDang": row["kieu_dang"],
                "soKmDaDi": row["so_km_da_di"],
                "hopSo": row["hop_so"],
                "tinhTrang": row["tinh_trang"],
                "nhienLieu": row["nhien_lieu"],
                "gia": row["gia"],
                "segmentId": int(row["segment_id"]),
                "priceValue": float(row["price_value"]),
                "yearValue": float(row["year_value"]),
                "mileageValue": float(row["mileage_value"]),
            })

        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/recommendations/similar/{car_id}")
def get_similar_cars(car_id: int):
    try:
        df = load_cars()
        df = cluster_cars(df, n_clusters=3)

        if df.empty:
            raise HTTPException(status_code=404, detail="Không có dữ liệu xe")

        current_car_df = df[df["id"] == car_id]
        if current_car_df.empty:
            raise HTTPException(status_code=404, detail="Không tìm thấy xe")

        current_car = current_car_df.iloc[0]
        current_segment = int(current_car["segment_id"]) if pd.notna(current_car["segment_id"]) else 0

        candidates = df[
            (df["segment_id"] == current_segment) &
            (df["id"] != car_id)
        ].copy()

        if candidates.empty:
            candidates = df[df["id"] != car_id].copy()

        if candidates.empty:
            return {
                "currentCar": {
                    "id": int(current_car["id"]),
                    "maTin": current_car["ma_tin"] or "",
                    "tieuDe": current_car["tieu_de"] or "",
                    "gia": current_car["gia"] or "",
                    "segmentId": current_segment
                },
                "recommendedCars": []
            }

        current_vector = np.array([
            float(current_car["price_value"]) if pd.notna(current_car["price_value"]) else 0.0,
            float(current_car["year_value"]) if pd.notna(current_car["year_value"]) else 0.0,
            float(current_car["mileage_value"]) if pd.notna(current_car["mileage_value"]) else 0.0
        ])

        def calc_distance(row):
            vec = np.array([
                float(row["price_value"]) if pd.notna(row["price_value"]) else 0.0,
                float(row["year_value"]) if pd.notna(row["year_value"]) else 0.0,
                float(row["mileage_value"]) if pd.notna(row["mileage_value"]) else 0.0
            ])
            dist = np.linalg.norm(current_vector - vec)
            if np.isnan(dist) or np.isinf(dist):
                return 999999999.0
            return float(dist)

        candidates["distance"] = candidates.apply(calc_distance, axis=1)
        candidates = candidates.sort_values(by="distance").head(6)

        recommended = []
        for _, row in candidates.iterrows():
            recommended.append({
                "id": int(row["id"]),
                "maTin": row["ma_tin"] or "",
                "tieuDe": row["tieu_de"] or "",
                "url": row["url"] or "",
                "urlHinhAnh": row["url_hinh_anh"] or "",
                "ngayDang": row["ngay_dang"] or "",
                "namSx": row["nam_sx"] or "",
                "xuatXu": row["xuat_xu"] or "",
                "diaDiem": row["dia_diem"] or "",
                "kieuDang": row["kieu_dang"] or "",
                "soKmDaDi": row["so_km_da_di"] or "",
                "hopSo": row["hop_so"] or "",
                "tinhTrang": row["tinh_trang"] or "",
                "nhienLieu": row["nhien_lieu"] or "",
                "gia": row["gia"] or "",
                "segmentId": int(row["segment_id"]) if pd.notna(row["segment_id"]) else 0,
                "distance": float(row["distance"]) if pd.notna(row["distance"]) else 999999999.0,
            })

        return {
            "currentCar": {
                "id": int(current_car["id"]),
                "maTin": current_car["ma_tin"] or "",
                "tieuDe": current_car["tieu_de"] or "",
                "gia": current_car["gia"] or "",
                "segmentId": current_segment
            },
            "recommendedCars": recommended
        }
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))