import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Modal, Alert } from "react-bootstrap";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaKey } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.scss";
import { API_BASE_URL } from "../../config/api";

// --- COMPONENT CON: Hiển thị thông tin ---
// Component này chỉ có nhiệm vụ hiển thị dữ liệu.
const UserInfoDisplay = ({ userInfo, onEditClick, onChangePasswordClick }) => (
  <div className="user-info-display">
    <div className="info-item">
      <FaUser className="info-icon" />
      <div className="info-content">
        <strong>Họ tên: </strong>
        <span>{userInfo.fullname}</span>
      </div>
    </div>
    <div className="info-item">
      <FaEnvelope className="info-icon" />
      <div className="info-content">
        <strong>Email: </strong>
        <span>{userInfo.email}</span>
      </div>
    </div>
    <div className="info-item">
      <FaPhone className="info-icon" />
      <div className="info-content">
        <strong>Số điện thoại: </strong>
        <span>{userInfo.phone || "Chưa có"}</span>
      </div>
    </div>
    <div className="info-item">
      <FaMapMarkerAlt className="info-icon" />
      <div className="info-content">
        <strong>Địa chỉ: </strong>
        <span>{userInfo.address || "Chưa có"}</span>
      </div>
    </div>
    <div className="button-group">
      <button className="btn btn-primary w-100 mb-2" onClick={onEditClick}>
        <FaEdit className="me-1" /> Chỉnh sửa thông tin
      </button>
      <button className="btn btn-warning w-100" onClick={onChangePasswordClick}>
        <FaKey className="me-1" /> Đổi mật khẩu
      </button>
    </div>
  </div>
);

// --- COMPONENT CON: Form chỉnh sửa thông tin ---
// Component này chứa logic của form.
const UserInfoForm = ({
  userInfo,
  onUserInfoChange,
  onUpdate,
  onCancel,
  isSubmitting,
}) => (
  <form className="user-info-form">
    <div className="mb-3">
      <label className="form-label">Họ tên</label>
      <input
        type="text"
        className="form-control"
        name="fullname"
        value={userInfo.fullname || ""}
        onChange={onUserInfoChange}
        required
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Email</label>
      <input
        type="email"
        className="form-control"
        name="email"
        value={userInfo.email || ""}
        onChange={onUserInfoChange}
        required
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Số điện thoại</label>
      <input
        type="text"
        className="form-control"
        name="phone"
        value={userInfo.phone || ""}
        onChange={onUserInfoChange}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Địa chỉ</label>
      <input
        type="text"
        className="form-control"
        name="address"
        value={userInfo.address || ""}
        onChange={onUserInfoChange}
      />
    </div>
    <div className="button-group">
      <button
        type="button"
        className="btn btn-success w-100 mb-2"
        onClick={onUpdate}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Đang lưu..." : "Lưu"}
      </button>
      <button type="button" className="btn btn-secondary w-100" onClick={onCancel}>
        Quay lại
      </button>
    </div>
  </form>
);

// --- COMPONENT CON: Form đổi mật khẩu ---
// Component này xử lý form đổi mật khẩu.
const ChangePasswordForm = ({
  passwordForm,
  onChange,
  onSubmit,
  onClose,
  isSubmitting,
  errorMessage,
}) => (
  <form className="change-password-form">
    <div className="mb-3">
      <label className="form-label">Mật khẩu cũ</label>
      <input
        type="password"
        className="form-control"
        name="oldPassword"
        value={passwordForm.oldPassword}
        onChange={onChange}
        required
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Mật khẩu mới (ít nhất 6 ký tự)</label>
      <input
        type="password"
        className="form-control"
        name="newPassword"
        value={passwordForm.newPassword}
        onChange={onChange}
        required
        minLength={6}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Xác nhận mật khẩu mới</label>
      <input
        type="password"
        className="form-control"
        name="confirmPassword"
        value={passwordForm.confirmPassword}
        onChange={onChange}
        required
      />
    </div>
    {errorMessage && (
      <Alert variant="danger" className="mb-3">
        {errorMessage}
      </Alert>
    )}
    <div className="d-flex gap-2">
      <button
        type="button"
        className="btn btn-success flex-grow-1"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Đang thay đổi..." : "Thay đổi"}
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onClose}
        disabled={isSubmitting}
      >
        Hủy
      </button>
    </div>
  </form>
);

