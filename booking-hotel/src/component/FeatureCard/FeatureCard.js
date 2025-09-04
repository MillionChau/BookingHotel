import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./FeatureCard.scss";

const FeatureCard = () => {
  const features = [
    {
      icon: "https://cdn.pixabay.com/animation/2023/06/13/15/12/15-12-51-616_512.gif",
      title: "Lọc thông minh",
      description:
        "Lọc theo địa điểm, giá, loại phòng, số sao để tìm phòng phù hợp nhất.",
    },
    {
      icon: "https://phtd.com.vn/wp-content/uploads/2024/01/icon-bao-mat.png",
      title: "Bảo mật",
      description:
        "Mã hóa dữ liệu người dùng, xác thực phiên đăng nhập an toàn.",
    },
    {
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFo6kb0wMwT_-uEjjV22GdAErKC4vHIqXhUw&s",
      title: "Responsive",
      description: "Trải nghiệm mượt mà trên cả mobile và desktop.",
    },
  ];

  return (
    <>
      <div className="container mt-5">
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-12 col-md-4 col-sm-12">
              <div className="border rounded p-4 shadow-sm d-flex flex-column align-items-start h-100">
                <div className="d-flex align-items-center iconFeature">
                  <img
                    width={70}
                    height={70}
                    src={feature.icon}
                    alt={feature.title}
                    className="img"
                  />
                  <h3 className="fw-bold fs-5">{feature.title}</h3>
                </div>
                <p className="text-muted">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FeatureCard;
