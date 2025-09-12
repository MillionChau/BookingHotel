import React, { useState } from "react";
import { Row, Col, Card, Nav, Form } from "react-bootstrap";
import {
  FaHome,
  FaDoorOpen,
  FaClipboardList,
  FaChartBar,
  FaComments,
  FaArrowLeft,
  FaMoneyBill,
  FaShoppingBag,
  FaChartLine,
  FaUsers,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// dl test ks
const hotelsData = {
  "Khách sạn A": {
    totalRooms: 120,
    bookedRooms: 85,
    monthlyRevenue: {
      2023: [
        { month: "Jan", revenue: 100000000 },
        { month: "Feb", revenue: 80000000 },
        { month: "Mar", revenue: 95000000 },
      ],
      2024: [
        { month: "Jan", revenue: 120000000 },
        { month: "Feb", revenue: 90000000 },
        { month: "Mar", revenue: 105000000 },
      ],
    },
  },
  "Khách sạn B": {
    totalRooms: 100,
    bookedRooms: 60,
    monthlyRevenue: {
      2023: [
        { month: "Jan", revenue: 70000000 },
        { month: "Feb", revenue: 75000000 },
        { month: "Mar", revenue: 80000000 },
      ],
      2024: [
        { month: "Jan", revenue: 95000000 },
        { month: "Feb", revenue: 85000000 },
        { month: "Mar", revenue: 100000000 },
      ],
    },
  },
};

// dữ liệu user
const totalUsers = 2430;

// format tiền VNĐ
const formatCurrency = (value) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const Dashboard = () => {
  const [selectedHotel, setSelectedHotel] = useState("Khách sạn A");
  const [selectedYear, setSelectedYear] = useState("2024");

  const hotel = hotelsData[selectedHotel];
  const occupancyRate = ((hotel.bookedRooms / hotel.totalRooms) * 100).toFixed(
    0
  );

  return (
    <div className="d-flex">
      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <h4 className="mb-4">Tổng quan</h4>

        {/* Bộ lọc khách sạn + năm */}
        <Row className="mb-3">
          <Col md={3}>
            <Form.Select
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}>
              {Object.keys(hotelsData).map((hotelName) => (
                <option key={hotelName} value={hotelName}>
                  {hotelName}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="2023">Năm 2023</option>
              <option value="2024">Năm 2024</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6>Doanh thu</h6>
                  <h5>
                    {formatCurrency(
                      hotel.monthlyRevenue[selectedYear][0].revenue
                    )}
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
                  <h5>{hotel.bookedRooms}</h5>
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
                  <h5>{occupancyRate}%</h5>
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
                  <h5>{totalUsers}</h5>
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
              <LineChart data={hotel.monthlyRevenue[selectedYear]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}tr`}
                />
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
