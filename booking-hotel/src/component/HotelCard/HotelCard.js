import React, { useEffect, useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { FaStar, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import "./HotelCard.scss";

const HotelCard = ({ hotelId, userId, isFavoriteDefault = false }) => {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  useEffect(() => {
    if (!hotelId) return;

    const fetchData = async () => {
      try {
        // lấy thông tin khách sạn
        const resHotel = await axios.get(
          `http://localhost:5360/hotel/${hotelId}`
        );
        if (resHotel.data && resHotel.data.hotel) setHotel(resHotel.data.hotel);

        // check có trong danh sách yêu thích không
        if (userId) {
          const resFav = await axios.get(
            `http://localhost:5360/favorite/check`,
            {
              params: { userId, hotelId },
            }
          );
          if (resFav.data.isFavorite) {
            setFavorite(true);
            setFavoriteId(resFav.data.favoriteId);
          }
        }
      } catch (err) {
        console.error("Lỗi khi load dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId, userId]);

  const toggleFavorite = async () => {
    try {
      if (!userId) {
        alert("Bạn cần đăng nhập để thêm yêu thích");
        return;
      }

      if (favorite) {
        // xóa yêu thích
        await axios.delete(`http://localhost:5360/favorite/${favoriteId}`);
        setFavorite(false);
        setFavoriteId(null);
      } else {
        // thêm yêu thích
        const res = await axios.post(`http://localhost:5360/favorite/create`, {
          userId,
          hotelId,
        });
        setFavorite(true);
        setFavoriteId(res.data.favorite._id);
      }
    } catch (err) {
      console.error("Lỗi khi toggle favorite:", err);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (!hotel) return <div>Khách sạn không tồn tại</div>;

  return (
    <Card
      style={{ width: "100%", margin: "0 auto" }}
      className="h-100 shadow-sm rounded-4 overflow-hidden position-relative">
      {/* Icon yêu thích */}
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.8)",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
        onClick={toggleFavorite}
        className="favorite-icon position-absolute top-0 end-0 m-2 d-flex justify-content-center align-items-center">
        <FaHeart
          style={{ color: favorite ? "#ff4d6d" : "#999", fontSize: "18px" }}
        />
      </div>

      {/* Ảnh khách sạn */}
      <Card.Img
        src={hotel.imageUrl}
        alt={hotel.name}
        style={{ height: "200px", objectFit: "cover", width: "100%" }}
      />

      <Card.Body className="d-flex flex-column p-2">
        <Card.Title className="fw-bold fs-6 my-1 hotel-title">
          {hotel.name}
        </Card.Title>
        <Card.Text className="text-muted small hotel-title my-1">
          {hotel.address}
        </Card.Text>

        <div className="d-flex align-items-center my-1">
          <FaStar className="text-warning me-2" />
          {hotel.rating && hotel.rating > 0 ? (
            <span>{hotel.rating.toFixed(1)} / 5</span>
          ) : (
            <span className="text-muted">Chưa có đánh giá</span>
          )}
        </div>

        <Link to={`/HotelDetail/${hotel.hotelId}`} className="mt-auto w-100">
          <Button
            variant="primary"
            className="w-100 mt-2"
            style={{ borderRadius: "0.5rem", padding: "0.25rem 0" }}>
            Xem chi tiết
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default HotelCard;
