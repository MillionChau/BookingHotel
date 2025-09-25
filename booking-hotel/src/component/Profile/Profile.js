import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.scss";

// --- COMPONENT CON: Hiển thị thông tin ---
// Component này chỉ có nhiệm vụ hiển thị dữ liệu.
const UserInfoDisplay = ({ userInfo, onEditClick }) => (
  <div>
    <p>
      <strong>Họ tên:</strong> {userInfo.fullname}
    </p>
    <p>
      <strong>Email:</strong> {userInfo.email}
    </p>
    <p>
      <strong>Số điện thoại:</strong> {userInfo.phone || "Chưa có"}
    </p>
    <p>
      <strong>Địa chỉ:</strong> {userInfo.address || "Chưa có"}
    </p>
    <button className="btn btn-primary w-100" onClick={onEditClick}>
      Chỉnh sửa
    </button>
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
  <div>
    <div className="mb-3">
      <label className="form-label">Họ tên</label>
      <input
        type="text"
        className="form-control"
        name="fullname"
        value={userInfo.fullname || ""}
        onChange={onUserInfoChange}
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
    <button
      className="btn btn-success w-100 mb-2"
      onClick={onUpdate}
      disabled={isSubmitting} // Vô hiệu hóa nút khi đang gửi request
    >
      {isSubmitting ? "Đang lưu..." : "Lưu"}
    </button>
    <button className="btn btn-secondary w-100" onClick={onCancel}>
      Quay lại
    </button>
  </div>
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
      const res = await axios.get(`http://localhost:5360/user/user-info/${userId}`);
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

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setUpdateStatus({ message: "", type: "" }); // Xóa thông báo khi người dùng bắt đầu nhập liệu
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  // Gửi request update
  const handleUpdate = async () => {
    setIsSubmitting(true);
    setUpdateStatus({ message: "", type: "" });
    try {
      await axios.put(`http://localhost:5360/user/update-user/${userId}`, userInfo);
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

  // Quay lại: reset dữ liệu về ban đầu
  const handleCancel = () => {
    setUserInfo(originalInfo);
    setEditMode(false);
    setUpdateStatus({ message: "", type: "" });
  };
  
  // Hiển thị thông báo loading hoặc lỗi
  if (loading) return <div className="container text-center mt-5"><p>Đang tải thông tin...</p></div>;
  if (error) return <div className="container text-center mt-5 alert alert-danger">{error}</div>;

  return (
    <div className="container mb-5 profile">
      <div className="row">
        {/* Thông tin cá nhân */}
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5 className="mb-3">Thông tin cá nhân</h5>
            
            {/* Hiển thị thông báo cập nhật */}
            {updateStatus.message && (
              <div className={`alert alert-${updateStatus.type}`} role="alert">
                {updateStatus.message}
              </div>
            )}
            
            {!editMode ? (
              <UserInfoDisplay
                userInfo={userInfo}
                onEditClick={() => setEditMode(true)}
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

        {/* Lịch sử đặt phòng (giữ nguyên) */}
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5 className="mb-3">Lịch sử đặt phòng</h5>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Khách sạn</th>
                  <th>Phòng</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Sunrise Hotel</td>
                  <td>A201</td>
                  <td>2025-09-01 → 2025-09-03</td>
                  <td>
                    <span className="badge bg-success">Đã xác nhận</span>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Lotus Inn</td>
                  <td>B12</td>
                  <td>2025-07-11 → 2025-07-12</td>
                  <td>
                    <span className="badge bg-success">Đã xác nhận</span>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Moonlight Resort</td>
                  <td>P01</td>
                  <td>2025-06-20 → 2025-06-25</td>
                  <td>
                    <span className="badge bg-secondary">Đã hủy</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Profile;