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
import BookingList from "./component/BookingList/BookingList";
import FeatureCard from "./component/FeatureCard/FeatureCard";
import FavoriteCard from "./component/FavoriteCard/FavoriteCard";
const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

const HomePage = () => {
  return (
    <>
      <Banner />;
      <FeatureCard />
      <HotelCard />
    </>
  );
};
const HeaderOnlyLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);
function App() {
  return (
    <div className="App">
      <Routes>
        {/* Layout có cả Header + Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        <Route element={<HeaderOnlyLayout />}>
          <Route path="/BookingHotel" element={<BookingHotel />} />
          <Route path="/BookingList" element={<BookingList />} />
          <Route path="/FavoriteCard" element={<FavoriteCard />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
