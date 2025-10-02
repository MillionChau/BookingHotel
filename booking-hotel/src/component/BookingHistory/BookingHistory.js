import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Loading from "../Loading/Loading";
import { Card, Row, Col, Badge } from "react-bootstrap";

const API_BASE = "http://localhost:5360";

function BookingHistory({ userId: propUserId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  // Resolve userId
  const userId = useMemo(() => {
    if (propUserId) return propUserId;
    try {
      const u = localStorage.getItem("user");
      if (!u) return null;
      const parsed = JSON.parse(u);
      return parsed.id || parsed._id || null;
    } catch {
      return null;
    }
  }, [propUserId]);

  // Cancel booking
  const handleCancelBooking = async (booking) => {
    const id = booking?.bookingId || booking?._id;
    if (!id) return alert("Không xác định được booking id.");

    if (!window.confirm("Bạn có chắc muốn hủy đặt phòng này không?")) return;

    try {
      setCancelingId(id);
      const res = await axios.patch(`${API_BASE}/booking/${encodeURIComponent(id)}/cancel`);
      const updated = res?.data?.booking || res?.data;
      setBookings((prev) =>
        prev.map((b) =>
          (b.bookingId && b.bookingId === id) || b._id === id ? { ...b, ...updated } : b
        )
      );
      alert(res?.data?.message || "Đã hủy đặt phòng");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Hủy không thành công");
    } finally {
      setCancelingId(null);
    }
  };

  // Fetch bookings and related hotel/room info
  useEffect(() => {
    if (!userId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchMap = async (ids, endpoint) => {
      if (!ids || ids.size === 0) return {};
      const arr = [...ids];
      const results = await Promise.all(
        arr.map(async (id) => {
          try {
            const res = await axios.get(`${API_BASE}/${endpoint}/${encodeURIComponent(id)}`);
            return [id, res.data?.hotel || res.data?.room || res.data];
          } catch {
            return [id, null];
          }
        })
      );
      return Object.fromEntries(results);
    };

    const loadBookings = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/booking/user/${encodeURIComponent(userId)}`);
        const rawList = res?.data?.bookings || res?.data?.BookingList || res?.data || [];
        if (!mounted) return;

        const hotelIds = new Set();
        const roomIds = new Set();

        rawList.forEach((b) => {
          if (!b) return;
          if (!b.hotel || typeof b.hotel === "string") {
            const hid = b.hotelId || (typeof b.hotel === "string" ? b.hotel : null);
            if (hid) hotelIds.add(hid);
          }
          if (!b.room || typeof b.room === "string") {
            const rid = b.roomId || (typeof b.room === "string" ? b.room : null);
            if (rid) roomIds.add(rid);
          }
        });

        const [hotelMap, roomMap] = await Promise.all([
          fetchMap(hotelIds, "hotel"),
          fetchMap(roomIds, "room"),
        ]);

        if (!mounted) return;

        const normalized = rawList.map((b) => {
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

        setBookings(normalized);
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử đặt phòng:", err);
        setBookings([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadBookings();

    return () => {
      mounted = false;
    };
  }, [userId]);

  // Helpers
  const getHotelName = (b) =>
    b?.__hotel?.name ||
    b?.__hotel?.hotelName ||
    b?.__hotel?.title ||
    b?.hotelName ||
    (b?.hotel && typeof b.hotel === "string" ? b.hotel : null) ||
    (b?.hotel && b.hotel.name) ||
    "Tên khách sạn";

  const getHotelImage = (b) =>
    b?.__hotel?.imageUrl || b?.__hotel?.image || b?.__hotel?.img || b?.hotelImage || b?.imageUrl || null;

  const getRoomName = (b) =>
    b?.__room?.name ||
    b?.__room?.roomName ||
    b?.roomName ||
    (b?.room && typeof b.room === "string" ? b.room : null) ||
    (b?.room && b.room.name) ||
    "Tên phòng";

  const getRoomImage = (b) =>
    b?.__room?.imageUrl || b?.__room?.image || b?.__room?.img || b?.roomImage || null;

  const getRoomType = (b) =>
    b?.__room?.type || b?.roomType || (b?.room && b.room.type) || "Loại phòng";

  const formatDate = (d) => {
    try {
      if (!d) return "--";
      const dd = new Date(d);
      if (isNaN(dd.getTime())) return "--";
      return dd.toLocaleDateString("vi-VN");
    } catch {
      return "--";
    }
  };

  const formatPrice = (p) => {
    try {
      const n = Number(p) || 0;
      return n.toLocaleString("vi-VN");
    } catch {
      return p;
    }
  };

  if (loading) return <Loading />;

  if (!bookings.length) {
    return <div className="text-center my-4">Bạn chưa có lịch sử đặt phòng nào.</div>;
  }

  return (
    <div className="container mt-5 pt-4">
      <h3 className="fw-bold mb-4">📖 Lịch sử đặt phòng</h3>
      <Row>
        {bookings.map((b) => {
          const hotelName = getHotelName(b);
          const roomName = getRoomName(b);
          const roomType = getRoomType(b);
          const img = getRoomImage(b) || getHotelImage(b) || "https://picsum.photos/400/250?random=1";
          const key = b._id || b.bookingId || `${b.hotelId || "h"}-${b.roomId || "r"}-${Math.random()}`;

          return (
            <Col md={6} lg={4} className="mb-4" key={key}>
              <Card className="shadow-sm rounded-3 overflow-hidden h-100">
                <Card.Img variant="top" src={img} alt={roomName} style={{ height: 200, objectFit: "cover" }} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold">{hotelName}</Card.Title>
                  <Card.Subtitle className="text-muted">{roomName}</Card.Subtitle>
                  <Badge bg="light" text="dark" className="mb-2">
                    {roomType}
                  </Badge>

                  <div className="mb-1">
                    <strong>Ngày nhận:</strong> {formatDate(b.checkinDate)}
                  </div>
                  <div className="mb-1">
                    <strong>Ngày trả:</strong> {formatDate(b.checkOutDate)}
                  </div>

                  <div className="mb-2">
                    <strong>Trạng thái:</strong>{" "}
                    <span
                      className={
                        b.status === "Booked"
                          ? "badge bg-success"
                          : b.status === "Cancelled"
                          ? "badge bg-danger"
                          : "badge bg-secondary"
                      }
                    >
                      {b.status}
                    </span>
                  </div>

                  {b.status === "Booked" && (
                    <div className="mt-2">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        disabled={cancelingId === (b.bookingId || b._id)}
                        onClick={() => handleCancelBooking(b)}
                      >
                        {cancelingId === (b.bookingId || b._id) ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Đang hủy...
                          </>
                        ) : (
                          "❌ Hủy đặt phòng"
                        )}
                      </button>
                    </div>
                  )}

                  <div className="mb-1">
                    <strong>Thanh toán:</strong> {b.paymentStatus || "-"}
                  </div>
                  <h5 className="text-primary mt-auto">{formatPrice(b.totalPrice)} VND</h5>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default BookingHistory;
