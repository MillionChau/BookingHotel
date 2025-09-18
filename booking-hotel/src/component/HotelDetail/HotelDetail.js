import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUserFriends, FaStar } from "react-icons/fa";
import { Carousel } from "react-bootstrap";
import axios from "axios";

const HotelDetail = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch hotel info
        const hotelRes = await axios.get(`http://localhost:5360/hotel/${hotelId}`);
        if (hotelRes.data && hotelRes.data.hotel) setHotel(hotelRes.data.hotel);

        // fetch rooms by hotelId
        const roomRes = await axios.get(`http://localhost:5360/room/hotel/${hotelId}`);
        const rooms = roomRes.data.rooms || [];

        // gom group theo type
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
          if (g.availableCount > 1) status = "Còn phòng";
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

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <h3 className="fw-bold"  style={{ marginTop: "80px" }}>{hotel.name}</h3>
        <div className="d-flex align-items-center mb-2">
          <FaStar className="text-warning me-1" />
          <span className="fw-semibold me-3">
            {hotel.rating && hotel.rating > 0 ? hotel.rating.toFixed(1) : "Chưa có đánh giá"} / 5
          </span>
          <span className="text-muted">{hotel.address}</span>
        </div>
      </div>

      <div className="row g-2 mb-4">
        <div className="col-md-8">
          <img
            src={hotel.imageUrl}
            alt="main-hotel"
            className="img-fluid rounded w-100"
            style={{ height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-4">
          <div className="row g-2">
            {roomTypes.flatMap(r => r.images).slice(0, 4).map((img, idx) => (
              <div key={idx} className="col-6">
                <img
                  src={img}
                  alt={`gallery-${idx}`}
                  className="img-fluid rounded"
                  style={{ height: 100, objectFit: "cover", width: "100%" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

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
                <img
                  src={room.images[0]}
                  alt={room.type}
                  className="img-fluid rounded"
                />
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
                {room.minPrice.toLocaleString()} VND
              </div>
              <button className="btn btn-primary btn-sm mt-2">Chọn</button>
              <div className="small text-danger mt-1">{room.status}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelDetail;
