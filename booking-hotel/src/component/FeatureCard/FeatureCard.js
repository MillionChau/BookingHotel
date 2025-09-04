import React from "react";
import { Funnel, ShieldCheck, Phone } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FeatureCard.scss";

const FeatureCard = () => {
  const features = [
    {
      icon: <Funnel />,
      title: "Lọc thông minh",
      description:
        "Lọc theo địa điểm, giá, loại phòng, số sao để tìm phòng phù hợp nhất.",
    },
    {
      icon: <ShieldCheck />,
      title: "Bảo mật",
      description:
        "Mã hóa dữ liệu người dùng, xác thực phiên đăng nhập an toàn.",
    },
    {
      icon: <Phone />,
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
                <div className="fs-3 mb-2">{feature.icon}</div>
                <h3 className="fw-bold fs-5">{feature.title}</h3>
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
