import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Loading from "../Loading/Loading";
import { Card, Row, Col, Badge, Modal, Button, Toast, ToastContainer } from "react-bootstrap";
import { API_BASE_URL } from "../../config/api";

// Bảng màu tùy chỉnh
const colors = {
  primary: '#007bff', // Màu nhấn (Xanh dương)
  danger: 'danger',  // Màu cảnh báo (Đỏ)
  text: '#212529',    // Màu chữ chính (Đen)
  muted: '#6c757d',   // Màu chữ phụ & Trạng thái hoàn thành (Xám)
  background: '#f8f9fa' // Màu nền trang
};

function BookingHistory({ userId: propUserId }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  // State cho modal xác nhận hủy
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  // State cho toast thông báo
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  // Hiển thị toast
  const showToastMessage = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // Lấy userId từ props hoặc localStorage
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

  // Hàm mở modal xác nhận hủy
  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  // Hàm đóng modal xác nhận hủy
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setBookingToCancel(null);
  };

  // Hàm xử lý hủy đặt phòng
  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
    
    const id = bookingToCancel?.bookingId || bookingToCancel?._id;
    if (!id) {
      showToastMessage("Không xác định được booking id.", "danger");
      return;
    }

    try {
      setCancelingId(id);
      const res = await axios.patch(`${API_BASE_URL}/booking/${encodeURIComponent(id)}/cancel`);
      const updated = res?.data?.booking || res?.data;
      setBookings((prev) =>
        prev.map((b) =>
          (b.bookingId && b.bookingId === id) || b._id === id ? { ...b, ...updated } : b
        )
      );
      showToastMessage(res?.data?.message || "Đã hủy đặt phòng thành công", "success");
    } catch (err) {
      console.error(err);
      showToastMessage(err?.response?.data?.message || "Hủy không thành công", "danger");
    } finally {
      setCancelingId(null);
      closeCancelModal();
    }
  };

  // useEffect để lấy dữ liệu đặt phòng
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
            const res = await axios.get(`${API_BASE_URL}/${endpoint}/${encodeURIComponent(id)}`);
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
        const res = await axios.get(`${API_BASE_URL}/booking/user/${encodeURIComponent(userId)}`);
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
        showToastMessage("Lỗi khi tải lịch sử đặt phòng", "danger");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadBookings();

    return () => {
      mounted = false;
    };
  }, [userId]);

  // Sắp xếp bookings từ mới nhất đến cũ nhất
  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      // Ưu tiên sắp xếp theo ngày đặt (createdAt) trước
      const dateA = new Date(a.createdAt || a.bookingDate || a.checkinDate);
      const dateB = new Date(b.createdAt || b.bookingDate || b.checkinDate);
      
      // Nếu không có ngày đặt, sử dụng ngày check-in
      if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) {
        const checkinA = new Date(a.checkinDate);
        const checkinB = new Date(b.checkinDate);
        return checkinB - checkinA; // Mới nhất -> cũ nhất
      }
      
      return dateB - dateA; // Mới nhất -> cũ nhất
    });
  }, [bookings]);

  // Các hàm tiện ích
  const getHotelName = (b) =>
    b?.__hotel?.name || b?.__hotel?.hotelName || b?.__hotel?.title || b?.hotelName || "Tên khách sạn";
  const getRoomName = (b) =>
    b?.__room?.name || b?.__room?.roomName || b?.roomName || "Tên phòng";
  const getRoomImage = (b) =>
    b?.__room?.imageUrl || b?.__room?.image || b?.__room?.img || b?.roomImage || b?.__hotel?.imageUrl || null;
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

  if (!sortedBookings.length) {
    return <div className="text-center my-5"><h3>🤔</h3><p>Bạn chưa có lịch sử đặt phòng nào.</p></div>;
  }

  return (
    <div className="container my-5 py-5" style={{ backgroundColor: colors.background, borderRadius: '1rem' }}>
      <h3 className="fw-bold mb-4" style={{ color: colors.text }}>📖 Lịch sử đặt phòng</h3>
      <div className="d-flex flex-column gap-4">
        {sortedBookings.map((b) => {
          const key = b._id || b.bookingId || Math.random();
          const img = getRoomImage(b) || `https://picsum.photos/400/300?random=${key}`;
          const isCanceling = cancelingId === (b.bookingId || b._id);
          
          const getStatusText = (status) => {
            switch (status) {
              case "Booked": return "Đã đặt";
              case "Completed": return "Hoàn thành";
              case "Cancelled": return "Đã hủy";
              default: return status; // Fallback nếu có trạng thái khác
            }
          };

          const getStatusColor = (status) => {
            switch (status) {
              case "Booked": return "primary"; // Xanh dương
              case "Completed": return "success"; // Xanh lá
              case "Cancelled": return "danger"; // Đỏ
              default: return "secondary"; // Màu xám cho fallback
            }
          };

          const statusText = getStatusText(b.status);
          const statusColor = getStatusColor(b.status);

          return (
            <Card key={key} className="border-0 shadow-sm rounded-3 overflow-hidden">
              <Row className="g-0">
                <Col md={4} xl={3}>
                  <img src={img} alt={getRoomName(b)} className="w-100 h-100" style={{ objectFit: "cover", minHeight: "240px" }} />
                </Col>
                <Col md={8} xl={9}>
                  <Card.Body className="p-4 d-flex flex-column h-100">
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-1">
                        <h5 className="fw-bold mb-0" style={{ color: colors.text }}>{getHotelName(b)}</h5>
                        <Badge
                          className="ms-2 fw-normal text-capitalize"
                          bg={statusColor}
                        >
                          {statusText}
                        </Badge>
                      </div>
                      <p className="mb-0" style={{ color: colors.muted }}>{getRoomName(b)}</p>
                    </div>

                    <Row className="g-3 my-2">
                      <Col xs={6} md={4}>
                        <small style={{ color: colors.muted }}>🗓️ Ngày nhận phòng</small>
                        <p className="fw-bold mb-0" style={{ color: colors.text }}>{formatDate(b.checkinDate)}</p>
                      </Col>
                      <Col xs={6} md={4}>
                        <small style={{ color: colors.muted }}>🗓️ Ngày trả phòng</small>
                        <p className="fw-bold mb-0" style={{ color: colors.text }}>{formatDate(b.checkOutDate)}</p>
                      </Col>
                      <Col xs={12} md={4}>
                        <small style={{ color: colors.muted }}>💳 Thanh toán</small>
                        <p className="fw-bold mb-0 text-capitalize" style={{ color: colors.text }}>{b.paymentStatus || "N/A"}</p>
                      </Col>
                    </Row>

                    {/* Thêm thông tin ngày đặt */}
                    {(b.createdAt || b.bookingDate) && (
                      <Row className="g-3 mb-2">
                        <Col xs={12}>
                          <small style={{ color: colors.muted }}>📅 Ngày đặt</small>
                          <p className="fw-bold mb-0" style={{ color: colors.text }}>
                            {formatDate(b.createdAt || b.bookingDate)}
                          </p>
                        </Col>
                      </Row>
                    )}
                    
                    <div className="mt-auto pt-3 d-flex justify-content-between align-items-center">
                      <div>
                        <small style={{ color: colors.muted }}>Tổng cộng</small>
                        <h4 className="fw-bolder mb-0" style={{ color: colors.primary }}>{formatPrice(b.totalPrice)} VND</h4>
                      </div>

                      {b.status === "Booked" && (
                        <button
                          className="btn btn-outline-danger"
                          disabled={isCanceling}
                          onClick={() => openCancelModal(b)}
                        >
                          {isCanceling ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                              <span>Đang hủy...</span>
                            </>
                          ) : (
                            "Hủy phòng"
                          )}
                        </button>
                      )}
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          );
        })}
      </div>

      {/* Modal xác nhận hủy đặt phòng */}
      <Modal show={showCancelModal} onHide={closeCancelModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">⚠️ Xác nhận hủy đặt phòng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn hủy đặt phòng này không?</p>
          {bookingToCancel && (
            <div className="bg-light p-3 rounded small">
              <strong>Thông tin đặt phòng:</strong><br />
              Khách sạn: {getHotelName(bookingToCancel)}<br />
              Phòng: {getRoomName(bookingToCancel)}<br />
              Ngày nhận: {formatDate(bookingToCancel.checkinDate)}<br />
              Ngày trả: {formatDate(bookingToCancel.checkOutDate)}
            </div>
          )}
          <p className="text-danger mt-2 mb-0">
            <small>Lưu ý: Hành động này không thể hoàn tác.</small>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCancelModal}>
            Thoát
          </Button>
          <Button 
            variant="danger" 
            onClick={handleCancelBooking}
            disabled={cancelingId}
          >
            {cancelingId ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Đang hủy...
              </>
            ) : (
              "Xác nhận hủy"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
      <ToastContainer 
        position="top-end" 
        className="p-3 position-fixed"
        style={{ 
          zIndex: 9999,
          top: "100px",
          right: "20px"
        }}
      >
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={4000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header className={`bg-${toastVariant} text-white`}>
            <strong className="me-auto">
              {toastVariant === "success" ? "✅ Thành công" : "❌ Lỗi"}
            </strong>
          </Toast.Header>
          <Toast.Body className="bg-light">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default BookingHistory;