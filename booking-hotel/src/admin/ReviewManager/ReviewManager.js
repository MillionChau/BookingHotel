import React, { useState, useEffect } from "react";
import { Table, Form, Button, Spinner, Alert, Modal, Badge } from "react-bootstrap";
import axios from "axios";

export default function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });

  const reviewBaseUrl = "http://localhost:5360/review";
  const roomBaseurl = "http://localhost:5360/room"

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${roomBaseurl}/all`);
      setRooms(res.data.rooms);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách phòng:", err);
    }
  };

  const fetchAllReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${reviewBaseUrl}/all`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đánh giá:", err);
      
      try {
        const allReviews = [];
        for (const room of rooms) {
          const res = await axios.get(`${reviewBaseUrl}/room/${room.roomId}`);
          allReviews.push(...res.data.reviews);
        }
        setReviews(allReviews);
      } catch (fallbackErr) {
        console.error("Fallback cũng thất bại:", fallbackErr);
        setError("Không thể tải danh sách đánh giá");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomStats = async (roomId) => {
    try {
      const res = await axios.get(`${reviewBaseUrl}/room/${roomId}/rating`);
      setStats({
        averageRating: res.data.averageRating,
        totalReviews: res.data.totalReviews
      });
    } catch (err) {
      console.error("Lỗi khi lấy thống kê:", err);
    }
  };

  const filteredReviews = selectedRoom
    ? reviews.filter((r) => r.roomId === selectedRoom)
    : reviews;

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;
    
    try {
      await axios.delete(`${reviewBaseUrl}/${reviewToDelete.reviewId}`, {
        data: { 
          userId: "userId",
          userRole: "admin" 
        }
      });
      setReviews(reviews.filter(r => r.reviewId !== reviewToDelete.reviewId));
      setShowDeleteModal(false);
      setReviewToDelete(null);
      
      // Refresh stats
      if (selectedRoom) {
        fetchRoomStats(selectedRoom);
      }
    } catch (err) {
      console.error("Lỗi khi xóa đánh giá:", err);
      setError("Không thể xóa đánh giá: " + (err.response?.data?.message || err.message));
    }
  };

  // Hiển thị sao đánh giá
  const renderRatingStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      fetchAllReviews();
    }
  }, [rooms]);

  useEffect(() => {
    if (selectedRoom) {
      fetchRoomStats(selectedRoom);
    }
  }, [selectedRoom]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Quản lý đánh giá</h2>

      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

      <div className="row mb-4">
        <div className="col-md-6">
          <Form.Select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            <option value="">Tất cả phòng</option>
            {rooms.map(room => (
              <option key={room.roomId} value={room.roomId}>
                {room.name} ({room.roomId})
              </option>
            ))}
          </Form.Select>
        </div>
        
        {selectedRoom && (
          <div className="col-md-6">
            <div className="stats-box p-3 bg-light rounded">
              <h5>Thống kê đánh giá</h5>
              <p>Điểm trung bình: <Badge bg="primary">{stats.averageRating}/5</Badge></p>
              <p>Tổng số đánh giá: <Badge bg="secondary">{stats.totalReviews}</Badge></p>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Mã đánh giá</th>
              <th>Phòng</th>
              <th>Người đánh giá</th>
              <th>Đánh giá</th>
              <th>Nội dung</th>
              <th>Ngày đánh giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review, index) => (
                <tr key={review.reviewId}>
                  <td>{index + 1}</td>
                  <td>{review.reviewId}</td>
                  <td>{review.roomId}</td>
                  <td>{review.userId?.fullname || review.reviewer || "Ẩn danh"}</td>
                  <td title={`${review.rating} sao`}>
                    {renderRatingStars(review.rating)}
                  </td>
                  <td>{review.content || review.comment}</td>
                  <td>{new Date(review.addedDate).toLocaleString('vi-VN')}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setReviewToDelete(review);
                        setShowDeleteModal(true);
                      }}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  {selectedRoom ? "Chưa có đánh giá nào cho phòng này" : "Chưa có đánh giá nào"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal xác nhận xóa */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa đánh giá này không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteReview}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}