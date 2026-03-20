from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import numpy as np

app = FastAPI(title="AI Service - Car Analytics")



# Sửa lại đúng DB của bạn
DB_URL = "postgresql://postgres:123456@localhost:5432/car_db"
engine = create_engine(DB_URL)

SEGMENT_LABELS = [
    "Phân khúc phổ thông",
    "Phân khúc trung cấp",
    "Phân khúc cao cấp",
]

def load_cars():
    query = """
        SELECT
            id,
            brand,
            model,
            year,
            price,
            mileage,
            fuel_type,
            transmission,
            color,
            origin,
            status,
            description,
            image_url
        FROM cars
    """
    df = pd.read_sql(query, engine)
    return df

def preprocess(df: pd.DataFrame):
    df = df.copy()

    if df.empty:
        return df

    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    df["year"] = pd.to_numeric(df["year"], errors="coerce")
    df["mileage"] = pd.to_numeric(df["mileage"], errors="coerce")

    df["price"] = df["price"].fillna(df["price"].median())
    df["year"] = df["year"].fillna(df["year"].median())
    df["mileage"] = df["mileage"].fillna(df["mileage"].median())

    df["brand"] = df["brand"].fillna("Unknown")
    df["model"] = df["model"].fillna("Unknown")
    df["fuel_type"] = df["fuel_type"].fillna("Unknown")
    df["transmission"] = df["transmission"].fillna("Unknown")
    df["image_url"] = df["image_url"].fillna("")

    return df

def cluster_cars(df: pd.DataFrame, n_clusters: int = 3):
    df = preprocess(df)

    if len(df) == 0:
        return df

    # Chỉ dùng cột số cho MVP
    X = df[["price", "year", "mileage"]].copy()

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    k = min(n_clusters, len(df))
    model = KMeans(n_clusters=k, random_state=42, n_init=10)
    df["cluster"] = model.fit_predict(X_scaled)

    # Sắp xếp cluster theo giá trung bình tăng dần để đặt tên dễ hiểu
    cluster_price_order = (
        df.groupby("cluster")["price"]
        .mean()
        .sort_values()
        .index
        .tolist()
    )

    cluster_mapping = {}
    for idx, old_cluster in enumerate(cluster_price_order):
        cluster_mapping[old_cluster] = idx

    df["segment_id"] = df["cluster"].map(cluster_mapping)

    return df

@app.get("/")
def home():
    return {"message": "AI Service is running"}

@app.get("/segments")
def get_segments():
    df = load_cars()
    df = cluster_cars(df, n_clusters=3)

    if df.empty:
        return []

    segments = []
    grouped = df.groupby("segment_id")

    for segment_id, group in grouped:
        avg_price = float(group["price"].mean())
        min_price = float(group["price"].min())
        max_price = float(group["price"].max())

        top_brands = (
            group["brand"]
            .value_counts()
            .head(3)
            .index
            .tolist()
        )

        name = SEGMENT_LABELS[segment_id] if segment_id < len(SEGMENT_LABELS) else f"Phân khúc {segment_id}"

        segments.append({
            "segmentId": int(segment_id),
            "name": name,
            "minPrice": min_price,
            "maxPrice": max_price,
            "avgPrice": avg_price,
            "count": int(len(group)),
            "topBrands": top_brands,
        })

    segments = sorted(segments, key=lambda x: x["avgPrice"])
    return segments

@app.get("/segments/{segment_id}/cars")
def get_cars_by_segment(segment_id: int):
    df = load_cars()
    df = cluster_cars(df, n_clusters=3)

    if df.empty:
        return []

    filtered = df[df["segment_id"] == segment_id]

    if filtered.empty:
        return []

    result = filtered[[
        "id", "brand", "model", "year", "price", "mileage",
        "fuel_type", "transmission", "image_url", "segment_id"
    ]].copy()

    result = result.rename(columns={
        "fuel_type": "fuelType",
        "image_url": "imageUrl",
        "segment_id": "segmentId"
    })

    return result.to_dict(orient="records")

@app.get("/recommendations/similar/{car_id}")
def get_similar_cars(car_id: int):
    df = load_cars()
    df = cluster_cars(df, n_clusters=3)

    if df.empty:
        raise HTTPException(status_code=404, detail="Không có dữ liệu xe")

    current_car_df = df[df["id"] == car_id]
    if current_car_df.empty:
        raise HTTPException(status_code=404, detail="Không tìm thấy xe")

    current_car = current_car_df.iloc[0]
    current_segment = current_car["segment_id"]

    candidates = df[
        (df["segment_id"] == current_segment) &
        (df["id"] != car_id)
    ].copy()

    if candidates.empty:
        return {
            "currentCar": {
                "id": int(current_car["id"]),
                "brand": current_car["brand"],
                "model": current_car["model"],
                "price": float(current_car["price"]),
                "segmentId": int(current_segment)
            },
            "recommendedCars": []
        }

    # Tính độ gần dựa trên price, year, mileage
    current_vector = np.array([
        float(current_car["price"]),
        float(current_car["year"]),
        float(current_car["mileage"])
    ])

    def calc_distance(row):
        vec = np.array([
            float(row["price"]),
            float(row["year"]),
            float(row["mileage"])
        ])
        return np.linalg.norm(current_vector - vec)

    candidates["distance"] = candidates.apply(calc_distance, axis=1)
    candidates = candidates.sort_values(by="distance").head(6)

    recommended = candidates[[
        "id", "brand", "model", "year", "price", "mileage",
        "fuel_type", "transmission", "image_url", "segment_id"
    ]].copy()

    recommended = recommended.rename(columns={
        "fuel_type": "fuelType",
        "image_url": "imageUrl",
        "segment_id": "segmentId"
    })

    return {
        "currentCar": {
            "id": int(current_car["id"]),
            "brand": current_car["brand"],
            "model": current_car["model"],
            "price": float(current_car["price"]),
            "segmentId": int(current_segment)
        },
        "recommendedCars": recommended.to_dict(orient="records")
    }