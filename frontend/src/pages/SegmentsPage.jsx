import { useEffect, useState } from "react";
import axios from "axios";

function formatPrice(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "Chưa có giá";
  return new Intl.NumberFormat("vi-VN").format(num) + " VNĐ";
}

function SegmentsPage() {
  const [segments, setSegments] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/ai/segments");
      setSegments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Lỗi lấy phân khúc:", error);
      setSegments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCarsBySegment = async (segmentId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/ai/segments/${segmentId}/cars`
      );
      setSelectedSegment(segmentId);
      setCars(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Lỗi lấy xe theo phân khúc:", error);
      setCars([]);
    }
  };

  return (
    <div className="car-page">
      <div className="page-header">
        <h1>Phân khúc xe thông minh</h1>
        <p>Khám phá các nhóm xe theo mức giá được hệ thống tự động phân cụm.</p>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : segments.length === 0 ? (
        <p>Không có dữ liệu phân khúc.</p>
      ) : (
        <>
          <div className="car-grid">
            {segments.map((segment) => (
              <div
                key={segment.segmentId}
                className="car-card"
                style={{ cursor: "default" }}
              >
                <div className="car-card-body">
                  <div className="detail-badge">{segment.name}</div>
                  <p className="car-price">{formatPrice(segment.avgPrice)}</p>

                  <div className="car-meta-grid">
                    <div>
                      <span>Giá thấp nhất</span>
                      <strong>{formatPrice(segment.minPrice)}</strong>
                    </div>
                    <div>
                      <span>Giá cao nhất</span>
                      <strong>{formatPrice(segment.maxPrice)}</strong>
                    </div>
                    <div>
                      <span>Số lượng xe</span>
                      <strong>{segment.count}</strong>
                    </div>
                    <div>
                      <span>Hãng nổi bật</span>
                      <strong>{segment.topBrands?.join(", ") || "Không có"}</strong>
                    </div>
                  </div>

                  <button
                    className="primary-btn"
                    onClick={() => fetchCarsBySegment(segment.segmentId)}
                  >
                    Xem xe trong phân khúc
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedSegment !== null && (
            <div className="related-section" style={{ marginTop: "30px" }}>
              <div className="section-head">
<h2>
  Xe trong{" "}
  {segments.find((s) => s.segmentId === selectedSegment)?.name || `phân khúc ${selectedSegment}`}
</h2>              </div>

              {cars.length === 0 ? (
                <p>Không có xe trong phân khúc này.</p>
              ) : (
                <div className="car-grid">
                  {cars.map((car) => (
                    <div key={car.id} className="car-card">
                      <div className="car-image-wrap">
                        <img
                          src={car.urlHinhAnh || "https://via.placeholder.com/400x250?text=No+Image"}
                          alt={car.tieuDe || "Xe ô tô"}
                          className="car-image"
                        />
                      </div>

                      <div className="car-card-body">
                        <div className="car-title-row">
                          <h3>{car.tieuDe || "Không có tiêu đề"}</h3>
                          <span className="car-year">{car.namSX || "N/A"}</span>
                        </div>

                        <p className="car-price">
                          {formatPrice(car.priceValue ?? car.gia)}
                        </p>

                        <div className="car-meta-grid">
                          <div>
                            <span>Số km</span>
                            <strong>{car.soKmDaDi || "Không rõ"}</strong>
                          </div>
                          <div>
                            <span>Nhiên liệu</span>
                            <strong>{car.nhienLieu || "Không rõ"}</strong>
                          </div>
                          <div>
                            <span>Hộp số</span>
                            <strong>{car.hopSo || "Không rõ"}</strong>
                          </div>
                          <div>
                            <span>ID</span>
                            <strong>#{car.id}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SegmentsPage;