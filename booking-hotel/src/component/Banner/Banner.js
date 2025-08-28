import React from "react";
import { Container, Button, InputGroup , Form } from "react-bootstrap";

export function Banner() {
  return (
    <div className="bg-primary text-white py-5 text-center">
      <Container>
        <h1 className="fw-bold mb-3">
          Đặt phòng khách sạn dễ dàng, nhanh chóng và tiện lợi
        </h1>
        <p className="lead mb-4">
          Tìm kiếm và đặt phòng khách sạn trên toàn quốc chỉ trong vài bước.
        </p>
        <Button variant="light" size="lg" href="/dat-phong">
          <span className="bi bi-calendar-check me-2"> Đặt phòng ngay</span>
        </Button>
        
      </Container>
    </div>
  );
}