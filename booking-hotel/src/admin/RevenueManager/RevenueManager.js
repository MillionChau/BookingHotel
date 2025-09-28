import React, { useEffect, useState } from "react";
import { Table, Form, Button, Row, Col, Card, Spinner, Pagination, Alert } from "react-bootstrap";
import axios from "axios";
import "./RevenueManager.module.scss";

export default function RevenueManager() {
  const [revenues, setRevenues] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({ month: "", year: "", hotelId: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5360/revenue/stats")
      .then((res) => {
        setStats(res.data.data);
      })
      .catch((err) => {
        console.error("Lỗi lấy thống kê:", err.response?.data || err);
      });
  }, []);

  useEffect(() => {
    fetchRevenues(page, filters);
  }, [page, filters]);

  const fetchRevenues = async (page, filters) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5360/revenue/all", {
        params: { page, limit: 10, ...filters },
      });
      setRevenues(res.data.data.docs || []);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (err) {
      console.error("Lỗi lấy revenues:", err.response?.data || err);
      setError("Không thể tải dữ liệu doanh thu!");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  return (
    <div className="revenue-dashboard container mt-4">
      <h2 className="mb-4">📊 Revenue Manager</h2>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="stat-card bg-primary text-white">
            <Card.Body>
              <h5>Tổng doanh thu</h5>
              <h3>{stats.totalRevenue?.toLocaleString("vi-VN")} ₫</h3>
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
              <h3>{stats.hotelCount || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Form className="filter-form mb-3">
        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Tháng</Form.Label>
              <Form.Control
                type="number"
                name="month"
                value={filters.month}
                onChange={handleFilterChange}
                placeholder="VD: 9"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Năm</Form.Label>
              <Form.Control
                type="number"
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                placeholder="VD: 2025"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Hotel ID</Form.Label>
              <Form.Control
                type="text"
                name="hotelId"
                value={filters.hotelId}
                onChange={handleFilterChange}
                placeholder="Nhập hotelId"
              />
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex align-items-end">
            <Button variant="secondary" onClick={() => setFilters({ month: "", year: "", hotelId: "" })}>
              Reset
            </Button>
          </Col>
        </Row>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Hotel ID</th>
              <th>Tháng</th>
              <th>Năm</th>
              <th>Tổng doanh thu</th>
              <th>Tổng booking</th>
            </tr>
          </thead>
          <tbody>
            {revenues.length > 0 ? (
              revenues.map((rev, idx) => (
                <tr key={idx}>
                  <td>{rev.hotelId}</td>
                  <td>{rev.month}</td>
                  <td>{rev.year}</td>
                  <td>{rev.totalRevenue?.toLocaleString("vi-VN")} ₫</td>
                  <td>{rev.totalBookings}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          {[...Array(totalPages).keys()].map((num) => (
            <Pagination.Item key={num + 1} active={num + 1 === page} onClick={() => setPage(num + 1)}>
              {num + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
  );
}
