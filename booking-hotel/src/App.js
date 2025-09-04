import Footer from "./component/Footer/Footer";
import { Header } from "./component/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
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
