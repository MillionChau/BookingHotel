import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUserFriends, FaStar, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { Carousel, Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import Loading from "../Loading/Loading";

const HotelDetail = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showGallery, setShowGallery] = useState(false);

  const userId = JSON.parse(localStorage.getItem("user"));

  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  useEffect(() => {
    if (!startDate) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      setStartDate(tomorrow.toISOString().split("T")[0]);
    }
  }, [startDate, today]);

  const nights =
    startDate && endDate
      ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
      : 0;

  const handleStartChange = (e) => {
    const val = e.target.value;
    if (val < todayStr) return;
    setStartDate(val);
    if (endDate && new Date(endDate) <= new Date(val)) {
      setEndDate("");
    }
  };

  const handleEndChange = (e) => {
    const val = e.target.value;
    if (new Date(val) <= new Date(startDate)) return;
    setEndDate(val);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelRes = await axios.get(`http://localhost:5360/hotel/${hotelId}`);
        if (hotelRes.data && hotelRes.data.hotel) setHotel(hotelRes.data.hotel);

        const roomRes = await axios.get(`http://localhost:5360/room/hotel/${hotelId}`);
        const allRooms = roomRes.data.rooms || [];
        setRooms(allRooms);

        const grouped = Object.values(
          allRooms.reduce((acc, room) => {
            if (!acc[room.type]) {
              acc[room.type] = {
                type: room.type,
                images: [],
                minPrice: room.price,
                availableCount: 0,
              };
            }
            acc[room.type].images.push(room.imageUrl);
            acc[room.type].minPrice = Math.min(acc[room.type].minPrice, room.price);
            if (room.status === "Trống") acc[room.type].availableCount += 1;
            return acc;
          }, {})
        );

        const finalData = grouped.map((g) => {
          let status = "Hết phòng";
          if (g.availableCount >= 2) status = "Còn phòng";
          else if (g.availableCount === 1) status = "Chỉ còn 1 phòng";
          return { ...g, status };
        });

        setRoomTypes(finalData);
      } catch (err) {
        console.error("Lỗi fetch:", err);
      }
    };

    fetchData();
  }, [hotelId]);

  if (!hotel) return <Loading />;

  const allImages = [hotel.imageUrl, ...roomTypes.flatMap((r) => r.images)].filter(Boolean);
  const mainImage = allImages[0];
  const thumbnails = allImages.slice(1, 6);
  const moreImages = allImages.length - 6;

  const handleConfirmBooking = async () => {
    try {
      if (!selectedRoom || !nights) {
        alert("Vui lòng chọn ngày trước khi đặt!");
        return;
      }

      const bookingData = {
        userId: userId.id,
        hotelId: hotelId,
        roomId: selectedRoom.roomId,
        checkinDate: startDate,
        checkOutDate: endDate,
        unitPrice: selectedRoom.price,
        totalPrice: selectedRoom.price * nights,
      };

      const res = await axios.post("http://localhost:5360/api/momo/create", {
        bookingData,
      });

      if (res.data && res.data.payUrl) {
        window.location.href = res.data.payUrl;
      } else {
        alert("Không lấy được link thanh toán!");
      }
    } catch (err) {
      console.error("Axios error:", err.response?.data || err.message);
      alert(
        "Có lỗi khi tạo thanh toán: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="container mt-5 pt-5">
      {/* Hotel name + chọn ngày */}
      <div className="bg-white rounded-3 shadow p-3 d-flex align-items-center gap-3 mb-4 border border-info">
        <div className="d-flex align-items-center bg-info bg-opacity-25 rounded px-3 py-2 flex-grow-1">
          <FaMapMarkerAlt className="me-2 text-info" />
          <span className="fw-semibold text-dark">{hotel.name}</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <FaCalendarAlt className="text-info" />
          <input
            type="date"
            value={startDate}
            min={todayStr}
            onChange={handleStartChange}
            className="form-control form-control-sm border rounded"
            style={{ width: "150px" }}
          />
          <span className="fw-semibold">-</span>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={handleEndChange}
            className="form-control form-control-sm border rounded"
            style={{ width: "150px" }}
          />
        </div>

        {nights > 0 && (
          <span className="badge bg-info text-white px-3 py-2">{nights} đêm</span>
        )}
      </div>

      {/* Hotel info */}
      <div className="mb-3">
        <h3 className="fw-bold" style={{ marginTop: "20px" }}>
          {hotel.name}
        </h3>
        <div className="d-flex align-items-center mb-2">
          <FaStar className="text-warning me-1" />
          <span className="fw-semibold me-3">
            {hotel.rating && hotel.rating > 0
              ? hotel.rating.toFixed(1)
              : "Chưa có đánh giá"}{" "}
            / 5
          </span>
          <span className="text-muted">
            <FaMapMarkerAlt className="me-2 text-danger" />
            {hotel.address}
          </span>
        </div>
      </div>

      {/* Gallery */}
      <div className="row g-2 mb-4">
        <div className="col-md-8">
          <img
            src={mainImage}
            alt="main-hotel"
            className="img-fluid rounded w-100"
            style={{ height: 400, objectFit: "cover" }}
          />
        </div>
        <div className="col-md-4">
          <div className="row g-2">
            {thumbnails.map((img, idx) => (
              <div key={idx} className="col-6 position-relative">
                {idx === thumbnails.length - 1 && moreImages > 0 ? (
                  <div
                    className="position-relative"
                    onClick={() => setShowGallery(true)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={img}
                      alt={`thumb-${idx}`}
                      className="img-fluid rounded"
                      style={{ height: 100, objectFit: "cover", width: "100%" }}
                    />
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 text-white fw-bold rounded">
                      Xem tất cả hình ảnh
                    </div>
                  </div>
                ) : (
                  <img
                    src={img}
                    alt={`thumb-${idx}`}
                    className="img-fluid rounded"
                    style={{ height: 100, objectFit: "cover", width: "100%" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal gallery */}
      <Modal show={showGallery} onHide={() => setShowGallery(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Tất cả hình ảnh</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-2">
            {allImages.map((img, idx) => (
              <div key={idx} className="col-md-4">
                <img
                  src={img}
                  alt={`all-${idx}`}
                  className="img-fluid rounded mb-2"
                  style={{ height: 200, objectFit: "cover", width: "100%" }}
                />
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      {/* Description */}
      {hotel.description && (
        <div className="mb-4">
          <h5 className="fw-bold">Mô tả khách sạn</h5>
          <p className="text-muted">{hotel.description}</p>
        </div>
      )}

      {/* Rooms */}
      {roomTypes.map((roomType) => (
        <div key={roomType.type} className="card mb-4 shadow-sm border-0">
          <div className="card-header bg-white border-0">
            <h5 className="fw-bold mb-0">{roomType.type}</h5>
          </div>
          <div className="row g-0">
            <div className="col-md-4 p-3 bg-light">
              {roomType.images.length > 1 ? (
                <Carousel interval={null}>
                  {roomType.images.map((img, idx) => (
                    <Carousel.Item key={idx}>
                      <img src={img} alt={`${roomType.type}-${idx}`} className="d-block w-100 rounded" />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                roomType.images[0] && (
                  <img src={roomType.images[0]} alt={roomType.type} className="img-fluid rounded" />
                )
              )}
              <div className="mt-2 text-muted small">20 m² • Vòi tắm đứng • Tủ lạnh • Máy lạnh</div>
            </div>
            <div className="col-md-6 p-3 border-start">
              <div className="fw-semibold mb-2">Loại phòng</div>
              <p className="small text-muted">{roomType.type}</p>
              <p className="text-success small">Miễn phí huỷ phòng</p>
            </div>
            <div className="col-md-2 p-3 border-start text-center">
              <FaUserFriends size={20} />
              <div className="small mt-1">2 khách</div>
            </div>
            <div className="col-md-2 p-3 border-start text-center d-flex flex-column justify-content-center">
              <div className="fw-bold text-danger fs-5">
                {roomType.minPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </div>
              <button
                className="btn btn-primary btn-sm mt-2"
                onClick={() => {
                  if (!startDate || !endDate) {
                    alert("Vui lòng chọn ngày trước khi đặt!");
                    return;
                  }
                  const availableRooms = rooms.filter(
                    (r) => r.type === roomType.type && r.status === "Trống"
                  );
                  if (availableRooms.length === 0) {
                    alert("Hết phòng loại này!");
                    return;
                  }
                  const randomRoom =
                    availableRooms[Math.floor(Math.random() * availableRooms.length)];
                  setSelectedRoom(randomRoom);
                  setShowModal(true);
                }}
              >
                Chọn
              </button>
              <div className="small text-danger mt-1">{roomType.status}</div>
            </div>
          </div>
        </div>
      ))}

      {/* Booking modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-primary">Xác nhận đặt phòng</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          {selectedRoom && (
            <div className="row g-4">
              <div className="col-md-6">
                <div className="p-4 bg-white rounded-4 shadow-sm h-100 border">
                  <h6 className="fw-bold text-dark mb-3 border-bottom pb-2">
                    Thông tin khách hàng
                  </h6>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Họ tên</Form.Label>
                      <Form.Control type="text" defaultValue={userId?.fullname || ""} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" defaultValue={userId?.email || ""} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control type="text" defaultValue={userId?.phone || ""} />
                    </Form.Group>
                  </Form>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-4 bg-white rounded-4 shadow-sm h-100 border">
                  <h6 className="fw-bold text-dark mb-3 border-bottom pb-2">
                    Thông tin đặt phòng
                  </h6>
                  <ul className="list-unstyled mb-0 small">
                    <li><strong>Khách sạn:</strong> {hotel.name}</li>
                    <li><strong>Phòng:</strong> {selectedRoom.name} ({selectedRoom.type})</li>
                    <li><strong>Ngày nhận:</strong> {startDate}</li>
                    <li><strong>Ngày trả:</strong> {endDate}</li>
                    <li><strong>Số đêm:</strong> {nights}</li>
                    <li className="mt-3">
                      <span className="fw-bold text-danger fs-5">
                        Giá: {(selectedRoom.price * nights).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Huỷ
          </Button>
          <Button variant="primary" className="px-4 fw-semibold" onClick={handleConfirmBooking}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HotelDetail;
