import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
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
      const res = await registerUser(formData);

      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Đăng ký thành công");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="card">
        <h2>Đăng ký tài khoản</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Nhập email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Nhập số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="fullName"
            placeholder="Nhập họ tên"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <p className="switch-text">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;