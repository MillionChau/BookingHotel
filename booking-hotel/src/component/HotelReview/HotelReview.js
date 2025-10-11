import React, { useEffect, useState } from "react";
import axios from "axios";

export default function HotelReviews({ hotelId }) {
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelReviews = async () => {
      try {
        // Lấy danh sách phòng theo hotelId
        const roomRes = await axios.get(`http://localhost:5360/room/hotel/${hotelId}`);
        const allRooms = roomRes.data.rooms || [];
        setRooms(allRooms);

        

        const allReviews = [];

        // Lấy review của từng phòng
        for (const room of allRooms) {
          try {
            const reviewRes = await axios.get(`http://localhost:5360/review/room/${room.roomId}`);
            if (reviewRes.data && reviewRes.data.reviews) {
              // Gắn thêm tên phòng vào review để hiển thị
              const roomReviews = reviewRes.data.reviews.map((r) => ({
                ...r,
                roomName: room.roomName || room.name || "Phòng không tên",
                roomTypeName: room.type || "Không rõ loại phòng",
              }));
              allReviews.push(...roomReviews);
            }
          } catch (error) {
            // Nếu phòng chưa có đánh giá thì bỏ qua
          }
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
    <div>
      <h3>📝 Danh sách đánh giá của khách sạn</h3>
      {reviews.length === 0 ? (
        <p>Chưa có đánh giá nào cho khách sạn này.</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "12px",
              margin: "10px 0",
              backgroundColor: "#fafafa",
            }}
          >
            <h4>Phòng: {review.roomName}</h4>
            <p><strong>Loại phòng: </strong> {review.roomTypeName} </p>
            <p><strong>Người đánh giá:</strong> {review.userId.fullname || "Ẩn danh"}</p>
            <p><strong>Đánh giá:</strong> {review.rating} ⭐</p>
            <p><strong>Nội dung:</strong> {review.content}</p>
            <p style={{ fontStyle: "italic" }}>
              Ngày: {new Date(review.addedDate).toLocaleDateString("vi-VN")}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
