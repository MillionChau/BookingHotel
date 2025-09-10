import React, { useState } from "react";
import { Table, Button, Modal, Form, InputGroup, FormControl, Badge } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaSearch, FaUserPlus } from "react-icons/fa";

// Dữ liệu người dùng mẫu
const initialUsers = [
  {
    userId: "U001",
    fullName: "Nguyễn Văn An",
    email: "an.nguyen@email.com",
    phone: "0901234567",
    role: "User",
    status: "Đang ở",
    joinDate: "2024-05-10",
  },
  {
    userId: "U002",
    fullName: "Trần Thị Bích",
    email: "bich.tran@email.com",
    phone: "0987654321",
    role: "User",
    status: "Đang ở",
    joinDate: "2024-06-15",
  },
  {
    userId: "U003",
    fullName: "Lê Minh Cường",
    email: "cuong.le@email.com",
    phone: "0912345678",
    role: "Admin",
    status: "Đang ở",
    joinDate: "2024-02-20",
  },
  {
    userId: "U004",
    fullName: "Phạm Thu Duyên",
    email: "duyen.pham@email.com",
    phone: "0934567890",
    role: "User",
    status: "Đã trả phòng",
    joinDate: "2024-07-01",
  },
];

// Component quản lý người dùng
const UserManager = () => {
  const [users, setUsers] = useState(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Hàm xử lý hiển thị modal (thêm mới hoặc chỉnh sửa)
  const handleShow = (user = null) => {
    if (user) {
      setFormData(user);
      setIsEditing(true);
    } else {
      // Reset form cho người dùng mới
      setFormData({
        userId: `U${String(users.length + 1).padStart(3, '0')}`, // Tự động tạo mã
        fullName: "",
        email: "",
        phone: "",
        role: "User",
        status: "Đang ở",
        joinDate: new Date().toISOString().slice(0, 10), // Ngày hiện tại
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  // Hàm đóng modal
  const handleClose = () => setShowModal(false);

  // Hàm lưu thông tin (thêm mới hoặc cập nhật)
  const handleSave = () => {
    if (isEditing) {
      setUsers(users.map((u) => (u.userId === formData.userId ? formData : u)));
    } else {
      setUsers([...users, formData]);
    }
    handleClose();
  };

  // Hàm xóa người dùng
  const handleDelete = (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      setUsers(users.filter((u) => u.userId !== userId));
    }
  };

  // Hiển thị badge cho trạng thái
  const renderStatusBadge = (status) => {
    const variant = status === "Đang ở" ? "success" : "danger";
    return <Badge bg={variant}>{status}</Badge>;
  };
    
  // Lọc người dùng dựa trên từ khóa tìm kiếm
  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );


  return (
    <div className="container mt-4">
      <h2 className="mb-4">Quản lý người dùng</h2>

      {/* Thanh công cụ: Thêm mới và Tìm kiếm */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="primary" onClick={() => handleShow()}>
          <FaUserPlus className="me-2" /> Thêm người dùng
        </Button>
        <InputGroup style={{ maxWidth: "300px" }}>
          <FormControl
            placeholder="Tìm kiếm theo tên, email, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InputGroup.Text><FaSearch /></InputGroup.Text>
        </InputGroup>
      </div>

      {/* Bảng hiển thị danh sách người dùng */}
      <Table striped bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>Mã người dùng</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Ngày tham gia</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td>{renderStatusBadge(user.status)}</td>
              <td>{user.joinDate}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShow(user)}
                >
                  <FaEdit /> Sửa
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(user.userId)}
                >
                  <FaTrashAlt /> Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal để thêm/sửa người dùng */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Mã người dùng</Form.Label>
              <Form.Control type="text" value={formData.userId || ""} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                value={formData.fullName || ""}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vai trò</Form.Label>
              <Form.Select
                value={formData.role || "User"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </Form.Select>
            </Form.Group>
             <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={formData.status || "Đang ở"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="Đang ở">Đang ở</option>
                <option value="Đã trả phòng">Đã trả phòng</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManager;