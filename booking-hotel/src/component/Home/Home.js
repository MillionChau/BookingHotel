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

  const itemsPerPage = 4;
  const userId = localStorage.getItem("user");

  const [locations, setLocations] = useState([]);
  useEffect(() => {
    const fetchHotelIds = async () => {
      try {
        const res = await axios.get("http://localhost:5360/hotel/all");
        if (res.data && res.data.HotelList) {
          const ids = res.data.HotelList.map((hotel) => hotel.hotelId);
          setHotelIds(ids);

          const grouped = {};
          res.data.HotelList.forEach((hotel) => {
            if (hotel.address) {
              const parts = hotel.address.split("-");
              let location = parts[parts.length - 1];
              location = location.normalize("NFC").replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();
              if (!grouped[location]) grouped[location] = 0;
              grouped[location]++;
            }
          });

          const locationsArray = Object.entries(grouped).map(([name, count]) => ({
            name,
            count,
          }));
          setLocations(locationsArray);
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách khách sạn:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotelIds();
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
  const getLocationImage = (locationName) => {
    return locationImages[locationName] || "/images/default.jpg";
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? Math.max(hotelIds.length - itemsPerPage, 0) : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + itemsPerPage >= hotelIds.length ? 0 : prev + 1));
  };

  if (loading) return <Spinner animation="border" />;

  const currentItems = hotelIds.slice(startIndex, startIndex + itemsPerPage);
  const topLocations = locations.slice(0, 2);
  const bottomLocations = locations.slice(2, 5);

  return (
    <div className="home-page my-5">
      <Banner />
      <FeatureCard />

      <h2 className="fw-bold text-center text-uppercase section-title pb-2 mb-4 mt-5">
        Điểm đến hot nhất
      </h2>
      
      <div className="container">
        <div className="row g-3 mb-3">
          {topLocations.map((loc) => (
            <div key={loc.name} className="col-md-6">
              <Link to={`/search?destination=${encodeURIComponent(loc.name)}`} className="location-link">
                <div
                  className="location-card large-card p-3 rounded text-white d-flex"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.4), transparent), url(${getLocationImage(
                      loc.name
                    )})`,
                  }}
                >
                  <h5 className="fw-bold mt-auto">
                    {loc.name} <FaStar style={{ color: "yellow", marginLeft: "4px" }} />
                  </h5>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="row g-3">
          {bottomLocations.map((loc) => (
            <div key={loc.name} className="col-md-4">
              <Link to={`/search?destination=${encodeURIComponent(loc.name)}`} className="location-link">
                <div
                  className="location-card small-card p-3 rounded text-white d-flex"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.4), transparent), url(${getLocationImage(
                      loc.name
                    )})`,
                  }}
                >
                  <h5 className="fw-bold mt-auto">
                    {loc.name} <FaStar style={{ color: "yellow", marginLeft: "4px" }} />
                  </h5>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      <div className="container">
        <hr className="section-divider" />
      </div>
      <h2 className="fw-bold text-center text-uppercase section-title pb-2 mb-4 mt-5">
        Lưu trú tại các chỗ nghỉ độc đáo hàng đầu
      </h2>

      <div className="d-flex align-items-center justify-content-center" style={{ gap: "10px" }}>
        <Button onClick={handlePrev} variant="secondary" style={{ width: "40px", height: "40px", marginRight: "30px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <FaChevronLeft />
        </Button>
        <div className="d-flex justify-content-center gap-3" style={{ width: "100%", maxWidth: "1320px" }}>
          {currentItems.map((id) => (
            <div key={id} style={{ flex: "1 1 25%", maxWidth: "25%" }} className="col-12 col-sm-6 col-lg-3 homeItem">
              <HotelCard hotelId={id} userId={userId} />
            </div>
          ))}
        </div>
        <Button onClick={handleNext} variant="secondary" style={{ width: "40px", height: "40px", borderRadius: "50%", marginLeft: "30px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <FaChevronRight />
        </Button>
      </div>
    </div>
  );
}

export default Home;