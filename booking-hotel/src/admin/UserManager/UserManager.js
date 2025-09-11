import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
  });
  const [passwordData, setPasswordData] = useState({
    password: "",
    newPassword: "",
    validPassword: "",
  });
  const [createData, setCreateData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5360/user/all-user");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Mở modal sửa thông tin user
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

  // Lưu thông tin user
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

  // Mở modal đổi mật khẩu
  const handleChangePassword = (user) => {
    setCurrentUser(user);
    setPasswordData({ password: "", newPassword: "", validPassword: "" });
    setShowPasswordModal(true);
  };

  // Lưu mật khẩu mới
  const handleSavePassword = async () => {
    try {
      await axios.patch(
        `http://localhost:5360/user/change-password/${currentUser.userId}`,
        passwordData
      );
      setShowPasswordModal(false);
      alert("Cập nhật mật khẩu thành công!");
    } catch (err) {
      console.error("Lỗi khi đổi mật khẩu:", err.response?.data || err);
      alert(err.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  // Xóa user
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

  // Tạo user mới
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

  // Lọc danh sách theo searchTerm (tên hoặc email)
  const filteredUsers = users.filter(
    (u) =>
      u.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Quản lý người dùng</h2>

      <div className="d-flex mb-3">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="me-2"
        />
        <Button variant="success" onClick={() => setShowCreateModal(true)}>
          + Tạo người dùng
        </Button>
      </div>

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
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.address}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createAt).toLocaleString()}</td>
                <td className="d-flex">
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2 mb-1"
                    onClick={() => handleEditUser(user)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2 mb-1"
                    onClick={() => handleChangePassword(user)}
                  >
                    Đổi mật khẩu
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="mb-1"
                    onClick={() => handleDeleteUser(user.userId)}
                  >
                    Xóa
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

      {/* Modal sửa thông tin user */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa thông tin người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                value={formData.fullname}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Điện thoại</Form.Label>
              <Form.Control
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveUser}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal đổi mật khẩu */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Đổi mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Mật khẩu hiện tại</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, password: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.validPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, validPassword: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSavePassword}>
            Lưu mật khẩu
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal tạo user mới */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo người dùng mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                value={createData.fullname}
                onChange={(e) =>
                  setCreateData({ ...createData, fullname: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={createData.email}
                onChange={(e) =>
                  setCreateData({ ...createData, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Điện thoại</Form.Label>
              <Form.Control                type="text"
                value={createData.phone}
                onChange={(e) =>
                  setCreateData({ ...createData, phone: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                value={createData.address}
                onChange={(e) =>
                  setCreateData({ ...createData, address: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                value={createData.password}
                onChange={(e) =>
                  setCreateData({ ...createData, password: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={handleCreateUser}>
            Tạo
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

               
