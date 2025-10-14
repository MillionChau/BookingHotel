import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import HotelCard from "../HotelCard/HotelCard";
import Loading from "../Loading/Loading";
import "./FavoriteList.scss";

function FavoriteList({ userId: propUserId }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchFavorites = async () => {
      setLoading(true);

      // Lấy userId ưu tiên từ prop, nếu không có thì lấy từ localStorage
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
        // Không có userId -> không cần gọi API
        if (mounted) {
          setFavorites([]);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5360/favorite/user/${uid}`);
        // Hỗ trợ nhiều shape response: res.data hoặc res.data.favorites
        const data = res?.data;
        const favs = Array.isArray(data) ? data : data?.favorites || data?.items || data || [];
        if (mounted) setFavorites(favs);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách yêu thích:", err);
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

  if (loading) return <Loading />;

  if (!favorites || favorites.length === 0)
    return (
      <div className="text-center favoriteList my-4">
        Bạn chưa có khách sạn yêu thích nào.
      </div>
    );

  return (
    <div className="container mt-5 pt-5">
      <h3 className="fw-bold mb-3">Danh sách yêu thích</h3>
      <Row xs={1} sm={2} md={3} lg={5} className="g-4 mb-5">
        {favorites.map((fav) => (
          <Col key={fav._id || fav.id || fav.hotelId}>
            {/* Truyền prop isFavoriteDefault = true để hiển thị trái tim đỏ */}
            <HotelCard
              hotelId={fav.hotelId}
              userId={propUserId}
              isFavoriteDefault={true}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default FavoriteList;