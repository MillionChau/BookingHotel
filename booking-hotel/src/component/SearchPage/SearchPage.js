import React, { useState, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Form,
  Button,
  InputGroup,
  Card,
} from "react-bootstrap";
import HotelCard from "../HotelCard/HotelCard"; 
import { FaStar } from "react-icons/fa";
import "./SearchPage.css"; 

function SearchPage() {
  
  const [destination, setDestination] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState(0);

 
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const getUserId = () => {
    try {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString).id : null;
    } catch (e) {
      console.error("Lỗi khi đọc user từ localStorage", e);
      return null;
    }
  };
  const userId = getUserId();


  const executeSearch = useCallback(async (searchParams) => {
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const filteredParams = {};
      for (const key in searchParams) {
        if (searchParams[key] !== "" && searchParams[key] !== null && searchParams[key] !== 0) {
          filteredParams[key] = searchParams[key];
        }
      }

      const query = new URLSearchParams(filteredParams).toString();
      const res = await axios.get(`http://localhost:5360/hotel/search?${query}`);
      setHotels(res.data);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm khách sạn:", err);
      setError("Không thể tìm thấy khách sạn phù hợp. Vui lòng thử lại sau.");
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = {
      destination,
      minPrice,
      maxPrice,
      rating,
    };
    executeSearch(searchParams);
  };

  const handleRatingClick = (newRating) => {
    setRating(rating === newRating ? 0 : newRating);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
          <p className="mt-2">Đang tìm kiếm khách sạn...</p>
        </div>
      );
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }

    if (!searched) {
      return (
        <Alert variant="info">
          Vui lòng nhập thông tin và nhấn "Tìm Kiếm" để xem kết quả.
        </Alert>
      );
    }

    if (hotels.length === 0) {
      return (
        <Alert variant="warning">
          Không tìm thấy khách sạn nào phù hợp với tiêu chí của bạn.
        </Alert>
      );
    }

    return (
      <Row xs={1} sm={1} md={2} lg={3} className="g-4">
        {hotels.map((hotel) => (
          <Col key={hotel._id}>
            <HotelCard hotelId={hotel._id} userId={userId} />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <Container className="search-page mt-5 pt-4">
      {/* FORM TÌM KIẾM CHÍNH (ĐÃ BỎ TRƯỜNG NGÀY) */}
      <Form
        onSubmit={handleSubmit}
        className="p-3 mb-4 bg-light rounded shadow-sm"
      >
        <Row className="g-3 align-items-end">
          <Col md={10}>
            <Form.Group controlId="formDestination">
              <Form.Label><strong>Điểm đến</strong></Form.Label>
              <Form.Control
                type="text"
                placeholder="Ví dụ: Hà Nội, Vũng Tàu, Quận 1..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" /> : "Tìm Kiếm"}
            </Button>
          </Col>
        </Row>
      </Form>
      <hr />

      {/* BỘ LỌC VÀ KẾT QUẢ */}
      <Row>
        {/* CỘT BỘ LỌC */}
        <Col md={4} lg={3}>
          <Card className="p-3 shadow-sm position-sticky" style={{ top: '80px' }}>
            <Card.Title as="h5" className="fw-bold mb-4">Bộ lọc</Card.Title>
            
            {/* Lọc theo giá */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3">Khoảng giá (VNĐ)</h6>
              <InputGroup className="mb-2">
                <InputGroup.Text>Từ</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min={0}
                />
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>Đến</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="Không giới hạn"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min={0}
                />
              </InputGroup>
            </div>

            {/* Lọc theo sao */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3">Hạng sao</h6>
              <div className="d-flex justify-content-center">
                {[5, 4, 3, 2, 1].map((star) => (
                  <FaStar
                    key={star}
                    className={`star-filter ${rating >= star ? "active" : ""}`}
                    onClick={() => handleRatingClick(star)}
                    title={`${star} sao`}
                  />
                ))}
              </div>
            </div>

            <Button variant="outline-primary" className="w-100" onClick={handleSubmit} disabled={loading}>
              Áp dụng bộ lọc
            </Button>
          </Card>
        </Col>

        {/* CỘT KẾT QUẢ TÌM KIẾM */}
        <Col md={8} lg={9}>
          <h4 className="fw-bold mb-4">Kết quả tìm kiếm</h4>
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
}

export default SearchPage;