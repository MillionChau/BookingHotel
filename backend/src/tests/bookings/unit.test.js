const bookingController = require('../../controllers/bookingController')
const Booking = require('../../models/booking')
const revenueService = require('../../services/revenueService')

// Mock các dependencies
jest.mock('../../models/booking')
jest.mock('../../services/revenueService')

describe('Booking Controller - Unit Test', () => {
  let req, res

  beforeEach(() => {
    req = { body: {}, params: {} }
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    jest.clearAllMocks()
  })

  // TC-25: Đặt phòng thành công
  it('TC-25: should create booking successfully', async () => {
    req.body = {
      userId: 'USR-001',
      hotelId: 'HT-2025-0001',
      roomId: 'RM-001',
      checkinDate: '2025-01-15',
      checkOutDate: '2025-01-20',
      paymentStatus: 'Paid',
      paymentMethod: 'MoMo',
      unitPrice: 100,
      totalPrice: 500
    }

    // Mock generateBookingId
    bookingController.generateBookingId = jest.fn().mockResolvedValue('BK-202501-0001')
    
    // Mock save
    const mockSave = jest.fn().mockResolvedValue(true)
    Booking.mockImplementation(() => ({
      save: mockSave
    }))

    await bookingController.createBooking(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Đăng ký khách sạn thành công!'
    }))
  })

  // TC-26: Thiếu trường bắt buộc khi đặt phòng
  it('TC-26: should return 400 if missing required fields', async () => {
    req.body = {
      userId: '',
      hotelId: '',
      roomId: ''
    }

    await bookingController.createBooking(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Thiếu mã người dùng hoặc mã khách sạn'
    }))
  })

  // TC-27: Lấy danh sách đơn theo người dùng
  it('TC-27: should get bookings by user successfully', async () => {
    req.params.userId = 'USR-001'
    const mockBookings = [{ bookingId: 'BK-001' }, { bookingId: 'BK-002' }]
    Booking.find.mockResolvedValue(mockBookings)

    await bookingController.getBookingsByUser(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Lấy danh sách đơn đặt thành công!',
      bookings: mockBookings
    }))
  })

  // TC-27: Không tìm thấy đơn đặt theo user
  it('TC-27: should return 404 if no bookings found for user', async () => {
    req.params.userId = 'USR-999'
    Booking.find.mockResolvedValue([])

    await bookingController.getBookingsByUser(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Không có đơn đặt nào!'
    }))
  })

  // TC-29: Lấy đơn đặt theo ID thành công
  it('TC-29: should get booking by id successfully', async () => {
    req.params.bookingId = 'BK-202501-0001'
    const mockBooking = { bookingId: 'BK-202501-0001', userId: 'USR-001' }
    Booking.findOne.mockResolvedValue(mockBooking)

    await bookingController.getBookingById(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Lấy đơn đặt thành công!',
      booking: mockBooking
    }))
  })

  // TC-29: Không tìm thấy đơn đặt theo ID
  it('TC-29: should return 404 if booking not found', async () => {
    req.params.bookingId = 'NOT-FOUND'
    Booking.findOne.mockResolvedValue(null)

    await bookingController.getBookingById(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Không tìm thấy đơn đặt!'
    }))
  })

  // TC-30: Hủy đơn đặt thành công
  it('TC-30: should cancel booking successfully', async () => {
    req.params.bookingId = 'BK-202501-0001'
    const mockBooking = {
      bookingId: 'BK-202501-0001',
      status: 'Booked',
      save: jest.fn().mockResolvedValue(true)
    }
    Booking.findOne.mockResolvedValue(mockBooking)

    await bookingController.cancelBooking(req, res)

    expect(mockBooking.status).toBe('Cancelled')
    expect(mockBooking.save).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Hủy đơn đặt thành công!'
    }))
  })

  // TC-24: Lấy tất cả đơn đặt (Admin)
  it('TC-24: should get all bookings successfully', async () => {
    const mockBookings = [{ bookingId: 'BK-001' }, { bookingId: 'BK-002' }]
    Booking.find.mockResolvedValue(mockBookings)

    await bookingController.getAllBookings(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Lấy danh sách đơn đặt thành công!',
      bookings: mockBookings
    }))
  })

  // TC-24: Không có đơn đặt nào
  it('TC-24: should return 404 if no bookings exist', async () => {
    Booking.find.mockResolvedValue([])

    await bookingController.getAllBookings(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Không tìm thấy đơn đặt nào!'
    }))
  })

  // TC-28: Cập nhật thanh toán thành công
  it('TC-28: should update payment status successfully', async () => {
    req.params.bookingId = 'BK-202501-0001'
    req.body = {
      paymentStatus: 'Paid',
      paymentMethod: 'CreditCard',
      paymentDay: '2025-01-10'
    }

    const mockBooking = {
      bookingId: 'BK-202501-0001',
      paymentStatus: 'Pending',
      paymentMethod: 'MoMo',
      paymentDay: null,
      save: jest.fn().mockResolvedValue(true)
    }
    Booking.findOne.mockResolvedValue(mockBooking)

    await bookingController.updatePaymentStatus(req, res)

    expect(mockBooking.paymentStatus).toBe('Paid')
    expect(mockBooking.paymentMethod).toBe('CreditCard')
    expect(mockBooking.save).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Cập nhật trạng thái thanh toán thành công!'
    }))
  })

  // TC-28: Không tìm thấy đơn đặt khi cập nhật thanh toán
  it('TC-28: should return 404 if booking not found when updating payment', async () => {
    req.params.bookingId = 'NOT-FOUND'
    req.body = { paymentStatus: 'Paid' }
    Booking.findOne.mockResolvedValue(null)

    await bookingController.updatePaymentStatus(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Không tìm thấy đơn đặt!'
    }))
  })
})