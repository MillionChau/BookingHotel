import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL - adjust according to your backend
  const API_BASE_URL = "http://localhost:5360/booking";

  // Fetch all bookings from backend
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      setBookings(response.data.bookings);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách đơn đặt. Vui lòng thử lại sau.");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Badge màu trạng thái đơn
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Booked":
      case "Đã xác nhận":
        return <span className="badge bg-success">{status}</span>;
      case "Completed":
      case "Đã hoàn thành":
        return <span className="badge bg-primary">{status}</span>;
      case "Cancelled":
      case "Đã hủy":
        return <span className="badge bg-danger">{status}</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  // Badge màu trạng thái thanh toán
  const renderPaymentBadge = (status) => {
    switch (status) {
      case "Paid":
      case "Đã thanh toán":
        return <span className="badge bg-success">{status}</span>;
      case "Pending":
      case "Chờ thanh toán":
        return <span className="badge bg-warning text-dark">{status}</span>;
      case "Failed":
      case "Thất bại":
        return <span className="badge bg-danger">{status}</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchBookings}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Quản lý đơn đặt phòng</h4>

      {/* Refresh button */}
      <div className="mb-3">
        <button 
          className="btn btn-outline-primary btn-sm"
          onClick={fetchBookings}
        >
          🔄 Làm mới
        </button>
      </div>

      {/* Bảng hiển thị */}
      <div className="table-responsive">
        <table className="table align-middle table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Mã đơn</th>
              <th>Mã khách</th>
              <th>Mã khách sạn</th>
              <th>Ngày nhận</th>
              <th>Ngày trả</th>
              <th>Trạng thái đơn</th>
              <th>Hình thức TT</th>
              <th>Trạng thái TT</th>
              <th>Đơn giá (VNĐ)</th>
              <th>Tổng tiền (VNĐ)</th>
              <th>Ngày thanh toán</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center text-muted py-4">
                  Không có đơn đặt nào
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td>{booking.bookingId}</td>
                  <td>{booking.userId}</td>
                  <td>{booking.hotelId}</td>
                  <td>{new Date(booking.checkinDate).toLocaleDateString('vi-VN')}</td>
                  <td>{new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}</td>
                  <td>{renderStatusBadge(booking.status)}</td>
                  <td>{booking.paymentMethod || "Chưa xác định"}</td>
                  <td>{renderPaymentBadge(booking.paymentStatus)}</td>
                  <td>{booking.unitPrice?.toLocaleString() || "0"}</td>
                  <td>{booking.totalPrice?.toLocaleString() || "0"}</td>
                  <td>
                    {booking.paymentDay 
                      ? new Date(booking.paymentDay).toLocaleDateString('vi-VN')
                      : "Chưa thanh toán"
                    }
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;