import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import { Routes, Route, Outlet } from "react-router-dom";

import { Header } from "./component/Header/Header";
import Footer from "./component/Footer/Footer";
import Banner from "./component/Banner/Banner";
import Login from "./component/Login/Login";
import Register from "./component/Register/Register";
import { HotelCard } from "./component/HotelCard/HotelCard";
import BookingHotel from "./component/BookingHotel/BookingHotel";
import FeatureCard from "./component/FeatureCard/FeatureCard";

const MainLayout = () => {
  return (
    <>
      <Header />
      <HotelCard />
      <Footer />
    </>
  );
};

const HomePage = () => {
  return (
    <>
      <Banner />;
      <FeatureCard />
    </>
  );
};
const HeaderOnlyLayout = () => (
  <>
    <Header />
    <BookingHotel />
  </>
);
function App() {
  return (
    <div className="App">
      <Routes>
        {/* Layout có cả Header + Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotels" element={<HotelCard />} />
        </Route>

        {/* Layout chỉ có Header */}
        <Route element={<HeaderOnlyLayout />}>
          <Route path="/BookingHotel" element={<BookingHotel />} />
        </Route>

        {/* Trang không có Header/Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