// --- COMPONENT CHÍNH: Profile ---
function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [originalInfo, setOriginalInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // State mới để cải thiện UX
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateStatus, setUpdateStatus] = useState({ message: "", type: "" });

  // State cho modal đổi mật khẩu
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Lấy userId một cách an toàn hơn
  const getUserId = () => {
    try {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString).id : null;
    } catch (e) {
      console.error("Lỗi khi đọc user từ localStorage", e);
      return null;
    }
  };
  const userId = getUserId();

  // Lấy thông tin user, sử dụng useCallback để tối ưu
  const fetchUser = useCallback(async () => {
    if (!userId) {
      setError("Không tìm thấy thông tin người dùng.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE_URL}/user/user-info/${userId}`);
      setUserInfo(res.data.user);
      setOriginalInfo(res.data.user);
    } catch (err) {
      console.error("Lỗi lấy thông tin", err);
      setError("Không thể tải thông tin người dùng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Xử lý thay đổi input thông tin cá nhân
  const handleChange = (e) => {
    setUpdateStatus({ message: "", type: "" }); // Xóa thông báo khi người dùng bắt đầu nhập liệu
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý thay đổi input mật khẩu
  const handlePasswordChange = (e) => {
    setPasswordError(""); // Xóa lỗi khi người dùng bắt đầu nhập
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  // Gửi request update thông tin cá nhân
  const handleUpdate = async () => {
    setIsSubmitting(true);
    setUpdateStatus({ message: "", type: "" });
    try {
      await axios.put(`${API_BASE_URL}/user/update-user/${userId}`, userInfo);
      setUpdateStatus({ message: "Cập nhật thông tin thành công!", type: "success" });
      setOriginalInfo(userInfo);
      setEditMode(false);
    } catch (err) {
      console.error("Lỗi khi cập nhật", err);
      setUpdateStatus({ message: "Cập nhật thất bại. Vui lòng thử lại.", type: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gửi request đổi mật khẩu
  const handleChangePassword = async () => {
    // Validate cơ bản
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Mật khẩu mới và xác nhận không khớp!");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải ít nhất 6 ký tự!");
      return;
    }

    setPasswordSubmitting(true);
    setPasswordError("");
    try {
      await axios.patch(`${API_BASE_URL}/user/change-password/${userId}`, {
        password: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        validPassword: passwordForm.confirmPassword,
      });
      // Clear form sau khi thành công
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordModal(false);
      setUpdateStatus({ message: "Đổi mật khẩu thành công!", type: "success" });
    } catch (err) {
      console.error("Lỗi khi đổi mật khẩu", err);
      setPasswordError(err.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  // Quay lại: reset dữ liệu về ban đầu
  const handleCancel = () => {
    setUserInfo(originalInfo);
    setEditMode(false);
    setUpdateStatus({ message: "", type: "" });
  };

  // Đóng modal đổi mật khẩu và clear form
  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
  };

  // Hiển thị thông báo loading hoặc lỗi
  if (loading) return (
    <div className="container text-center mt-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Đang tải...</span>
      </div>
      <p className="mt-2">Đang tải thông tin...</p>
    </div>
  );
  if (error) return (
    <div className="container text-center mt-5">
      <Alert variant="danger">{error}</Alert>
    </div>
  );

  return (
    <div className="container mb-5 profile pt-5">
      <div className="row justify-content-center pt-5">
        {/* Thông tin cá nhân */}
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 profile-card">
            <div className="card-body p-4">
              <h5 className="card-title mb-4 text-center">
                <FaUser className="me-2" /> Thông tin cá nhân
              </h5>
              
              {/* Hiển thị thông báo cập nhật */}
              {updateStatus.message && (
                <Alert 
                  variant={updateStatus.type} 
                  className="mb-3" 
                  onClose={() => setUpdateStatus({ message: "", type: "" })} 
                  dismissible
                >
                  {updateStatus.message}
                </Alert>
              )}
              
              {!editMode ? (
                <UserInfoDisplay
                  userInfo={userInfo}
                  onEditClick={() => setEditMode(true)}
                  onChangePasswordClick={() => setShowPasswordModal(true)}
                />
              ) : (
                <UserInfoForm
                  userInfo={userInfo}
                  onUserInfoChange={handleChange}
                  onUpdate={handleUpdate}
                  onCancel={handleCancel}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal đổi mật khẩu */}
      <Modal show={showPasswordModal} onHide={handleClosePasswordModal} centered size="md">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <FaKey className="me-2" /> Đổi mật khẩu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ChangePasswordForm
            passwordForm={passwordForm}
            onChange={handlePasswordChange}
            onSubmit={handleChangePassword}
            onClose={handleClosePasswordModal}
            isSubmitting={passwordSubmitting}
            errorMessage={passwordError}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Profile;