import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import axios from "axios";
// THAY ĐỔI: Bỏ icon FiKey vì không còn dùng
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import './UserManager.css';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  // ĐÃ BỎ: State cho modal mật khẩu
  // const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
  });
  // ĐÃ BỎ: State cho dữ liệu mật khẩu
  // const [passwordData, setPasswordData] = useState({ ... });
  const [createData, setCreateData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5360/user/all-user");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
    } catch (err) {
      console.error("Lỗi khi cập nhật user:", err.response?.data || err);
      alert(err.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  // ĐÃ BỎ: Hàm xử lý đổi mật khẩu (handleChangePassword và handleSavePassword)

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await axios.delete(`http://localhost:5360/user/${userId}`);
      fetchUsers();
      alert("Xóa người dùng thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa user:", err.response?.data || err);
      alert(err.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const handleCreateUser = async () => {
    try {
      await axios.post(`http://localhost:5360/auth/register`, createData);
      fetchUsers();
      setShowCreateModal(false);
      setCreateData({ fullname: "", email: "", phone: "", address: "", password: "" });
      alert("Tạo người dùng thành công!");
    } catch (err) {
      console.error("Lỗi khi tạo user:", err.response?.data || err);
      alert(err.response?.data?.message || "Có lỗi xảy ra!");
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
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>UserId</th>
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
                  <td>{user.userId}</td>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createAt).toLocaleString()}</td>
                  <td className="action-buttons">
                    <Button variant="outline-warning" size="sm" onClick={() => handleEditUser(user)}>
                      <FiEdit />
                    </Button>
                    {/* ĐÃ BỎ: Nút Đổi mật khẩu */}
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(user.userId)}>
                      <FiTrash2 />
                    </Button>
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

      {/* ĐÃ BỎ: Modal đổi mật khẩu */}

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
    </div>
  );
}