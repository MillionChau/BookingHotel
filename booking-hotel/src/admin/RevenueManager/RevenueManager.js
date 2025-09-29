import React, { useEffect, useState } from "react";
import { Table, Form, Button, Row, Col, Card, Spinner, Pagination, Alert } from "react-bootstrap";
import axios from "axios";
import "./RevenueManager.module.scss";

export default function RevenueManager() {
  const [revenues, setRevenues] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({ 
    month: new Date().getMonth() + 1, 
    year: new Date().getFullYear(), 
    hotelId: "" 
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");

  // Fetch danh sách khách sạn và stats
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch stats
        const statsRes = await axios.get("http://localhost:5360/revenue/stats");
        setStats(statsRes.data.data || {});
        
        // Fetch danh sách khách sạn thực tế
        const hotelsRes = await axios.get("http://localhost:5360/hotel/all");
        // Sử dụng HotelList từ response
        setHotels(hotelsRes.data.HotelList || []);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu ban đầu:", err);
        setError("Không thể tải dữ liệu khởi tạo!");
      }
    };
    
    fetchInitialData();
  }, []);

  // Fetch revenues khi filters thay đổi
  useEffect(() => {
    fetchRevenues();
  }, [filters, page]);

  const fetchRevenues = async () => {
    setLoading(true);
    setError("");
    
    try {
      let revenueData = [];
      let response;

      if (filters.hotelId) {
        // Lấy doanh thu theo hotel cụ thể bằng hotelId
        response = await axios.get(`http://localhost:5360/revenue/hotel/${filters.hotelId}`, {
          params: { month: filters.month, year: filters.year }
        });
        revenueData = response.data.data ? [response.data.data] : [];
      } else {
        // Lấy doanh thu monthly (tất cả hotels)
        response = await axios.get("http://localhost:5360/revenue/monthly", {
          params: { month: filters.month, year: filters.year, page, limit: 10 }
        });
        revenueData = response.data.data?.docs || response.data.data || [];
        setTotalPages(response.data.data?.totalPages || 1);
      }

      setRevenues(revenueData);
    } catch (err) {
      console.error("Lỗi lấy revenues:", err.response?.data || err);
      if (err.response?.status === 404) {
        setError("Không tìm thấy dữ liệu doanh thu cho bộ lọc hiện tại!");
      } else {
        setError("Không thể tải dữ liệu doanh thu!");
      }
      setRevenues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPage(1);
  };

  const handleHotelChange = (e) => {
    const hotelId = e.target.value;
    setSelectedHotel(hotelId);
    setFilters({ ...filters, hotelId });
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ 
      month: new Date().getMonth() + 1, 
      year: new Date().getFullYear(), 
      hotelId: "" 
    });
    setSelectedHotel("");
    setPage(1);
  };

  const getMonthName = (month) => {
    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    return months[month - 1] || `Tháng ${month}`;
  };

  // Tìm tên khách sạn theo hotelId
  const getHotelName = (hotelId) => {
    const hotel = hotels.find(h => h.hotelId === hotelId);
    return hotel ? `${hotel.name} (${hotelId})` : hotelId;
  };

  return (
    <div className="revenue-dashboard container mt-4">
      <h2 className="mb-4">Quản lý Doanh thu</h2>

      {/* Thống kê tổng quan */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="stat-card bg-primary text-white">
            <Card.Body>
              <h5>Tổng doanh thu</h5>
              <h3>{stats.totalRevenue ? stats.totalRevenue.toLocaleString("vi-VN") + " ₫" : "0 ₫"}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card bg-success text-white">
            <Card.Body>
              <h5>Tổng số booking</h5>
              <h3>{stats.totalBookings || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card bg-warning text-dark">
            <Card.Body>
              <h5>Số khách sạn</h5>
              <h3>{stats.hotelCount || hotels.length}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">🔍 Lọc doanh thu</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Khách sạn</Form.Label>
                <Form.Select
                  name="hotelId"
                  value={selectedHotel}
                  onChange={handleHotelChange}
                >
                  <option value="">Tất cả khách sạn</option>
                  {hotels.map(hotel => (
                    <option key={hotel.hotelId} value={hotel.hotelId}>
                      {hotel.name} ({hotel.hotelId})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Tháng</Form.Label>
                <Form.Select
                  name="month"
                  value={filters.month}
                  onChange={handleFilterChange}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {getMonthName(i + 1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Năm</Form.Label>
                <Form.Control
                  type="number"
                  name="year"
                  value={filters.year}
                  onChange={handleFilterChange}
                  min="2020"
                  max="2030"
                />
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button 
                variant="primary" 
                onClick={fetchRevenues} 
                disabled={loading}
                className="w-100"
              >
                {loading ? <Spinner size="sm" /> : "🔍 Áp dụng"}
              </Button>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button 
                variant="secondary" 
                onClick={handleResetFilters}
                className="w-100"
              >
                ↺ Reset
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Hiển thị thông tin filter hiện tại */}
      {filters.hotelId && (
        <Alert variant="info" className="mb-3">
          Đang xem doanh thu cho: <strong>{getHotelName(filters.hotelId)}</strong> - 
          <strong> {getMonthName(filters.month)}/{filters.year}</strong>
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Bảng doanh thu */}
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Chi tiết doanh thu</h5>
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={fetchRevenues}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Làm mới"}
          </Button>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" />
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              <Table striped bordered hover responsive>
                <thead className="bg-dark text-white">
                  <tr>
                    <th>Khách sạn</th>
                    <th>Tháng/Năm</th>
                    <th>Tổng doanh thu</th>
                    <th>Tổng booking</th>
                    <th>Doanh thu trung bình</th>
                  </tr>
                </thead>
                <tbody>
                  {revenues.length > 0 ? (
                    revenues.map((rev, idx) => (
                      <tr key={idx}>
                        <td>
                          <strong>{getHotelName(rev.hotelId)}</strong>
                        </td>
                        <td>
                          {getMonthName(rev.month)}/{rev.year}
                        </td>
                        <td className="fw-bold text-success">
                          {rev.totalRevenue ? rev.totalRevenue.toLocaleString("vi-VN") + " ₫" : "0 ₫"}
                        </td>
                        <td>
                          <span className="badge bg-primary">{rev.totalBookings || 0}</span>
                        </td>
                        <td className="fw-bold">
                          {rev.totalRevenue && rev.totalBookings && rev.totalBookings > 0
                            ? Math.round(rev.totalRevenue / rev.totalBookings).toLocaleString("vi-VN") + " ₫"
                            : "0 ₫"
                          }
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">
                        <div>
                          <i className="fas fa-chart-bar fa-2x mb-2"></i>
                          <p>Không có dữ liệu doanh thu cho bộ lọc hiện tại</p>
                          <small>Hãy thử thay đổi tháng, năm hoặc khách sạn</small>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Pagination chỉ hiển thị khi xem tất cả khách sạn */}
              {!filters.hotelId && totalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
                  <Pagination.Prev 
                    disabled={page === 1} 
                    onClick={() => setPage(page - 1)} 
                  />
                  
                  {[...Array(totalPages).keys()].map((num) => (
                    <Pagination.Item 
                      key={num + 1} 
                      active={num + 1 === page} 
                      onClick={() => setPage(num + 1)}
                    >
                      {num + 1}
                    </Pagination.Item>
                  ))}
                  
                  <Pagination.Next 
                    disabled={page === totalPages} 
                    onClick={() => setPage(page + 1)} 
                  />
                </Pagination>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}