import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

function RoomManager() {
  const [rooms, setRooms] = useState([
    {
      roomId: "R001",
      hotelId: "H001",
      roomNumber: "101",
      type: "Deluxe",
      price: 800000,
      status: "Trống",
      imageUrl: "https://source.unsplash.com/120x80/?hotel-room",
    },
    {
      roomId: "R002",
      hotelId: "H001",
      roomNumber: "102",
      type: "Suite",
      price: 1200000,
      status: "Đang đặt",
      imageUrl: "https://source.unsplash.com/120x80/?bedroom",
    },
    {
      roomId: "R003",
      hotelId: "H002",
      roomNumber: "201",
      type: "Standard",
      price: 500000,
      status: "Trống",
      imageUrl: "https://source.unsplash.com/120x80/?apartment",
    },
  ]);

  const [selectedHotel, setSelectedHotel] = useState("H001");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    roomId: "",
    hotelId: "",
    roomNumber: "",
    type: "",
    price: "",
    status: "Trống",
    imageUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const filteredRooms = rooms.filter((room) => room.hotelId === selectedHotel);

  const handleShow = (room = null) => {
    if (room) {
      setFormData(room);
      setIsEditing(true);
    } else {
      setFormData({
        roomId: "",
        hotelId: selectedHotel,
        roomNumber: "",
        type: "",
        price: "",
        status: "Trống",
        imageUrl: "",
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (isEditing) {
      setRooms(rooms.map((r) => (r.roomId === formData.roomId ? formData : r)));
    } else {
      setRooms([...rooms, formData]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setRooms(rooms.filter((r) => r.roomId !== id));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Quản lý phòng</h2>

      <Form.Select
        className="mb-3"
        value={selectedHotel}
        onChange={(e) => setSelectedHotel(e.target.value)}
      >
        <option value="H001">Khách sạn H001 - Hà Nội Center</option>
        <option value="H002">Khách sạn H002 - Đà Nẵng Beach</option>
      </Form.Select>

      <Button variant="primary" onClick={() => handleShow()}>
        + Thêm phòng
      </Button>

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Mã phòng</th>
            <th>Số phòng</th>
            <th>Loại</th>
            <th>Giá (VNĐ/đêm)</th>
            <th>Trạng thái</th>
            <th>Ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <tr key={room.roomId}>
                <td>{room.roomId}</td>
                <td>{room.roomNumber}</td>
                <td>{room.type}</td>
                <td>{room.price.toLocaleString("vi-VN")} ₫</td>
                <td>{room.status}</td>
                <td>
                  <img
                    src={room.imageUrl}
                    alt={room.roomNumber}
                    width="120"
                    height="80"
                  />
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShow(room)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(room.roomId)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Chưa có phòng nào trong khách sạn này
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
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Mã phòng</Form.Label>
              <Form.Control
                type="text"
                value={formData.roomId}
                onChange={(e) =>
                  setFormData({ ...formData, roomId: e.target.value })
                }
                disabled={isEditing}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Số phòng</Form.Label>
              <Form.Control
                type="text"
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Loại phòng</Form.Label>
              <Form.Control
                type="text"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Giá (VNĐ/đêm)</Form.Label>
              <Form.Control
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseInt(e.target.value) })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Trống">Trống</option>
                <option value="Đang đặt">Đang đặt</option>
                <option value="Bảo trì">Bảo trì</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Ảnh (URL)</Form.Label>
              <Form.Control
                type="text"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
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

export default RoomManager;
