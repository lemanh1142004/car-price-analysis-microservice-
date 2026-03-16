import { useEffect, useState } from "react";
import axios from "axios";

function CarListPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

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

      setCars(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách xe:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="card" style={{ width: "900px", maxWidth: "95%" }}>
        <h2>Danh sách xe</h2>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : cars.length === 0 ? (
          <p>Không có dữ liệu xe</p>
        ) : (
          <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Hãng</th>
                <th>Mẫu xe</th>
                <th>Năm</th>
                <th>Giá</th>
                <th>Số km</th>
                <th>Nhiên liệu</th>
                <th>Hộp số</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td>{car.id}</td>
                  <td>{car.brand}</td>
                  <td>{car.model}</td>
                  <td>{car.year}</td>
                  <td>{car.price}</td>
                  <td>{car.mileage}</td>
                  <td>{car.fuelType}</td>
                  <td>{car.transmission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CarListPage;