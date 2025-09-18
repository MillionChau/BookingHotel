import React from 'react';
import './Footer.scss';

function Footer() {
  const handleAccordion = (event) => {

    const column = event.currentTarget.parentElement;
    if (window.innerWidth <= 768 && column.classList.contains('footer-column')) {
      column.classList.toggle('open');
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-content-wrapper">
        <div className="footer-column">
          <h3 onClick={handleAccordion}>Về chúng tôi</h3>
          <ul>
            <li><a href="#"><i className="bi bi-info-circle"></i> Về Booking Hotel</a></li>
            <li><a href="#"><i className="bi bi-briefcase"></i> Cơ hội việc làm</a></li>
            <li><a href="#"><i className="bi bi-newspaper"></i> Truyền thông</a></li>
            <li><a href="#"><i className="bi bi-tree"></i> Du lịch bền vững</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 onClick={handleAccordion}>Sản phẩm</h3>
          <ul>
            <li><a href="#"><i className="bi bi-building"></i> Khách sạn</a></li>
            <li><a href="#"><i className="bi bi-airplane"></i> Vé máy bay</a></li>
            <li><a href="#"><i className="bi bi-car-front-fill"></i> Cho thuê xe</a></li>
            <li><a href="#"><i className="bi bi-controller"></i> Hoạt động & Vui chơi</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 onClick={handleAccordion}>Hỗ trợ</h3>
          <ul>
            <li><a href="#"><i className="bi bi-question-circle"></i> Trung tâm trợ giúp</a></li>
            <li><a href="#"><i className="bi bi-headset"></i> Liên hệ chúng tôi</a></li>
            <li><a href="#"><i className="bi bi-gear"></i> Quản lý đặt chỗ</a></li>
            <li><a href="#"><i className="bi bi-people"></i> Trợ giúp đối tác</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 onClick={handleAccordion}>Khác</h3>
          <ul>
            <li><a href="#"><i className="bi bi-share"></i> BookingHotel Affiliate</a></li>
            <li><a href="#"><i className="bi bi-book"></i> Blog du lịch</a></li>
            <li><a href="#"><i className="bi bi-file-text"></i> Điều khoản & Điều kiện</a></li>
            <li><a href="#"><i className="bi bi-shield-check"></i> Chính sách Quyền riêng tư</a></li>
          </ul>
        </div>
        
      
        <div className="footer-social">
          <h3 onClick={handleAccordion}>Theo dõi chúng tôi</h3>
          <ul>
            <li><a href="#"><i className="bi bi-facebook"></i> Facebook</a></li>
            <li><a href="#"><i className="bi bi-instagram"></i> Instagram</a></li>
            <li><a href="#"><i className="bi bi-tiktok"></i> TikTok</a></li>
            <li><a href="#"><i className="bi bi-youtube"></i> Youtube</a></li>
          </ul>
        </div>

        <div className="footer-legal">
          <p>Copyright © 2024–2025 BookingHotel.com™. Bảo lưu mọi quyền.</p>
          <p>Booking Hotel là thành viên của Booking Hotel Inc., tập đoàn hàng đầu thế giới về du lịch trực tuyến và các dịch vụ liên quan.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;