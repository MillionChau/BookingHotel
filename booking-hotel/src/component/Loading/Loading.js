import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Loading = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        {/* Spinner */}
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "4rem", height: "4rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>

        {/* Text dưới spinner */}
        <div className="mt-3 fw-semibold text-primary fs-5">
          Đang tải dữ liệu...
        </div>
      </div>
    </div>
  );
};

export default Loading;
