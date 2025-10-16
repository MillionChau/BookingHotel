import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Form, Toast, ToastContainer } from "react-bootstrap";
import axios from "axios";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

export default function HotelManagement() {
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    manager: "",
    rating: 0,
    imageUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

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

  const fetchHotels = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5360/hotel/all");
      setHotels(res.data.HotelList || []);
    } catch (err) {
      console.error("Lỗi khi tải khách sạn:", err);
      showToastMessage("Lỗi khi tải danh sách khách sạn!", "danger");
    }
  }, []);

  // Lấy danh sách khách sạn khi load trang
  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);


  // Mở modal thêm / sửa
  const handleShow = (hotel = null) => {
    if (hotel) {
      setFormData({
        name: hotel.name,
        address: hotel.address,
        description: hotel.description,
        manager: hotel.manager,
        rating: hotel.rating,
        imageUrl: hotel.imageUrl,
      });
      setCurrentId(hotel.hotelId);
      setIsEditing(true);
    } else {
      setFormData({
        name: "",
        address: "",
        description: "",
        manager: "",
        rating: 0,
        imageUrl: "",
      });
      setCurrentId(null);
      setIsEditing(false);
    }
    setShowModal(true);
  };

  // Lưu khách sạn
  const handleSave = async () => {
    try {
      if (!formData.name || !formData.address) {
        showToastMessage("Vui lòng điền tên và địa chỉ khách sạn!", "danger");
        return;
      }

      if (isEditing) {
        await axios.put(
          `http://localhost:5360/hotel/update/${currentId}`,
          formData
        );
        showToastMessage("Cập nhật khách sạn thành công!", "success");
      } else {
        await axios.post("http://localhost:5360/hotel/create", formData);
        showToastMessage("Thêm khách sạn mới thành công!", "success");
      }
      fetchHotels();
      setShowModal(false);
    } catch (err) {
      console.error("Lỗi khi lưu khách sạn:", err.response?.data || err);
      showToastMessage(
        err.response?.data?.message || "Lỗi khi lưu thông tin khách sạn!",
        "danger"
      );
    }
  };

  // Xác nhận xóa khách sạn
  const handleConfirmDelete = async () => {
    if (!hotelToDelete) return;

    try {
      await axios.delete(`http://localhost:5360/hotel/delete/${hotelToDelete}`);
      fetchHotels();
      setShowDeleteModal(false);
      setHotelToDelete(null);
      showToastMessage("Xóa khách sạn thành công!", "success");
    } catch (err) {
      console.error("Lỗi khi xóa khách sạn:", err);
      showToastMessage("Có lỗi xảy ra khi xóa khách sạn!", "danger");
    }
  };

  // Mở modal xóa
  const handleDeleteClick = (id) => {
    setHotelToDelete(id);
    setShowDeleteModal(true);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Quản lý khách sạn</h2>
      <Button variant="primary" onClick={() => handleShow()}>
        <FiPlus className="me-1" /> Thêm khách sạn
      </Button>

      <Table bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Mã KS</th>
            <th>Tên khách sạn</th>
            <th>Địa chỉ</th>
            <th>Mô tả</th>
            <th>Quản lý</th>
            <th>Đánh giá</th>
            <th>Ảnh</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel.hotelId}>
              <td>{hotel.hotelId}</td>
              <td>{hotel.name}</td>
              <td>{hotel.address}</td>
              <td>{hotel.description}</td>
              <td>{hotel.manager}</td>
              <td>{hotel.rating > 0 ? `${hotel.rating} ⭐` : "Chưa có đánh giá"}</td>
              <td>
                {hotel.imageUrl ? (
                  <img
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    width="80"
                    height="60"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span>No image</span>
                )}
              </td>
              <td>{hotel.createdAt ? new Date(hotel.createdAt).toLocaleString("vi-VN") : "N/A"}</td>
              <td>
                <div className="d-flex justify-content-center align-items-center gap-2 h-100">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleShow(hotel)}
                  >
                    <FiEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(hotel.hotelId)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal thêm/sửa */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Sửa khách sạn" : "Thêm khách sạn"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Tên khách sạn *</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nhập tên khách sạn"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Địa chỉ *</Form.Label>
              <Form.Control
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Nhập địa chỉ"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Nhập mô tả"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Quản lý</Form.Label>
              <Form.Control
                type="text"
                value={formData.manager}
                onChange={(e) =>
                  setFormData({ ...formData, manager: e.target.value })
                }
                placeholder="Nhập tên quản lý"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Đánh giá</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
                placeholder="Nhập đánh giá từ 0-5"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Ảnh (URL)</Form.Label>
              <Form.Control
                type="text"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="Nhập URL ảnh"
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

      {/* Modal xác nhận xóa */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc muốn xóa khách sạn này?</p>
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