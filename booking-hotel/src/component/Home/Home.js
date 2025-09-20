import React, { useEffect, useState } from "react";
import axios from "axios";
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
          style={{ width: "100%", maxWidth: "1100px" }}>
          {currentItems.map((id) => (
            <div key={id} style={{ flex: "1 1 25%", maxWidth: "25%" }}>
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
