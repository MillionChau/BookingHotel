import React from "react";
import { Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Banner.css";
function Banner() {
  return (
    <div className="bg-primary banner text-white  text-center banner">
      <Container>
        <h1 className="fw-bold mb-3">
          Đặt phòng khách sạn dễ dàng, nhanh chóng, minh bạch
        </h1>
        <p className="mb-4">
          Tìm kiếm – Lọc – Đặt phòng – Quản lý mọi lúc, mọi nơi.
        </p>
        <div>
          <Button variant="light" className="me-2 fw-semibold">
            <i className="bi bi-calendar-check me-1"></i> Đặt phòng ngay
          </Button>
          <Button variant="outline-light" className="fw-semibold">
            <i className="bi bi-search me-1">
              <a href=""></a>
            </i>{" "}
            Khám phá
          </Button>
        </div>
      </Container>
    </div>
  );
}
export default Banner;
