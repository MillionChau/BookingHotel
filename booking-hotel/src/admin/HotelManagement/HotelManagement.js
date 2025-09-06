import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

export default function HotelManager() {
  const [hotels, setHotels] = useState([
    {
      hotelId: "H001",
      name: "Khách sạn Hà Nội Center",
      address: "123 Trần Hưng Đạo, Hà Nội",
      description: "Khách sạn 4 sao nằm tại trung tâm Hà Nội",
      manager: "Nguyễn Văn A",
      rating: 4,
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      hotelId: "H002",
      name: "Khách sạn Đà Nẵng Beach",
      address: "45 Nguyễn Văn Thoại, Đà Nẵng",
      description: "Gần biển Mỹ Khê, view đẹp",
      manager: "Trần Thị B",
      rating: 0, 
      imageUrl: "https://via.placeholder.com/150",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    hotelId: "",
    name: "",
    address: "",
    description: "",
    manager: "",
    rating: 0, 
    imageUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Mở modal để thêm/sửa
  const handleShow = (hotel = null) => {
    if (hotel) {
      setFormData(hotel);
      setIsEditing(true);
    } else {
      setFormData({
        hotelId: "",
        name: "",
        address: "",
        description: "",
        manager: "",
        rating: 0,
        imageUrl: "",
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  // Lưu khách sạn
  const handleSave = () => {
    if (isEditing) {
      setHotels(
        hotels.map((h) =>
          h.hotelId === formData.hotelId ? formData : h
        )
      );
    } else {
      setHotels([...hotels, { ...formData, rating: 0 }]);
    }
    setShowModal(false);
  };

  // Xóa khách sạn
  const handleDelete = (id) => {
    setHotels(hotels.filter((h) => h.hotelId !== id));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Quản lý khách sạn</h2>
      <Button variant="primary" onClick={() => handleShow()}>
        + Thêm khách sạn
      </Button>

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Mã KS</th>
            <th>Tên khách sạn</th>
            <th>Địa chỉ</th>
            <th>Mô tả</th>
            <th>Quản lý</th>
            <th>Đánh giá</th>
            <th>Ảnh</th>
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
              <td>
                {hotel.rating > 0
                  ? `${hotel.rating} ⭐`
                  : "Chưa có đánh giá"}
              </td>
              <td>
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  width="80"
                  height="60"
                />
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShow(hotel)}
                >
                  Sửa
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(hotel.hotelId)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal thêm/sửa */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Sửa khách sạn" : "Thêm khách sạn"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Mã khách sạn</Form.Label>
              <Form.Control
                type="text"
                value={formData.hotelId}
                onChange={(e) =>
                  setFormData({ ...formData, hotelId: e.target.value })
                }
                disabled={isEditing}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Tên khách sạn</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
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
