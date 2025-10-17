import React from "react";
import { Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Banner.scss";
import { Link } from "react-router-dom";

function Banner() {
  return (
    <div className="banner text-white text-center">
      <Container>
        <h1 className="fw-bold mb-3">
          Đặt phòng khách sạn dễ dàng, nhanh chóng, minh bạch
        </h1>
        <p className="mb-4">
          Tìm kiếm – Đặt phòng – Quản lý mọi lúc, mọi nơi.
        </p>
        <div>
          <Button
            as={Link}
            to="/search"
            variant="light"
            className="btn-hero" 
          >
            <i className="bi bi-calendar-check me-1"></i> Khám phá khách sạn
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default Banner;