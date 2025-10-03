import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.scss";
import Banner from "../Banner/Banner";
import FeatureCard from "../FeatureCard/FeatureCard";
import HotelCard from "../HotelCard/HotelCard";
import { Spinner, Button } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

function Home() {
  const [hotelIds, setHotelIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [locations, setLocations] = useState([]);
  
  const itemsPerPage = 4;
  const userId = localStorage.getItem("user");

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const res = await axios.get("http://localhost:5360/hotel/all");
        if (res.data && res.data.HotelList) {
          const hotelList = res.data.HotelList;
          const ids = hotelList.map((hotel) => hotel.hotelId);
          setHotelIds(ids);

          const grouped = {};
          hotelList.forEach((hotel) => {
            if (hotel.address) {
              const parts = hotel.address.split("-");
              let location = parts[parts.length - 1];
              location = location.normalize("NFC").replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();
              if (location && !grouped[location]) grouped[location] = 0;
              if (location) grouped[location]++;
            }
          });

          const locationsArray = Object.entries(grouped).map(([name, count]) => ({ name, count }));
          setLocations(locationsArray);
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách khách sạn:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotelData();
  }, []);

  const locationImages = {
    "Đà Nẵng": "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcT1BDHY_4VeF6BTMF25nEjx2K_CDWpeIVcI0RppRQokdx5gnYrvxjNH8OhOjW7Objj-OxHaMjkjW1Gg2ExtWJqTgm80Vu80LzMsENn20Q",
    "TP. Hồ Chí Minh": "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSI36O1EynC6Td6U17X2RnDvfn1b_3XY_ep0gzVREBZns_QNzME1rgcaa8KjSByZRLKgGeEJx2repD75EV-bpztZZOQKWqolRgkvTMmwA",
    "Lào Cai": "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcTeZKFdsoyEADnjIza-CIVjZJ-bsg23BLglC0Cio14VnOFiL-KwctDVR5RJLA5xHl-Xwh0OyR6EF-zGwaEYuX1998Fv7NlgAnTQOhxWyQ",
    "Hà Nội": "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcTpcV2obDsvnibbiSw5ApcnaFcxm9LoJSDjUm7iDzKzQawEaRUs3E5CNQmhiRqRMXR8PXIxyDyrdoXinCGkRVKo6CngduHYPOVajVljtQ",
    "Thanh Hóa": "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQSU6yNakOeptPsvnPev9R4rbiUa84aKAv37j1ofgV29hXmzkBt0LpBjk_qNgNNWkOOHr5ge3QJpDNhpsUHN-y4IuX8Gg4s6QPoT2Yvnw",
    "Vũng Tàu": "https://images.unsplash.com/photo-1613963901592-332194119313?q=80&w=2070&auto-format&fit=crop",
    "Đà Lạt": "https://images.unsplash.com/photo-1572455024443-a2e6f3a8bceb?q=80&w=1974&auto-format&fit=crop",
  };
  
  const getLocationImage = (locationName) => locationImages[locationName] || "/images/default.jpg";

  const handlePrev = () => setStartIndex((prev) => (prev === 0 ? Math.max(hotelIds.length - itemsPerPage, 0) : prev - 1));
  const handleNext = () => setStartIndex((prev) => (prev + itemsPerPage >= hotelIds.length ? 0 : prev + 1));

  if (loading) return <div className="text-center my-5"><Spinner animation="border" /></div>;

  const currentItems = hotelIds.slice(startIndex, startIndex + itemsPerPage);
  const topLocations = locations.slice(0, 2);
  const bottomLocations = locations.slice(2, 5);

  return (
    <div className="home-page my-5">
      <Banner />
      <div data-aos="fade-up">
        <FeatureCard />
      </div>

      {/* ======================= KHU VỰC ĐIỂM ĐẾN HOT NHẤT ======================= */}
      <div className="hottest-destinations-section container py-5">
        <div className="text-center" data-aos="fade-up">
          <h2 className="fw-bold text-uppercase section-title pb-2 mb-3">
            Điểm đến hot nhất
          </h2>
          <p className="section-subtitle">
            Những thành phố không thể bỏ lỡ trong chuyến hành trình tiếp theo của bạn.
          </p>
        </div>
        
        <div className="container">
          <div className="row g-3 mb-3">
            {topLocations.map((loc, index) => (
              <div 
                key={loc.name} 
                className="col-md-6" 
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <Link to={`/search?destination=${encodeURIComponent(loc.name)}`} className="location-link">
                  <div
                    className="location-card large-card p-4 rounded d-flex flex-column"
                    style={{ backgroundImage: `url(${getLocationImage(loc.name)})` }}
                  >
                    <div className="location-card-content mt-auto">
                      <h5 className="location-name fw-bold mb-1">
                        {loc.name} <FaStar style={{ color: "yellow", marginLeft: "4px" }} />
                      </h5>
                      <span className="location-count">{loc.count} Khách sạn</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="row g-3">
            {bottomLocations.map((loc, index) => (
              <div 
                key={loc.name} 
                className="col-md-4" 
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <Link to={`/search?destination=${encodeURIComponent(loc.name)}`} className="location-link">
                  <div
                    className="location-card small-card p-4 rounded d-flex flex-column"
                    style={{ backgroundImage: `url(${getLocationImage(loc.name)})` }}
                  >
                    <div className="location-card-content mt-auto">
                      <h5 className="location-name fw-bold mb-1">
                        {loc.name} <FaStar style={{ color: "yellow", marginLeft: "4px" }} />
                      </h5>
                      <span className="location-count">{loc.count} Khách sạn</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======================= KHU VỰC CHỖ NGHỈ ĐỘC ĐÁO ======================= */}
      <section className="featured-hotels-section">
        <div className="container">
          <div className="text-center" data-aos="fade-up">
            <h2 className="fw-bold text-uppercase section-title pb-2 mb-3">
              Lưu trú tại các chỗ nghỉ độc đáo hàng đầu
            </h2>
            <p className="section-subtitle">
              Khám phá những lựa chọn hàng đầu được đánh giá cao bởi cộng đồng du khách của chúng tôi.
            </p>
          </div>

          <div className="slider-container" data-aos="fade-up" data-aos-delay="200">
            <Button onClick={handlePrev} variant="light" className="slider-nav-button prev">
              <FaChevronLeft />
            </Button>

            <div className="slider-track">
              {currentItems.map((id) => (
                <div key={id} className="col-12 col-sm-6 col-lg-3 homeItem">
                  <HotelCard hotelId={id} userId={userId} />
                </div>
              ))}
            </div>

            <Button onClick={handleNext} variant="light" className="slider-nav-button next">
              <FaChevronRight />
            </Button>
          </div>
        </div>
      </section>

    </div> 
  );
}

export default Home;