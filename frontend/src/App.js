import { Routes, Route, Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CarListPage from "./pages/CarListPage";
import CarDetailPage from "./pages/CarDetailPage";
import SegmentsPage from "./pages/SegmentsPage";

function Navbar({ token, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* CHỈ HIỆN TRANG CHỦ KHI CHƯA LOGIN */}
        {!token && <Link to="/">Trang chủ</Link>}

        {/* SAU KHI LOGIN */}
        {token && <Link to="/cars">Quản lý xe</Link>}
        {token && <Link to="/segments">Phân khúc xe</Link>}

        {/* CHƯA LOGIN */}
        {!token && <Link to="/register">Đăng ký</Link>}
        {!token && <Link to="/login">Đăng nhập</Link>}
      </div>

      <div className="nav-right">
        {token && <button onClick={handleLogout}>Đăng xuất</button>}
      </div>
    </nav>
  );
}

function App() {
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
  };

  return (
    <div>
      <Navbar token={token} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={token ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/cars" />} />
        <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/cars" />} />
        <Route path="/cars" element={token ? <CarListPage /> : <Navigate to="/login" />} />
        <Route path="/cars/:id" element={token ? <CarDetailPage /> : <Navigate to="/login" />} />
        <Route path="/segments" element={token ? <SegmentsPage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;