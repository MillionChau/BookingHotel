const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const supertest = require('supertest')
const express = require('express')

const Review = require('../../models/review')
const Booking = require('../../models/booking')
const User = require('../../models/user')
const Room = require('../../models/room')

const reviewRoute = require('../../routes/reviewRoute')

let app, mongoServer, request

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)

    app = express()
    app.use(express.json())
    app.use('/review', reviewRoute)

    request = supertest(app)
})

afterEach(async () => {
    await Review.deleteMany({})
    await Booking.deleteMany({})
    await User.deleteMany({})
    await Room.deleteMany({})
})

afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
})

describe('Review Controller - Integration Test', () => {
    let booking, room, user

    beforeEach(async () => {
        user = await User.create({
            userId: 'User-0001',
            fullname: 'Test User',
            email: 'test@example.com'
        })

        room = await Room.create({
            roomId: 'Room-0001',
            name: 'Deluxe Room',
            type: 'Double',
            price: 1000
        })

        booking = await Booking.create({
            bookingId: 'Booking-0001',
            userId: 'User-0001',
            roomId: 'Room-0001',
            checkIn: new Date(),
            checkOut: new Date(Date.now() + 86400000),
            status: 'confirmed',
            reviewed: false
        })
    })

    it('TC-37: should create review successfully', async () => {
        const res = await request.post('/review/create').send({
            userId: 'User-0001',
            roomId: 'Room-0001',
            bookingId: 'Booking-0001',
            content: 'This is test content',
            rating: 5
        })

        expect(res.statusCode).toBe(201)
        expect(res.body.message).toBe('Tạo đánh giá thành công!')
        
        expect(res.body.review.userId).toBe('User-0001')
        expect(res.body.review.roomId).toBe('Room-0001')
        expect(res.body.review.bookingId).toBe('Booking-0001')
        expect(res.body.review.content).toBe('This is test content')
        expect(res.body.review.rating).toBe(5)

        const savedReview = await Review.findOne({ bookingId: 'Booking-0001' })
        expect(savedReview).toBeTruthy()

        const updatedBooking = await Booking.findOne({ bookingId: 'Booking-0001' })
        if (updatedBooking.reviewed !== undefined) {
            expect(updatedBooking.reviewed).toBe(true)
        }
    })

    // TC-38: Thêm đánh giá không đủ quyền
    it('TC-38: should return 403 if user has no permission to review', async () => {
        const res = await request.post('/review/create').send({
            userId: 'User-0002',
            roomId: 'Room-0001',
            bookingId: 'Booking-0001',
            content: 'This is test content',
            rating: 5
        })

        expect(res.statusCode).toBe(403)
        expect(res.body.message).toBe('Bạn không có quyền đánh giá')
    })


    it('TC-39: should get reviews by room successfully', async () => {
        await Review.create([
            {
                reviewId: 'RV-2024-Room-0001-0001',
                userId: 'User-0001',
                roomId: 'Room-0001',
                bookingId: 'Booking-0001',
                content: 'Great room!',
                rating: 5
            },
            {
                reviewId: 'RV-2024-Room-0001-0002',
                userId: 'User-0001',
                roomId: 'Room-0001',
                bookingId: 'Booking-0002',
                content: 'Excellent service!',
                rating: 4
            }
        ])

        const res = await request.get('/review/room/Room-0001?page=1&limit=10')

        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Lấy danh sách đánh giá thành công!')
        expect(res.body.reviews).toHaveLength(2)
        expect(res.body.totalReviews).toBe(2)
        expect(res.body.currentPage).toBe(1)
        expect(res.body.totalPages).toBe(1)
    })

    // TC-40: Chỉnh sửa đánh giá thành công
    it('TC-40: should update review successfully', async () => {
        const review = await Review.create({
            reviewId: 'RV-2024-Room-0001-0001',
            userId: 'User-0001',
            roomId: 'Room-0001',
            bookingId: 'Booking-0001',
            content: 'Old content',
            rating: 3,
            createdAt: new Date()
        })

        const res = await request.put(`/review/${review.reviewId}`).send({
            userId: 'User-0001',
            content: 'Updated content',
            rating: 5
        })

        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Cập nhật đánh giá thành công!')
        expect(res.body.review.content).toBe('Updated content')
        expect(res.body.review.rating).toBe(5)

        const updatedReview = await Review.findOne({ reviewId: review.reviewId })
        expect(updatedReview.content).toBe('Updated content')
        expect(updatedReview.rating).toBe(5)
    })

    // TC-41: Chỉnh sửa đánh giá không đủ quyền
    it('TC-41: should return 403 if user has no permission to update review', async () => {
        const review = await Review.create({
            reviewId: 'RV-2024-Room-0001-0001',
            userId: 'User-0001',
            roomId: 'Room-0001',
            bookingId: 'Booking-0001',
            content: 'Test content',
            rating: 3,
            createdAt: new Date()
        })

        const res = await request.put(`/review/${review.reviewId}`).send({
            userId: 'User-0002',
            content: 'Updated content',
            rating: 5
        })

        expect(res.statusCode).toBe(403)
        expect(res.body.message).toBe('Bạn chỉ có thể sửa đánh giá của chính mình!')
    })

    // TC-42: Xoá đánh giá thành công
    it('TC-42: should delete review successfully', async () => {
        const review = await Review.create({
            reviewId: 'RV-2024-Room-0001-0001',
            userId: 'User-0001',
            roomId: 'Room-0001',
            bookingId: 'Booking-0001',
            content: 'Test content',
            rating: 5
        })

        const res = await request.delete(`/review/${review.reviewId}`).send({
            userId: 'User-0001',
            userRole: 'user'
        })

        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Xóa đánh giá thành công!')

        const deletedReview = await Review.findOne({ reviewId: review.reviewId })
        expect(deletedReview).toBeNull()

        const updatedBooking = await Booking.findOne({ bookingId: 'Booking-0001' })
        if (updatedBooking.reviewed !== undefined) {
            expect(updatedBooking.reviewed).toBe(false)
        }
    })

    // TC-43: Xoá đánh giá không có quyền
    it('TC-43: should return 403 if user has no permission to delete review', async () => {
        const review = await Review.create({
            reviewId: 'RV-2024-Room-0001-0001',
            userId: 'User-0001',
            roomId: 'Room-0001',
            bookingId: 'Booking-0001',
            content: 'Test content',
            rating: 5
        })

        const res = await request.delete(`/review/${review.reviewId}`).send({
            userId: 'User-0002',
            userRole: 'user'
        })

        expect(res.statusCode).toBe(403)
        expect(res.body.message).toBe('Bạn không có quyền xóa đánh giá này!')

        const existingReview = await Review.findOne({ reviewId: review.reviewId })
        expect(existingReview).toBeTruthy()
    })

    // TC-44: Lấy đánh giá theo phòng
    it('TC-44: should get reviews by room successfully', async () => {
        await Review.create([
            {
                reviewId: 'RV-2024-Room-0001-0001',
                userId: 'User-0001',
                roomId: 'Room-0001',
                bookingId: 'Booking-0001',
                content: 'Great room!',
                rating: 5
            },
            {
                reviewId: 'RV-2024-Room-0001-0002',
                userId: 'User-0001',
                roomId: 'Room-0001', 
                bookingId: 'Booking-0002',
                content: 'Excellent service!',
                rating: 4
            },
            {
                reviewId: 'RV-2024-Room-0002-0001',
                userId: 'User-0001',
                roomId: 'Room-0002',
                bookingId: 'Booking-0003',
                content: 'Another room review',
                rating: 3
            }
        ])

        const res = await request.get('/review/room/Room-0001?page=1&limit=10')

        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Lấy danh sách đánh giá thành công!')
        expect(res.body.reviews).toHaveLength(2)
        expect(res.body.reviews.every(r => r.roomId === 'Room-0001')).toBe(true)
        expect(res.body.totalReviews).toBe(2)
    })

    // Test case bổ sung: Không thể tạo review trùng booking
    it('should return 400 if review already exists for booking', async () => {
        await Review.create({
            reviewId: 'RV-2024-Room-0001-0001',
            userId: 'User-0001',
            roomId: 'Room-0001',
            bookingId: 'Booking-0001',
            content: 'First review',
            rating: 5
        })

        const res = await request.post('/review/create').send({
            userId: 'User-0001',
            roomId: 'Room-0001',
            bookingId: 'Booking-0001',
            content: 'Second review',
            rating: 4
        })

        expect(res.statusCode).toBe(400)
        expect(res.body.message).toBe('Bạn đã đánh giá rồi!')
    })

    // Test case bổ sung: Lấy thông tin rating của phòng
    it('should get room average rating successfully', async () => {
        await Review.create([
            {
                reviewId: 'RV-2024-Room-0001-0001',
                userId: 'User-0001',
                roomId: 'Room-0001',
                bookingId: 'Booking-0001',
                content: 'Great!',
                rating: 5
            },
            {
                reviewId: 'RV-2024-Room-0001-0002',
                userId: 'User-0001',
                roomId: 'Room-0001',
                bookingId: 'Booking-0002',
                content: 'Good!',
                rating: 4
            },
            {
                reviewId: 'RV-2024-Room-0001-0003',
                userId: 'User-0001',
                roomId: 'Room-0001',
                bookingId: 'Booking-0003',
                content: 'Average',
                rating: 3
            }
        ])

        const res = await request.get('/review/room/Room-0001/rating')

        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Lấy thông tin rating thành công!')
        expect(parseFloat(res.body.averageRating)).toBeCloseTo(4.0, 1)
        expect(res.body.totalReviews).toBe(3)
        expect(res.body.ratingDistribution).toEqual({
            1: 0, 2: 0, 3: 1, 4: 1, 5: 1
        })
    })

    // 
    

    // Test case bổ sung: Validation - rating ngoài phạm vi
    it('should return 400 if rating is out of range', async () => {
        const res = await request.post('/review/create').send({
            userId: 'User-0001',
            roomId: 'Room-0001',
            bookingId: 'Booking-0001',
            content: 'Test content',
            rating: 6
        })

        expect(res.statusCode).toBe(400)
        expect(res.body.message).toBe('Đánh giá chỉ từ 1 đến 5')
    })

    // Test case bổ sung: Validation - thiếu trường bắt buộc
    it('should return 400 if missing required fields', async () => {
        const res = await request.post('/review/create').send({
            userId: 'User-0001',
            content: 'Test content'
        })

        expect(res.statusCode).toBe(400)
        expect(res.body.message).toBe('Thiếu trường bắt buộc')
    })

    // Test case bổ sung: Không tìm thấy review khi lấy theo ID
    it('should return 404 if review not found', async () => {
        const res = await request.get('/review/NON_EXISTENT_REVIEW')

        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe('Không tìm thấy đánh giá!')
    })

    // Test case bổ sung: Admin có thể xóa review của người khác
    it('should allow admin to delete any review', async () => {
        const review = await Review.create({
            reviewId: 'RV-2024-Room-0001-0001',
            userId: 'User-0001',
            roomId: 'Room-0001',
            bookingId: 'Booking-0001',
            content: 'Test content',
            rating: 5
        })

        const res = await request.delete(`/review/${review.reviewId}`).send({
            userId: 'User-0002',
            userRole: 'admin'
        })

        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Xóa đánh giá thành công!')

        const deletedReview = await Review.findOne({ reviewId: review.reviewId })
        expect(deletedReview).toBeNull()
    })
})