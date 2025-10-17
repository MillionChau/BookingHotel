import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import {
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
import axios from "axios";
import { API_BASE_URL  } from "../../config/api";

// Format VNĐ
const formatCurrency = (value) =>
  value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) ?? "0₫";

export default function Dashboard() {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [revenue, setRevenue] = useState([]);
  const [occupancy, setOccupancy] = useState(null);
  const [userCount, setUserCount] = useState(0);

  // Fetch hotel list
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/hotel/all`)
      .then((res) => {
        const list = res.data.HotelList || [];
        setHotels(list);
        if (list.length > 0) {
          setSelectedHotel(list[0].hotelId);
        }
      })
      .catch((err) => console.error("Error fetching hotels:", err));
  }, []);

  // Fetch occupancy + revenue + user count
  useEffect(() => {
    if (!selectedHotel) return;

    Promise.all([
      axios.get(`${API_BASE_URL}/room/hotel/${selectedHotel}/occupancy`),
      axios.get(
        `${API_BASE_URL}/revenue/hotel/${selectedHotel}?year=${selectedYear}`
      ),
      axios.get(`${API_BASE_URL}/user/all-user`),
    ])
      .then(([occRes, revRes, userRes]) => {
        setOccupancy(occRes.data.occupancy);
        setUserCount(userRes.data.users?.length || 0);

        // Xử lý dữ liệu doanh thu
        const allRevs =
          revRes.data.data?.revenues?.map((r) => ({
            month: Number(r.month),
            revenue: r.totalPrice,
          })) || [];

        let filtered = allRevs;

        // Nếu người dùng chọn 1 tháng cụ thể => lọc 3 tháng: trước, hiện tại, sau
        if (selectedMonth !== "all") {
          const monthNum = Number(selectedMonth);
          const prev = monthNum === 1 ? 12 : monthNum - 1;
          const next = monthNum === 12 ? 1 : monthNum + 1;
          filtered = allRevs.filter((r) =>
            [prev, monthNum, next].includes(r.month)
          );
        }

        // Sắp xếp theo tháng
        filtered.sort((a, b) => a.month - b.month);

        // Format cho hiển thị biểu đồ
        const formatted = filtered.map((r) => ({
          month: `T${r.month}`,
          revenue: r.revenue,
        }));

        setRevenue(formatted);
      })
      .catch((err) => console.error("Error fetching dashboard data:", err));
  }, [selectedHotel, selectedYear, selectedMonth]);

  // Lấy doanh thu tháng hiện tại (chính xác)
  const currentRevenue =
    selectedMonth === "all"
      ? revenue.reduce((sum, r) => sum + r.revenue, 0)
      : revenue.find((r) => r.month === `T${selectedMonth}`)?.revenue || 0;

  return (
    <div className="d-flex">
      <div className="flex-grow-1 p-4">
        <h4 className="mb-4">Tổng quan</h4>

        {/* --- Bộ lọc --- */}
        <Row className="mb-3">
          <Col md={3}>
            <Form.Select
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
            >
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
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2025">Năm 2025</option>
              <option value="2026">Năm 2026</option>
            </Form.Select>
          </Col>

          <Col md={2}>
            <Form.Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="all">Tất cả</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* --- Thống kê nhanh --- */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6>
                    Doanh thu{" "}
                    {selectedMonth === "all"
                      ? "(cả năm)"
                      : `(tháng ${selectedMonth})`}
                  </h6>
                  <h5>{formatCurrency(currentRevenue)}</h5>
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

        {/* --- Biểu đồ --- */}
        <Card className="p-3 shadow-sm">
          <h6>Doanh thu theo tháng</h6>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}tr`}
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
}
