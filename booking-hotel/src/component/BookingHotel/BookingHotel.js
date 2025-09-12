// import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { ArrowClockwise, StarFill, Heart } from "react-bootstrap-icons";
import { hotelCard } from "../HotelCard/HotelCard";
import "./BookingHotel.scss";
import Search from "../Search/Search";
function BookingHotel() {
  return (
    <>
      <div className="container my-5 bookingHotel">
        <div className="row">
          <div className="col-lg-5 d-flex flex-column bookingHotel-search">
            <div className="card shadow-sm">
              <div class="card-body">
                <Search />
              </div>
            </div>
            {/* <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="h4 mb-3">Đặt phòng</h2>
                <div className="row g-2">
                  <h5 className="card-title">Thông tin đặt</h5>
                  <div className="col-6">
                    <label className="form-label">Nhận phòng</label>
                    <input
                      type="date"
                      className="form-control"
                      id="bkCheckin"
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Trả phòng</label>
                    <input
                      type="date"
                      className="form-control"
                      id="bkCheckout"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Số khách</label>
                    <input
                      type="number"
                      className="form-control"
                      id="bkGuests"
                      min="1"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Phương thức thanh toán</label>
                    <select className="form-select" id="bkPayment">
                      <option>Thanh toán khi nhận phòng</option>
                      <option>Thẻ nội địa</option>
                      <option>Visa/MasterCard</option>
                      <option>Ví điện tử</option>
                    </select>
                  </div>
                  <div className="col-12 d-grid mt-2">
                    <button className="btn btn-primary" id="btnPlaceBooking">
                      <i className="bi bi-bag-check me-2"></i>Xác nhận đặt phòng
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
          <div className="col-lg-7">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title d-flex justify-content-between align-items-center">
                  Chọn phòng
                  <button
                    className="btn btn-sm btn-outline-secondary  d-flex align-items-center"
                    id="btnReloadRooms">
                    <ArrowClockwise /> Tải lại
                  </button>
                </h5>
                <div className="row g-3" id="roomList">
                  {hotelCard.slice(0, 4).map((item, index) => (
                    <div key={index} className=" col-md-6">
                      <div className="hotelCard card h-100">
                        <img
                          src={item.img}
                          className="card-img-top"
                          alt={item.name}
                        />
                        <div className="card-body">
                          <h5 className="card-title d-flex align-items-center">
                            {item.nameHotel}
                            <span className="d-flex align-items-center badge text-bg-warning ms-2">
                              <StarFill />
                              {item.iconStar}
                            </span>
                          </h5>
                          <div className="small text-muted mb-2">
                            <i className="bi bi-geo-alt me-1"></i>
                            {item.addressHotel} • Phòng {item.room} •{" "}
                            {item.type}
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-semibold">
                              {item.price.toLocaleString("vi-VN")} ₫/đêm
                            </span>
                            <div className="btn-group d-flex align-items-center ">
                              <button
                                className="btn btn-primary btn-sm btnChooseRoom"
                                data-id={item.id}>
                                Chọn
                              </button>
                              <button className="btn btn-sm btn-outline-secondary btnAddFav">
                                <Heart />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingHotel;
