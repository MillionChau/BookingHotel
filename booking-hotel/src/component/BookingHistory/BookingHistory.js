import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function BookingHistory() {
  const allBookings = [
    {
      id: 1,
      hotel: "Sunrise Hotel",
      room: "A201",
      checkIn: "2025-09-01",
      checkOut: "2025-09-03",
      price: "1.900.000 ₫",
      status: "confirmed",
    },
    {
      id: 2,
      hotel: "Lotus Inn",
      room: "B12",
      checkIn: "2025-07-11",
      checkOut: "2025-07-12",
      price: "500.000 ₫",
      status: "confirmed",
    },
    {
      id: 3,
      hotel: "Moonlight Resort",
      room: "P01",
      checkIn: "2025-06-20",
      checkOut: "2025-06-25",
      price: "11.000.000 ₫",
      status: "cancelled",
    },
  ];

  const [filter, setFilter] = useState("all");

  const filteredBookings =
    filter === "all"
      ? allBookings
      : allBookings.filter((b) => b.status === filter);

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <span className="badge bg-success">Đã xác nhận</span>;
      case "cancelled":
        return <span className="badge bg-secondary">Đã hủy</span>;
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Phòng đã đặt</h5>
          <select
            className="form-select w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Khách sạn</th>
              <th>Phòng</th>
              <th>Nhận</th>
              <th>Trả</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.hotel}</td>
                <td>{b.room}</td>
                <td>{b.checkIn}</td>
                <td>{b.checkOut}</td>
                <td>{b.price}</td>
                <td>{getStatusBadge(b.status)}</td>
                <td>
                  {b.status === "confirmed" && (
                    <button className="btn btn-outline-danger btn-sm">
                      Hủy
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingHistory;
