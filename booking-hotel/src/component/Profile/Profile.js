import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.scss";

function Profile({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullname || user.fullName || "",
        email: user.email || "",
        // --- THAY ĐỔI Ở ĐÂY ---
        // Thay "Chưa có số điện thoại" bằng chuỗi rỗng ""
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-content">
          {/* Thông tin cá nhân */}
          <div className="profile-info">
            <div className="card">
              <h5 className="card-title">Thông tin cá nhân</h5>
              <div className="form-group">
                <label>Họ tên</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  
                />
              </div>
              <button
                className="btn btn-primary btn-edit"
                onClick={handleEditClick}
              >
                {isEditing ? "Lưu thay đổi" : "Chỉnh sửa"}
              </button>
            </div>
          </div>

          {/* Lịch sử đặt phòng */}
          <div className="booking-history">
            <div className="card">
              <h5 className="card-title">Lịch sử đặt phòng</h5>
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
                  {/* ... dữ liệu lịch sử ... */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;