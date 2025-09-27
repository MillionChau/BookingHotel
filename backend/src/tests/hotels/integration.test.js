const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const supertest = require('supertest')
const express = require('express')

const Hotel = require('../../models/hotel')
const hotelController = require('../../controllers/hotelController')

const hotelRoute = require('../../routes/hotelRoute')

let app, mongoServer, request

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)

  app = express()
  app.use(express.json())
  app.use('/hotel', hotelRoute)

  request = supertest(app)
})

afterEach(async () => {
  await Hotel.deleteMany({})
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('Hotel Controller - Integration Test', () => {
  // TC-06: Tạo khách sạn thành công
  it('TC-06: should create hotel successfully', async () => {
    const res = await request.post('/hotel/create').send({
      name: 'Hotel A',
      address: '123-Đường X-Hà Nội',
      description: 'Khách sạn test',
      manager: 'Mr. A'
    })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('hotel')
    expect(res.body.hotel).toHaveProperty('hotelId')
  })

  // TC-07: Thiếu trường dữ liệu
  it('TC-07: should return 400 if missing fields', async () => {
    const res = await request.post('/hotel/create').send({
      name: '',
      address: ''
    })

    expect(res.statusCode).toBe(400)
  })

  // TC-08: Lấy tất cả khách sạn
  it('TC-08: should get all hotels', async () => {
    await Hotel.create({ hotelId: 'HT-2025-0001', name: 'H1', address: '1-A-HN' })

    const res = await request.get('/hotel/all')

    expect(res.statusCode).toBe(200)
    expect(res.body.HotelList.length).toBeGreaterThan(0)
  })

  // TC-09: Lấy khách sạn theo ID
  it('TC-09: should get hotel by id', async () => {
    await Hotel.create({ hotelId: 'HT-2025-0001', name: 'H1', address: '1-A-HN' })

    const res = await request.get('/hotel/HT-2025-0001')

    expect(res.statusCode).toBe(200)
    expect(res.body.hotel.hotelId).toBe('HT-2025-0001')
  })

  // TC-10: Lấy khách sạn không tồn tại
  it('TC-10: should return 404 if hotel not found for deleting', async () => {
    const res = await request.get('/hotel/NOT-FOUND')

    expect(res.statusCode).toBe(404)
    expect(res.body.message).toBe('Không tìm thấy khách sạn!')
  })

  // TC-11: Chỉnh sửa khách sạn
  it('TC-11: should update hotel successfully', async () => {
    await Hotel.create({ hotelId: 'HT-2025-0001', name: 'H1', address: '1-A-HN' })

    const res = await request.put('/hotel/update/HT-2025-0001').send({
      name: 'New Name',
      address: '2-B-HN'
    })

    expect(res.statusCode).toBe(200)
    expect(res.body.message).toMatch(/Chỉnh sửa/)
  })

  // TC-12: Chỉnh sửa khách sạn không tồn tại
  it('TC-12: should return 404 if hotel not found when updating', async () => {
    const res = await request.put('/hotel/delete/NOT-FOUND').send({
      name: 'Name',
      address: 'Addr'
    })

    expect(res.statusCode).toBe(404)
  })

  // TC-13: Xoá khách sạn tồn tại
  it('TC-13: should delete hotel successfully', async () => {
    await Hotel.create({ hotelId: 'HT-2025-0001', name: 'H1', address: '1-A-HN' })

    const res = await request.delete('/hotel/delete/HT-2025-0001')

    expect(res.statusCode).toBe(200)
    expect(res.body.message).toMatch(/Xoá/)
  })

  // TC-14: Xoá khách sạn không tồn tại
  it('TC-14: should return 404 if hotel not found when deleting', async () => {
    const res = await request.delete('/hotel/delete/NOT-FOUND')

    expect(res.statusCode).toBe(404)
  })
})
