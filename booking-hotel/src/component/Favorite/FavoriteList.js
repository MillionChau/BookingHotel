import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Toast, ToastContainer } from "react-bootstrap";
import HotelCard from "../HotelCard/HotelCard";
import Loading from "../Loading/Loading";
import "./FavoriteList.scss";
import { API_BASE_URL } from "../../config/api";

function FavoriteList({ userId: propUserId }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    let mounted = true;

    const fetchFavorites = async () => {
      setLoading(true);

      // Lấy userId từ prop hoặc localStorage
      let uid = propUserId;
      if (!uid) {
        try {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const parsed = JSON.parse(userStr);
            uid = parsed?.id || parsed?._id || parsed?.userId || uid;
          }
        } catch (e) {
          console.warn("Không parse được localStorage user:", e);
        }
      }

      if (!uid) {
        if (mounted) {
          setFavorites([]);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/favorite/user/${uid}`);
        const data = res?.data;
        const favs = Array.isArray(data)
          ? data
          : data?.favorites || data?.items || data || [];
        if (mounted) setFavorites(favs);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách yêu thích:", err);
        showToast("Không thể tải danh sách yêu thích.", "danger");
        if (mounted) setFavorites([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFavorites();

    return () => {
      mounted = false;
    };
  }, [propUserId]);

  const handleRemoveFavorite = async (hotelId) => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : {};
      const uid = propUserId || user?.id || user?._id || user?.userId;

      if (!uid) {
        showToast("Không tìm thấy thông tin người dùng.", "danger");
        return;
      }

      await axios.delete(`${API_BASE_URL}/favorite/${uid}/${hotelId}`);
      setFavorites((prev) => prev.filter((f) => f.hotelId !== hotelId));
      showToast("Đã xóa khỏi danh sách yêu thích!");
    } catch (err) {
      console.error("Lỗi khi xóa khỏi yêu thích:", err);
      showToast("Không thể xóa khỏi danh sách yêu thích.", "danger");
    }
  };

  if (loading) return <Loading />;

  if (!favorites || favorites.length === 0)
    return (
      <div className="text-center favoriteList my-4">
        Bạn chưa có khách sạn yêu thích nào.
        <ToastContainer position="top-end" className="p-3">
          <Toast
            show={toast.show}
            bg={toast.variant}
            onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            delay={3000}
            autohide
          >
            <Toast.Body className="text-white fw-semibold">
              {toast.message}
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    );

  return (
    <div className="container mt-5 pt-5">
      <h3 className="fw-bold mb-3">Danh sách yêu thích</h3>
      <Row xs={1} sm={2} md={3} lg={5} className="g-4 mb-5">
        {favorites.map((fav) => (
          <Col key={fav._id || fav.id || fav.hotelId}>
            <HotelCard
              hotelId={fav.hotelId}
              userId={propUserId}
              isFavoriteDefault={true}
              onRemoveFavorite={handleRemoveFavorite}
            />
          </Col>
        ))}
      </Row>

      {/* Toast hiển thị thông báo */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toast.show}
          bg={toast.variant}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white fw-semibold">
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default FavoriteList;
