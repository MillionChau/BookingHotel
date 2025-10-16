import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Form,
  Button,
  Row,
  Col,
  Card,
  Spinner,
  Pagination,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import "./RevenueManager.module.scss";

// Helper functions defined outside component
const getMonthName = (month) => {
  if (month === "all" || month == null) return "Tất cả các tháng";
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  const n = Number(month);
  const idx = Number.isInteger(n) ? n - 1 : -1;
  return idx >= 0 && idx < 12 ? months[idx] : `Tháng ${month}`;
};

// Normalize function defined outside component
const normalizeRevenueItems = (items, currentFilters) => {
  const arr = Array.isArray(items) ? items : items ? [items] : [];
  return arr.map((it) => {
    const copy = { ...it };
    if ((copy.month === undefined || copy.month === null || copy.month === "") && currentFilters.month !== "all") {
      copy.month = Number(currentFilters.month);
    }
    if ((copy.year === undefined || copy.year === null || copy.year === "") && currentFilters.year) {
      copy.year = Number(currentFilters.year);
    }
    return copy;
  });
};

export default function RevenueManager() {
  const [revenues, setRevenues] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    month: "all",
    year: String(new Date().getFullYear()),
    hotelId: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");

  // fetch revenues (hotel-specific or all)
  const fetchRevenues = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const baseParams = {
        year: Number(filters.year),
        page,
        limit: 10,
      };

      // 1) Nếu chọn 1 khách sạn cụ thể
      if (filters.hotelId) {
        // && month is specific -> call hotel endpoint (existing)
        if (filters.month !== "all") {
          const params = { ...baseParams, month: Number(filters.month) };
          const response = await axios.get(
            `http://localhost:5360/revenue/hotel/${filters.hotelId}`,
            { params }
          );
          const data = response.data.data;
          const normalized = normalizeRevenueItems(data, filters);
          setRevenues(normalized);
          setTotalPages(1);
        }
        // nếu hotelId + month = "all" -> gọi /revenue/monthly?hotelId=xxx&month=m cho từng tháng
        else {
          const monthRequests = Array.from({ length: 12 }, (_, i) => {
            const m = i + 1;
            return axios.get("http://localhost:5360/revenue/monthly", {
              params: { ...baseParams, month: m, hotelId: filters.hotelId },
            }).then(res => ({ ok: true, res })).catch(err => ({ ok: false, err, month: m }));
          });

          const results = await Promise.all(monthRequests);
          const allItems = [];

          results.forEach((r, idx) => {
            const month = idx + 1;
            if (r.ok) {
              const data = r.res.data.data;
              const docs = data?.docs || data || [];
              let normalized = normalizeRevenueItems(docs, { ...filters, month });
              // ensure each item has month/year filled (some APIs return object without month)
              normalized = normalized.map((it) => {
                const copy = { ...it };
                if (copy.month === undefined || copy.month === null || copy.month === "") {
                  copy.month = month;
                }
                if (copy.year === undefined || copy.year === null || copy.year === "") {
                  copy.year = Number(filters.year);
                }
                return copy;
              });
              allItems.push(...normalized);
            } else {
              // no data for that month -> skip (optional: log)
              console.warn(`No data for month ${r.month}/${filters.year} (hotel ${filters.hotelId})`, r.err);
            }
          });

          // sort by year then month asc for predictable ordering
          allItems.sort((a, b) => {
            const ay = Number(a.year || filters.year);
            const by = Number(b.year || filters.year);
            const am = Number(a.month || 0);
            const bm = Number(b.month || 0);
            return ay !== by ? ay - by : am - bm;
          });

          setRevenues(allItems);
          setTotalPages(1);
        }
      }

      // 2) Nếu không chọn khách sạn (tất cả khách sạn)
      else {
        // a) tất cả tháng -> gọi từng tháng (1..12) cho toàn bộ hotels
        if (filters.month === "all") {
          // parallel requests for months 1..12
          const requests = Array.from({ length: 12 }, (_, i) =>
            axios
              .get("http://localhost:5360/revenue/monthly", {
                params: { ...baseParams, month: i + 1 },
              })
              .then(res => ({ ok: true, res }))
              .catch(err => ({ ok: false, err, month: i + 1 }))
          );

          const results = await Promise.all(requests);
          const allMonths = [];

          results.forEach((r, idx) => {
            const month = idx + 1;
            if (r.ok) {
              const data = r.res.data.data;
              const docs = data?.docs || data || [];
              let normalized = normalizeRevenueItems(docs, { ...filters, month });
              // ensure month/year present
              normalized = normalized.map((it) => {
                const copy = { ...it };
                if (copy.month === undefined || copy.month === null || copy.month === "") {
                  copy.month = month;
                }
                if (copy.year === undefined || copy.year === null || copy.year === "") {
                  copy.year = Number(filters.year);
                }
                return copy;
              });
              allMonths.push(...normalized);
            } else {
              console.warn(`No data for month ${r.month}/${filters.year}`, r.err);
            }
          });

          allMonths.sort((a, b) => {
            const ay = Number(a.year || filters.year);
            const by = Number(b.year || filters.year);
            const am = Number(a.month || 0);
            const bm = Number(b.month || 0);
            return ay !== by ? ay - by : am - bm;
          });

          setRevenues(allMonths);
          setTotalPages(1);
        }
        // b) không chọn hotel + chỉ 1 tháng -> gọi monthly bình thường (có pagination)
        else {
          const response = await axios.get("http://localhost:5360/revenue/monthly", {
            params: { ...baseParams, month: Number(filters.month) },
          });
          const data = response.data.data;
          const docs = data?.docs || data || [];
          const normalized = normalizeRevenueItems(docs, filters);
          setRevenues(normalized);
          setTotalPages(data?.totalPages || 1);
        }
      }
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
  }, [filters, page]);

  // fetch initial stats & hotels
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const statsRes = await axios.get("http://localhost:5360/revenue/stats");
        setStats(statsRes.data.data || {});

        const hotelsRes = await axios.get("http://localhost:5360/hotel/all");
        setHotels(hotelsRes.data.HotelList || []);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu ban đầu:", err);
        setError("Không thể tải dữ liệu khởi tạo!");
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchRevenues();
  }, [fetchRevenues]);

  // handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleHotelChange = (e) => {
    const hotelId = e.target.value;
    setSelectedHotel(hotelId);
    setFilters((prev) => ({ ...prev, hotelId }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      month: "all",
      year: String(new Date().getFullYear()),
      hotelId: "",
    });
    setSelectedHotel("");
    setPage(1);
  };

  const getHotelName = (hotelId) => {
    const hotel = hotels.find((h) => h.hotelId === hotelId);
    return hotel ? `${hotel.name} (${hotelId})` : hotelId;
  };

  // render helper to decide the displayed month/year text for a revenue row
  const renderMonthYear = (rev) => {
    // prefer rev values
    const itemMonth = rev?.month;
    const itemYear = rev?.year;

    // if item has valid year (from API or normalized), use it
    if (itemYear) {
      if (itemMonth !== undefined && itemMonth !== null && String(itemMonth) !== "") {
        // itemMonth might be number or string
        if (String(itemMonth) === "all") {
          return `Tất cả các tháng/${itemYear}`;
        }
        return `${getMonthName(itemMonth)}/${itemYear}`;
      } else {
        // no month for this item but we have year -> if filters.month is specific, show that
        if (filters.month && filters.month !== "all") {
          return `${getMonthName(filters.month)}/${filters.year}`;
        }
        return `Tất cả các tháng/${itemYear}`;
      }
    }

    // fallback: no year on item
    if (filters.month && filters.month !== "all" && filters.year) {
      return `${getMonthName(filters.month)}/${filters.year}`;
    }

    return "Không xác định";
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
              <h3>
                {stats.totalRevenue
                  ? stats.totalRevenue.toLocaleString("vi-VN") + " ₫"
                  : "0 ₫"}
              </h3>
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
                  {hotels.map((hotel) => (
                    <option key={hotel.hotelId} value={hotel.hotelId}>
                      {hotel.name} ({hotel.hotelId})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Tháng</Form.Label>
                <Form.Select
                  name="month"
                  value={filters.month}
                  onChange={handleFilterChange}
                >
                  <option value="all">Tất cả các tháng</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      {getMonthName(i + 1)}
                    </option>
                  ))}
                </Form.Select>
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
                  min="2020"
                  max="2030"
                />
              </Form.Group>
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

      {filters.hotelId && (
        <Alert variant="info" className="mb-3">
          Đang xem doanh thu cho:{" "}
          <strong>{getHotelName(filters.hotelId)}</strong> -{" "}
          <strong>
            {filters.month !== "all"
              ? `${getMonthName(filters.month)}/${filters.year}`
              : `Tất cả các tháng/${filters.year}`}
          </strong>
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
                        <td>{renderMonthYear(rev)}</td>
                        <td className="fw-bold text-success">
                          {rev.totalRevenue
                            ? rev.totalRevenue.toLocaleString("vi-VN") + " ₫"
                            : "0 ₫"}
                        </td>
                        <td>
                          <span className="badge bg-primary">
                            {rev.totalBookings || 0}
                          </span>
                        </td>
                        <td className="fw-bold">
                          {rev.totalRevenue && rev.totalBookings > 0
                            ? Math.round(
                              rev.totalRevenue / rev.totalBookings
                            ).toLocaleString("vi-VN") + " ₫"
                            : "0 ₫"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">
                        <i className="fas fa-chart-bar fa-2x mb-2"></i>
                        <p>Không có dữ liệu doanh thu cho bộ lọc hiện tại</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

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