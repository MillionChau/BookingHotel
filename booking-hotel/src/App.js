import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Customer Components
import Header from "./component/Header/Header";
import Footer from "./component/Footer/Footer";
import HotelDetail from "./component/HotelDetail/HotelDetail";
import SearchPage from "./component/SearchPage/SearchPage";
import ProfilePage from "./component/Profile/Profile";
import FavoriteCard from "./component/FavoriteCard/FavoriteCard";
import BookingHistory from "./component/BookingHistory/BookingHistory";
import Login from "./component/Login/Login";
import Register from "./component/Register/Register";
import Home from "./component/Home/Home";
import Loading from "./component/Loading/Loading";

// Admin Components
import Sidebar from "./admin/SideBar/SideBar";
import Dashboard from "./admin/DashBoard/DashBoard";
import HotelManagement from "./admin/HotelManagement/HotelManagement";
import RoomManager from "./admin/RoomManager/RoomManager";
import BookingManagement from "./admin/BookingManagement/BookingManagement";
import UserManager from "./admin/UserManager/UserManager";

// Protected Route
const ProtectedRoute = ({ children, requiredRole, user }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole)
    return <Navigate to="/" replace />;
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) return <Loading />;

  return (
    <>
      {/* Layout Customer */}
      {user && user.role === "Customer" && (
        <div className="App">
          <Header user={user} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/BookingHotel" element={<SearchPage />} />
            <Route path="/BookingList" element={<HotelDetail />} />
            <Route path="/FavoriteCard" element={<FavoriteCard />} />
            <Route path="/HotelDetail/:hotelId" element={<HotelDetail />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute requiredRole="Customer" user={user}>
                  <ProfilePage />
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
          <Footer />
        </div>
      )}

      {/* Layout Admin */}
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
                    <RoomManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/review"
                element={
                  <ProtectedRoute requiredRole="Admin" user={user}>
                    <RoomManager />
                  </ProtectedRoute>
                }
              />
              {/* các route khác của Admin */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      )}

      {/* Layout Guest */}
      {!user && (
              <div className="App">
          <Header user={user} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/hotel/:id" element={<HotelDetail />} />
            <Route path="/HotelDetail/:hotelId" element={<HotelDetail />} />
            <Route path="/BookingHotel" element={<SearchPage />} />
            <Route path="/BookingList" element={<HotelDetail />} />
            <Route path="/FavoriteCard" element={<FavoriteCard />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute requiredRole="Customer" user={user}>
                  <ProfilePage />
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
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
