import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function formatPrice(value) {
  return new Intl.NumberFormat("vi-VN").format(value) + " VNĐ";
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

      setCar(res.data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết xe:", error);
      setCar(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedCars = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/ai/recommendations/similar/${id}`
      );

      setRelatedCars(res.data?.recommendedCars || []);
    } catch (error) {
      console.error("Lỗi lấy xe liên quan:", error);
      setRelatedCars([]);
    } finally {
      setRelatedLoading(false);
    }
  };

  if (loading) {
    return <div className="car-page"><p>Đang tải chi tiết xe...</p></div>;
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
            src={car.imageUrl}
            alt={car.model}
            className="detail-image"
          />
        </div>

        <div className="detail-info-panel">
          <div className="detail-badge">Chi tiết xe</div>
          <h1>{car.brand} {car.model}</h1>
          <p className="detail-price">{formatPrice(car.price)}</p>

          <div className="detail-grid">
            <div className="detail-item">
              <span>Năm sản xuất</span>
              <strong>{car.year}</strong>
            </div>
            <div className="detail-item">
              <span>Số km</span>
              <strong>{car.mileage}</strong>
            </div>
            <div className="detail-item">
              <span>Nhiên liệu</span>
              <strong>{car.fuelType || "N/A"}</strong>
            </div>
            <div className="detail-item">
              <span>Hộp số</span>
              <strong>{car.transmission || "N/A"}</strong>
            </div>
            <div className="detail-item">
              <span>Màu sắc</span>
              <strong>{car.color || "N/A"}</strong>
            </div>
            <div className="detail-item">
              <span>Xuất xứ</span>
              <strong>{car.origin || "N/A"}</strong>
            </div>
            <div className="detail-item">
              <span>Trạng thái</span>
              <strong>{car.status || "N/A"}</strong>
            </div>
            <div className="detail-item">
              <span>ID xe</span>
              <strong>#{car.id}</strong>
            </div>
          </div>

          <div className="detail-description">
            <h3>Mô tả</h3>
            <p>{car.description || "Chưa có mô tả."}</p>
          </div>
        </div>
      </div>

      <div className="related-section">
        <div className="section-head">
          <h2>Xe liên quan</h2>
          <p>Các xe cùng phân khúc và gần nhất về giá, năm sản xuất, số km.</p>
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
                    src={item.imageUrl}
                    alt={item.model}
                    className="car-image"
                  />
                </div>

                <div className="car-card-body">
                  <div className="car-title-row">
                    <h3>{item.brand} {item.model}</h3>
                    <span className="car-year">{item.year}</span>
                  </div>

                  <p className="car-price">{formatPrice(item.price)}</p>

                  <div className="car-meta-grid">
                    <div><span>Số km</span><strong>{item.mileage}</strong></div>
                    <div><span>Nhiên liệu</span><strong>{item.fuelType || "N/A"}</strong></div>
                    <div><span>Hộp số</span><strong>{item.transmission || "N/A"}</strong></div>
                    <div><span>ID</span><strong>#{item.id}</strong></div>
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