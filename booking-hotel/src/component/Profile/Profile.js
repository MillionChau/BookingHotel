import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Profile() {
  const [userInfo, setUserInfo] = useState([]);
  const userId = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5360/user/user-info/${userId.id}`
        );
        const data = await res.data.user;
        setUserInfo(data);
      } catch (err) {
        console.err("Lỗi thông tin");
      }
    };
    fetchUser();
  }, []);
  console.log(userInfo);
  return (
    // <div className="container mt-4">
    //   <div className="row">
    //     {/* Thông tin cá nhân */}
    //     <div className="col-md-5">
    //       <div className="card shadow-sm p-3">
    //         <h5 className="mb-3">Thông tin cá nhân</h5>
    //         <div className="mb-3">
    //           <label className="form-label">Họ tên</label>
    //           <input
    //             type="text"
    //             className="form-control"
    //             value="Nguyễn Văn A"
    //             readOnly
    //           />
    //         </div>
    //         <div className="mb-3">
    //           <label className="form-label">Email</label>
    //           <input
    //             type="email"
    //             className="form-control"
    //             value="email@domain.com"
    //             readOnly
    //           />
    //         </div>
    //         <div className="mb-3">
    //           <label className="form-label">Số điện thoại</label>
    //           <input
    //             type="text"
    //             className="form-control"
    //             value="0123 456 789"
    //             readOnly
    //           />
    //         </div>
    //         <div className="mb-3">
    //           <label className="form-label">Mật khẩu</label>
    //           <input
    //             type="password"
    //             className="form-control"
    //             value="123456"
    //             readOnly
    //           />
    //         </div>
    //         <button className="btn btn-primary w-100">Chỉnh sửa</button>
    //       </div>
    //     </div>

    //     {/* Lịch sử đặt phòng */}
    //   </div>
    // </div>
    <div>1</div>
  );
}

export default Profile;
