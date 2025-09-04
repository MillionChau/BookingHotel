<<<<<<< HEAD
import React from 'react';
import './Footer.css'; 
=======
import React from "react";
import "./Footer.scss"; // Import file CSS để tạo kiểu
>>>>>>> 33908288ac41bcac83272fde0062efc30a570954

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-links-grid">
        <div className="footer-column">
          <h3>Hỗ trợ</h3>
          <ul>
            <li>
              <a href="#">Các câu hỏi thường gặp về virus corona (COVID-19)</a>
            </li>
            <li>
              <a href="#">Quản lí các chuyến đi của bạn</a>
            </li>
            <li>
              <a href="#">Liên hệ Dịch vụ Khách hàng</a>
            </li>
            <li>
              <a href="#">Trợ giúp đối tác</a>
            </li>
            <li>
              <a href="#">Trung tâm thông tin bảo mật</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Khám phá</h3>
          <ul>
            <li>
              <a href="#">Địa điểm</a>
            </li>
            <li>
              <a href="#">Các loại chỗ nghỉ</a>
            </li>
            <li>
              <a href="#">Đánh giá</a>
            </li>
            <li>
              <a href="#">Ưu đãi theo mùa và dịp lễ</a>
            </li>
            <li>
              <a href="#">Bài viết về du lịch</a>
            </li>
            <li>
              <a href="#">BookingHotel.com dành cho Doanh Nghiệp</a>
            </li>
            <li>
              <a href="#">Traveller Review Awards</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Điều khoản & Quyền riêng tư</h3>
          <ul>
            <li>
              <a href="#">Bảo mật & Cookie</a>
            </li>
            <li>
              <a href="#">Điều khoản và điều kiện</a>
            </li>
            <li>
              <a href="#">Chính sách về Khả năng tiếp cận</a>
            </li>
            <li>
              <a href="#">Tranh chấp đối tác</a>
            </li>
            <li>
              <a href="#">Chính sách chống Nô lệ Hiện đại</a>
            </li>
            <li>
              <a href="#">Chính sách về Quyền con người</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Đối tác</h3>
          <ul>
            <li>
              <a href="#">Đăng nhập vào trang Extranet</a>
            </li>
            <li>
              <a href="#">Đăng ký chỗ nghỉ của Quý vị</a>
            </li>
            <li>
              <a href="#">Trở thành đối tác phân phối</a>
            </li>
            <li>
              <a href="#">Liên hệ công ty</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Về chúng tôi</h3>
          <ul>
            <li>
              <a href="#">Về Booking.com</a>
            </li>
            <li>
              <a href="#">Chúng tôi hoạt động như thế nào</a>
            </li>
            <li>
              <a href="#">Du lịch bền vững</a>
            </li>
            <li>
              <a href="#">Truyền thông</a>
            </li>
            <li>
              <a href="#">Cơ hội việc làm</a>
            </li>
            <li>
              <a href="#">Quan hệ cổ đông</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-legal-info">
        <p>Copyright © 2004–2025 BookingHotel.com™. Bảo lưu mọi quyền.</p>
        <p>
          Booking.com là một phần của Booking Hotel Inc., tập đoàn đứng đầu thế
          giới về du lịch trực tuyến và các dịch vụ liên quan.
        </p>
        <div className="footer-holding-logos">
          <i className="bi bi-building"></i> BookingHotel
        </div>
      </div>
    </footer>
  );
}

export default Footer;
