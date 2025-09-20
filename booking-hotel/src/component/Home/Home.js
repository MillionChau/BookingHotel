import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "../Header/Header";
import Banner from "../Banner/Banner";
import FeatureCard from "../FeatureCard/FeatureCard";
import HotelCard from "../HotelCard/HotelCard";
import { Spinner, Button } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


function Home() {
  const [hotelIds, setHotelIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
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

  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: 250, behavior: "smooth" });
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="home-page">
      {/* <Header /> */}
      <Banner />
      <FeatureCard />

      {/* Dòng giới thiệu */}
      <div className="mt-5 mb-4 fw-bold fs-3 text-center">
        Lưu trú tại các chỗ nghỉ độc đáo hàng đầu
      </div>

      {/* Carousel wrapper */}
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ gap: "10px", overflow: "hidden" }}
      >
        {/* Nút trái */}
        <Button
          onClick={scrollLeft}
          variant="secondary"
          style={{
            width: "40px",
            height: "40px",
            minWidth: "40px",   
            minHeight: "40px",
            borderRadius: "50%",
            padding: 0,   
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaChevronLeft />
        </Button>

        {/* Container card */}
        <div
          ref={containerRef}
          className="d-flex gap-3 overflow-auto"
          style={{
            scrollBehavior: "smooth",
            paddingBottom: "1rem",
            flexWrap: "nowrap",
          }}
        >
          {hotelIds.map((id) => (
            <div style={{ flex: "0 0 auto" }} key={id}>
              <HotelCard hotelId={id} userId={userId} />
            </div>
          ))}

        </div>

        {/* Nút phải */}
        <Button
          onClick={scrollRight}
          variant="secondary"
          style={{
            width: "40px",
            height: "40px",
            minWidth: "40px",
            minHeight: "40px",
            borderRadius: "50%",
            padding: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaChevronRight />
        </Button>
      </div>
    </div>

  );
}

export default Home;
