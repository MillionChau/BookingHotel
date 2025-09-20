import React from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FeatureCard.scss";

const FeatureCard = () => {
  const slides = [
    {
      img: "https://static.vivnpay.vn/202311301357/app-dat-phong-khach-san.jpg",
      title: "Đặt phòng dễ dàng",
      desc: "Chỉ vài bước để đặt khách sạn yêu thích nhanh chóng.",
      color: "text-warning",
    },
    {
      img: "https://www.vietnambooking.com/wp-content/uploads/2020/08/LeQuocKhanh_checkin.png",
      title: "Ưu đãi mỗi ngày",
      desc: "Săn deal khách sạn giá tốt, tiết kiệm đến 50%.",
      color: "text-success",
    },
    {
      img: "https://dolphintour.vn/images/uploadsimages/10-khach-san-sang-trong-nhat-the-gioi-1.png",
      title: "Trải nghiệm tuyệt vời",
      desc: "Khám phá hàng nghìn khách sạn ở Việt Nam và quốc tế.",
      color: "text-danger",
    },
  ];

  return (
    <div className="container feature-slider mt-4">
      <h2 class="fw-bold text-center text-uppercase section-title pb-2 mb-4 ">
        Lý do bạn đến với chúng tôi
      </h2>
      <Carousel fade interval={4000} pause="hover">
        {slides.map((slide, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100 slider-img"
              src={slide.img}
              alt={slide.title}
            />
            <Carousel.Caption className="caption-bg">
              <h3 className={`fw-bold ${slide.color}`}>{slide.title}</h3>
              <p className="fw-semibold">{slide.desc}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default FeatureCard;