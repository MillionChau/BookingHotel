import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { FaStar, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import "./HotelCard.scss";
import { API_BASE_URL } from "../../config/api";

const HotelCard = ({
  hotelId,
  userId,
  isFavoriteDefault = false,
  favoriteIdDefault = null,
  hotel,
  onToggleFavorite,
}) => {
  const [hotelData, setHotelData] = useState(hotel || null);
  const [loading, setLoading] = useState(!hotel);
  const [favorite, setFavorite] = useState(isFavoriteDefault);
  const [favoriteId, setFavoriteId] = useState(favoriteIdDefault);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const triggerToast = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // Lấy userId từ localStorage nếu không được truyền qua props
  const user = localStorage.getItem("user");
  if (user) {
    const userData = JSON.parse(user);
    userId = userData.id;
  }

  // Effect fetch dữ liệu khách sạn + kiểm tra trạng thái yêu thích
  useEffect(() => {
    if (hotel) return;
    if (!hotelId) return;

    const fetchHotel = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/hotel/${hotelId}`);
        if (res.data && res.data.hotel) {
          setHotelData(res.data.hotel);
        }

        if (userId) {
          const resFav = await axios.get(`${API_BASE_URL}/favorite/check`, {
            params: { userId, hotelId },
          });
          if (resFav.data.isFavorite) {
            setFavorite(true);
            setFavoriteId(resFav.data.favoriteId);
          }
        }
      } catch (err) {
        console.error("Lỗi khi load dữ liệu khách sạn:", err);
        triggerToast("Không thể tải dữ liệu khách sạn.", "danger");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId, userId, hotel]);

  // Thêm / Xóa khách sạn khỏi danh sách yêu thích
  const toggleFavorite = async () => {
    try {
      if (!userId) {
        triggerToast("Bạn cần đăng nhập để thêm yêu thích.", "warning");
        return;
      }

      if (favorite) {
        await axios.delete(`${API_BASE_URL}/favorite/${favoriteId}`);
        setFavorite(false);
        setFavoriteId(null);
        triggerToast("Đã xóa khách sạn khỏi danh sách yêu thích!", "success");
        if (onToggleFavorite) {
          onToggleFavorite(hotelId, false, null);
        }
      } else {
        const res = await axios.post(`${API_BASE_URL}/favorite/create`, {
          userId,
          hotelId,
        });
        setFavorite(true);
        setFavoriteId(res.data.favorite._id);
        triggerToast("Đã thêm khách sạn vào danh sách yêu thích!", "success");
        if (onToggleFavorite) {
          onToggleFavorite(hotelId, true, res.data.favorite._id);
        }
      }
    } catch (err) {
      console.error("Lỗi khi toggle favorite:", err);
      triggerToast("Thao tác thất bại, vui lòng thử lại.", "danger");
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (!hotelData) return <div>Khách sạn không tồn tại</div>;

  return (
    <>
      <Card
        style={{
          width: "100%",
          margin: "0 auto",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
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
            transition: "transform 0.2s ease",
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

        {/* Thông tin khách sạn */}
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
              style={{
                borderRadius: "8px",
                padding: "0.5rem 0",
                fontWeight: "500",
              }}>
              Xem chi tiết
            </Button>
          </Link>
        </Card.Body>
      </Card>

      {/* Toast thông báo */}
      <ToastContainer
        position="top-end"
        className="p-3 position-fixed"
        style={{
          zIndex: 9999,
          top: "100px",
          right: "20px",
        }}>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={4000}
          autohide
          bg={toastVariant}>
          <Toast.Header className={`bg-${toastVariant} text-white`}>
            <strong className="me-auto">
              {toastVariant === "success"
                ? " Thành công"
                : toastVariant === "danger"
                ? " Lỗi"
                : " Cảnh báo"}
            </strong>
          </Toast.Header>
          <Toast.Body className="bg-light">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default HotelCard;
