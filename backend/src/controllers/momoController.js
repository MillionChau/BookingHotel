const axios = require('axios');
const crypto = require('crypto');
const Booking = require('../models/booking');
const revenueService = require('../services/revenueService');
const BookingController = require('../controllers/bookingController');

exports.createPayment = async (req, res) => {
    try {
        const { bookingData } = req.body;

        if (!bookingData || !bookingData.totalPrice) {
            return res.status(400).json({ message: "Thiếu dữ liệu đặt phòng hoặc totalPrice" });
        }

        const amount = bookingData.totalPrice;
        const orderInfo = "Thanh toán đặt phòng khách sạn";

        const accessKey = "F8BBA842ECF85";
        const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        const partnerCode = "MOMO";
        const requestType = "payWithMethod";
        const orderId = partnerCode + new Date().getTime(); // unique ID

        const requestId = orderId;
        const redirectUrl = `http://localhost:3000/payment-success?bookingData=${encodeURIComponent(JSON.stringify(bookingData))}&orderId=${orderId}`;
        const ipnUrl = "http://localhost:5360/api/momo/callback"; // callback MoMo

        const extraData = encodeURIComponent(JSON.stringify(bookingData));

        const rawSignature =
            `accessKey=${accessKey}` +
            `&amount=${amount}` +
            `&extraData=${extraData}` +
            `&ipnUrl=${ipnUrl}` +
            `&orderId=${orderId}` +
            `&orderInfo=${orderInfo}` +
            `&partnerCode=${partnerCode}` +
            `&redirectUrl=${redirectUrl}` +
            `&requestId=${requestId}` +
            `&requestType=${requestType}`;

        const signature = crypto.createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        const requestBody = {
            partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            lang: "vi",
            requestType,
            autoCapture: true,
            extraData,
            orderGroupId: "",
            signature
        };

        const response = await axios.post(
            "https://test-payment.momo.vn/v2/gateway/api/create",
            requestBody,
            { headers: { "Content-Type": "application/json" } }
        );

        return res.json({ ...response.data, orderId });
    } catch (error) {
        console.error("Error creating MoMo payment:", error.response?.data || error.message);
        res.status(500).json({ message: "Error creating MoMo payment", error: error.message });
    }
};


  

// Callback từ MoMo
exports.handleCallback = async (req, res) => {
    try {
        const { orderId, resultCode, extraData } = req.body;

        if (resultCode === 0) { // thanh toán thành công
            const bookingData = JSON.parse(extraData);

            bookingData.bookingId = orderId; // gán orderId thành bookingId
            bookingData.paymentMethod = "MoMo";

            await BookingController.createBookingFromPayment(bookingData);
        }

        res.status(200).json({ message: "Callback received", data: req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error handling MoMo callback", error: err.message });
    }
};

//nrok

  
