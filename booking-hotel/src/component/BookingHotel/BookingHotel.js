import React, { useState, useCallback } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import SearchForm from "../SearchForm/SearchForm"; // Đảm bảo đường dẫn này đúng
import HotelCard from "../HotelCard/HotelCard"; // Đảm bảo đường dẫn này đúng

function SearchPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false); // State để biết đã tìm kiếm hay chưa

  // Lấy userId từ localStorage để truyền cho HotelCard
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

  // Hàm gọi API tìm kiếm
  const handleSearch = useCallback(async (searchParams) => {
    setLoading(true);
    setError(null);
    setSearched(true); // Đánh dấu là đã thực hiện tìm kiếm
    try {
      // Xây dựng query string từ các tham số
      const query = new URLSearchParams(searchParams).toString();
      // THAY THẾ bằng endpoint API của bạn
      const res = await axios.get(`/api/hotels/search?${query}`);
      setHotels(res.data);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm khách sạn:", err);
      setError("Không thể tìm thấy khách sạn phù hợp. Vui lòng thử lại.");
      setHotels([]); // Xóa kết quả cũ nếu có lỗi
    } finally {
      setLoading(false);
    }
  }, []);

  // Hàm render nội dung kết quả
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
         return <Alert variant="info">Vui lòng nhập thông tin và nhấn tìm kiếm để xem kết quả.</Alert>;
    }

    if (hotels.length === 0) {
      return <Alert variant="warning">Không tìm thấy khách sạn nào phù hợp với tiêu chí của bạn.</Alert>;
    }

    return (
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {hotels.map((hotel) => (
          <Col key={hotel._id}>
            {/* Giả định hotel._id là hotelId */}
            <HotelCard hotelId={hotel._id} userId={userId} />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <Container className="mt-5 pt-4">
      <h3 className="fw-bold mb-3">Tìm kiếm khách sạn</h3>
      <SearchForm onSearch={handleSearch} loading={loading} />
      <hr />
      <h4 className="fw-bold mb-4">Kết quả tìm kiếm</h4>
      {renderContent()}
    </Container>
  );
}

export default SearchPage;