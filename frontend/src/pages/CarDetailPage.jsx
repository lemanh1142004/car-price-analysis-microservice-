import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function formatPrice(value) {
  return value && String(value).trim() !== "" ? value : "Chưa có giá";
}

function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [relatedCars, setRelatedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);

  useEffect(() => {
    fetchCarDetail();
    fetchRelatedCars();
  }, [id]);

  const fetchCarDetail = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`http://localhost:8080/api/cars/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Chi tiet xe:", res.data);
      setCar(res.data);
    } catch (error) {
      console.error("Loi lay chi tiet xe:", error);
      setCar(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedCars = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:8080/api/ai/recommendations/similar/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Xe lien quan:", res.data);
      setRelatedCars(res.data?.recommendedCars || []);
    } catch (error) {
      console.error("Loi lay xe lien quan:", error);
      setRelatedCars([]);
    } finally {
      setRelatedLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="car-page">
        <p>Đang tải chi tiết xe...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="car-page">
        <p>Không tìm thấy xe.</p>
        <button className="primary-btn" onClick={() => navigate("/cars")}>
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="car-page">
      <button className="back-btn" onClick={() => navigate("/cars")}>
        ← Quay lại danh sách xe
      </button>

      <div className="detail-hero">
        <div className="detail-image-panel">
          <img
            src={car.urlHinhAnh || "https://via.placeholder.com/500x300?text=No+Image"}
            alt={car.tieuDe || "Car image"}
            className="detail-image"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/500x300?text=No+Image";
            }}
          />
        </div>

        <div className="detail-info-panel">
          <div className="detail-badge">Chi tiết xe</div>
          <h1>{car.tieuDe || "Không có tiêu đề"}</h1>
          <p className="detail-price">{formatPrice(car.gia)}</p>

          <div className="detail-grid">
            <div className="detail-item">
              <span>Năm sản xuất</span>
     <strong>
  {car.namSX ? parseInt(car.namSX, 10) : "N/A"}
</strong>
            </div>
            <div className="detail-item">
              <span>Số km</span>
              <strong>{car.soKmDaDi || "N/A"}</strong>
            </div>
            <div className="detail-item">
              <span>Nhiên liệu</span>
              <strong>{car.nhienLieu || "N/A"}</strong>
            </div>
            <div className="detail-item">
              <span>Hộp số</span>
              <strong>{car.hopSo || "N/A"}</strong>
            </div>
            <div className="detail-item">
              <span>Kiểu dáng</span>
              <strong>{car.kieuDang || "N/A"}</strong>
            </div>
            <div className="detail-item">
              <span>Xuất xứ</span>
              <strong>{car.xuatXu || "N/A"}</strong>
            </div>
            <div className="detail-item">
              <span>Tình trạng</span>
              <strong>{car.tinhTrang || "N/A"}</strong>
            </div>
            <div className="detail-item">
              <span>Địa điểm</span>
              <strong>{car.diaDiem || "N/A"}</strong>
            </div>
            <div className="detail-item">
              <span>Ngày đăng</span>
              <strong>{car.ngayDang || "N/A"}</strong>
            </div>
            <div className="detail-item">
              <span>ID xe</span>
              <strong>#{car.id}</strong>
            </div>
          </div>

          <div className="detail-description">
            <h3>Đường dẫn bài đăng</h3>
            {car.url ? (
              <a href={car.url} target="_blank" rel="noreferrer">
                Xem bài đăng gốc
              </a>
            ) : (
              <p>Không có URL bài đăng.</p>
            )}
          </div>
        </div>
      </div>

      <div className="related-section">
        <div className="section-head">
          <h2>Xe liên quan</h2>
          <p>Các xe có dữ liệu gần giống với xe đang xem.</p>
        </div>

        {relatedLoading ? (
          <p>Đang tải xe liên quan...</p>
        ) : relatedCars.length === 0 ? (
          <p>Chưa có xe liên quan phù hợp.</p>
        ) : (
          <div className="car-grid">
            {relatedCars.map((item) => (
              <div
                key={item.id}
                className="car-card"
                onClick={() => navigate(`/cars/${item.id}`)}
              >
                <div className="car-image-wrap">
                  <img
                    src={item.urlHinhAnh || "https://via.placeholder.com/400x250?text=No+Image"}
                    alt={item.tieuDe || "Car image"}
                    className="car-image"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x250?text=No+Image";
                    }}
                  />
                </div>

                <div className="car-card-body">
                  <div className="car-title-row">
                    <h3>{item.tieuDe || "Không có tiêu đề"}</h3>
                    <span className="car-year">{item.namSX || "N/A"}</span>
                  </div>

                  <p className="car-price">{formatPrice(item.gia)}</p>

                  <div className="car-meta-grid">
                    <div>
                      <span>Số km</span>
                      <strong>{item.soKmDaDi || "N/A"}</strong>
                    </div>
                    <div>
                      <span>Nhiên liệu</span>
                      <strong>{item.nhienLieu || "N/A"}</strong>
                    </div>
                    <div>
                      <span>Hộp số</span>
                      <strong>{item.hopSo || "N/A"}</strong>
                    </div>
                    <div>
                      <span>ID</span>
                      <strong>#{item.id}</strong>
                    </div>
                  </div>

                  <button
                    className="primary-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/cars/${item.id}`);
                    }}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CarDetailPage;