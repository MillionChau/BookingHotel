import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Profile() {
  return (
    <div className="container mt-4">
      <div className="row">
        {/* Thông tin cá nhân */}
        <div className="col-md-5">
          <div className="card shadow-sm p-3">
            <h5 className="mb-3">Thông tin cá nhân</h5>
            <div className="mb-3">
              <label className="form-label">Họ tên</label>
              <input type="text" className="form-control" value="Nguyễn Văn A" readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value="email@domain.com" readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input type="text" className="form-control" value="0123 456 789" readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input type="password" className="form-control" value="123456" readOnly />
            </div>
            <button className="btn btn-primary w-100">Chỉnh sửa</button>
          </div>
        </div>

        {/* Lịch sử đặt phòng */}
        <div className="col-md-7">
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
