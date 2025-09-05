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
import FavoriteList from "./component/Favorite/FavoriteList"; 

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

const HomePage = () => {
  return (
    <>
      <Banner />
      <FeatureCard />
      <HotelCard />
    </>
  );
};

const HeaderOnlyLayout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
);

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="hotels" element={<HotelCard />} />
          <Route path="favorites" element={<FavoriteList />} />
        </Route>

        <Route path="/BookingHotel" element={<HeaderOnlyLayout />}>
            <Route index element={<BookingHotel />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;