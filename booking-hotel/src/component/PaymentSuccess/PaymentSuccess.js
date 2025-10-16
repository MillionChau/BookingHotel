import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toast, ToastContainer, Spinner } from "react-bootstrap";
import axios from "axios";

export default function PaymentSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [isProcessing, setIsProcessing] = useState(true);

    // Hiển thị toast
    const showToastMessage = (message, variant = "success") => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
    };

    useEffect(() => {
        const processPayment = async () => {
            const params = new URLSearchParams(location.search);
            const bookingDataStr = params.get("bookingData");
            const orderId = params.get("orderId");

            if (bookingDataStr && orderId) {
                try {
                    const bookingData = JSON.parse(decodeURIComponent(bookingDataStr));
                    bookingData.bookingId = orderId;
                    bookingData.paymentMethod = "MoMo";
                    bookingData.paymentStatus = "Paid";
                    bookingData.paymentDay = new Date();

                    await axios.post("http://localhost:5360/booking/create", bookingData);
                    
                    showToastMessage("Thanh toán và đặt phòng thành công!", "success");
                    
                    // Chuyển hướng sau 2 giây
                    setTimeout(() => {
                        navigate("/");
                    }, 2000);
                    
                } catch (err) {
                    console.error(err);
                    showToastMessage("Lưu thông tin đặt phòng thất bại!", "danger");
                    setIsProcessing(false);
                }
            } else {
                showToastMessage("Thiếu dữ liệu đặt phòng!", "danger");
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        };

        processPayment();
    }, [location, navigate]);

    return (
        <div className="container mt-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                    {isProcessing ? (
                        <>
                            <Spinner animation="border" variant="primary" className="mb-3" />
                            <h3 className="text-primary">Đang xử lý thanh toán...</h3>
                            <p className="text-muted">Vui lòng chờ trong giây lát</p>
                        </>
                    ) : (
                        <>
                            <div className="mb-3">
                                <i className="fas fa-exclamation-triangle text-warning" style={{fontSize: '3rem'}}></i>
                            </div>
                            <h3 className="text-warning">Có lỗi xảy ra</h3>
                            <p className="text-muted">Vui lòng thử lại hoặc liên hệ hỗ trợ</p>
                            <button 
                                className="btn btn-primary mt-3"
                                onClick={() => navigate("/")}
                            >
                                Quay về trang chủ
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            <ToastContainer position="top-center" className="p-3" style={{ zIndex: 9999 }}>
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={4000}
                    autohide
                    bg={toastVariant}
                >
                    <Toast.Header className={`bg-${toastVariant} text-white`}>
                        <strong className="me-auto">
                            {toastVariant === "success" ? "✅ Thành công" : "❌ Lỗi"}
                        </strong>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={() => setShowToast(false)}
                            aria-label="Close"
                        ></button>
                    </Toast.Header>
                    <Toast.Body className="bg-light">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}