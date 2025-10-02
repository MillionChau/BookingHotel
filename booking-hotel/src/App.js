import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";

// Customer Components
import Header from "./component/Header/Header";
import Footer from "./component/Footer/Footer";
import HotelDetail from "./component/HotelDetail/HotelDetail";
import SearchPage from "./component/SearchPage/SearchPage";
import ProfilePage from "./component/Profile/Profile";
// import FavoriteCard from "./component/FavoriteCard/FavoriteCard";
import BookingHistory from "./component/BookingHistory/BookingHistory";
import Login from "./component/Login/Login";
import Register from "./component/Register/Register";
import Home from "./component/Home/Home";
import FavoriteList from "./component/Favorite/FavoriteList";

// Admin Components
import Sidebar from "./admin/SideBar/SideBar";
import Dashboard from "./admin/DashBoard/DashBoard";
import HotelManagement from "./admin/HotelManagement/HotelManagement";
import RoomManager from "./admin/RoomManager/RoomManager";
import ReviewManager from "./admin/ReviewManager/ReviewManager";
import BookingManagement from "./admin/BookingManagement/BookingManagement";
import RevenueManager from "./admin/RevenueManager/RevenueManager";
import UserManager from "./admin/UserManager/UserManager";
import PaymentSuccess from "./component/PaymentSuccess/PaymentSuccess";

// Protected Route
const ProtectedRoute = ({ children, requiredRole, user }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole)
    return <Navigate to="/" replace />;
  return children;
};

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const location = useLocation();
  const hideLayout = ["/login", "/register"].includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <>
      {/* ======================= Layout Customer ======================= */}
      {user && user.role === "Customer" && (
        <div className="App">
          {!hideLayout && <Header user={user} onLogout={handleLogout} />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/favoriteList" element={<FavoriteList />} />
            <Route path="/HotelDetail/:hotelId" element={<HotelDetail />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute requiredRole="Customer" user={user}>
                  <ProfilePage user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/BookingList"
              element={
                <ProtectedRoute requiredRole="Customer" user={user}>
                  <BookingHistory />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {!hideLayout && <Footer />}
        </div>
      )}

      {/* ======================= Layout Admin ======================= */}
      {user && user.role === "Admin" && (
        <div style={{ display: "flex" }}>
          <Sidebar onLogout={handleLogout} />
          <div style={{ flex: 1, padding: "20px" }}>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="Admin" user={user}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hotelmanagement"
                element={
                  <ProtectedRoute requiredRole="Admin" user={user}>
                    <HotelManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rooms"
                element={
                  <ProtectedRoute requiredRole="Admin" user={user}>
                    <RoomManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute requiredRole="Admin" user={user}>
                    <BookingManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute requiredRole="Admin" user={user}>
                    <UserManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/revenue"
                element={
                  <ProtectedRoute requiredRole="Admin" user={user}>
                    <RevenueManager /> 
                  </ProtectedRoute>
                }
              />
              <Route
                path="/review"
                element={
                  <ProtectedRoute requiredRole="Admin" user={user}>
                    {/* <ReviewManager /> */}
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      )}

      {/* ======================= Layout Guest ======================= */}
      {!user && (
        <div className="App">
          {!hideLayout && <Header user={user} onLogout={handleLogout} />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            
            <Route path="/BookingList" element={<HotelDetail />} />
            <Route path="/FavoriteList" element={<FavoriteList />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute requiredRole="Customer" user={user}>
                  <ProfilePage user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/BookingList"
              element={
                <ProtectedRoute requiredRole="Customer" user={user}>
                  <BookingHistory />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {!hideLayout && <Footer />}
        </div>
      )}
    </>
  );
}

export default App;
