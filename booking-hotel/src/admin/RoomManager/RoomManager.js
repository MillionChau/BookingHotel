import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

export default function RoomManager() {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    roomId: "",
    name: "",
    type: "",
    price: "",
    imageUrl: "",
    status: "available",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [error, setError] = useState("");

  // Lấy danh sách khách sạn
  useEffect(() => {
    axios
      .get("http://localhost:5360/hotel/all")
      .then((res) => {
        const hotelList = res.data.HotelList || res.data.hotels || [];
        setHotels(hotelList);
        if (hotelList.length > 0) setSelectedHotel(hotelList[0].hotelId);
      })
      .catch(console.error);
  }, []);

  // Lấy danh sách phòng khi chọn khách sạn
  useEffect(() => {
    if (selectedHotel) fetchRooms(selectedHotel);
  }, [selectedHotel]);

  const fetchRooms = async (hotelId) => {
    try {
      const res = await axios.get(`http://localhost:5360/room/hotel/${hotelId}`);
      setRooms(res.data.rooms || []);
      setError("");
    } catch (err) {
      console.error("Lỗi khi lấy danh sách phòng:", err.response?.data || err);
      setRooms([]);
      if (err.response?.status === 404) {
        setError("Không có phòng nào cho khách sạn này!");
      } else {
        setError("Lỗi khi tải dữ liệu phòng!");
      }
    }
  };

  const handleShow = (room = null) => {
    setError("");
    if (room) {
      setFormData({
        roomId: room.roomId,
        name: room.name,
        type: room.type,
        price: room.price,
        imageUrl: room.imageUrl || "",
        status: room.status,
      });
      setCurrentRoomId(room.roomId); // Sửa: dùng roomId thay vì _id
      setIsEditing(true);
    } else {
      setFormData({
        roomId: "",
        name: "",
        type: "",
        price: "",
        imageUrl: "",
        status: "available",
      });
      setCurrentRoomId(null);
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!selectedHotel) {
        setError("Vui lòng chọn khách sạn trước!");
        return;
      }

      if (!formData.name || !formData.price) {
        setError("Vui lòng điền đầy đủ thông tin bắt buộc (Tên phòng và Giá)!");
        return;
      }

      const payload = { 
        ...formData, 
        hotelId: selectedHotel,
        price: Number(formData.price)
      };

      if (isEditing) {
        await axios.put(`http://localhost:5360/room/update/${currentRoomId}`, payload);
      } else {
        await axios.post("http://localhost:5360/room/create", payload);
      }
      
      fetchRooms(selectedHotel);
      setShowModal(false);
      setError("");
    } catch (err) {
      console.error("Lỗi khi lưu phòng:", err.response?.data || err);
      setError(err.response?.data?.message || "Lỗi khi lưu thông tin phòng!");
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) return;
    
    try {
      await axios.delete(`http://localhost:5360/room/delete/${roomId}`);
      fetchRooms(selectedHotel);
    } catch (err) {
      console.error("Lỗi khi xóa phòng:", err.response?.data || err);
      setError(err.response?.data?.message || "Lỗi khi xóa phòng!");
    }
  };

  // Hàm chuyển đổi trạng thái để hiển thị
  const getStatusDisplay = (status) => {
    const statusMap = {
      'available': 'Trống',
      'occupied': 'Đang sử dụng',
      'maintenance': 'Bảo trì',
      'Đang đặt': 'Đang đặt',
      'Trống': 'Trống',
      'Bảo trì': 'Bảo trì'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Quản lý phòng</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Select
        className="mb-3"
        value={selectedHotel}
        onChange={(e) => setSelectedHotel(e.target.value)}
      >
        <option value="">Chọn khách sạn</option>
        {hotels.map((h) => (
          <option key={h.hotelId} value={h.hotelId}>
            {h.name} ({h.hotelId})
          </option>
        ))}
      </Form.Select>

      <Button variant="primary" onClick={() => handleShow()} disabled={!selectedHotel}>
        <FiPlus className="me-1" /> Thêm phòng
      </Button>

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Mã phòng</th>
            <th>Tên phòng</th>
            <th>Loại</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <tr key={room.roomId}>
                <td>{room.roomId}</td>
                <td>{room.name}</td>
                <td>{room.type}</td>
                <td>{room.price?.toLocaleString("vi-VN")} ₫</td>
                <td>{getStatusDisplay(room.status)}</td>
                <td>
                  {room.imageUrl ? (
                    <img src={room.imageUrl} alt={room.name} width="120" height="80" 
                         style={{objectFit: 'cover'}} />
                  ) : (
                    <span>No image</span>
                  )}
                </td>
                <td>
                  <div className="d-flex justify-content-center align-items-center gap-2 h-100">
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleShow(room)}
                    >
                      <FiEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(room.roomId)}
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                {selectedHotel ? "Chưa có phòng nào" : "Vui lòng chọn khách sạn"}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Sửa phòng" : "Thêm phòng"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            {!isEditing && (
              <Form.Group className="mb-2">
                <Form.Label>Mã phòng (Để trống để tự động tạo)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Để trống để tự động tạo mã"
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                />
              </Form.Group>
            )}
            <Form.Group className="mb-2">
              <Form.Label>Tên phòng *</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Loại phòng</Form.Label>
              <Form.Control
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Giá *</Form.Label>
              <Form.Control
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="available">Trống</option>
                <option value="occupied">Đang sử dụng</option>
                <option value="maintenance">Bảo trì</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Ảnh (URL)</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}