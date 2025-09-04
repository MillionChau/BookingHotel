import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { hotelCard } from "../HotelCard/HotelCard";

function BookingHotel() {
  return (
    <div className="container my-4">
      <h3 className="mb-4">Đặt phòng</h3>
      <Row>
        {/* Form đặt phòng */}
        <Col md={4}>
          <Card className="shadow-sm p-3">
            <h5>Thông tin đặt</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nhận phòng</Form.Label>
                <Form.Control type="date" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Trả phòng</Form.Label>
                <Form.Control type="date" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số khách</Form.Label>
                <Form.Control type="number" defaultValue={2} min="1" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phương thức thanh toán</Form.Label>
                <Form.Select>
                  <option>Thanh toán khi nhận phòng</option>
                  <option>Thẻ tín dụng</option>
                  <option>Chuyển khoản</option>
                </Form.Select>
              </Form.Group>

              <Button className="w-100" variant="primary">
                <i className="bi bi-check2-square me-1"></i>
                Xác nhận đặt phòng
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Danh sách khách sạn */}
        <Col md={8}>
          <Row>
            {hotelCard.map((hotel) => (
              <Col md={6} sm={12} key={hotel.id} className="mb-3">
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={hotel.img}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-center">
                      {hotel.nameHotel}
                      <span className="bg-warning text-dark px-2 py-1 rounded ms-2">
                        <i className="bi bi-star-fill me-1"></i>
                        {hotel.iconStar}
                      </span>
                    </Card.Title>

                    <Card.Text className="text-muted mb-2">
                      <i className="bi bi-geo-alt me-1"></i>
                      {hotel.addressHotel}
                    </Card.Text>

                    <h6 className="fw-bold mb-3">
                      {hotel.price.toLocaleString()} đ/đêm
                    </h6>

                    <Button variant="primary">Chọn</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default BookingHotel;
