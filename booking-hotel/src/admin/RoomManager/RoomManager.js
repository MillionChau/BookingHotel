import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import axios from "axios";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

export default function RoomManager() {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
  const [roomToDelete, setRoomToDelete] = useState(null); // Sửa từ userToDelete thành roomToDelete
  const [error, setError] = useState("");

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  // Hiển thị toast
  const showToastMessage = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // Fetch hotel list
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

  // Fetch room list by hotel
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
      setCurrentRoomId(room.roomId);
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
        price: Number(formData.price),
      };

      if (isEditing) {
        await axios.put(
          `http://localhost:5360/room/update/${currentRoomId}`,
          payload
        );
        showToastMessage("Cập nhật phòng thành công!", "success");
      } else {
        await axios.post("http://localhost:5360/room/create", payload);
        showToastMessage("Thêm phòng mới thành công!", "success");
      }

      fetchRooms(selectedHotel);
      setShowModal(false);
      setError("");
    } catch (err) {
      console.error("Lỗi khi lưu phòng:", err.response?.data || err);
      showToastMessage(
        err.response?.data?.message || "Lỗi khi lưu thông tin phòng!",
        "danger"
      );
    }
  };

  // Sửa hàm handleConfirmDelete để xóa phòng
  const handleConfirmDelete = async () => {
    if (!roomToDelete) return;
    
    try {
      await axios.delete(`http://localhost:5360/room/delete/${roomToDelete}`);
      fetchRooms(selectedHotel);
      setShowDeleteModal(false);
      setRoomToDelete(null);
      showToastMessage("Xóa phòng thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa phòng:", err.response?.data || err);
      showToastMessage(err.response?.data?.message || "Có lỗi xảy ra khi xóa phòng!", "danger");
    }
  };

  // Sửa hàm handleDeleteClick để xóa phòng
  const handleDeleteClick = (roomId) => {
    setRoomToDelete(roomId);
    setShowDeleteModal(true);
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      available: "Trống",
      occupied: "Đang sử dụng",
      maintenance: "Bảo trì",
      Trống: "Trống",
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

      <Button
        variant="primary"
        onClick={() => handleShow()}
        disabled={!selectedHotel}
      >
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
                    <img
                      src={room.imageUrl}
                      alt={room.name}
                      width="120"
                      height="80"
                      style={{ objectFit: "cover" }}
                    />
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
                      onClick={() => handleDeleteClick(room.roomId)}
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
                {selectedHotel
                  ? "Chưa có phòng nào"
                  : "Vui lòng chọn khách sạn"}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal thêm/sửa */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Sửa phòng" : "Thêm phòng"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            {!isEditing && (
              <Form.Group className="mb-2">
                <Form.Label>Mã phòng (Tự tạo nếu để trống)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="VD: A101"
                  value={formData.roomId}
                  onChange={(e) =>
                    setFormData({ ...formData, roomId: e.target.value })
                  }
                />
              </Form.Group>
            )}
            <Form.Group className="mb-2">
              <Form.Label>Tên phòng *</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
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
              <Form.Label>Giá *</Form.Label>
              <Form.Control
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
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
                <option value="available">Trống</option>
                <option value="occupied">Đang sử dụng</option>
                <option value="maintenance">Bảo trì</option>
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

      {/* Modal xóa phòng - Sửa nội dung cho phù hợp */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc muốn xóa phòng này?</p>
          <p className="text-danger mt-2">Hành động này không thể hoàn tác!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
          <Button variant="danger" onClick={handleConfirmDelete}>Xóa</Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={4000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header className={`bg-${toastVariant} text-white`}>
            <strong className="me-auto">
              {toastVariant === "success" ? "✅ Thành công" : "❌ Lỗi"}
            </strong>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setShowToast(false)}
              aria-label="Close"
            ></button>
          </Toast.Header>
          <Toast.Body className="bg-light">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}