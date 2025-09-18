import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HotelDetail.scss";
//có db thì sửa
function HotelDetail() {
  const rooms = [
    {
      id: 1,
      name: "Phòng Standard",
      img: "https://picsum.photos/400/250?random=1",
      size: "20m²",
      bed: "1 giường đôi",
      guest: "2 khách",
      price: 500000,
      numbers: ["P101", "P102", "P103", "P104"],
      booked: ["P102"],
    },
    {
      id: 2,
      name: "Phòng Deluxe",
      img: "https://picsum.photos/400/250?random=2",
      size: "30m²",
      bed: "2 giường đơn",
      guest: "2 khách",
      price: 750000,
      numbers: ["P201", "P202"],
      booked: [],
    },
    {
      id: 3,
      name: "Phòng Suite",
      img: "https://picsum.photos/400/250?random=3",
      size: "50m²",
      bed: "1 giường King",
      guest: "3 khách",
      price: 1200000,
      numbers: ["P301"],
      booked: [],
    },
  ];

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [error, setError] = useState("");

  // Chọn phòng + số phòng
  const handleSelect = (room, number) => {
    if (room.booked.includes(number)) return;
    if (selectedNumber === number) {
      setSelectedRoom(null);
      setSelectedNumber(null);
    } else {
      setSelectedRoom(room);
      setSelectedNumber(number);
    }
  };

  // Tính số ngày
  const calculateDays = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = (end - start) / (1000 * 3600 * 24);
    return diff > 0 ? diff : 0;
  };

  // Kiểm tra điều kiện đặt phòng
  const validateBooking = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minCheckIn = new Date(today);
    minCheckIn.setDate(today.getDate() + 1);

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (!checkIn || !checkOut) {
      setError("Vui lòng chọn ngày nhận và ngày trả phòng.");
      return false;
    }
    if (start < minCheckIn) {
      setError("Ngày nhận phòng phải sau ngày hiện tại ít nhất 1 ngày.");
      return false;
    }
    if (end <= start) {
      setError("Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày.");
      return false;
    }
    setError("");
    return true;
  };

  // Tổng tiền
  const total = selectedRoom ? selectedRoom.price * calculateDays() : 0;

  return (
    <div className="hotelDetail container mt-5 ">
      {/* Banner khách sạn */}
      <div className="card mb-4 shadow-sm">
        <img
          src="https://picsum.photos/1200/400?random=9"
          className="card-img-top"
          alt="Hotel Banner"
        />
        <div className="card-body">
          <h3 className="card-title">Khách sạn Hà Nội Luxury</h3>
          <p className="card-text">
            <i className="bi bi-geo-alt"></i> 123 Trần Duy Hưng, Hà Nội
          </p>
          <p className="text-muted">
            ⭐⭐⭐⭐ · Khách sạn 4 sao với hồ bơi, spa và phòng tập gym hiện đại
          </p>
        </div>
      </div>

      <div className="row">
        {/* Danh sách phòng */}
        <div className="col-md-8">
          <h4 className="mb-3">Các loại phòng</h4>
          {rooms.map((room) => (
            <div key={room.id} className="card mb-3 shadow-sm">
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={room.img}
                    className="img-fluid rounded-start"
                    alt={room.name}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{room.name}</h5>
                    <p className="card-text">
                      <strong>Kích thước:</strong> {room.size} <br />
                      <strong>Giường:</strong> {room.bed} <br />
                      <strong>Sức chứa:</strong> {room.guest}
                    </p>
                    <h6 className="text-primary">
                      {room.price.toLocaleString()} VND/đêm
                    </h6>

                    {/* Hiển thị danh sách số phòng */}
                    <div className="d-flex flex-wrap mt-2">
                      {room.numbers.map((number) => {
                        const isBooked = room.booked.includes(number);
                        const isSelected = selectedNumber === number;
                        return (
                          <button
                            key={number}
                            className={`btn me-2 mb-2 ${
                              isBooked
                                ? "btn-secondary"
                                : isSelected
                                ? "btn-success"
                                : "btn-outline-primary"
                            }`}
                            disabled={isBooked}
                            onClick={() => handleSelect(room, number)}>
                            {number}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cột bên phải - Thông tin đặt phòng */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm sticky-top">
            <h5>Thông tin đặt phòng</h5>
            <div className="mb-3">
              <label className="form-label">Ngày nhận phòng</label>
              <input
                type="date"
                className="form-control"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Ngày trả phòng</label>
              <input
                type="date"
                className="form-control"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            {/* Thông tin phòng đã chọn */}
            {selectedRoom && selectedNumber && (
              <div className="alert alert-info">
                <p className="mb-1">
                  <strong>Phòng:</strong> {selectedRoom.name} ({selectedNumber})
                </p>
                <p className="mb-1">
                  <strong>Giá:</strong> {selectedRoom.price.toLocaleString()}{" "}
                  VND/đêm
                </p>
                <p className="mb-1">
                  <strong>Số đêm:</strong> {calculateDays()}
                </p>
                <h6 className="text-danger">
                  Tổng tiền: {total.toLocaleString()} VND
                </h6>
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            <button
              className="btn btn-primary w-100"
              onClick={() => validateBooking()}>
              Đặt phòng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelDetail;
