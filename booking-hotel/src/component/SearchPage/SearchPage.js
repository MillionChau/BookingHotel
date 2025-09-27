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
  const [searchResults, setSearchResults] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  //  Lấy userId từ localStorage
  const getUserId = () => {
    try {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString).id : null;
    } catch (e) {
      return null;
    }
  };
  const userId = getUserId();

  //  Hàm tìm kiếm khách sạn
  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await axios.get("http://localhost:5360/hotel/all");
      let data = res.data.HotelList || [];

      // Lọc theo điểm đến
      if (destination.trim() !== "") {
        data = data.filter((item) =>
          item.address.toLowerCase().includes(destination.toLowerCase())
        );
      }

      // Lọc theo giá
      if (minPrice !== "") {
        data = data.filter((hotel) => hotel.price >= Number(minPrice));
      }
      if (maxPrice !== "") {
        data = data.filter((hotel) => hotel.price <= Number(maxPrice));
      }

      // Lọc theo rating
      if (rating > 0) {
        data = data.filter((hotel) => Math.floor(hotel.rating) === rating);
      }

      setSearchResults(data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách khách sạn. Vui lòng thử lại.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [destination, minPrice, maxPrice, rating]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
    setSearched(true);
  };

  const handleRatingClick = (newRating) => {
    setRating(rating === newRating ? 0 : newRating);
  };

  //  Toggle yêu thích
  const handleToggleFavorite = async (hotelId) => {
    try {
      await axios.post("http://localhost:5360/favorite/toggle", {
        userId,
        hotelId,
      });

      // cập nhật lại state searchResults
      setSearchResults((prev) =>
        prev.map((hotel) =>
          hotel.hotelId === hotelId
            ? { ...hotel, isFavorite: !hotel.isFavorite }
            : hotel
        )
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật yêu thích:", err);
    }
  };

  //  Render kết quả
  const renderContent = () => {
    if (!searched) {
      return (
        <Alert variant="info">
          Vui lòng nhập thông tin và nhấn nút tìm kiếm.
        </Alert>
      );
    }

    if (loading) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p className="mt-2">Đang tìm kiếm... </p>
        </div>
      );
    }

    if (error) return <Alert variant="danger">{error}</Alert>;

    const visibleResults = searchResults.slice(0, visibleCount);

    if (searchResults.length > 0) {
      return (
        <>
          <Row xs={1} md={3} className="g-4">
            {visibleResults.map((s) => (
              <Col key={s.hotelId}>
                <HotelCard
                  hotelId={s.hotelId}
                  userId={userId}
                  isFavoriteDefault={s.isFavorite || false}
                  onToggleFavorite={handleToggleFavorite}
                />
              </Col>
            ))}
          </Row>

          {visibleCount < searchResults.length && (
            <div className="text-center mt-4">
              <Button
                variant="outline-primary"
                onClick={() => setVisibleCount(visibleCount + 6)}>
                Xem thêm
              </Button>
            </div>
          )}
        </>
      );
    } else {
      return (
        <Alert variant="warning">
          Không tìm thấy kết quả <strong>{destination}</strong>.
        </Alert>
      );
    }
  };

  return (
    <Container className="search-page my-5 pt-4">
      {/* --- FORM TÌM KIẾM --- */}
      <Form
        onSubmit={handleSubmit}
        className="p-3 mb-4 bg-light rounded shadow-sm">
        <Row className="g-3 align-items-end">
          <Col md={6}>
            <Form.Group controlId="formDestination">
              <Form.Label>
                <strong>Điểm đến</strong>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ví dụ: Hà Nội, Vũng Tàu..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}>
              {loading ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                "Tìm Kiếm"
              )}
            </Button>
          </Col>
        </Row>
      </Form>
      <hr />

      <Row>
        {/* --- SIDEBAR BỘ LỌC --- */}
        <Col md={4} lg={3}>
          <Card className="p-3 shadow-sm">
            <Card.Title as="h5" className="fw-bold mb-4">
              Bộ lọc
            </Card.Title>
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

            <div className="mb-4">
              <h6 className="fw-bold mb-3">Hạng sao</h6>
              <div className="d-flex justify-content-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`star-filter ${rating >= star ? "active" : ""}`}
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
          <h4 className="fw-bold mb-4">
            Kết quả tìm kiếm <strong>{destination}</strong>
          </h4>
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
}

export default SearchPage;
