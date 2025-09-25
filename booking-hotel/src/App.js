import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Layouts
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import Home from "./component/Home/Home";
import SearchPage from "./component/SearchPage/SearchPage";
import HotelDetail from "./component/HotelDetail/HotelDetail";
import FavoriteList from "./component/Favorite/FavoriteList";
import ProfilePage from "./component/Profile/Profile";
import BookingHistory from "./component/BookingHistory/BookingHistory";
import Login from "./component/Login/Login";
import Register from "./component/Register/Register";

// Admin Pages
import Dashboard from "./admin/DashBoard/DashBoard";
import HotelManagement from "./admin/HotelManagement/HotelManagement";
import RoomManager from "./admin/RoomManager/RoomManager";
import BookingManagement from "./admin/BookingManagement/BookingManagement";
import UserManager from "./admin/UserManager/UserManager";
import ReviewManager from "./admin/ReviewManager/ReviewManager";

// Protected Route (Giữ nguyên)
const ProtectedRoute = ({ children, requiredRole, user }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    // Nếu là admin vào trang customer thì về dashboard, customer vào admin thì về home
    const redirectPath = user.role === "Admin" ? "/dashboard" : "/";
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Routes>
      {/* ========== Layout cho Admin ========== */}
      <Route
        path="/*"
        element={
          <ProtectedRoute requiredRole="Admin" user={user}>
            <AdminLayout onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="hotelmanagement" element={<HotelManagement />} />
        <Route path="rooms" element={<RoomManager />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="users" element={<UserManager />} />
        <Route path="review" element={<ReviewManager />} />
        {/* Redirect tất cả các route không khớp của admin về dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* ========== Layout cho Customer & Guest ========== */}
      <Route
        path="/*"
        element={<CustomerLayout user={user} onLogout={handleLogout} />}
      >
        {/* Route công khai */}
        <Route index element={<Home />} />
        <Route path="BookingHotel" element={<SearchPage />} />
        <Route path="HotelDetail/:hotelId" element={<HotelDetail />} />
        <Route path="login" element={<Login setUser={setUser} />} />
        <Route path="register" element={<Register />} />
        
        {/* Route chỉ dành cho Customer */}
        <Route
          path="profile"
          element={
            <ProtectedRoute requiredRole="Customer" user={user}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="FavoriteList"
          element={
            <ProtectedRoute requiredRole="Customer" user={user}>
              <FavoriteList />
            </ProtectedRoute>
          }
        />
        <Route
          path="BookingList"
          element={
            <ProtectedRoute requiredRole="Customer" user={user}>
              <BookingHistory />
            </ProtectedRoute>
          }
        />
        
        {/* Redirect tất cả các route không khớp về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;