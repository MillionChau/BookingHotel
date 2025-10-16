import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Form, Spinner, Toast, ToastContainer } from "react-bootstrap";
import axios from "axios";
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import './UserManager.css';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
  });
  const [createData, setCreateData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  // State cho Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const formatUserId = (userId) => {
    if (!userId) return "N/A";
    const firstTwoChars = userId.substring(0, 2);
    const lastThreeChars = userId.substring(userId.length - 3);
    return `${firstTwoChars}***${lastThreeChars}`;
  };

  const maskEmail = (email) => {
    if (!email || !email.includes("@")) return "N/A";
    const [name, domain] = email.split("@");
    const visible = name.slice(0, 2);
    return `${visible}***@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return "N/A";
    const cleaned = phone.toString().replace(/\D/g, "");
    if (cleaned.length <= 4) return "*".repeat(cleaned.length);
    const prefix = cleaned.slice(0, 2);
    const suffix = cleaned.slice(-3);
    return `${prefix}****${suffix}`;
  };

  const showToastMessage = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // Sử dụng useCallback để memoize hàm fetchUsers
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5360/user/all-user");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng:", err);
      showToastMessage("Lỗi khi tải danh sách người dùng", "danger");
    } finally {
      setLoading(false);
    }
  }, []); // Dependency array rỗng vì hàm không phụ thuộc vào props hay state nào

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // Thêm fetchUsers vào dependency array

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setFormData({
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
    setShowEditModal(true);
  };

  const handleSaveUser = async () => {
    try {
      await axios.put(
        `http://localhost:5360/user/update-user/${currentUser.userId}`,
        formData
      );
      fetchUsers();
      setShowEditModal(false);
      showToastMessage("Cập nhật thông tin người dùng thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật user:", err.response?.data || err);
      showToastMessage(err.response?.data?.message || "Có lỗi xảy ra khi cập nhật!", "danger");
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await axios.delete(`http://localhost:5360/user/delete/${userToDelete.userId}`);
      fetchUsers();
      setShowDeleteModal(false);
      setUserToDelete(null);
      showToastMessage("Xóa người dùng thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa user:", err.response?.data || err);
      showToastMessage(err.response?.data?.message || "Có lỗi xảy ra khi xóa!", "danger");
    }
  };

  const handleCreateUser = async () => {
    try {
      await axios.post(`http://localhost:5360/auth/register`, createData);
      fetchUsers();
      setShowCreateModal(false);
      setCreateData({ fullname: "", email: "", phone: "", address: "", password: "" });
      showToastMessage("Tạo người dùng thành công!");
    } catch (err) {
      console.error("Lỗi khi tạo user:", err.response?.data || err);
      showToastMessage(err.response?.data?.message || "Có lỗi xảy ra khi tạo người dùng!", "danger");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-manager-container">
      <h2 className="mb-4 title">Quản lý người dùng</h2>

      <div className="d-flex justify-content-between mb-4">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <Button variant="primary" onClick={() => setShowCreateModal(true)} className="create-btn">
          <FiPlus /> Tạo người dùng
        </Button>
      </div>

      <div className="table-wrapper">
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Địa chỉ</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center p-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.userId}>
                  <td title={user.userId}>{formatUserId(user.userId)}</td>
                  <td>{user.fullname}</td>
                  <td title={user.email}>{maskEmail(user.email)}</td>
                  <td title={user.phone}>{maskPhone(user.phone)}</td>
                  <td>{user.address}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createAt).toLocaleString()}</td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center gap-2 h-100">
                      <Button variant="outline-warning" size="sm" onClick={() => handleEditUser(user)}>
                        <FiEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(user)}>
                        <FiTrash2 />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  Không tìm thấy người dùng
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal Sửa thông tin */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sửa thông tin người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control type="text" value={formData.fullname} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Điện thoại</Form.Label>
              <Form.Control type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleSaveUser}>Lưu</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Tạo người dùng */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tạo người dùng mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3"><Form.Label>Họ và tên</Form.Label><Form.Control type="text" value={createData.fullname} onChange={(e) => setCreateData({ ...createData, fullname: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={createData.email} onChange={(e) => setCreateData({ ...createData, email: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Điện thoại</Form.Label><Form.Control type="text" value={createData.phone} onChange={(e) => setCreateData({ ...createData, phone: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Địa chỉ</Form.Label><Form.Control type="text" value={createData.address} onChange={(e) => setCreateData({ ...createData, address: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Mật khẩu</Form.Label><Form.Control type="password" value={createData.password} onChange={(e) => setCreateData({ ...createData, password: e.target.value })} /></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Hủy</Button>
          <Button variant="success" onClick={handleCreateUser}>Tạo</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Xác nhận xóa */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc muốn xóa người dùng này?</p>
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
          <Toast.Body className="bg-light">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}