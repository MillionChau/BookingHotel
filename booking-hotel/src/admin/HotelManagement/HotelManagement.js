import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";


export default function HotelManagement() {
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
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

  // Lấy danh sách khách sạn khi load trang
  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await axios.get("http://localhost:5360/hotel/all");
      setHotels(res.data.HotelList || []);
    } catch (err) {
      console.error("Lỗi khi tải khách sạn:", err);
    }
  };

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
      if (isEditing) {
        await axios.put(
          `http://localhost:5360/hotel/update/${currentId}`,
          formData
        );
      } else {
        await axios.post("http://localhost:5360/hotel/create", formData);
      }
      fetchHotels();
      setShowModal(false);
    } catch (err) {
      console.error("Lỗi khi lưu khách sạn:", err.response?.data || err);
    }
  };

  // Xóa khách sạn
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5360/hotel/delete/${id}`);
      fetchHotels();
    } catch (err) {
      console.error("Lỗi khi xóa khách sạn:", err);
    }
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
              <img src={hotel.imageUrl} alt={hotel.name} width="80" height="60" />
            </td>
            <td>{hotel.createdAt ? new Date(hotel.createdAt).toLocaleString("vi-VN") : "N/A"}</td> {/* 👈 hiển thị */}
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
                  onClick={() => handleDelete(hotel.hotelId)}
                >
                  <FiTrash2 />
                </Button>
              </div>
            </td>

          </tr>
        ))}
      </tbody>

      </Table>

      {/* thêm / sửa */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Sửa khách sạn" : "Thêm khách sạn"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Tên khách sạn</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="hotelName"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="hotelAddress"
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
                placeholder="hotelDesc"
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
                placeholder="hotelManager"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Đánh giá</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
                placeholder="hotelReview"
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
                placeholder="imageUrl"
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