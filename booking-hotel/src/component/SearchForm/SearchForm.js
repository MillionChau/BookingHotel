import React, { useState } from "react";
import { Form, Button, Row, Col, Spinner, InputGroup } from "react-bootstrap";

function SearchForm({ onSearch, loading }) {
  const [destination, setDestination] = useState("");
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [options, setOptions] = useState({
    adults: 1,
    children: 0,
    rooms: 1,
  });
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");

  const handleOptionsChange = (e) => {
    setOptions({ ...options, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkinDate && checkoutDate && new Date(checkoutDate) <= new Date(checkinDate)) {
      alert("Ngày trả phòng phải sau ngày nhận phòng.");
      return;
    }
    onSearch({ destination, checkinDate, checkoutDate, ...options, minPrice, maxPrice, rating });
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3 mb-4 bg-light rounded shadow-sm">
      <Row className="g-3 align-items-end mb-3">
        <Col md={5}>
          <Form.Group controlId="formDestination">
            <Form.Label><strong>Điểm đến</strong></Form.Label>
            <Form.Control
              type="text"
              placeholder="Ví dụ: Hà Nội, Vũng Tàu..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={5}>
          <Form.Label><strong>Ngày nhận - trả phòng</strong></Form.Label>
          <div className="d-flex">
            <Form.Control type="date" value={checkinDate} onChange={(e) => setCheckinDate(e.target.value)} />
            <Form.Control type="date" value={checkoutDate} onChange={(e) => setCheckoutDate(e.target.value)} className="ms-2" />
          </div>
        </Col>
        <Col md={2}>
            <Form.Label><strong>Số phòng</strong></Form.Label>
            <Form.Control type="number" name="rooms" value={options.rooms} onChange={handleOptionsChange} min={1} title="Số phòng" />
        </Col>
      </Row>
      
      <Row className="g-3 align-items-end">
        <Col md={5}>
            <Form.Label><strong>Khoảng giá (VNĐ)</strong></Form.Label>
            <InputGroup>
                <Form.Control type="number" placeholder="Giá tối thiểu" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} min={0} />
                <Form.Control type="number" placeholder="Giá tối đa" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} min={0} className="ms-2" />
            </InputGroup>
        </Col>
        <Col md={5}>
            <Form.Label><strong>Hạng sao</strong></Form.Label>
            <Form.Select aria-label="Chọn số sao" value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value="">Tất cả hạng sao</option>
                <option value="5">5 sao ⭐⭐⭐⭐⭐</option>
                <option value="4">4 sao ⭐⭐⭐⭐</option>
                <option value="3">3 sao ⭐⭐⭐</option>
                <option value="2">2 sao ⭐⭐</option>
                <option value="1">1 sao ⭐</option>
            </Form.Select>
        </Col>
        <Col md={2}>
          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" /> : "Tìm Kiếm"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchForm;