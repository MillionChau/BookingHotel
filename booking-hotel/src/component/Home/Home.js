import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.scss";
import Banner from "../Banner/Banner";
import FeatureCard from "../FeatureCard/FeatureCard";
import HotelCard from "../HotelCard/HotelCard";
import { Spinner, Button } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Home() {
  const [hotelIds, setHotelIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  const itemsPerPage = 4; // số item hiển thị 1 lần
  const userId = localStorage.getItem("user");

  const [locations, setLocations] = useState([]);
  useEffect(() => {
    const fetchHotelIds = async () => {
      try {
        const res = await axios.get("http://localhost:5360/hotel/all");
        if (res.data && res.data.HotelList) {
          const ids = res.data.HotelList.map((hotel) => hotel.hotelId);
          setHotelIds(ids);
  
          // Lấy địa điểm từ address
          const grouped = {};
          res.data.HotelList.forEach((hotel) => {
            if (hotel.address) {
              // Tách theo dấu "-" và lấy phần cuối
              const parts = hotel.address.split("-");
              let location = parts[parts.length - 1];
          
                // 1. Chuẩn hóa unicode (loại bỏ ký tự kết hợp, nếu có)
              location = location.normalize("NFC");

              // 2. Thay non-breaking space ( = \u00A0) và các space lạ thành space thường
              location = location.replace(/\u00A0/g, " ");

              // 3. Gộp nhiều khoảng trắng/tab/xuống dòng thành 1 space
              location = location.replace(/\s+/g, " ");

              // 4. Xóa space thừa 2 đầu
              location = location.trim();
          
              if (!grouped[location]) grouped[location] = 0;
              grouped[location]++;
            }
          });
          
  
          // Chuyển thành mảng [{location, count}]
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

  // link ảnh
    const locationImages = {
      "Đà Nẵng": "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcT1BDHY_4VeF6BTMF25nEjx2K_CDWpeIVcI0RppRQokdx5gnYrvxjNH8OhOjW7Objj-OxHaMjkjW1Gg2ExtWJqTgm80Vu80LzMsENn20Q",
      "TP. Hồ Chí Minh": "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSI36O1EynC6Td6U17X2RnDvfn1b_3XY_ep0gzVREBZns_QNzME1rgcaa8KjSByZRLKgGeEJx2repD75EV-bpztZZOQKWqolRgkvTMmwA",
      "Lào Cai": "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcTeZKFdsoyEADnjIza-CIVjZJ-bsg23BLglC0Cio14VnOFiL-KwctDVR5RJLA5xHl-Xwh0OyR6EF-zGwaEYuX1998Fv7NlgAnTQOhxWyQ",
      "Hà Nội": "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcTpcV2obDsvnibbiSw5ApcnaFcxm9LoJSDjUm7iDzKzQawEaRUs3E5CNQmhiRqRMXR8PXIxyDyrdoXinCGkRVKo6CngduHYPOVajVljtQ",
      "Thanh Hóa": "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQSU6yNakOeptPsvnPev9R4rbiUa84aKAv37j1ofgV29hXmzkBt0LpBjk_qNgNNWkOOHr5ge3QJpDNhpsUHN-y4IuX8Gg4s6QPoT2Yvnw",
    };
    const getLocationImage = (locationName) => {
      return locationImages[locationName] || "/images/default.jpg";
    };

  useEffect(() => {
    const fetchHotelIds = async () => {
      try {
        const res = await axios.get("http://localhost:5360/hotel/all");
        if (res.data && res.data.HotelList) {
          const ids = res.data.HotelList.map((hotel) => hotel.hotelId);
          setHotelIds(ids);
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách khách sạn:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotelIds();
  }, []);

  const handlePrev = () => {
    setStartIndex((prev) =>
      prev === 0 ? Math.max(hotelIds.length - itemsPerPage, 0) : prev - 1
    );
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      prev + itemsPerPage >= hotelIds.length ? 0 : prev + 1
    );
  };

  if (loading) return <Spinner animation="border" />;

  // cắt ra 4 item bắt đầu từ startIndex
  const currentItems = hotelIds.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="home-page my-5">
      <Banner />
      <FeatureCard />

      <h2 className="fw-bold text-center text-uppercase section-title pb-2 mb-4 mt-4">
        Điểm đến hot nhất
      </h2>

      <div className="container">
        <div className="row g-3">
          {locations.map((loc, index) => (
            <div key={index} className="col-12 col-sm-6 col-lg-3">
              <div
                className="p-4 rounded text-white d-flex flex-column justify-content-between"
                style={{
                  background: `linear-gradient(to top, rgba(0,0,0,0.6), transparent), url(${getLocationImage(loc.name)}) center/cover`,
                  minHeight: "150px",
                }}
              >
                <h5 className="fw-bold">{loc.name}</h5>
                <p>Có {loc.count} khách sạn</p>
                <Button variant="outline-light" size="sm">
                  Xem khách sạn trống phòng
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>


      <h2 className="fw-bold text-center text-uppercase section-title pb-2 mb-4 mt-4">
        Lưu trú tại các chỗ nghỉ độc đáo hàng đầu
      </h2>

      <div
        className="d-flex align-items-center justify-content-center"
        style={{ gap: "10px" }}>
        {/* Nút trái */}
        <Button
          onClick={handlePrev}
          variant="secondary"
          style={{
            width: "40px",
            height: "40px",
            marginRight: "30px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <FaChevronLeft />
        </Button>

        {/* Hiển thị 4 item */}
        <div
          className="d-flex justify-content-center gap-3"
          style={{ width: "100%", maxWidth: "1320px" }}>
          {currentItems.map((id) => (
            <div
              key={id}
              style={{ flex: "1 1 25%", maxWidth: "25%" }}
              className="col-12 col-sm-6 col-lg-3 homeItem">
              <HotelCard hotelId={id} userId={userId} />
            </div>
          ))}
        </div>

        {/* Nút phải */}
        <Button
          onClick={handleNext}
          variant="secondary"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            marginLeft: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <FaChevronRight />
        </Button>
      </div>
    </div>
  );
}

export default Home;
