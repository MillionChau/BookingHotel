import React, { useState } from "react";
import { Table, Button, Dropdown } from "react-bootstrap";
import "./BookingList.scss";
function BookingList() {
  const initialBookings = [
    {
      id: 101,
      hotel: "Sunrise Hotel",
      room: "A201",
      checkin: "01-09-2025",
      checkout: "03-09-2025",
      price: 1900000,
      status: "Đang chờ",
    },
    {
      id: 102,
      hotel: "Lotus Inn",
      room: "B12",
      checkin: "03-09-2025",
      checkout: "05-09-2025",
      price: 500000,
      status: "Đã xác nhận",
    },
    {
      id: 103,
      hotel: "Moonlight Resort",
      room: "P01",
      checkin: "25-06-2025",
      checkout: "26-06-2025",
      price: 11000000,
      status: "Đã hủy",
    },
    {
      id: 104,
      hotel: "Ocean View",
      room: "C08",
      checkin: "20-07-2025",
      checkout: "21-07-2025",
      price: 1200000,
      status: "Đã xác nhận",
    },
  ];

  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState("Tất cả trạng thái");

  // Hàm đổi trạng thái filter
  const handleFilter = (status) => {
    setFilter(status);
  };

  // Hàm xử lý hủy booking
  const handleCancel = (id) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: "Đã hủy" } : b
    );
    setBookings(updated);
  };

  // Lọc theo trạng thái
  const filteredBookings =
    filter === "Tất cả trạng thái"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  // Render badge theo trạng thái
  const renderStatus = (status) => {
    switch (status) {
      case "Đang chờ":
        return <span className="badge bg-warning text-dark">{status}</span>;
      case "Đã xác nhận":
        return <span className="badge bg-success">{status}</span>;
      case "Đã hủy":
        return <span className="badge bg-secondary">{status}</span>;
      default:
        return status;
    }
  };

  // Xuất CSV
  const exportCSV = () => {
    const header = ["Khách sạn", "Phòng", "Nhận", "Trả", "Giá", "Trạng thái"];
    const rows = filteredBookings.map((b) => [
      b.hotel,
      b.room,
      b.checkin,
      b.checkout,
      b.price,
      b.status,
    ]);
  };

  return (
    <div className="container bookingList">
      <h4 className="mb-3">Phòng đã đặt</h4>

      {/* Bộ lọc + Xuất CSV */}
      <div className="d-flex mb-3 gap-2">
        <Dropdown>
          <Dropdown.Toggle variant="outline-primary">{filter}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleFilter("Tất cả trạng thái")}>
              Tất cả trạng thái
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilter("Đang chờ")}>
              Đang chờ
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilter("Đã xác nhận")}>
              Đã xác nhận
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilter("Đã hủy")}>
              Đã hủy
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Bảng */}
      <Table bordered hover responsive>
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
          {filteredBookings.map((b, index) => (
            <tr key={b.id}>
              <td>{index + 1}</td>
              <td>{b.hotel}</td>
              <td>{b.room}</td>
              <td>{b.checkin}</td>
              <td>{b.checkout}</td>
              <td>{b.price.toLocaleString("vi-VN") + " ₫"}</td>
              <td>{renderStatus(b.status)}</td>
              <td>
                {b.status === "Đang chờ" || b.status === "Đã xác nhận" ? (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleCancel(b.id)}>
                    Hủy
                  </Button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default BookingList;
