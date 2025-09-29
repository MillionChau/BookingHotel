const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const supertest = require('supertest')
const express = require('express')

const Booking = require('../../models/booking')
const bookingRoute = require('../../routes/bookingRoute')

let app, mongoServer, request

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)

  app = express()
  app.use(express.json())
  app.use('/booking', bookingRoute)

  request = supertest(app)
})

afterEach(async () => {
  await Booking.deleteMany({})
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('Booking Controller - Integration Test', () => {
  // TC-25: Đặt phòng thành công
  it('TC-25: should create booking successfully', async () => {
    const res = await request.post('/booking/create').send({
      userId: 'USR-001',
      hotelId: 'HT-2025-0001',
      roomId: 'RM-001',
      checkinDate: '2025-01-15',
      checkOutDate: '2025-01-20',
      paymentStatus: 'Paid',
      paymentMethod: 'MoMo',
      unitPrice: 100,
      totalPrice: 500
    })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('booking')
    expect(res.body.booking).toHaveProperty('bookingId')
    expect(res.body.booking.bookingId).toMatch(/^BK-\d{6}-\d{4}$/)
  })

  // TC-26: Thiếu trường bắt buộc khi đặt phòng
  it('TC-26: should return 400 if missing required fields', async () => {
    const res = await request.post('/booking/create').send({
      userId: '',
      hotelId: '',
      roomId: ''
    })

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe('Thiếu mã người dùng hoặc mã khách sạn')
  })

  // TC-27: Lấy danh sách đơn theo người dùng
  it('TC-27: should get bookings by user successfully', async () => {
    await Booking.create({
      bookingId: 'BK-202501-0001',
      userId: 'USR-001',
      hotelId: 'HT-2025-0001',
      roomId: 'RM-001',
      checkinDate: new Date('2025-01-15'),
      checkOutDate: new Date('2025-01-20'),
      status: 'Booked',
      paymentStatus: 'Paid'
    })

    const res = await request.get('/booking/user/USR-001')

    expect(res.statusCode).toBe(200)
    expect(res.body.bookings.length).toBeGreaterThan(0)
    expect(res.body.bookings[0].userId).toBe('USR-001')
  })

  // TC-27: Không tìm thấy đơn đặt theo user
  it('TC-27: should return 404 if no bookings found for user', async () => {
    const res = await request.get('/booking/user/USR-999')

    expect(res.statusCode).toBe(404)
    expect(res.body.message).toBe('Không có đơn đặt nào!')
  })

  // TC-29: Lấy đơn đặt theo ID thành công
  it('TC-29: should get booking by id successfully', async () => {
    await Booking.create({
      bookingId: 'BK-202501-0001',
      userId: 'USR-001',
      hotelId: 'HT-2025-0001',
      roomId: 'RM-001',
      checkinDate: new Date('2025-01-15'),
      checkOutDate: new Date('2025-01-20'),
      status: 'Booked'
    })

    const res = await request.get('/booking/BK-202501-0001')

    expect(res.statusCode).toBe(200)
    expect(res.body.booking.bookingId).toBe('BK-202501-0001')
  })

  // TC-29: Không tìm thấy đơn đặt theo ID
  it('TC-29: should return 404 if booking not found', async () => {
    const res = await request.get('/booking/NOT-FOUND')

    expect(res.statusCode).toBe(404)
    expect(res.body.message).toBe('Không tìm thấy đơn đặt!')
  })

  // TC-30: Hủy đơn đặt thành công
  it('TC-30: should cancel booking successfully', async () => {
    await Booking.create({
      bookingId: 'BK-202501-0001',
      userId: 'USR-001',
      hotelId: 'HT-2025-0001',
      roomId: 'RM-001',
      checkinDate: new Date('2025-01-15'),
      checkOutDate: new Date('2025-01-20'),
      status: 'Booked'
    })

    const res = await request.patch('/booking/BK-202501-0001/cancel')

    expect(res.statusCode).toBe(200)
    expect(res.body.message).toMatch(/Hủy đơn đặt thành công/)
    expect(res.body.booking.status).toBe('Cancelled')
  })

  // TC-24: Lấy tất cả đơn đặt (Admin)
  it('TC-24: should get all bookings successfully', async () => {
    await Booking.create({
      bookingId: 'BK-202501-0001',
      userId: 'USR-001',
      hotelId: 'HT-2025-0001',
      roomId: 'RM-001',
      checkinDate: new Date('2025-01-15'),
      checkOutDate: new Date('2025-01-20'),
      status: 'Booked'
    })

    const res = await request.get('/booking')

    expect(res.statusCode).toBe(200)
    expect(res.body.bookings.length).toBeGreaterThan(0)
  })

  // TC-24: Không có đơn đặt nào
  it('TC-24: should return 404 if no bookings exist', async () => {
    const res = await request.get('/booking')

    expect(res.statusCode).toBe(404)
    expect(res.body.message).toBe('Không tìm thấy đơn đặt nào!')
  })

  // TC-28: Cập nhật thanh toán thành công
  it('TC-28: should update payment status successfully', async () => {
    await Booking.create({
      bookingId: 'BK-202501-0001',
      userId: 'USR-001',
      hotelId: 'HT-2025-0001',
      roomId: 'RM-001',
      checkinDate: new Date('2025-01-15'),
      checkOutDate: new Date('2025-01-20'),
      status: 'Booked',
      paymentStatus: 'Pending',
      paymentMethod: 'MoMo'
    })

    const res = await request.put('/booking/BK-202501-0001/payment').send({
      paymentStatus: 'Paid',
      paymentMethod: 'CreditCard',
      paymentDay: '2025-01-10'
    })

    expect(res.statusCode).toBe(200)
    expect(res.body.message).toMatch(/Cập nhật trạng thái thanh toán thành công/)
    expect(res.body.booking.paymentStatus).toBe('Paid')
    expect(res.body.booking.paymentMethod).toBe('CreditCard')
  })

  // TC-28: Không tìm thấy đơn đặt khi cập nhật thanh toán
  it('TC-28: should return 404 if booking not found when updating payment', async () => {
    const res = await request.put('/booking/NOT-FOUND/payment').send({
      paymentStatus: 'Paid'
    })

    expect(res.statusCode).toBe(404)
    expect(res.body.message).toBe('Không tìm thấy đơn đặt!')
  })
})