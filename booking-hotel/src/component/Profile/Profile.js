import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.scss";

function Profile() {
  const [userInfo, setUserInfo] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [originalInfo, setOriginalInfo] = useState(null);

  const userId = JSON.parse(localStorage.getItem("user"));

  // Lấy thông tin user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5360/user/user-info/${userId.id}`
        );
        setUserInfo(res.data.user);
        setOriginalInfo(res.data.user); // lưu lại dữ liệu gốc
      } catch (err) {
        console.error("Lỗi lấy thông tin", err);
      }
    };
    fetchUser();
  }, [userId.id]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  // Gửi request update
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5360/user/update-user/${userId.id}`, {
        fullname: userInfo.fullname,
        email: userInfo.email,
        phone: userInfo.phone,
        address: userInfo.address,
      });
      alert("Cập nhật thông tin thành công!");
      setEditMode(false);
      setOriginalInfo(userInfo); // cập nhật dữ liệu gốc
    } catch (err) {
      console.error("Lỗi khi cập nhật", err);
      alert("Cập nhật thất bại!");
    }
  };

  // Quay lại: reset dữ liệu về ban đầu
  const handleCancel = () => {
    setUserInfo(originalInfo);
    setEditMode(false);
  };

  return (
    <div className="container mb-5 profile">
      <div className="row">
        {/* Thông tin cá nhân */}
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5 className="mb-3">Thông tin cá nhân</h5>

            {/* Nếu chưa bật editMode thì hiển thị dạng text */}
            {!editMode ? (
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

                <button
                  className="btn btn-primary w-100"
                  onClick={() => setEditMode(true)}>
                  Chỉnh sửa
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-3">
                  <label className="form-label">Họ tên</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fullname"
                    value={userInfo.fullname || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={userInfo.email || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={userInfo.phone || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Địa chỉ</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={userInfo.address || ""}
                    onChange={handleChange}
                  />
                </div>

                <button
                  className="btn btn-success w-100 mb-2"
                  onClick={handleUpdate}>
                  Lưu
                </button>
                <button
                  className="btn btn-secondary w-100"
                  onClick={handleCancel}>
                  Quay lại
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lịch sử đặt phòng */}
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
