import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserFriends, FaStar, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { Carousel, Modal } from "react-bootstrap";
import axios from "axios";

const HotelDetail = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [showGallery, setShowGallery] = useState(false);

  // state chọn ngày
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // hôm nay (YYYY-MM-DD)
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // mặc định check-in = ngày mai
  useEffect(() => {
    if (!startDate) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      setStartDate(tomorrow.toISOString().split("T")[0]);
    }
  }, [startDate, today]);

  // số đêm
  const nights =
    startDate && endDate
      ? Math.ceil(
          (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
        )
      : 0;

  // validate check-in
  const handleStartChange = (e) => {
    const val = e.target.value;
    if (val < todayStr) return; // không cho chọn ngày quá khứ
    setStartDate(val);

    // nếu endDate <= startDate thì reset endDate
    if (endDate && new Date(endDate) <= new Date(val)) {
      setEndDate("");
    }
  };

  // validate check-out
  const handleEndChange = (e) => {
    const val = e.target.value;
    if (new Date(val) <= new Date(startDate)) return; // phải sau check-in
    setEndDate(val);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelRes = await axios.get(`http://localhost:5360/hotel/${hotelId}`);
        if (hotelRes.data && hotelRes.data.hotel) setHotel(hotelRes.data.hotel);

        const roomRes = await axios.get(`http://localhost:5360/room/hotel/${hotelId}`);
        const rooms = roomRes.data.rooms || [];

        const grouped = Object.values(
          rooms.reduce((acc, room) => {
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

  if (!hotel) return <div>Đang tải dữ liệu...</div>;

  // Gom ảnh từ hotel + roomTypes
  const allImages = [hotel.imageUrl, ...roomTypes.flatMap((r) => r.images)].filter(Boolean);
  const mainImage = allImages[0];
  const thumbnails = allImages.slice(1, 6);
  const moreImages = allImages.length - 6;

  return (
    <div className="container mt-5 pt-5">
      {/* 🔹 Thanh tìm kiếm trên cùng */}
      <div className="bg-primary text-white rounded-3 p-2 d-flex align-items-center gap-2 mb-4">
        <div className="bg-info bg-opacity-25 rounded px-3 py-2 flex-grow-1 d-flex align-items-center">
          <FaMapMarkerAlt className="me-2" />
          <span>{hotel.name}</span>
        </div>

        <FaCalendarAlt className="me-2 text-primary" />
        <input
          type="date"
          value={startDate}
          min={todayStr}
          onChange={handleStartChange}
          className="form-control border-0 bg-transparent"
          style={{ width: "auto" }}
        />
        <span>-</span>
        <input
          type="date"
          value={endDate}
          min={startDate}
          onChange={handleEndChange}
          className="form-control border-0 bg-transparent"
          style={{ width: "auto" }}
        />
        {nights > 0 && <span className="ms-2 fw-semibold">{nights} đêm</span>}

        <button className="btn btn-light fw-bold text-primary">
          🔍 Tìm khách sạn
        </button>
      </div>

      {/* --- Tiêu đề khách sạn --- */}
      <div className="mb-3">
        <h3 className="fw-bold" style={{ marginTop: "20px" }}>{hotel.name}</h3>
        <div className="d-flex align-items-center mb-2">
          <FaStar className="text-warning me-1" />
          <span className="fw-semibold me-3">
            {hotel.rating && hotel.rating > 0 ? hotel.rating.toFixed(1) : "Chưa có đánh giá"} / 5
          </span>
          <span className="text-muted">
            <FaMapMarkerAlt className="me-2 text-danger" />
            {hotel.address}
          </span>
        </div>
      </div>

      {/* --- Gallery --- */}
      <div className="row g-2 mb-4">
        {/* Ảnh chính */}
        <div className="col-md-8">
          <img
            src={mainImage}
            alt="main-hotel"
            className="img-fluid rounded w-100"
            style={{ height: 400, objectFit: "cover" }}
          />
        </div>

        {/* Thumbnail bên phải */}
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

      {/* Modal hiển thị tất cả ảnh */}
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

      {/* --- Mô tả khách sạn --- */}
      {hotel.description && (
        <div className="mb-4">
          <h5 className="fw-bold">Mô tả khách sạn</h5>
          <p className="text-muted">{hotel.description}</p>
        </div>
      )}

      {/* --- Loại phòng --- */}
      {roomTypes.map((room) => (
        <div key={room.type} className="card mb-4 shadow-sm border-0">
          <div className="card-header bg-white border-0">
            <h5 className="fw-bold mb-0">{room.type}</h5>
          </div>
          <div className="row g-0">
            <div className="col-md-4 p-3 bg-light">
              {room.images.length > 1 ? (
                <Carousel interval={null}>
                  {room.images.map((img, idx) => (
                    <Carousel.Item key={idx}>
                      <img
                        src={img}
                        alt={`${room.type}-${idx}`}
                        className="d-block w-100 rounded"
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                room.images[0] && (
                  <img
                    src={room.images[0]}
                    alt={room.type}
                    className="img-fluid rounded"
                  />
                )
              )}
              <div className="mt-2 text-muted small">
                20 m² • Vòi tắm đứng • Tủ lạnh • Máy lạnh
              </div>
              <a href="#" className="d-block mt-2 text-primary small fw-bold">
                Xem chi tiết phòng
              </a>
            </div>
            <div className="col-md-4 p-3 border-start">
              <div className="fw-semibold mb-2">Lựa chọn phòng</div>
              <div className="small text-muted">{room.type}</div>
              <div className="mt-1">Không bao gồm bữa sáng</div>
              <div className="text-success small mt-2">
                Miễn phí huỷ phòng trước 02 Oct 12:59
              </div>
              <div className="text-success small">
                Không cần thanh toán trước cho đến ngày 01 Oct 2025
              </div>
            </div>
            <div className="col-md-2 p-3 border-start text-center">
              <FaUserFriends size={20} />
              <div className="small mt-1">2 khách</div>
            </div>
            <div className="col-md-2 p-3 border-start text-center d-flex flex-column justify-content-center">
              <div className="fw-bold text-danger fs-5">
                {room.minPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </div>
              <button
                className="btn btn-primary btn-sm mt-2"
                onClick={() => navigate(`/booking/${hotelId}?roomType=${room.type}`)}
              >
                Chọn
              </button>
              <div className="small text-danger mt-1">{room.status}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelDetail;
