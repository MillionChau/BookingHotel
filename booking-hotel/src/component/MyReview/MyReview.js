import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Loading from "../Loading/Loading";
import { Card, Row, Col, Form, Button, Modal, Spinner, Tab, Tabs } from "react-bootstrap";
import { API_BASE_URL } from "../../config/api";

export default function MyReview() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewInputs, setReviewInputs] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  
  // State để lưu trữ riêng biệt
  const [userReviewIds, setUserReviewIds] = useState(new Set());
  const [userReviews, setUserReviews] = useState([]); // Tất cả reviews user đã tạo
  
  // Modal
  const [showHistory, setShowHistory] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const userId = useMemo(() => {
    try {
      const u = localStorage.getItem("user");
      if (!u) return null;
      return JSON.parse(u).id || JSON.parse(u)._id || null;
    } catch {
      return null;
    }
  }, []);

  // Helper functions
  const getHotelName = (b) =>
    b?.__hotel?.name ||
    b?.hotelName ||
    (b?.hotel && typeof b.hotel === "object"
      ? b.hotel.name || b.hotel.hotelName
      : b?.hotel) ||
    "Tên khách sạn";

  const getRoomName = (b) =>
    b?.__room?.name ||
    b?.roomName ||
    (b?.room && typeof b.room === "object"
      ? b.room.name || b.room.roomName
      : b?.room) ||
    "Tên phòng";

  // Fetch tất cả reviews của user
  const fetchUserReviews = useCallback(async () => {
    if (!userId) return [];

    try {
      let userReviews = [];
      
      try {
        const response = await axios.get(`${API_BASE_URL}/review/user/${encodeURIComponent(userId)}`);
        userReviews = response?.data?.reviews || response?.data || [];
      } catch (err) {
        // Fallback: lấy tất cả và filter
        const response = await axios.get(`${API_BASE_URL}/review/all`);
        const allReviews = response?.data?.reviews || response?.data || [];
        userReviews = Array.isArray(allReviews) 
          ? allReviews.filter(review => String(review.userId) === String(userId))
          : [];
      }

      return userReviews;
    } catch (err) {
      console.error("Lỗi khi fetch reviews của user:", err);
      return [];
    }
  }, [userId]);

  // Fetch bookings và reviews
  const fetchBookings = useCallback(async () => {
    if (!userId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch song song bookings và reviews
      const [bookingsRes, userReviewsData] = await Promise.all([
        axios.get(`${API_BASE_URL}/booking/user/${encodeURIComponent(userId)}`),
        fetchUserReviews()
      ]);

      const rawList = bookingsRes?.data?.bookings || bookingsRes?.data?.BookingList || bookingsRes?.data || [];

      // Filter chỉ lấy bookings Completed
      const completedBookings = rawList.filter(b => b?.status === "Completed");

      // Enrich với hotel và room data
      const hotelIds = new Set();
      const roomIds = new Set();
      completedBookings.forEach(b => {
        if (b.hotelId) hotelIds.add(b.hotelId);
        if (b.roomId) roomIds.add(b.roomId);
      });

      const fetchMap = async (ids, endpoint) => {
        if (!ids || ids.size === 0) return {};
        const arr = [...ids];
        const results = await Promise.all(
          arr.map(async (id) => {
            try {
              const r = await axios.get(`${API_BASE_URL}/${endpoint}/${encodeURIComponent(id)}`);
              const data = r.data?.hotel || r.data?.room || r.data;
              return [id, data];
            } catch {
              return [id, null];
            }
          })
        );
        return Object.fromEntries(results);
      };

      const [hotelMap, roomMap] = await Promise.all([
        fetchMap(hotelIds, "hotel"),
        fetchMap(roomIds, "room"),
      ]);

      const normalized = completedBookings.map(b => {
        const hotelObj = b?.hotel && typeof b.hotel === "object"
          ? b.hotel
          : hotelMap[b.hotelId] || hotelMap[b.hotel] || null;
        const roomObj = b?.room && typeof b.room === "object"
          ? b.room
          : roomMap[b.roomId] || roomMap[b.room] || null;
        return { ...b, __hotel: hotelObj, __room: roomObj };
      });

      // Tạo Set chứa các bookingId đã được review
      const reviewedBookingIds = new Set(
        userReviewsData
          .map(review => review.bookingId || review.booking)
          .filter(Boolean)
      );

      setBookings(normalized);
      setUserReviewIds(reviewedBookingIds);
      setUserReviews(userReviewsData);
    } catch (err) {
      console.error("Lỗi khi lấy lịch sử đặt phòng:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [userId, fetchUserReviews]);

  // Fetch reviews cho modal history (có thể gọi lại khi cần refresh)
  const fetchMyReviews = async () => {
    if (!userId) {
      setUserReviews([]);
      return;
    }

    try {
      setReviewsLoading(true);
      const reviewsData = await fetchUserReviews();
      setUserReviews(reviewsData);
    } catch (err) {
      console.error("Lỗi khi lấy review của user:", err);
      setUserReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [userId, fetchBookings]);

  // Filter bookings
  const selectableBookings = useMemo(() => {
    return bookings.filter(booking => {
      const bookingId = booking.bookingId || booking._id;
      return !userReviewIds.has(bookingId);
    });
  }, [bookings, userReviewIds]);

  const reviewedBookings = useMemo(() => {
    return bookings.filter(booking => {
      const bookingId = booking.bookingId || booking._id;
      return userReviewIds.has(bookingId);
    });
  }, [bookings, userReviewIds]);

  // Lấy review tương ứng cho mỗi booking đã review
  const getReviewForBooking = (booking) => {
    const bookingId = booking.bookingId || booking._id;
    return userReviews.find(review => 
      String(review.bookingId || review.booking) === String(bookingId)
    );
  };

  const openHistory = async () => {
    await fetchMyReviews();
    setShowHistory(true);
  };

  const handleChange = (bookingId, field, value) => {
    setReviewInputs(prev => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], [field]: value },
    }));
  };

  const submitReview = async (booking) => {
    const bookingId = booking.bookingId || booking._id;
    const input = reviewInputs[bookingId];

    if (!input?.content || !input?.rating) {
      alert("Vui lòng nhập đầy đủ nội dung và đánh giá");
      return;
    }

    try {
      setSubmittingId(bookingId);

      const payload = {
        roomId: booking.roomId || booking?.room?._id || "",
        userId: userId,
        bookingId: bookingId,
        content: input.content,
        rating: Number(input.rating),
      };

      const res = await axios.post(`${API_BASE_URL}/review/create`, payload);

      alert(res?.data?.message || "Đã gửi đánh giá thành công!");

      // Cập nhật state
      setUserReviewIds(prev => new Set([...prev, bookingId]));
      setReviewInputs(prev => {
        const copy = { ...prev };
        delete copy[bookingId];
        return copy;
      });

      // Refresh reviews data
      await fetchMyReviews();
      
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      alert(err?.response?.data?.message || "Gửi đánh giá thất bại");
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mt-5 pt-5 pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">📝 Đánh giá của tôi</h3>
        <Button variant="outline-secondary" onClick={openHistory}>
          <i className="bi bi-clock-history me-2"></i>
          Xem lại tất cả đánh giá
        </Button>
      </div>

      <Tabs defaultActiveKey="pending" className="mb-4">
        {/* TAB 1: PHÒNG CHƯA ĐÁNH GIÁ */}
        <Tab eventKey="pending" title={`Chờ đánh giá (${selectableBookings.length})`}>
          {selectableBookings.length > 0 ? (
            selectableBookings.map(booking => {
              const bookingId = booking.bookingId || booking._id;
              return (
                <Card key={bookingId} className="mb-4 shadow-sm">
                  <Card.Body>
                    <Row>
                      <Col md={4} lg={3}>
                        <img
                          src={
                            booking.__room?.imageUrl ||
                            booking.roomImage ||
                            "https://via.placeholder.com/400x250?text=Room+Image"
                          }
                          className="img-fluid rounded"
                          style={{ width: '100%', height: '170px', objectFit: 'cover' }}
                          alt={`Phòng ${getRoomName(booking)}`}
                        />
                      </Col>

                      <Col md={8} lg={9}>
                        <Card.Title className="fw-bold">{getHotelName(booking)}</Card.Title>
                        <Card.Subtitle className="mb-3 text-muted">
                          {getRoomName(booking)}
                        </Card.Subtitle>

                        <Form.Group className="mb-2">
                          <Form.Label className="small">Nội dung đánh giá</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Chia sẻ trải nghiệm của bạn..."
                            value={reviewInputs[bookingId]?.content || ""}
                            onChange={e => handleChange(bookingId, "content", e.target.value)}
                          />
                        </Form.Group>

                        <Row>
                          <Col sm={8}>
                            <Form.Group>
                              <Form.Label className="small">Xếp hạng của bạn</Form.Label>
                              <Form.Select
                                value={reviewInputs[bookingId]?.rating || ""}
                                onChange={e => handleChange(bookingId, "rating", e.target.value)}
                              >
                                <option value="">-- Chọn số sao --</option>
                                <option value="5">5 sao ★★★★★</option>
                                <option value="4">4 sao ★★★★☆</option>
                                <option value="3">3 sao ★★★☆☆</option>
                                <option value="2">2 sao ★★☆☆☆</option>
                                <option value="1">1 sao ★☆☆☆☆</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col sm={4} className="d-flex align-items-end">
                            <Button
                              variant="primary"
                              disabled={submittingId === bookingId}
                              onClick={() => submitReview(booking)}
                              className="w-100 mt-3 mt-sm-0"
                            >
                              {submittingId === bookingId ? "Đang gửi..." : "Gửi đánh giá"}
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              );
            })
          ) : (
            <div className="text-center p-5 bg-light rounded">
              <p className="mb-0">🎉 Chúc mừng! Bạn đã đánh giá tất cả các phòng đã hoàn thành.</p>
            </div>
          )}
        </Tab>

        {/* TAB 2: PHÒNG ĐÃ ĐÁNH GIÁ */}
        <Tab eventKey="completed" title={`Đã đánh giá (${reviewedBookings.length})`}>
          {reviewedBookings.length > 0 ? (
            reviewedBookings.map(booking => {
              const bookingId = booking.bookingId || booking._id;
              const review = getReviewForBooking(booking);
              
              return (
                <Card key={bookingId} className="mb-4 shadow-sm">
                  <Card.Body>
                    <Row>
                      <Col md={4} lg={3}>
                        <img
                          src={
                            booking.__room?.imageUrl ||
                            booking.roomImage ||
                            "https://via.placeholder.com/400x250?text=Room+Image"
                          }
                          className="img-fluid rounded"
                          style={{ width: '100%', height: '170px', objectFit: 'cover' }}
                          alt={`Phòng ${getRoomName(booking)}`}
                        />
                      </Col>

                      <Col md={8} lg={9}>
                        <Card.Title className="fw-bold">{getHotelName(booking)}</Card.Title>
                        <Card.Subtitle className="mb-3 text-muted">
                          {getRoomName(booking)}
                        </Card.Subtitle>

                        {review && (
                          <>
                            <div className="mb-2">
                              <strong>Đánh giá của bạn:</strong>
                              <div className="mt-1">
                                {"⭐".repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)))} 
                                <span className="ms-2">({review.rating}/5)</span>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <strong>Nội dung:</strong>
                              <p className="mt-1 mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                {review.content}
                              </p>
                            </div>

                            <div className="text-muted small">
                              Đánh giá ngày: {new Date(review.addedDate || review.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                          </>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              );
            })
          ) : (
            <div className="text-center p-5 bg-light rounded">
              <p className="mb-0">📝 Bạn chưa đánh giá phòng nào.</p>
            </div>
          )}
        </Tab>
      </Tabs>

      {/* Modal History - Hiển thị tất cả reviews dạng danh sách */}
      <Modal show={showHistory} onHide={() => setShowHistory(false)} size="lg" className="pt-5">
        <Modal.Header closeButton>
          <Modal.Title>📜 Tất cả đánh giá của tôi</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {reviewsLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : userReviews.length === 0 ? (
            <p>Bạn chưa có đánh giá nào.</p>
          ) : (
            userReviews.map(review => {
              // Tìm booking tương ứng để lấy thông tin phòng/khách sạn
              const booking = bookings.find(b => 
                String(b.bookingId || b._id) === String(review.bookingId || review.booking)
              );

              return (
                <Card key={review.reviewId || review._id} className="mb-3 shadow-sm">
                  <Card.Body>
                    <Card.Title>{booking ? getHotelName(booking) : review.hotelName || "Tên khách sạn"}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {booking ? getRoomName(booking) : review.roomName || "Tên phòng"}
                    </Card.Subtitle>
                    <p style={{ marginBottom: 6 }}>
                      <strong>Đánh giá:</strong> {"⭐".repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)))} ({review.rating}/5)
                    </p>
                    <p style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>{review.content}</p>
                    <div className="text-muted small mt-2">
                      Ngày đánh giá: {new Date(review.addedDate || review.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </Card.Body>
                </Card>
              );
            })
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHistory(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}