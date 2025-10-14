import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Loading from "../Loading/Loading";
import { Card, Row, Col, Form, Button, Modal, Spinner } from "react-bootstrap";

const API_BASE = "http://localhost:5360";

export default function MyReview() {
  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviewInputs, setReviewInputs] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [reviewedBookingIds, setReviewedBookingIds] = useState([]);

  // modal xem lịch sử 
  const [showHistory, setShowHistory] = useState(false);
  const [reviews, setReviews] = useState([]);
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

  // get tên khách sạn
  const getHotelName = (b) =>
    b?.__hotel?.name ||
    b?.hotelName ||
    (b?.hotel && typeof b.hotel === "object"
      ? b.hotel.name || b.hotel.hotelName
      : b?.hotel) ||
    "Tên khách sạn";

  // get tên phòng
  const getRoomName = (b) =>
    b?.__room?.name ||
    b?.roomName ||
    (b?.room && typeof b.room === "object"
      ? b.room.name || b.room.roomName
      : b?.room) ||
    "Tên phòng";

  // fetch bookings 
  const fetchBookings = useCallback(async () => {
    if (!userId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE}/booking/user/${encodeURIComponent(userId)}`
      );
      const rawList =
        res?.data?.bookings || res?.data?.BookingList || res?.data || [];

      // collect ids
      const hotelIds = new Set();
      const roomIds = new Set();
      rawList.forEach((b) => {
        if (!b) return;
        if (b.status === "Completed") {
          if (b.hotelId) hotelIds.add(b.hotelId);
          if (b.roomId) roomIds.add(b.roomId);
        }
      });

      // fetch helper
      const fetchMap = async (ids, endpoint) => {
        if (!ids || ids.size === 0) return {};
        const arr = [...ids];
        const results = await Promise.all(
          arr.map(async (id) => {
            try {
              const r = await axios.get(
                `${API_BASE}/${endpoint}/${encodeURIComponent(id)}`
              );
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

      const normalized = rawList
        .filter((b) => b?.status === "Completed")
        .map((b) => {
          const hotelObj =
            b?.hotel && typeof b.hotel === "object"
              ? b.hotel
              : hotelMap[b.hotelId] || hotelMap[b.hotel] || null;
          const roomObj =
            b?.room && typeof b.room === "object"
              ? b.room
              : roomMap[b.roomId] || roomMap[b.room] || null;
          return { ...b, __hotel: hotelObj, __room: roomObj };
        });

      const reviewed = normalized
        .filter((b) => b.reviewed)
        .map((b) => b.bookingId || b._id);

      setBookings(normalized);
      setReviewedBookingIds(reviewed);
    } catch (err) {
      console.error("Lỗi khi lấy lịch sử đặt phòng:", err);
      setBookings([]);
      setReviewedBookingIds([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // fetch reviews 
  const fetchMyReviews = async () => {
    if (!userId) {
      setReviews([]);
      return;
    }

    try {
      setReviewsLoading(true);
      let data = null;

      try {
        const r1 = await axios.get(
          `${API_BASE}/review/user/${encodeURIComponent(userId)}`
        );
        data = r1?.data?.reviews || r1?.data || [];
      } catch (errUser) {
        try {
          const r2 = await axios.get(`${API_BASE}/review/all`);
          const all = r2?.data?.reviews || r2?.data || [];
          data = Array.isArray(all)
            ? all.filter((item) => String(item.userId) === String(userId))
            : [];
        } catch (errAll) {
          console.warn(
            "Không lấy được reviews theo user, thử all cũng thất bại.",
            errUser?.message,
            errAll?.message
          );
          data = [];
        }
      }

      const enriched = data.map((rev) => {
        const bookingId = rev.bookingId || rev.booking || rev.booking_id;
        const booking = bookings.find(
          (b) => String(b.bookingId || b._id) === String(bookingId)
        );

        const hotelName = booking
          ? getHotelName(booking)
          : rev.hotelName || rev.hotel || "";
        const roomName = booking
          ? getRoomName(booking)
          : rev.roomName || rev.room || "";

        return {
          ...rev,
          hotelName,
          roomName,
          rating: Number(rev.rating) || 0,
          content: rev.content || rev.comment || "",
        };
      });

      setReviews(enriched);
    } catch (err) {
      console.error("Lỗi khi lấy review của user:", err);
      setReviews([]);
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

  // open modal -> fetch review
  const openHistory = async () => {
    if (loading) await fetchBookings();
    await fetchMyReviews();
    setShowHistory(true);
  };

  const handleChange = (bookingId, field, value) => {
    setReviewInputs((prev) => ({
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
        roomId:
          booking.roomId ||
          booking?.room?._id ||
          booking?.roomId ||
          "",
        userId: userId || "",
        bookingId: bookingId || "",
        content: input.content || "",
        rating: Number(input.rating) || 0,
        addedDate: new Date(),
      };

      const res = await axios.post(`${API_BASE}/review/create`, payload);

      alert(res?.data?.message || "Đã gửi đánh giá thành công!");

      setReviewedBookingIds((prev) =>
        Array.from(new Set([...prev, bookingId]))
      );
      setReviewInputs((prev) => {
        const copy = { ...prev };
        delete copy[bookingId];
        return copy;
      });

      setBookings((prev) =>
        prev.map((b) =>
          String(b.bookingId || b._id) === String(bookingId)
            ? { ...b, reviewed: true }
            : b
        )
      );

      await fetchMyReviews();
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      alert(err?.response?.data?.message || "Gửi đánh giá thất bại");
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) return <Loading />;

  const selectableBookings = bookings.filter(
    (b) => !reviewedBookingIds.includes(b.bookingId || b._id)
  );

  return (
    <div className="container mt-5 pt-5 pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">📝 Những phòng bạn có thể đánh giá</h3>
        <Button variant="outline-secondary" onClick={openHistory}>
          <i className="bi bi-clock-history me-2"></i>
          Xem lại tất cả đánh giá
        </Button>
      </div>

      {/* Kiểm tra xem có phòng nào để đánh giá không */}
      {selectableBookings.length > 0 ? (
        // Lặp qua mỗi phòng có thể đánh giá và hiển thị thành 1 card
        selectableBookings.map((booking) => {
          const bookingId = booking.bookingId || booking._id;
          return (
            <Card key={bookingId} className="mb-4 shadow-sm">
              <Card.Body>
                <Row>
                  {/* Cột bên trái cho hình ảnh */}
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

                  {/* Cột bên phải cho thông tin và form */}
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
                        onChange={(e) =>
                          handleChange(bookingId, "content", e.target.value)
                        }
                      />
                    </Form.Group>

                    <Row>
                      <Col sm={8}>
                        <Form.Group>
                          <Form.Label className="small">Xếp hạng của bạn</Form.Label>
                          {/* Gợi ý: Dùng Select để chọn sao sẽ thân thiện hơn */}
                          <Form.Select
                            value={reviewInputs[bookingId]?.rating || ""}
                            onChange={(e) =>
                              handleChange(bookingId, "rating", e.target.value)
                            }
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
                            {submittingId === bookingId
                              ? "Đang gửi..."
                              : "Gửi"}
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
        // Hiển thị thông báo nếu không có phòng nào để đánh giá
        <div className="text-center p-5 bg-light rounded">
          <p className="mb-0">🎉 Chúc mừng! Bạn đã đánh giá tất cả các phòng đã hoàn thành.</p>
        </div>
      )}

      
      {/* Modal */}
      <Modal
        show={showHistory}
        onHide={() => setShowHistory(false)}
        size="lg"
        className="pt-5"
      >
        <Modal.Header closeButton>
          <Modal.Title>📜 Lịch sử đánh giá</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {reviewsLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : reviews.length === 0 ? (
            <p>Bạn chưa có đánh giá nào.</p>
          ) : (
            reviews.map((r) => (
              <Card key={r.reviewId || r._id} className="mb-3 shadow-sm">
                <Card.Body>
                  <Card.Title>{r.hotelName || "Tên khách sạn"}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {r.roomName || "Tên phòng"}
                  </Card.Subtitle>
                  <p style={{ marginBottom: 6 }}>
                    <strong>Đánh giá:</strong>{" "}
                    {"⭐".repeat(
                      Math.max(0, Math.min(5, Number(r.rating) || 0))
                    )}{" "}
                    ({r.rating})
                  </p>
                  <p style={{ marginBottom: 0 }}>{r.content}</p>
                </Card.Body>
              </Card>
            ))
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
