import { useState } from "react";
import axios from "axios";

function formatPrice(value) {
  return new Intl.NumberFormat("vi-VN").format(value) + " VNĐ";
}

function SimilarCarsPage() {
  const [carId, setCarId] = useState("");
  const [result, setResult] = useState(null);

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8080/api/ai/recommendations/similar/${carId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(res.data);
    } catch (error) {
      console.error("Lỗi gợi ý xe:", error);
      alert("Không tìm thấy xe hoặc chưa có dữ liệu");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2>Gợi ý xe tương tự</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="Nhập ID xe"
          value={carId}
          onChange={(e) => setCarId(e.target.value)}
          style={{ padding: "8px", marginRight: "8px" }}
        />
        <button onClick={fetchRecommendations}>Tìm xe tương tự</button>
      </div>

      {result && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <h3>Xe đang xem</h3>
            <p>
              {result.currentCar.brand} {result.currentCar.model} - {formatPrice(result.currentCar.price)}
            </p>
          </div>

          <div>
            <h3>Xe cùng phân khúc</h3>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {result.recommendedCars.map((car) => (
                <div
                  key={car.id}
                  style={{
                    width: "240px",
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <img
                    src={car.imageUrl}
                    alt={car.model}
                    style={{ width: "100%", height: "160px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "12px" }}>
                    <h4>{car.brand} {car.model}</h4>
                    <p>Năm: {car.year}</p>
                    <p>Giá: {formatPrice(car.price)}</p>
                    <p>Số km: {car.mileage}</p>
                    <p>Nhiên liệu: {car.fuelType}</p>
                    <p>Hộp số: {car.transmission}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SimilarCarsPage;