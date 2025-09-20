import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaDoorOpen,
  FaClipboardList,
  FaUsers,
  FaChartBar,
  FaComments,
  FaArrowLeft,
  FaHotel,
} from "react-icons/fa";
import "./SideBar.scss";

function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  const handleBackToUser = () => {
    onLogout();      // Xóa user + token
    navigate("/");   // Điều hướng về trang chủ ngay
  };

  const menuItems = [
    { path: "/dashboard", label: "Tổng quan", icon: <FaHome /> },
    { path: "/hotelmanagement", label: "Quản lý khách sạn", icon: <FaHotel /> },
    { path: "/rooms", label: "Quản lý phòng", icon: <FaDoorOpen /> },
    { path: "/bookings", label: "Đơn đặt phòng", icon: <FaClipboardList /> },
    { path: "/users", label: "Người dùng", icon: <FaUsers /> },
    { path: "/revenue", label: "Doanh thu", icon: <FaChartBar /> },
    { path: "/review", label: "Đánh giá", icon: <FaComments /> },
  ];

  return (
    <div className="Sidebar">
      <h5 className="px-2 mb-3">Admin Dashboard</h5>
      <nav className="d-flex flex-column">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className="d-flex align-items-center mb-3"
            style={({ isActive }) => ({
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: isActive ? "600" : "400",
              color: isActive ? "#0d6efd" : "#333",
              gap: "8px",
            })}
          >
            <span style={{ fontSize: "18px", marginRight: "8px" }}>
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}

        {/* Nút về trang người dùng */}
        <button
          onClick={handleBackToUser}
          className="d-flex align-items-center mb-3 btn btn-link p-0"
          style={{
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: "400",
            color: "#333",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "18px", marginRight: "8px" }}>
            <FaArrowLeft />
          </span>
          Về trang người dùng
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
