import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
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
    status: "Trống",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Lấy danh sách khách sạn
  useEffect(() => {
    axios
      .get("http://localhost:5360/hotel/all")
      .then((res) => {
        const hotelList = res.data.HotelList || [];
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
    } catch (err) {
      console.error(err.response?.data || err);
      setRooms([]);
    }
  };

  const handleShow = (room = null) => {
    if (room) {
      setFormData({
        roomId: room.roomId,
        name: room.name,
        type: room.type,
        price: room.price,
        imageUrl: room.imageUrl,
        status: room.status,
      });
      setCurrentId(room._id); // dùng _id MongoDB cho API update/delete
      setIsEditing(true);
    } else {
      setFormData({
        roomId: "",
        name: "",
        type: "",
        price: "",
        imageUrl: "",
        status: "Trống",
      });
      setCurrentId(null);
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!selectedHotel) return alert("Chọn khách sạn trước!");
      const payload = { ...formData, hotelId: selectedHotel };
      if (isEditing) {
        await axios.put(`http://localhost:5360/room/${currentId}`, payload);
      } else {
        await axios.post("http://localhost:5360/room/create", payload);
      }
      fetchRooms(selectedHotel);
      setShowModal(false);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const handleDelete = async (_id) => {
    try {
      await axios.delete(`http://localhost:5360/room/${_id}`);
      fetchRooms(selectedHotel);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Quản lý phòng</h2>

      <Form.Select
        className="mb-3"
        value={selectedHotel}
        onChange={(e) => setSelectedHotel(e.target.value)}
      >
        {hotels.map((h) => (
          <option key={h.hotelId} value={h.hotelId}>
            {h.name}
          </option>
        ))}
      </Form.Select>

      <Button variant="primary" onClick={() => handleShow()}>
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
              <tr key={room._id}>
                <td>{room.roomId}</td>
                <td>{room.name}</td>
                <td>{room.type}</td>
                <td>{room.price.toLocaleString("vi-VN")} ₫</td>
                <td>{room.status}</td>
                <td>
                  <img src={room.imageUrl} alt={room.name} width="120" height="80" />
                </td>
                <td className="d-flex justify-content-center align-items-center gap-2">
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
                    onClick={() => handleDelete(room._id)}
                  >
                    <FiTrash2 />
                  </Button>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Chưa có phòng nào
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
            {!isEditing && (
              <Form.Group className="mb-2">
                <Form.Label>Mã phòng</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                />
              </Form.Group>
            )}
            <Form.Group className="mb-2">
              <Form.Label>Tên phòng</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Loại</Form.Label>
              <Form.Control
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Giá</Form.Label>
              <Form.Control
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
