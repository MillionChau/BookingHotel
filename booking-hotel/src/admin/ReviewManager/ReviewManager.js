import React, { useState, useEffect, useCallback } from "react";
import { Table, Form, Button, Spinner, Alert, Modal, Badge, Card } from "react-bootstrap";
import axios from "axios";

export default function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });

  const reviewBaseUrl = "http://localhost:5360/review";
  const roomBaseUrl = "http://localhost:5360/room";

  /** 🏨 Lấy danh sách phòng */
  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${roomBaseUrl}/all`);
      setRooms(res.data.rooms || res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách phòng:", err);
      setError("Không thể tải danh sách phòng!");
    }
  };

  /** 📝 Lấy danh sách đánh giá */
  const fetchAllReviews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${reviewBaseUrl}/all`);
      setReviews(res.data.reviews || res.data.data || []);
    } catch (err) {
      console.warn("API /all không hoạt động, fallback từng phòng...");
      try {
        const allReviews = [];
        for (const room of rooms) {
          const res = await axios.get(`${reviewBaseUrl}/room/${room.roomId}`);
          allReviews.push(...(res.data.reviews || []));
        }
        setReviews(allReviews);
      } catch (fallbackErr) {
        console.error("Fallback thất bại:", fallbackErr);
        setError("Không thể tải danh sách đánh giá!");
      }
    } finally {
      setLoading(false);
    }
  }, [rooms]); // Thêm rooms vào dependencies vì sử dụng bên trong

  /** ⭐ Lấy thống kê theo phòng */
  const fetchRoomStats = async (roomId) => {
    if (!roomId) {
      setStats({ averageRating: 0, totalReviews: 0 });
      return;
    }

    try {
      const res = await axios.get(`${reviewBaseUrl}/room/${roomId}/rating`);
      setStats({
        averageRating: res.data.averageRating || 0,
        totalReviews: res.data.totalReviews || 0,
      });
    } catch (err) {
      console.error("Lỗi khi lấy thống kê:", err);
      setStats({ averageRating: 0, totalReviews: 0 });
    }
  };

  /** 🗑️ Xóa đánh giá */
  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;
    try {
      await axios.delete(`${reviewBaseUrl}/${reviewToDelete.reviewId}`, {
        data: { userId: "admin", userRole: "admin" },
      });
      setReviews((prev) => prev.filter((r) => r.reviewId !== reviewToDelete.reviewId));
      setShowDeleteModal(false);
      setReviewToDelete(null);
      if (selectedRoom) fetchRoomStats(selectedRoom);
    } catch (err) {
      console.error("Lỗi khi xóa đánh giá:", err);
      setError("Không thể xóa đánh giá: " + (err.response?.data?.message || err.message));
    }
  };

  /** ⭐ Hiển thị sao đánh giá */
  const renderRatingStars = (rating) =>
    "⭐".repeat(rating || 0) + "☆".repeat(5 - (rating || 0));

  /** 🧩 Hooks */
  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (rooms.length > 0) fetchAllReviews();
  }, [rooms, fetchAllReviews]);

  useEffect(() => {
    fetchRoomStats(selectedRoom);
  }, [selectedRoom]);

  /** Lọc theo phòng */
  const filteredReviews = selectedRoom
    ? reviews.filter((r) => r.roomId === selectedRoom)
    : reviews;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Quản lý Đánh giá</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Bộ lọc + thống kê */}
      <div className="row mb-4">
        <div className="col-md-6">
          {/* <Form.Group>
            <Form.Label>Phòng</Form.Label>
            <Form.Select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              <option value="">Tất cả phòng</option>
              {rooms.map((room) => (
                <option key={room.roomId} value={room.roomId}>
                  {room.name} ({room.roomId})
                </option>
              ))}
            </Form.Select>
          </Form.Group> */}
        </div>

        {selectedRoom && (
          <div className="col-md-6">
            <Card className="bg-light border">
              <Card.Body>
                <h5>📊 Thống kê đánh giá</h5>
                <p>
                  Trung bình:{" "}
                  <Badge bg="primary">{stats.averageRating.toFixed(1)}/5</Badge>
                </p>
                <p>
                  Tổng số đánh giá:{" "}
                  <Badge bg="secondary">{stats.totalReviews}</Badge>
                </p>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>

      {/* Bảng dữ liệu */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
          <p className="mt-3">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Mã đánh giá</th>
              <th>Phòng</th>
              <th>Người đánh giá</th>
              <th>Điểm</th>
              <th>Nội dung</th>
              <th>Ngày đánh giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review, idx) => (
                <tr key={review.reviewId}>
                  <td>{idx + 1}</td>
                  <td>{review.reviewId}</td>
                  <td>{review.roomId}</td>
                  <td>{review.userId?.fullname || review.reviewer || "Ẩn danh"}</td>
                  <td title={`${review.rating} sao`}>
                    {renderRatingStars(review.rating)}
                  </td>
                  <td>{review.content || review.comment}</td>
                  <td>{new Date(review.addedDate).toLocaleString("vi-VN")}</td>
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
                <td colSpan="8" className="text-center text-muted py-4">
                  {selectedRoom
                    ? "Không có đánh giá nào cho phòng này"
                    : "Không có đánh giá nào"}
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
        <Modal.Body>Bạn có chắc chắn muốn xóa đánh giá này không?</Modal.Body>
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