import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function formatPrice(value) {
  return value ? value : "Chưa có giá";
}

function CarListPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCars(page);
  }, [page]);

  const fetchCars = async (currentPage) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:8080/api/cars?page=${currentPage}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;
      console.log("API /api/cars:", data);

      if (Array.isArray(data)) {
        setCars(data);
        setTotalPages(1);
      } else if (Array.isArray(data.content)) {
        setCars(data.content);
        setTotalPages(data.totalPages || 0);
      } else {
        setCars([]);
        setTotalPages(0);
        setError("Dữ liệu trả về không đúng định dạng.");
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách xe:", error);
      setCars([]);
      setTotalPages(0);
      setError("Không thể tải danh sách xe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="car-page">
      <div className="page-header">
        <h1>Danh sách xe</h1>
        <p>Chọn một chiếc xe để xem chi tiết.</p>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p>{error}</p>
      ) : cars.length === 0 ? (
        <p>Không có dữ liệu xe hợp lệ.</p>
      ) : (
        <>
          <div className="car-grid">
            {cars.map((car) => (
              <div
                key={car.id}
                className="car-card"
                onClick={() => navigate(`/cars/${car.id}`)}
              >
                <div className="car-image-wrap">
                  <img
                    src={car.urlHinhAnh || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={car.tieuDe || "Car image"}
                    className="car-image"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                </div>

                <div className="car-card-body">
                  <div className="car-title-row">
                    <h3>{car.tieuDe || "Không có tiêu đề"}</h3>
                    <span className="car-year">{car.namSx || "N/A"}</span>
                  </div>

                  <p className="car-price">{formatPrice(car.gia)}</p>

                  <div className="car-meta-grid">
                    <div>
                      <span>Số km</span>
                      <strong>{car.soKmDaDi || "N/A"}</strong>
                    </div>
                    <div>
                      <span>Nhiên liệu</span>
                      <strong>{car.nhienLieu || "N/A"}</strong>
                    </div>
                    <div>
                      <span>Hộp số</span>
                      <strong>{car.hopSo || "N/A"}</strong>
                    </div>
                    <div>
                      <span>ID</span>
                      <strong>#{car.id}</strong>
                    </div>
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

          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage(0)}>
              ⏮
            </button>

            <button disabled={page === 0} onClick={() => setPage(page - 1)}>
              ←
            </button>

            {[...Array(totalPages)].map((_, i) => {
              if (
                i === 0 ||
                i === totalPages - 1 ||
                (i >= page - 2 && i <= page + 2)
              ) {
                return (
                  <button
                    key={i}
                    className={i === page ? "active-page" : ""}
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </button>
                );
              }

              if (i === page - 3 || i === page + 3) {
                return <span key={i}>...</span>;
              }

              return null;
            })}

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              →
            </button>

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(totalPages - 1)}
            >
              ⏭
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CarListPage;