const Booking = require('../models/booking')
const bookingMiddleware = require('../middlewares/bookingMiddleware')
const revenueService = require('../services/revenueService')

class BookingController {
    constructor() {
        this.createBooking = this.createBooking.bind(this)
        this.getBookingsByUser = this.getBookingsByUser.bind(this)
        this.getBookingById = this.getBookingById.bind(this)
        this.cancelBooking = this.cancelBooking.bind(this)
        this.getAllBookings = this.getAllBookings.bind(this)
    }

    async createBooking(req, res) {
        const { userId, hotelId, roomId, checkinDate, checkOutDate, status,
            paymentStatus, paymentMethod, unitPrice, paymentDay, totalPrice } = req.body

        try {
            if (!userId || !hotelId || !roomId)
                return res.status(400).json({ message: 'Thiếu mã người dùng hoặc mã khách sạn' })


            const bookingId = await this.generateBookingId()

            const booking = new Booking({
                bookingId,
                roomId,
                userId,
                hotelId,
                checkinDate: new Date(checkinDate),
                checkOutDate: new Date(checkOutDate),
                status: 'Booked',
                paymentStatus,
                paymentMethod,
                unitPrice,
                paymentDay: paymentDay ? new Date(paymentDay) : null,
                totalPrice
            })

            await booking.save()

            if (booking.paymentStatus === 'Paid') {
                await revenueService.updateRevenue(booking)
            }

            res.status(201).json({
                message: 'Đăng ký khách sạn thành công!',
                booking: booking
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    // PUT /bookings/:id/payment
    async updatePaymentStatus(req, res) {
        const { bookingId } = req.params
        const { paymentStatus, paymentMethod, paymentDay } = req.body

        try {
            const booking = await Booking.findOne({ bookingId })

            if (!booking)
                return res.status(404).json({ message: 'Không tìm thấy đơn đặt!' })

            const previousPaymentStatus = booking.paymentStatus

            booking.paymentStatus = paymentStatus
            booking.paymentMethod = paymentMethod || booking.paymentMethod
            booking.paymentDay = paymentDay ? new Date(paymentDay) : booking.paymentDay

            await booking.save()

            if (paymentStatus === 'Paid' && previousPaymentStatus !== 'Paid') {
                await revenueService.updateRevenue(booking)
            }

            res.status(200).json({
                message: 'Cập nhật trạng thái thanh toán thành công!',
                booking: booking
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async generateBookingId() {
        const now = new Date()
        const year = now.getFullYear()
        const month = (now.getMonth() + 1).toString().padStart(2, '0')

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        try {
            const monthlyBookings = await Booking.countDocuments({
                createdAt: {
                    $gte: startOfMonth,
                    $lte: endOfMonth
                }
            })

            const sequenceNumber = (monthlyBookings + 1).toString().padStart(4, '0')
            return `BK-${year}${month}-${sequenceNumber}`
        } catch (error) {
            const timestamp = Date.now().toString().slice(-6)
            return `BK-${year}${month}-${timestamp}`
        }
    }

    // GET /bookings/user/:userId
    async getBookingsByUser(req, res) {
        const { userId } = req.params

        try {
            const bookings = await Booking.find({ userId })

            if (!bookings || bookings.length === 0)
                return res.status(404).json({ message: 'Không có đơn đặt nào!' })

            res.status(200).json({
                message: 'Lấy danh sách đơn đặt thành công!',
                bookings: bookings
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    // GET /booking/:id
    async getBookingById(req, res) {
        const { bookingId } = req.params

        try {
            const booking = await Booking.findOne({ bookingId })

            if (!booking)
                return res.status(404).json({ message: 'Không tìm thấy đơn đặt!' })

            res.status(200).json({
                message: 'Lấy đơn đặt thành công!',
                booking: booking
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    // PATCH /bookings/:id/cancel
    async cancelBooking(req, res) {
        const { bookingId } = req.params

        try {
            const booking = await Booking.findOne({ bookingId })

            if (!booking)
                return res.status(404).json({ message: 'Không tìm thấy đơn đặt!' })

            booking.status = 'Cancelled'
            await booking.save()

            res.status(200).json({
                message: 'Hủy đơn đặt thành công!',
                booking: booking
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    // GET /bookings (Admin)   
    async getAllBookings(req, res) {
        try {
            const bookings = await Booking.find()

            if (!bookings || bookings.length === 0)
                return res.status(404).json({ message: 'Không tìm thấy đơn đặt nào!' })

            res.status(200).json({
                message: 'Lấy danh sách đơn đặt thành công!',
                bookings: bookings
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }
    async createBookingFromPayment(data) {
        try {
            const booking = new Booking({
                bookingId: data.bookingId,
                userId: data.userId,
                hotelId: data.hotelId,
                roomId: data.roomId,
                checkinDate: new Date(data.checkinDate),
                checkOutDate: new Date(data.checkOutDate),
                status: "Booked",
                paymentStatus: "Paid",
                paymentMethod: data.paymentMethod || "MoMo",
                unitPrice: data.unitPrice,
                paymentDay: new Date(),
                totalPrice: data.totalPrice
            });

            await booking.save();

            // update doanh thu luôn nếu Paid
            await revenueService.updateRevenue(booking);

            return booking;
        } catch (err) {
            console.error("createBookingFromPayment error:", err.message);
            throw err;
        }
    }
}

module.exports = new BookingController()