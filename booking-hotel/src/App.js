import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Customer Components
import Header from "./component/Header/Header";
import Footer from "./component/Footer/Footer";
import HotelDetail from "./component/HotelDetail/HotelDetail";
import SearchPage from "./component/SearchPage/SearchPage";
import ProfilePage from "./component/Profile/Profile";
import BookingHistory from "./component/BookingHistory/BookingHistory";
import Login from "./component/Login/Login";
import Register from "./component/Register/Register";
import Home from "./component/Home/Home";

// Admin Components
import Sidebar from "./admin/SideBar/SideBar";
import Dashboard from "./admin/DashBoard/DashBoard";
import HotelManagement from "./admin/HotelManagement/HotelManagement";
import RoomManager from "./admin/RoomManager/RoomManager";
import BookingManagement from "./admin/BookingManagement/BookingManagement";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!user.role) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in on app load
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <BrowserRouter>
      {/* Render customer layout for customer users */}
      {user && user.role === 'Customer' && (
        <div className="App">
          <Header user={user} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/hotel/:id" element={<HotelDetail />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute requiredRole="Customer">
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute requiredRole="Customer">
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

      {/* Render admin layout for admin users */}
      {user && user.role === 'Admin' && (
        <div style={{ display: "flex" }}>
          <Sidebar onLogout={handleLogout} />
          <div style={{ flex: 1, padding: "20px" }}>
            <Routes>
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/hotelmanagement" 
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <HotelManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/rooms" 
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <RoomManager />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bookings" 
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <BookingManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <RoomManager />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/revenue" 
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <RoomManager />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/review" 
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <RoomManager />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      )}

      {/* Render public layout for non-authenticated users */}
      {!user && (
        <div className="App">
          <Header user={user} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/hotel/:id" element={<HotelDetail />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;