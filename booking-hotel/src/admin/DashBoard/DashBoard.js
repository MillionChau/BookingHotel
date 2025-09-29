import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import { FaMoneyBill, FaShoppingBag, FaChartLine, FaUsers } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

// format VNĐ
const formatCurrency = (value) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const Dashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // tháng hiện tại
  const [revenue, setRevenue] = useState([]);
  const [occupancy, setOccupancy] = useState(null);
  const [userCount, setUserCount] = useState(0);

  // fetch hotel list
  useEffect(() => {
    axios.get("http://localhost:5360/hotel/all")
      .then((res) => {
        const list = res.data.HotelList || [];
        setHotels(list);
        if (list.length > 0) {
          setSelectedHotel(list[0].hotelId);
        }
      })
      .catch((err) => console.error("Error fetching hotels:", err));
  }, []);

  // fetch occupancy + revenue + user count when hotel/year/month changes
  useEffect(() => {
    if (!selectedHotel) return;

    // Occupancy
    axios.get(`http://localhost:5360/room/hotel/${selectedHotel}/occupancy`)
      .then((res) => setOccupancy(res.data.occupancy))
      .catch((err) => console.error("Error fetching occupancy:", err));


    axios.get(
      `http://localhost:5360/revenue/hotel/${selectedHotel}?year=${selectedYear}`
    )
      .then((res) => {
        const allRevs = res.data.data?.revenues?.map((r) => ({
          month: Number(r.month), // số tháng
          revenue: r.totalPrice,
        })) || [];

        // lọc tháng trước, tháng hiện tại, tháng sau
        const prev = selectedMonth - 1;
        const next = selectedMonth + 1;
        const filtered = allRevs.filter(
          (r) =>
            r.month === prev || r.month === selectedMonth || r.month === next
        );

        // sort để biểu đồ đúng thứ tự
        filtered.sort((a, b) => a.month - b.month);

        // chuyển month về "Tháng X" cho hiển thị
        const formatted = filtered.map((r) => ({
          month: `Tháng ${r.month}`,
          revenue: r.revenue,
        }));

        setRevenue(formatted);
      })
      .catch((err) => console.error("Error fetching revenue:", err));

    // User count
    axios.get("http://localhost:5360/user/all-user")
      .then((res) => setUserCount(res.data.users?.length || 0))
      .catch((err) => console.error("Error fetching users:", err));
  }, [selectedHotel, selectedYear, selectedMonth]);

  return (
    <div className="d-flex">
      <div className="flex-grow-1 p-4">
        <h4 className="mb-4">Tổng quan</h4>

        {/* Filters */}
        <Row className="mb-3">
          <Col md={3}>
            <Form.Select
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}>
              {hotels.map((hotel) => (
                <option key={hotel.hotelId} value={hotel.hotelId}>
                  {hotel.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={2}>
            <Form.Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="2025">Năm 2025</option>
              <option value="2026">Năm 2026</option>
            </Form.Select>
          </Col>

          <Col md={2}>
            <Form.Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6>Doanh thu (tháng {selectedMonth})</h6>
                  <h5>
                    {revenue.length > 0
                      ? formatCurrency(revenue[0].revenue)
                      : "0₫"}
                  </h5>
                </div>
                <FaMoneyBill size={28} />
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6>Phòng đã đặt</h6>
                  <h5>{occupancy?.occupiedRooms || 0}</h5>
                </div>
                <FaShoppingBag size={28} />
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6>Tỉ lệ lấp đầy</h6>
                  <h5>{occupancy?.occupancyRate || 0}%</h5>
                </div>
                <FaChartLine size={28} />
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6>Người dùng (chung)</h6>
                  <h5>{userCount}</h5>
                </div>
                <FaUsers size={28} />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Chart */}
        <Card className="p-3 shadow-sm">
          <h6>Doanh thu theo tháng</h6>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}tr`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="revenue" stroke="#007bff" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
