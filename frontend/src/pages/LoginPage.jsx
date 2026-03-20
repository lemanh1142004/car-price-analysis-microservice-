import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await loginUser(formData);

      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Đăng nhập thành công");
      setTimeout(() => navigate("/cars"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <div className="auth-left">
          <div className="auth-brand">Car Price Analytics</div>
          <h1>Đăng nhập để tiếp tục</h1>
          <p>
            Truy cập hệ thống quản lý ô tô, phân khúc giá thông minh
            và gợi ý các xe liên quan theo dữ liệu thực tế.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">Quản lý danh sách xe</div>
            <div className="auth-feature-item">Phân khúc xe theo AI</div>
            <div className="auth-feature-item">Gợi ý xe liên quan</div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>Đăng nhập</h2>
              <p>Nhập thông tin tài khoản để truy cập hệ thống</p>
            </div>

            <form className="auth-form modern-auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Nhập email của bạn"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="auth-submit-btn" type="submit" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            <p className="switch-text">
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;