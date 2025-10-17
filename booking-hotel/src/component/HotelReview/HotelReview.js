import React, { useEffect, useState } from "react";
import axios from "axios";
import './HotelReview.scss';
import { API_BASE_URL } from "../../config/api";

export default function HotelReviews({ hotelId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelReviews = async () => {
      try {
        const roomRes = await axios.get(`${API_BASE_URL}/room/hotel/${hotelId}`);
        const allRooms = roomRes.data.rooms || [];
        const allReviews = [];

        for (const room of allRooms) {
          try {
            const reviewRes = await axios.get(`${API_BASE_URL}/review/room/${room.roomId}`);
            if (reviewRes.data?.reviews) {
              const roomReviews = reviewRes.data.reviews.map((r) => ({
                ...r,
                roomName: room.roomName || room.name || "Phòng không tên",
                roomTypeName: room.type || "Không rõ loại phòng",
              }));
              allReviews.push(...roomReviews);
            }
          } catch (_) {}
        }

        setReviews(allReviews);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách đánh giá:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelReviews();
  }, [hotelId]);

  if (loading) return <p>Đang tải đánh giá...</p>;

  return (
  <div className="reviews-container">
    <h3 className="reviews-title">
      Danh sách đánh giá của khách sạn
    </h3>
    {reviews.length === 0 ? (
      <div className="no-reviews">
        Chưa có đánh giá nào cho khách sạn này.
      </div>
    ) : (
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review._id} className="review-card">
            <div className="review-header">
              <h4 className="room-name">
                Phòng: {review.roomName}
              </h4>
              <div className="room-type-badge">
                <strong>Loại phòng:</strong> {review.roomTypeName}
              </div>
            </div>
            
            <div className="review-details">
              <p className="reviewer-info">
                <strong>Người đánh giá:</strong> {review.userId.fullname || "Ẩn danh"}
              </p>
              <div className="rating-section">
                <strong>Đánh giá:</strong>
                <div className="stars">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <span className="rating-score">({review.rating}/5)</span>
              </div>
            </div>
            
            <p className="review-content">
              <strong>Nội dung:</strong> {review.content}
            </p>
            
            <p className="review-date">
              Ngày: {new Date(review.addedDate).toLocaleDateString("vi-VN")}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);
}