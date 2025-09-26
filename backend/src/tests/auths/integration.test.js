const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const supertest = require('supertest')
const express = require('express')

const authRoute = require('../../routes/authRoute')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')

let app, mongoServer, request

beforeAll(async () => {
    process.env.JWT_SECRET = 'testsecret'
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)

    app = express()
    app.use(express.json())
    app.use('/auth', authRoute)

    request = supertest(app)
})

afterEach(async () => {
    await User.deleteMany()
})

afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
})

describe('Auth Controller', () => {
    // TC-01: Đăng nhập thành công với vai trò Customer
    it('TC-01: should login successfully as Customer', async () => {
        const password = await bcrypt.hash('123456', 12)
        await User.create({
            userId: 'CT-2025-0000000001',
            fullname: 'Test User',
            email: 'test@gmail.com',
            password,
            role: 'Customer'
        })

        const res = await request.post('/auth/login').send({
            email: 'test@gmail.com',
            password: '123456'
        })

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('token')
        expect(res.body.user.role).toBe('Customer')
    })

    // TC-02: Đăng nhập thành công với vai trò Admin
    it('TC-02: should login successfully as Admin', async () => {
        const password = await bcrypt.hash('admin123', 12)
        await User.create({
            userId: 'AD-2025-0000000001',
            fullname: 'Admin User',
            email: 'test@gmail.com',
            password,
            role: 'Admin'
        })

        const res = await request.post('/auth/login').send({
            email: 'test@gmail.com',
            password: 'admin123'
        })

        expect(res.statusCode).toBe(200)
        expect(res.body.user.role).toBe('Admin')
    })

    // TC-03: Thiếu trường dữ liệu
    it('TC-03: should return 400 if missing fields', async () => {
        const res = await request.post('/auth/register').send({
            email: '',
            password: ''
        })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('message')
    })

    // TC-04: Email không tồn tại
    it('TC-04: should return 404 if user not found', async () => {
        const res = await request.post('/auth/login').send({
            email: 'notfound@example.com',
            password: '123456'
        })
        expect(res.statusCode).toBe(404)
        expect(res.body.message).toMatch(/Không tìm thấy/)
    })

    // TC-05: Mật khẩu sai
    it('TC-05: should return 401 if password is wrong', async () => {
        const password = await bcrypt.hash('correctpass', 12)
        await User.create({
            userId: 'CT-2025-0000000002',
            fullname: 'Wrong Pass',
            email: 'test@gmail.com',
            password,
            role: 'Customer'
        })

        const res = await request.post('/auth/login').send({
            email: 'test@gmail.com',
            password: 'wrongpass123'
        })

        expect(res.statusCode).toBe(401)
        expect(res.body.message).toMatch(/Mật khẩu không đúng/)
    })
})
