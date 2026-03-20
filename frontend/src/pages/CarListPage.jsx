import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function formatPrice(value) {
  return new Intl.NumberFormat("vi-VN").format(value) + " VNĐ";
}

function CarListPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:8080/api/cars", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCars(res.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách xe:", error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="car-page">
      <div className="page-header">
        <h1>Danh sách xe</h1>
        <p>Chọn một chiếc xe để xem chi tiết và gợi ý các mẫu xe liên quan.</p>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : cars.length === 0 ? (
        <p>Không có dữ liệu xe.</p>
      ) : (
        <div className="car-grid">
          {cars.map((car) => (
            <div
              key={car.id}
              className="car-card"
              onClick={() => navigate(`/cars/${car.id}`)}
            >
              <div className="car-image-wrap">
                <img
                  src={car.imageUrl}
                  alt={car.model}
                  className="car-image"
                />
              </div>

              <div className="car-card-body">
                <div className="car-title-row">
                  <h3>{car.brand} {car.model}</h3>
                  <span className="car-year">{car.year}</span>
                </div>

                <p className="car-price">{formatPrice(car.price)}</p>

                <div className="car-meta-grid">
                  <div><span>Số km</span><strong>{car.mileage}</strong></div>
                  <div><span>Nhiên liệu</span><strong>{car.fuelType || "N/A"}</strong></div>
                  <div><span>Hộp số</span><strong>{car.transmission || "N/A"}</strong></div>
                  <div><span>ID</span><strong>#{car.id}</strong></div>
                </div>

                <button
                  className="primary-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/cars/${car.id}`);
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
  );
}

export default CarListPage;