import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Row, Col } from "react-bootstrap";
import HotelCard from "../HotelCard/HotelCard";

function FavoriteList() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("user");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(`http://localhost:5360/favorite/user/${userId}`);
        setFavorites(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách yêu thích:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  // if (loading) return <Spinner animation="border" />;
  if (favorites.length === 0) return <div className="text-center mt-4">Bạn chưa có khách sạn yêu thích nào.</div>;

  return (
    <div className="container  mt-5 pt-5">
      <h3 className="fw-bold mb-3">Danh sách yêu thích</h3>
      <Row xs={1} sm={2} md={3} lg={5} className="g-4 mb-5 ">
        {favorites.map((fav) => (
          <Col key={fav._id}>
            {/* Truyền prop isFavorite = true để hiển thị trái tim đỏ */}
            <HotelCard hotelId={fav.hotelId} userId={userId} isFavoriteDefault={true} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default FavoriteList;
