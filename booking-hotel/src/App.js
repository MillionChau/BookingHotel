import Footer from "./component/Footer/Footer";
import { Header } from "./component/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import FeatureCard from "./component/FeatureCard/FeatureCard";
import Banner from "./component/Banner/Banner";
import HotelCard from "./component/HotelCard/HotelCard";
import HotelDetail from "./component/HotelDetail/HotelDetail";
import SearchPage from "./component/SearchPage/SearchPage";
import ProfilePage from "./component/Profile/Profile";
import BookingHistory from "./component/BookingHistory/BookingHistory";
import Dashboard from "./admin/DashBoard/DashBoard";
import HotelManagement from "./admin/HotelManagement/HotelManagement";
import RoomManager from "./admin/RoomManager/RoomManager";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./admin/SideBar/SideBar";
import BookingManagement from "./admin/BookingManagement/BookingManagement";
import UserManager from "./admin/UserManager/UserManager";

function App() {
  return (
    // <div className="App">
    //   {/* <Header /> */}
    //   {/* <SearchPage /> */}
    //   {/* <HotelDetail /> */}
    //   {/* <ProfilePage /> */}
    //   {/* <BookingHistory /> */}
    //   {/* <Footer /> */}
    //   {/* <Dashboard /> */}
    //   {/* <HotelManagement /> */}
    //   {/* <RoomManager /> */}
    // </div>
    <BrowserRouter>
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hotelmanagement" element={<HotelManagement />} />
          <Route path="/rooms" element={<RoomManager />} />
          <Route path="/bookings" element={<BookingManagement />} />
          <Route path="/users" element={<UserManager />} />
          <Route path="/revenue" element={<RoomManager />} />
          <Route path="/review" element={<RoomManager />} />
        </Routes>
      </div>
    </div>
  </BrowserRouter>
  );
}

export default App;