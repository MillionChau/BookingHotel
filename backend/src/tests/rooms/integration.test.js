const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const supertest = require('supertest')
const express = require('express')

const Room = require('../../models/room')
const Hotel = require('../../models/hotel')
const roomController = require('../../controllers/roomController')

const roomRoute = require('../../routes/roomRoute')

let app, mongoServer, request

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)

    app = express()
    app.use(express.json())
    app.use('/room', roomRoute)

    request = supertest(app)
})

afterEach(async () => {
    await Room.deleteMany({})
})

afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
})

describe('Room Controller - Integration Test', () => {
    let hotel

    beforeEach(async () => {
        hotel = await Hotel.create({
            hotelId: 'HTDC-2025-0001',
            name: 'Test Hotel',
            address: '123 Street - Duc Thang - Ha Noi'
        })
    })
    // TC-15: Thêm phòng thành công
    it('TC-15: should create room successfully', async () => {
        const res = await request.post('/room/create').send({
            hotelId: 'HTDC-2025-0001',
            name: 'Deluxe',
            type: 'Double',
            price: 1000,
            status: 'available',
            imageUrl: 'img.jpg',
        })

        expect(res.statusCode).toBe(201)
        expect(res.body).toHaveProperty('room')
        expect(res.body.room).toHaveProperty('roomId')
    })

    // TC-16: Thêm phòng thiếu trường
    it('TC-16: should return 400 if missing fields', async () => {
        const res = await request.post('/room/create').send({
            hotelId: 'HTDC-2025-0001',
            name: '',
            type: 'Double',
            price: 1000,
        })

        expect(res.statusCode).toBe(400)
    })

    // TC-17: Thêm phòng khách sạn không tồn tại
    it('TC-17: should return 404 if hotel not found when create room', async () => {
        const res = await request.post('/room/create').send({
            hotelId: 'NOT-FOUND',
            name: 'Deluxe',
            type: 'Double',
            price: 1000
        })

        expect(res.statusCode).toBe(404)
    })

    // TC-18: Lấy danh sách tất cả các phòng
    it('TC-18: should get all rooms', async () => {
        await Room.create({
            hotelId: 'HTDC-2025-0001',
            name: 'Deluxe',
            type: 'Double',
            price: 1000,
            status: 'available',
            imageUrl: 'img.jpg',
        })

        await Room.create({
            hotelId: 'HTDC-2025-0001',
            name: 'Deluxe 2',
            type: 'Double',
            price: 1000,
            status: 'available',
            imageUrl: 'img.jpg',
        })

        await Room.create({
            hotelId: 'HTDC-2025-0001',
            name: 'Deluxe 3',
            type: 'Double',
            price: 1000,
            status: 'available',
            imageUrl: 'img.jpg',
        })

        const res = await request.get('/room/all')

        expect(res.statusCode).toBe(200)
        expect(res.body.rooms.length).toBeGreaterThan(2)
    })

    // TC-19: Lấy danh sách phòng theo khách sạn
    it('TC-19: should get room by hotel', async () => {
        await Room.create({
            hotelId: 'HTDC-2025-0001',
            name: 'Deluxe',
            type: 'Double',
            price: 1000,
            status: 'available',
            imageUrl: 'img.jpg',
        })

        await Room.create({
            hotelId: 'HTDC-2025-0001',
            name: 'Deluxe 2',
            type: 'Double',
            price: 1000,
            status: 'available',
            imageUrl: 'img.jpg',
        })

        await Room.create({
            hotelId: 'HTDC-2025-0002',
            name: 'Deluxe 3',
            type: 'Double',
            price: 1000,
            status: 'available',
            imageUrl: 'img.jpg',
        })

        const res = await request.get('/room/hotel/HTDC-2025-0001')

        expect(res.statusCode).toBe(200)
        expect(res.body.rooms).toHaveLength(2)
        expect(res.body.rooms.every(r => r.hotelId === 'HTDC-2025-0001')).toBe(true)
    })

    // TC-19: Lấy phòng theo id
    it('TC-19: should get room by id', async () => {
        await Room.create({
            roomId: 'HTDC-2025-0002-Deluxe',
            hotelId: 'HTDC-2025-0002',
            name: 'Deluxe',
            type: 'Double',
            price: 1000,
            status: 'available',
            imageUrl: 'img.jpg',
        })

        const res = await request.get('/room/HTDC-2025-0002-Deluxe')

        expect(res.statusCode).toBe(200)
        expect(res.body.room.roomId).toBe('HTDC-2025-0002-Deluxe')
    })
    
    // TC-21: Xoá phòng tồn tại
    it('TC-21: should delete room successfully', async () => {
        await Room.create({
            roomId: 'HTDC-2025-0002-Deluxe',
            hotelId: 'HTDC-2025-0002',
            name: 'Deluxe',
            type: 'Double',
            price: 1000,
            status: 'available',
            imageUrl: 'img.jpg',
        })

        const res = await request.delete('/room/delete/HTDC-2025-0002-Deluxe')

        expect(res.statusCode).toBe(200)
        expect(res.body.message).toMatch(/Xoá/)
    })

    // TC-22: Xoá phòng không tồn tại
    it('TC-22: should return 404 if room not found for deleting', async () => {
        const res = await request.delete('/room/delete/NOT-FOUND')

        expect(res.statusCode).toBe(404)
        expect(res.body.message).toMatch(/Không tìm thấy phòng/)
    })

    // TC-23: Chỉnh sửa phòng thành công
    it('TC-23: should update room successfully', async () => {
        await Room.create({
            roomId: 'HTDC-2025-0002-Deluxe',
            hotelId: 'HTDC-2025-0002',
            name: 'Deluxe',
            type: 'Double',
            price: 1000,
            status: 'available',
            imageUrl: 'img.jpg',
        })

        const res = await request.put('/room/update/HTDC-2025-0002-Deluxe').send({
            name: 'Deluxe 2',
            type: 'Triple',

        })

        expect(res.statusCode).toBe(200)
        expect(res.body.message).toMatch(/(?=.*Cập nhật)(?=.*thành công)/)
        expect(res.body.room.name).toBe('Deluxe 2')
        expect(res.body.room.type).toBe('Triple')
    })
})