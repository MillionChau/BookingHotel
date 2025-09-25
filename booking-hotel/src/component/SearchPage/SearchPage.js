import React, { useState, useCallback } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner, Alert, Form, Button, InputGroup, Card } from "react-bootstrap";
import HotelCard from "../HotelCard/HotelCard";
import { FaStar } from "react-icons/fa";
import "./SearchPage.css"; 

function SearchPage() {
  const [destination, setDestination] = useState("");
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
 
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
    } catch (e) { return null; }
  };
  const userId = getUserId();

  const handleSearch = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const filteredParams = {};
      for (const key in params) {
        if (params[key] !== '' && params[key] !== null && params[key] !== 0) {
          filteredParams[key] = params[key];
        }
      }
      const query = new URLSearchParams(filteredParams).toString();
      const res = await axios.get(`http://localhost:5360/hotel/search?${query}`);
      setHotels(res.data);
    } catch (err) {
      setError("Không thể tìm thấy khách sạn phù hợp. Vui lòng thử lại.");
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkinDate && checkoutDate && new Date(checkoutDate) <= new Date(checkinDate)) {
      alert("Ngày trả phòng phải sau ngày nhận phòng.");
      return;
    }
    const searchParams = {
        destination,
        checkinDate,
        checkoutDate,
        minPrice,
        maxPrice,
        rating,
    };
    handleSearch(searchParams);
  };
  
  const handleRatingClick = (newRating) => {
    setRating(rating === newRating ? 0 : newRating);
  };
  
  // === HÀM RENDER KẾT QUẢ ===
  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" /><p className="mt-2">Đang tìm kiếm...</p>
        </div>
      );
    }
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!searched) return <Alert variant="info">Vui lòng nhập thông tin và nhấn tìm kiếm để xem kết quả.</Alert>;
    if (hotels.length === 0) return <Alert variant="warning">Không tìm thấy khách sạn nào phù hợp.</Alert>;
    
    return (
      <Row xs={1} sm={1} md={2} lg={3} className="g-4">
        {hotels.map((hotel) => (
          <Col key={hotel._id}><HotelCard hotelId={hotel._id} userId={userId} /></Col>
        ))}
      </Row>
    );
  };

  return (
    <Container className="search-page mt-5 pt-4">
      <Form onSubmit={handleSubmit} className="p-3 mb-4 bg-light rounded shadow-sm">
        {/* --- FORM TÌM KIẾM --- */}
        <Row className="g-3 align-items-end">
          <Col md={6}>
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
          <Col md={4}>
            <Form.Label><strong>Ngày nhận - trả phòng</strong></Form.Label>
            <InputGroup>
              <Form.Control type="date" value={checkinDate} onChange={(e) => setCheckinDate(e.target.value)} />
              <Form.Control type="date" value={checkoutDate} onChange={(e) => setCheckoutDate(e.target.value)} className="ms-2" />
            </InputGroup>
          </Col>
          <Col md={2}>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" /> : "Tìm Kiếm"}
            </Button>
          </Col>
        </Row>
      </Form>
      <hr />
      
      <Row>
        {/* --- SIDEBAR BỘ LỌC --- */}
        <Col md={4} lg={3}>
          <Card className="p-3 shadow-sm">
            <Card.Title as="h5" className="fw-bold mb-4">Bộ lọc</Card.Title>
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
            {/* ============================================== */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3">Hạng sao</h6>
              <div className="d-flex justify-content-center">
                {[5, 4, 3, 2, 1].map((star) => (
                  <FaStar
                    key={star}
                    className={`star-filter ${rating >= star ? 'active' : ''}`}
                    onClick={() => handleRatingClick(star)}
                  />
                ))}
              </div>
            </div>
            <Button variant="primary" className="w-100" onClick={handleSubmit}>
              Áp dụng bộ lọc
            </Button>
          </Card>
        </Col>

        {/* --- KẾT QUẢ TÌM KIẾM --- */}
        <Col md={8} lg={9}>
          <h4 className="fw-bold mb-4">Kết quả tìm kiếm</h4>
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
}

export default SearchPage;