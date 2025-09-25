import React, { useState, useCallback, useEffect } from "react";
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
import HotelCard from "../HotelCard/HotelCard"; // Đảm bảo đường dẫn này đúng
import { FaStar } from "react-icons/fa";
import "./SearchPage.css"; // Import file CSS

function SearchPage() {
  // === STATE CHO FORM VÀ BỘ LỌC ===
  const [destination, setDestination] = useState("");
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState(0); // 0 có nghĩa là không lọc theo sao

  // === STATE QUẢN LÝ KẾT QUẢ VÀ TRẠNG THÁI ===
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false); // Theo dõi xem người dùng đã tìm kiếm ít nhất một lần chưa

  // Lấy userId từ localStorage
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

  // === HÀM XỬ LÝ LOGIC ===

  // Hàm gọi API tìm kiếm, được bọc trong useCallback để tối ưu hóa
  const executeSearch = useCallback(async (searchParams) => {
    setLoading(true);
    setError(null);
    setSearched(true); // Đánh dấu đã thực hiện tìm kiếm

    try {
      // Lọc ra các tham số không hợp lệ (rỗng, null, hoặc 0) để không gửi lên server
      const filteredParams = {};
      for (const key in searchParams) {
        if (searchParams[key] !== "" && searchParams[key] !== null && searchParams[key] !== 0) {
          filteredParams[key] = searchParams[key];
        }
      }

      const query = new URLSearchParams(filteredParams).toString();
      // Sử dụng endpoint từ SearchPage.js, bạn có thể thay đổi nếu cần
      const res = await axios.get(`http://localhost:5360/hotel/search?${query}`);
      setHotels(res.data);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm khách sạn:", err);
      setError("Không thể tìm thấy khách sạn phù hợp. Vui lòng thử lại sau.");
      setHotels([]); // Xóa kết quả cũ khi có lỗi
    } finally {
      setLoading(false);
    }
  }, []);

  // Xử lý khi người dùng nhấn nút tìm kiếm hoặc áp dụng bộ lọc
  const handleSubmit = (e) => {
    e.preventDefault();
    // Kiểm tra ngày checkout phải sau ngày checkin
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
    executeSearch(searchParams);
  };

  // Xử lý khi người dùng click vào ngôi sao để lọc
  const handleRatingClick = (newRating) => {
    // Nếu click lại vào sao đã chọn thì bỏ chọn (đặt lại là 0)
    setRating(rating === newRating ? 0 : newRating);
  };

  // === HÀM RENDER KẾT QUẢ ===
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
            {/* Truyền hotelId và userId cho HotelCard */}
            <HotelCard hotelId={hotel._id} userId={userId} />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <Container className="search-page mt-5 pt-4">
      {/* FORM TÌM KIẾM CHÍNH */}
      <Form
        onSubmit={handleSubmit}
        className="p-3 mb-4 bg-light rounded shadow-sm"
      >
        <Row className="g-3 align-items-end">
          <Col md={6} lg={7}>
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
          <Col md={6} lg={3}>
            <Form.Label><strong>Ngày nhận - trả phòng</strong></Form.Label>
            <InputGroup>
              <Form.Control
                type="date"
                value={checkinDate}
                onChange={(e) => setCheckinDate(e.target.value)}
              />
              <Form.Control
                type="date"
                value={checkoutDate}
                onChange={(e) => setCheckoutDate(e.target.value)}
                className="ms-2"
              />
            </InputGroup>
          </Col>
          <Col md={12} lg={2}>
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