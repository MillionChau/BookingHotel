const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const supertest = require('supertest')
const express = require('express')
const bcrypt = require('bcryptjs')

const User = require('../../models/user')
const userController = require('../../controllers/userController')

const userRoute = require('../../routes/userRoute')

let app, mongoServer, request

beforeAll(async () => {
    jest.setTimeout(30000);

    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)

    app = express()
    app.use(express.json())
    app.use('/user', userRoute)

    request = supertest(app)
}, 30000)

afterEach(async () => {
    await User.deleteMany({})
})

afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
})

describe('User Controller - Integration Test', () => {
    // TC-31: Lấy danh sách tất cả người dùng
    it('TC-31: should get all user successfully', async () => {
        const userData = [
            {
                userId: "US-2025-0001",
                fullname: "Nguyễn Văn An",
                email: "nguyenvanan@example.com",
                password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjz87jmTqYne",
                phone: "0912345678",
                address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
                role: "Customer",
                createAt: new Date("2024-01-15T08:30:00Z")
            },
            {
                userId: "US-2025-0002",
                fullname: "Trần Thị Bình",
                email: "tranthibinh@example.com",
                password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjz87jmTqYne",
                phone: "0923456789",
                address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
                role: "Admin",
                createAt: new Date("2024-01-16T09:15:00Z")
            }
        ]

        await User.insertMany(userData)

        const res = await request.get('/user/all-user')

        expect(res.statusCode).toBe(200)
        expect(res.body.users).toHaveLength(2)
        expect(res.body.message).toBe('Lấy danh sách người dùng thành công!')
    })

    // TC-32: Đổi mật khẩu thành công
    it('TC-32: should change password successfully', async () => {
        const hashedPassword = await bcrypt.hash('oldPassword123', 12)
        await User.create({
            userId: 'US-2025-0001',
            fullname: 'Nguyễn Văn A',
            email: 'a@example.com',
            password: hashedPassword,
            phone: '0912345678',
            address: '123 ABC',
            role: 'Customer'
        })

        const res = await request.patch('/user/change-password/US-2025-0001').send({
            password: 'oldPassword123',
            newPassword: 'newPassword123',
            validPassword: 'newPassword123'
        })

        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Cập nhật mật khẩu thành công!')
    })

    // TC-33: Đổi mật khẩu thất bại - mật khẩu hiện tại sai
    it('TC-33: should return 401 if current password is wrong', async () => {
        const hashedPassword = await bcrypt.hash('correctPassword', 12)
        await User.create({
            userId: 'US-2025-0001',
            fullname: 'Nguyễn Văn A',
            email: 'a@example.com',
            password: hashedPassword,
            phone: '0912345678',
            address: '123 ABC',
            role: 'Customer'
        })

        const res = await request.patch('/user/change-password/US-2025-0001').send({
            password: 'wrongPassword',
            newPassword: 'newPassword123',
            validPassword: 'newPassword123'
        })

        expect(res.statusCode).toBe(401)
        expect(res.body.message).toBe('Mật khẩu không đúng!')
    })

    // TC-34: Cập nhật thông tin người dùng thành công
    it('TC-34: should update user info successfully', async () => {
        await User.create({
            userId: 'US-2025-0001',
            fullname: 'Old Name',
            email: 'old@example.com',
            password: await bcrypt.hash('password123', 12),
            phone: '0000000000',
            address: 'Old Address',
            role: 'Customer'
        })

        const res = await request.put('/user/update-user/US-2025-0001').send({
            fullname: 'Nguyễn Văn A Updated',
            email: 'updated@example.com',
            phone: '0987654321',
            address: '123 Updated Address, Hanoi'
        })

        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Thay đổi thông tin thành công!')

        const updatedUser = await User.findOne({ userId: 'US-2025-0001' })
        expect(updatedUser.fullname).toBe('Nguyễn Văn A Updated')
        expect(updatedUser.email).toBe('updated@example.com')
    })

    // TC-35: Cập nhật thông tin người dùng không tồn tại
    it('TC-35: should return 404 if user not found when updating', async () => {
        const res = await request.put('/user/update-user/NOT-FOUND').send({
            fullname: 'New Name',
            email: 'new@example.com'
        })

        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe('Không tìm thấy người dùng!')
    })

    // TC-36: Lấy thông tin người dùng thành công
    it('TC-36: should get user info successfully', async () => {
        await User.create({
            userId: 'US-2025-0001',
            fullname: 'Nguyễn Văn A',
            email: 'a@example.com',
            password: await bcrypt.hash('password123', 12),
            phone: '0123456789',
            address: '123 Đường ABC',
            role: 'Customer'
        })

        const res = await request.get('/user/user-info/US-2025-0001')

        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Lấy thành công thông tin user')
        expect(res.body.user.userId).toBe('US-2025-0001')
        expect(res.body.user.fullname).toBe('Nguyễn Văn A')
    })

    // Lấy thông tin người dùng không tồn tại
    it('should return 404 if user not found when getting info', async () => {
        const res = await request.get('/user/user-info/NOT-FOUND')

        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe('Người dùng không tồn tại!')
    })

    // Không có người dùng nào
    it('should return 404 if no users found', async () => {
        const res = await request.get('/user/all-user')

        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe('Không có người dùng')
    })

    // TC-33: Đổi mật khẩu với mật khẩu mới không khớp
    it('TC-33: should return 401 if new passwords do not match', async () => {
        const hashedPassword = await bcrypt.hash('oldPassword123', 12)
        await User.create({
            userId: 'US-2025-0001',
            fullname: 'Nguyễn Văn A',
            email: 'a@example.com',
            password: hashedPassword,
            phone: '0912345678',
            address: '123 ABC',
            role: 'Customer'
        })

        const res = await request.patch('/user/change-password/US-2025-0001').send({
            password: 'oldPassword123',
            newPassword: 'newPassword123',
            validPassword: 'differentPassword'
        })

        expect(res.statusCode).toBe(401)
        expect(res.body.message).toBe('Mật khẩu không trùng nhau!')
    })
})