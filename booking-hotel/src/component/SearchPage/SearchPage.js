import React, { useState, useCallback } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner, Alert, Form, Button } from "react-bootstrap";
import HotelCard from "../HotelCard/HotelCard"; // Import component "thông minh"
import "./SearchPage.scss";

function SearchPage() {
  // ... state của các bộ lọc (destination, minPrice, ...) giữ nguyên
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const userId = "USER_ID_CUA_BAN"; // Lấy userId từ localStorage hoặc context

  const executeSearch = useCallback(async (searchParams) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      // ... logic lọc params giữ nguyên

      const query = new URLSearchParams(searchParams).toString();
      
      // 1. SearchPage gọi API tìm kiếm
      const res = await axios.get(
        `http://localhost:5360/hotel/search?${query}`
      );
      
      // 2. SearchPage nhận về một danh sách khách sạn
      // (API có thể chỉ cần trả về [{_id: '1'}, {_id: '2'}] để tối ưu)
      setHotels(res.data);
    } catch (err) {
      setError("Không thể tìm thấy khách sạn phù hợp.");
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = { /* ... */ };
    executeSearch(searchParams);
  };
  
  const renderContent = () => {
    if (loading) {
      return <Spinner animation="border" />;
    }
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    // ... các trường hợp khác

    return (
      <Row xs={1} sm={1} md={2} lg={3} className="g-4">
        {hotels.map((hotel) => (
          <Col key={hotel._id}>
            {/* 3. Chỉ truyền `hotelId`. HotelCard sẽ tự lo phần còn lại */}
            <HotelCard hotelId={hotel._id} userId={userId} />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <Container className="search-page mt-5 pt-4">
      {/* ... Form tìm kiếm */}
      <div className="mt-4">
        <h4 className="fw-bold mb-4">Kết quả tìm kiếm</h4>
        {renderContent()}
      </div>
    </Container>
  );
}

export default SearchPage;