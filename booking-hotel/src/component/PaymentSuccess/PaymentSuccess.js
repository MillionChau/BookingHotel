import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const bookingDataStr = params.get("bookingData");
        const orderId = params.get("orderId");

        if (bookingDataStr && orderId) {
            const bookingData = JSON.parse(decodeURIComponent(bookingDataStr));
            bookingData.bookingId = orderId;
            bookingData.paymentMethod = "MoMo";
            bookingData.paymentStatus = "Paid";
            bookingData.paymentDay = new Date();

            axios.post("http://localhost:5360/booking/create", bookingData)
                .then(res => {
                    alert("Thanh toán và lưu booking thành công!");
                    navigate("/"); // chuyển về trang chính
                })
                .catch(err => {
                    console.error(err);
                    alert("Lưu booking thất bại!");
                });
        } else {
            alert("Thiếu dữ liệu booking.");
            navigate("/");
        }
    }, [location, navigate]);

    return (
        <div className="container mt-5">
            <h2>Đang xử lý thanh toán...</h2>
        </div>
    );
}
