import React, { useEffect, useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { FaStar, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import "./HotelCard.scss";

const HotelCard = ({
  hotelId,
  userId,
  isFavoriteDefault = false,
  favoriteIdDefault = null,
  hotel,
  onToggleFavorite,
}) => {
  // Khai báo các state quản lý dữ liệu, trạng thái loading và yêu thích
  const [hotelData, setHotelData] = useState(hotel || null);
  const [loading, setLoading] = useState(!hotel);
  const [favorite, setFavorite] = useState(isFavoriteDefault);
  const [favoriteId, setFavoriteId] = useState(favoriteIdDefault);

  // Lấy userId từ localStorage nếu không được truyền qua props
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    userId = userData.id;
  }

  // Effect để fetch dữ liệu khách sạn và kiểm tra trạng thái yêu thích
  useEffect(() => {
    if (hotel) return; 

    if (!hotelId) return;

    const fetchHotel = async () => {
      try {
        const res = await axios.get(`http://localhost:5360/hotel/${hotelId}`);
        if (res.data && res.data.hotel) {
          setHotelData(res.data.hotel);
        }

        if (userId) {
          const resFav = await axios.get(
            `http://localhost:5360/favorite/check`,
            { params: { userId, hotelId } }
          );
          if (resFav.data.isFavorite) {
            setFavorite(true);
            setFavoriteId(resFav.data.favoriteId);
          }
        }
      } catch (err) {
        console.error("Lỗi khi load dữ liệu khách sạn:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId, userId, hotel]);

  // Hàm xử lý thêm/xóa khách sạn khỏi danh sách yêu thích
  const toggleFavorite = async () => {
    try {
      if (!userId) {
        alert("Bạn cần đăng nhập để thêm yêu thích");
        return;
      }

      if (favorite) {
        await axios.delete(`http://localhost:5360/favorite/${favoriteId}`);
        alert("Đã xóa khách sạn khỏi danh sách yêu thích."); // Thêm thông báo
        setFavorite(false);
        setFavoriteId(null);
        if (onToggleFavorite) {
          onToggleFavorite(hotelId, false, null);
        }
      } else {
        const res = await axios.post(`http://localhost:5360/favorite/create`, {
          userId,
          hotelId,
        });
        alert("Đã thêm khách sạn vào danh sách yêu thích!"); // Thêm thông báo
        setFavorite(true);
        setFavoriteId(res.data.favorite._id);
        if (onToggleFavorite) {
          onToggleFavorite(hotelId, true, res.data.favorite._id);
        }
      }
    } catch (err) {
      console.error("Lỗi khi toggle favorite:", err);
      alert("Thao tác thất bại, vui lòng thử lại."); // Thêm thông báo lỗi
    }
  };

  // Xử lý các trường hợp component đang tải hoặc không có dữ liệu
  if (loading) return <Spinner animation="border" />;
  if (!hotelData) return <div>Khách sạn không tồn tại</div>;

  return (
    <Card
      style={{ 
        width: "100%", 
        margin: "0 auto",
        transition: "transform 0.3s ease, box-shadow 0.3s ease" 
      }}
      className="h-100 shadow-sm rounded-4 overflow-hidden position-relative hotel-card">
      {/* Icon yêu thích */}
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.8)",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          transition: "transform 0.2s ease"
        }}
        onClick={toggleFavorite}
        className="favorite-icon position-absolute top-0 end-0 m-2 d-flex justify-content-center align-items-center">
        <FaHeart
          style={{ color: favorite ? "#ff4d6d" : "#999", fontSize: "18px" }}
        />
      </div>

      {/* Ảnh khách sạn */}
      <Card.Img
        src={hotelData.imageUrl}
        alt={hotelData.name}
        style={{ height: "200px", objectFit: "cover", width: "100%" }}
      />
      
      {/* Thân thẻ chứa thông tin chi tiết */}
      <Card.Body className="d-flex flex-column p-3">
        <Card.Title className="fw-bold fs-6 my-1 hotel-title">
          {hotelData.name}
        </Card.Title>
        <Card.Text className="text-muted small hotel-title my-1">
          {hotelData.address}
        </Card.Text>

        <div className="d-flex align-items-center my-2">
          <FaStar className="text-warning me-2" />
          {hotelData.rating && hotelData.rating > 0 ? (
            <span>{hotelData.rating.toFixed(1)} / 5</span>
          ) : (
            <span className="text-muted">Chưa có đánh giá</span>
          )}
        </div>

        <Link
          to={`/HotelDetail/${hotelData.hotelId}`}
          className="mt-auto w-100">
          <Button
            variant="primary"
            className="w-100 mt-2"
            style={{ borderRadius: "8px", padding: "0.5rem 0", fontWeight: "500" }}>
            Xem chi tiết
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default HotelCard;