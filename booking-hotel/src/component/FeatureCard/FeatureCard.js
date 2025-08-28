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
      <div class="container">
        <div className="grid d-flex grid-cols-1 md:grid-cols-3 mt-5 gap-6 p-6 featureCard ">
          {features.map((f, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-sm flex flex-col items-start">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-bold text-lg">{f.title}</h3>
              <p className="text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FeatureCard;
