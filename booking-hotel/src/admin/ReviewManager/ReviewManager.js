import React, { useState, useEffect } from "react";
import { Table, Form } from "react-bootstrap";

// Dữ liệu giả
const fakeReviews = [
  {
    reviewId: "RV001",
    hotelId: "H001",
    roomName: "Deluxe 101",
    reviewer: "Nguyen Van A",
    rating: 5,
    comment: "Phòng đẹp, sạch sẽ và nhân viên thân thiện.",
    createdAt: "2025-09-10T12:30:00Z",
  },
  {
    reviewId: "RV002",
    hotelId: "H001",
    roomName: "Suite 102",
    reviewer: "Tran Thi B",
    rating: 4,
    comment: "Rất hài lòng, nhưng bữa sáng chưa đa dạng.",
    createdAt: "2025-09-11T08:15:00Z",
  },
  {
    reviewId: "RV003",
    hotelId: "H002",
    roomName: "Standard 201",
    reviewer: "Le Van C",
    rating: 3,
    comment: "Phòng hơi nhỏ, nhưng vị trí thuận tiện.",
    createdAt: "2025-09-09T14:00:00Z",
  },
];

export default function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("H001");

  useEffect(() => {
    // Lọc và sắp xếp đánh giá
    const filtered = fakeReviews
      .filter((r) => r.hotelId === selectedHotel)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // mới nhất trước
    setReviews(filtered);
  }, [selectedHotel]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Quản lý đánh giá</h2>

      <Form.Select
        className="mb-3"
        value={selectedHotel}
        onChange={(e) => setSelectedHotel(e.target.value)}
      >
        <option value="H001">Khách sạn H001 - Hà Nội Center</option>
        <option value="H002">Khách sạn H002 - Đà Nẵng Beach</option>
      </Form.Select>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên phòng</th>
            <th>Người đánh giá</th>
            <th>Đánh giá</th>
            <th>Bình luận</th>
            <th>Ngày đánh giá</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length > 0 ? (
            reviews.map((rev, index) => (
              <tr key={rev.reviewId}>
                <td>{index + 1}</td>
                <td>{rev.roomName}</td>
                <td>{rev.reviewer}</td>
                <td>{rev.rating} ⭐</td>
                <td>{rev.comment}</td>
                <td>{new Date(rev.createdAt).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Chưa có đánh giá nào cho khách sạn này
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
