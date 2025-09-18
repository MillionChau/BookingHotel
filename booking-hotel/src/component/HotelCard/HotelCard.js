import React, { useEffect, useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { FaStar, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const HotelCard = ({ hotelId }) => {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (!hotelId) return;

    const fetchHotel = async () => {
      try {
        const res = await axios.get(`http://localhost:5360/hotel/${hotelId}`);
        if (res.data && res.data.hotel) setHotel(res.data.hotel);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin khách sạn:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

  if (loading) return <Spinner animation="border" />;
  if (!hotel) return <div>Khách sạn không tồn tại</div>;

  return (
    <Card
      style={{ maxWidth: "220px", margin: "0 auto" }}
      className="h-100 shadow-sm rounded-4 overflow-hidden position-relative"
    >
      {/* Icon yêu thích */}
      <div
        onClick={() => setFavorite(!favorite)}
        className="position-absolute top-2 end-2 m-2 d-flex justify-content-center align-items-center"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.8)",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        <FaHeart
          style={{ color: favorite ? "#ff4d6d" : "#999", fontSize: "18px" }}
        />
      </div>

      {/* Ảnh khách sạn */}
      <Card.Img
        src={hotel.imageUrl}
        alt={hotel.name}
        style={{ height: "140px", objectFit: "cover" }}
      />

      <Card.Body className="d-flex flex-column p-2">
        <Card.Title className="fw-bold fs-6 mb-1">{hotel.name}</Card.Title>
        <Card.Text className="text-muted small mb-1">{hotel.address}</Card.Text>

        <div className="d-flex align-items-center mb-1">
          <FaStar className="text-warning me-2" />
          {hotel.rating && hotel.rating > 0 ? (
            <span>{hotel.rating.toFixed(1)} / 5</span>
          ) : (
            <span className="text-muted">Chưa có đánh giá</span>
          )}
        </div>

        {/* {hotel.minPrice && (
          <div className="mb-2">
            <div className="text-muted small">Giá chỉ từ</div>
            <div className="fw-bold text-danger" style={{ fontSize: "1rem" }}>
              {hotel.minPrice.toLocaleString("vi-VN")} ₫
            </div>
          </div>
        )} */}

        <Link to={`/HotelDetail/${hotel.hotelId}`} className="mt-auto w-100">
          <Button
            variant="primary"
            className="w-100"
            style={{ borderRadius: "0.5rem", padding: "0.25rem 0" }}
          >
            Xem chi tiết
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default HotelCard;
