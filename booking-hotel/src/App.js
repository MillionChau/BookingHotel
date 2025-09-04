import "bootstrap/dist/css/bootstrap.min.css";
<<<<<<< HEAD
import "bootstrap-icons/font/bootstrap-icons.min.css";
import { Routes, Route, Outlet } from "react-router-dom";

import { Header } from './component/Header/Header';
import Footer from './component/Footer/Footer';
import { Banner } from "./component/Banner/Banner";
import Login from './component/Login/Login';
import Register from './component/Register/Register';

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
    return <Banner />;
};


function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
=======
import "bootstrap-icons/font/bootstrap-icons.css";
import FeatureCard from "./component/FeatureCard/FeatureCard";
import Banner from "./component/Banner/Banner";
import { HotelCard } from "./component/HotelCard/HotelCard";
import BookingHotel from "./component/BookingHotel/BookingHotel";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />

        <Routes>
          {/* Trang chủ */}
          <Route
            path="/"
            element={
              <>
                <Banner />
                <FeatureCard />
                <HotelCard />
              </>
            }
          />

          {/* Trang đặt phòng */}
          <Route path="/BookingHotel" element={<BookingHotel />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
>>>>>>> 33908288ac41bcac83272fde0062efc30a570954
