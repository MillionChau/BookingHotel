import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const BookingManagement = () => {
  const bookings = [
    {
      bookingId: "B001",
      userId: "KH101",
      hotelName: "Khách sạn Biển Xanh",
      roomId: "P12",
      checkinDate: "2025-09-01",
      checkoutDate: "2025-09-05",
      status: "Đã xác nhận",
      paymentMethod: "MoMo",
      paymentStatus: "Đã thanh toán",
      unitPrice: 500000,
      totalPrice: 2000000,
      paymentDay: "2025-09-01",
    },
    {
      bookingId: "B002",
      userId: "KH102",
      hotelName: "Khách sạn Ánh Dương",
      roomId: "P14",
      checkinDate: "2025-08-28",
      checkoutDate: "2025-09-02",
      status: "Đã hoàn thành",
      paymentMethod: "VNPay",
      paymentStatus: "Đã thanh toán",
      unitPrice: 600000,
      totalPrice: 3000000,
      paymentDay: "2025-08-28",
    },
    {
      bookingId: "B003",
      userId: "KH103",
      hotelName: "Khách sạn Hoàng Gia",
      roomId: "P08",
      checkinDate: "2025-09-10",
      checkoutDate: "2025-09-12",
      status: "Đã xác nhận",
      paymentMethod: "ZaloPay",
      paymentStatus: "Đã thanh toán",
      unitPrice: 800000,
      totalPrice: 1600000,
      paymentDay: "2025-09-05",
    },
    {
      bookingId: "B004",
      userId: "KH104",
      hotelName: "Khách sạn Sông Hồng",
      roomId: "P20",
      checkinDate: "2025-09-03",
      checkoutDate: "2025-09-06",
      status: "Đã hủy",
      paymentMethod: "MoMo",
      paymentStatus: "Đã thanh toán",
      unitPrice: 450000,
      totalPrice: 1350000,
      paymentDay: "2025-09-03",
    },
    {
      bookingId: "B005",
      userId: "KH105",
      hotelName: "Khách sạn Golden Bay",
      roomId: "P01",
      checkinDate: "2025-09-07",
      checkoutDate: "2025-09-09",
      status: "Đã xác nhận",
      paymentMethod: "Thẻ quốc tế",
      paymentStatus: "Đã thanh toán",
      unitPrice: 1000000,
      totalPrice: 2000000,
      paymentDay: "2025-09-07",
    },
  ];

  // Badge màu trạng thái đơn
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Đã xác nhận":
        return <span className="badge bg-success">{status}</span>;
      case "Đã hoàn thành":
        return <span className="badge bg-primary">{status}</span>;
      case "Đã hủy":
        return <span className="badge bg-danger">{status}</span>;
      default:
        return status;
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Quản lý đơn đặt phòng</h4>

      {/* Bảng hiển thị */}
      <div className="table-responsive">
        <table className="table align-middle table-bordered">
          <thead className="table-light">
            <tr>
              <th>Mã đơn</th>
              <th>Mã khách</th>
              <th>Tên khách sạn</th>
              <th>Mã phòng</th>
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
            {bookings.map((b) => (
              <tr key={b.bookingId}>
                <td>{b.bookingId}</td>
                <td>{b.userId}</td>
                <td>{b.hotelName}</td>
                <td>{b.roomId}</td>
                <td>{b.checkinDate}</td>
                <td>{b.checkoutDate}</td>
                <td>{renderStatusBadge(b.status)}</td>
                <td>{b.paymentMethod}</td>
                <td>
                  <span className="badge bg-success">{b.paymentStatus}</span>
                </td>
                <td>{b.unitPrice.toLocaleString()}</td>
                <td>{b.totalPrice.toLocaleString()}</td>
                <td>{b.paymentDay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;
