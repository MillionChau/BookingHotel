const bookingController = require('../../controllers/bookingController')
const Booking = require('../../models/booking')
const revenueService = require('../../services/revenueService')

jest.mock('../../models/booking')

describe('Booking Controller - Unit Test', () => {
    let req, res

    beforeEach(() => {
        req = { body: {}, params: {}, query: {} }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        }
        jest.clearAllMocks()
    })

    // TC-24: Lấy danh sách đơn đặt
    it('TC-24: should get all booking successfully', async () => {
        const mockBookings = [
            {
                bookingId: "BK001",
                userId: "USER1001",
                hotelId: "HOTEL2001",
                roomId: "ROOM3001",
                checkinDate: new Date("2024-03-15"),
                checkOutDate: new Date("2024-03-18"),
                status: "confirmed",
                paymentStatus: "paid",
                paymentMethod: "credit_card",
                unitPrice: 1200000,
                paymentDay: new Date("2024-03-10"),
                totalPrice: 3600000
            },
            {
                bookingId: "BK002",
                userId: "USER1002",
                hotelId: "HOTEL2002",
                roomId: "ROOM3002",
                checkinDate: new Date("2024-03-20"),
                checkOutDate: new Date("2024-03-22"),
                status: "pending",
                paymentStatus: "pending",
                paymentMethod: "bank_transfer",
                unitPrice: 850000,
                paymentDay: null,
                totalPrice: 1700000
            }
        ]

        Booking.find.mockResolvedValue(mockBookings)

        await bookingController.getAllBookings(req, res)

        expect(Booking.find).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: expect.any(String),
            bookings: mockBookings
        })
    })

    // TC-25: Đặt phòng thành công
    it('TC-25: should booking successfully', async () => {
        req.body = {
            userId: "USER1001",
            hotelId: "HOTEL2001",
            roomId: 'ROOM1001',
            checkinDate: "2024-03-15",
            checkOutDate: "2024-03-18",
            paymentStatus: "Paid",
            paymentMethod: "credit_card",
            unitPrice: 1200000,
            paymentDay: "2024-03-10",
            totalPrice: 3600000
        }

        bookingController.generateBookingId = jest.fn().mockResolvedValue("BK001")

        Booking.countDocuments.mockResolvedValue(0)

        const mockSave = jest.fn().mockResolvedValue({
            bookingId: "BK001",
            userId: "USER1001",
            roomId: 'ROOM1001',
            hotelId: "HOTEL2001",
            checkinDate: new Date("2024-03-15"),
            checkOutDate: new Date("2024-03-18"),
            status: "Booked",
            paymentStatus: "Paid",
            paymentMethod: "credit_card",
            unitPrice: 1200000,
            paymentDay: new Date("2024-03-10"),
            totalPrice: 3600000
        })
        Booking.prototype.save = mockSave

        revenueService.updateRevenue = jest.fn().mockResolvedValue(true)

        await bookingController.createBooking(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Đăng ký khách sạn thành công!',
            booking: expect.any(Object)
        }))
    })
})