const reviewController = require('../../controllers/reviewController')
const Review = require('../../models/review')
const Booking = require('../../models/booking')

jest.mock('../../models/review')
jest.mock('../../models/booking')

describe('Review Controller - Unit Test', () => {
    let req, res

    beforeEach(() => {
        req = { body: {}, params: {}, query: {} }
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        jest.clearAllMocks()
    })

    // TC-38: Thêm đánh giá không đủ quyền
    it('TC-38: should return 403 if user has no permission to review', async () => {
        req.body = {
            userId: 'User-0001',
            roomId: 'Room-0001',
            bookingId: 'Booking-0001',
            content: 'This is test content',
            rating: 5
        }

        Booking.findOne.mockResolvedValue(null)

        await reviewController.createReview(req, res)

        expect(Booking.findOne).toHaveBeenCalledWith({
            bookingId: 'Booking-0001',
            userId: 'User-0001'
        })
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringMatching(/không có quyền đánh giá|Bạn không có quyền đánh giá/)
        }))
    })

    // TC-39: Lấy danh sách đánh giá
    it('TC-39: should get reviews by room successfully', async () => {
        const mockReviews = [
            {
                reviewId: 'RV-2024-Room-0001-0001',
                userId: 'User-0001',
                roomId: 'Room-0001',
                bookingId: 'Booking-0001',
                content: 'Great room!',
                rating: 5
            }
        ]

        req.params = { roomId: 'Room-0001' }
        req.query = { page: '1', limit: '10' }

        const mockFind = {
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockResolvedValue(mockReviews)
        }
        
        Review.find.mockReturnValue(mockFind)
        Review.countDocuments.mockResolvedValue(1)

        await reviewController.getReviewsByRoom(req, res)

        expect(Review.find).toHaveBeenCalledWith({ roomId: 'Room-0001' })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringMatching(/Lấy danh sách đánh giá thành công/),
            reviews: expect.any(Array),
            currentPage: 1,
            totalReviews: 1
        }))
    })

    // TC-40: Chỉnh sửa đánh giá thành công
    it('TC-40: should update review successfully', async () => {
        const mockUpdatedReview = {
            reviewId: 'RV-2024-Room-0001-0001',
            userId: 'User-0001',
            roomId: 'Room-0001',
            bookingId: 'Booking-0001',
            content: 'Updated content',
            rating: 5,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }

        const mockExistingReview = {
            reviewId: 'RV-2024-Room-0001-0001',
            userId: 'User-0001',
            roomId: 'Room-0001',
            bookingId: 'Booking-0001',
            content: 'Old content',
            rating: 3,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            toString: () => 'User-0001'
        }

        req.params = { reviewId: 'RV-2024-Room-0001-0001' }
        req.body = {
            userId: 'User-0001',
            content: 'Updated content',
            rating: 5
        }

        Review.findOne.mockResolvedValue(mockExistingReview)
        Review.findOneAndUpdate.mockResolvedValue(mockUpdatedReview)

        await reviewController.updateReview(req, res)

        expect(Review.findOne).toHaveBeenCalledWith({ reviewId: 'RV-2024-Room-0001-0001' })
        expect(Review.findOneAndUpdate).toHaveBeenCalledWith(
            { reviewId: 'RV-2024-Room-0001-0001' },
            { 
                content: 'Updated content', 
                rating: 5,
                updatedAt: expect.any(Date)
            },
            { new: true, runValidators: true }
        )
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringMatching(/Cập nhật đánh giá thành công/),
            review: mockUpdatedReview
        }))
    })

    // TC-41: Chỉnh sửa đánh giá không đủ quyền
    it('TC-41: should return 403 if user has no permission to update review', async () => {
        const mockReview = {
            reviewId: 'RV-2024-Room-0001-0001',
            userId: 'User-0001',
            roomId: 'Room-0001',
            bookingId: 'Booking-0001',
            content: 'Test content',
            rating: 3,
            createdAt: new Date(),
            toString: () => 'User-0001'
        }

        req.params = { reviewId: 'RV-2024-Room-0001-0001' }
        req.body = {
            userId: 'User-0002',
            content: 'Updated content',
            rating: 5
        }

        Review.findOne.mockResolvedValue(mockReview)

        await reviewController.updateReview(req, res)

        expect(Review.findOne).toHaveBeenCalledWith({ reviewId: 'RV-2024-Room-0001-0001' })
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringMatching(/chỉ có thể sửa đánh giá của chính mình/)
        }))
    })

    // TC-42: Xoá đánh giá thành công
    it('TC-42: should delete review successfully', async () => {
        const mockReview = {
            reviewId: 'RV-2024-Room-0001-0001',
            userId: 'User-0001',
            roomId: 'Room-0001',
            bookingId: 'Booking-0001',
            content: 'Test content',
            rating: 5
        }

        req.params = { reviewId: 'RV-2024-Room-0001-0001' }
        req.body = {
            userId: 'User-0001',
            userRole: 'user'
        }

        Review.findOne.mockResolvedValue(mockReview)
        Review.findOneAndDelete.mockResolvedValue(mockReview)
        Booking.findOneAndUpdate.mockResolvedValue({})

        await reviewController.deleteReview(req, res)

        expect(Review.findOne).toHaveBeenCalledWith({ reviewId: 'RV-2024-Room-0001-0001' })
        expect(Review.findOneAndDelete).toHaveBeenCalledWith({ reviewId: 'RV-2024-Room-0001-0001' })
        expect(Booking.findOneAndUpdate).toHaveBeenCalledWith(
            { bookingId: 'Booking-0001' },
            { reviewed: false }
        )
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringMatching(/Xóa đánh giá thành công/)
        }))
    })

    // TC-43: Xoá đánh giá không có quyền
    it('TC-43: should return 403 if user has no permission to delete review', async () => {
        const mockReview = {
            reviewId: 'RV-2024-Room-0001-0001',
            userId: 'User-0001',
            roomId: 'Room-0001',
            bookingId: 'Booking-0001',
            content: 'Test content',
            rating: 5,
            toString: () => 'User-0001'
        }

        req.params = { reviewId: 'RV-2024-Room-0001-0001' }
        req.body = {
            userId: 'User-0002',
            userRole: 'user' 
        }

        Review.findOne.mockResolvedValue(mockReview)

        await reviewController.deleteReview(req, res)

        expect(Review.findOne).toHaveBeenCalledWith({ reviewId: 'RV-2024-Room-0001-0001' })
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringMatching(/không có quyền xóa đánh giá này/)
        }))
    })

    // TC-44: Lấy đánh giá theo phòng
    it('TC-44: should get reviews by room successfully', async () => {
        const mockReviews = [
            {
                reviewId: 'RV-2024-Room-0001-0001',
                userId: 'User-0001',
                roomId: 'Room-0001',
                bookingId: 'Booking-0001',
                content: 'Great room!',
                rating: 5
            }
        ]

        req.params = { roomId: 'Room-0001' }
        req.query = { page: '1', limit: '10' }

        // Mock chain methods properly
        const mockFind = {
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockResolvedValue(mockReviews)
        }
        
        Review.find.mockReturnValue(mockFind)
        Review.countDocuments.mockResolvedValue(1)

        await reviewController.getReviewsByRoom(req, res)

        expect(Review.find).toHaveBeenCalledWith({ roomId: 'Room-0001' })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringMatching(/Lấy danh sách đánh giá thành công/),
            reviews: expect.any(Array),
            currentPage: 1,
            totalReviews: 1
        }))
    })

    // Test case bổ sung: Không thể sửa review sau 24 giờ
    it('should return 400 if trying to update review after 24 hours', async () => {
        const mockReview = {
            reviewId: 'RV-2024-Room-0001-0001',
            userId: 'User-0001',
            roomId: 'Room-0001',
            bookingId: 'Booking-0001',
            content: 'Old content',
            rating: 3,
            createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
            toString: () => 'User-0001'
        }

        req.params = { reviewId: 'RV-2024-Room-0001-0001' }
        req.body = {
            userId: 'User-0001',
            content: 'Updated content',
            rating: 5
        }

        Review.findOne.mockResolvedValue(mockReview)

        await reviewController.updateReview(req, res)

        expect(Review.findOne).toHaveBeenCalledWith({ reviewId: 'RV-2024-Room-0001-0001' })
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringMatching(/Không thể sửa đánh giá sau 24 giờ/)
        }))
    })
})