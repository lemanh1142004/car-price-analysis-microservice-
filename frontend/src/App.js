import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CarListPage from "./pages/CarListPage";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">Trang chủ</Link>
        {token && <Link to="/cars">Quản lý xe</Link>}
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
  const token = localStorage.getItem("token");

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={token ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/cars" element={token ? <CarListPage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;