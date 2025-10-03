const Review = require('../models/review')
const Booking = require('../models/booking')

class ReviewController {
    constructor() {
        this.createReview = this.createReview.bind(this)
        this.getReviewsByRoom = this.getReviewsByRoom.bind(this)
        this.getReviewById = this.getReviewById.bind(this)
        this.updateReview = this.updateReview.bind(this)
        this.deleteReview = this.deleteReview.bind(this)
        this.getRoomAverageRating = this.getRoomAverageRating.bind(this)
    }

    async getAllReviews(req, res) {
        try {
            const reviews = await Review.find().sort({ addedDate: -1 }); // review mới nhất lên trước
            return res.status(200).json({ reviews });
        } catch (err) {
            console.error("Lỗi khi lấy tất cả review:", err);
            return res.status(500).json({ message: "Lỗi server" });
        }
    }

    async getReviewById(req, res) {
        const { reviewId } = req.params;
    
        try {
            const review = await Review.findOne({ reviewId });
    
            if (!review) {
                return res.status(404).json({
                    message: 'Không tìm thấy đánh giá!'
                });
            }
    
            // Lấy thông tin Booking để xác định hotelId, roomId
            const booking = await Booking.findOne({ bookingId: review.bookingId });
            const hotelId = booking?.hotelId || null;
            const roomId = booking?.roomId || null;
    
            let hotelName = "Tên khách sạn";
            let roomName = "Tên phòng";
    
            if (hotelId) {
                const Hotel = require("../models/hotel");
                const hotel = await Hotel.findById(hotelId);
                if (hotel) hotelName = hotel.name || hotel.hotelName || hotelName;
            }
    
            if (roomId) {
                const Room = require("../models/room");
                const room = await Room.findById(roomId);
                if (room) roomName = room.name || room.roomName || roomName;
            }
    
            return res.status(200).json({
                message: 'Lấy đánh giá thành công!',
                review: {
                    reviewId: review.reviewId,
                    bookingId: review.bookingId,
                    userId: review.userId,
                    roomId: review.roomId,
                    content: review.content,
                    rating: review.rating,
                    addedDate: review.addedDate,
                    hotelName,
                    roomName
                }
            });
        } catch (err) {
            console.error("Lỗi khi lấy review theo ID:", err);
            return res.status(500).json({ message: "Lỗi server" });
        }
    }

    // POST /review
    async createReview(req, res) {
        const { userId, roomId, bookingId, content, rating } = req.body

        try {
            if (!userId || !roomId || !bookingId || !rating) {
                return res.status(400).json({ 
                    message: 'Thiếu trường bắt buộc' 
                })
            }

            if (rating < 1 || rating > 5) {
                return res.status(400).json({ 
                    message: 'Đánh giá chỉ từ 1 đến 5' 
                })
            }

            const booking = await Booking.findOne({ 
                bookingId: bookingId, 
                userId: userId 
            })

            if (!booking) {
                return res.status(403).json({ 
                    message: 'Bạn không có quyền đánh giá' 
                })
            }

            const existingReview = await Review.findOne({ bookingId })
            if (existingReview) {
                return res.status(400).json({ 
                    message: 'Bạn đã đánh giá rồi!' 
                })
            }

            const { reviewId }  = await this.generateReviewId(roomId)

            const review = new Review({
                reviewId,
                userId,
                roomId,
                bookingId,
                content,
                rating
            })

            await review.save()

            await Booking.findOneAndUpdate(
                { bookingId: bookingId }, 
                { reviewed: true }
            )

            res.status(201).json({
                message: 'Tạo đánh giá thành công!',
                review: review
            })

        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async generateReviewId(roomId) {
        const now = new Date()
        const year = now.getFullYear()

        const startOfYear = new Date(now.getFullYear(), 0, 1)
        const endOfYear = new Date(now.getFullYear() + 1, 0, 1)

        try {
            const yearlyReviews = await Review.countDocuments({
                roomId: roomId,
                createdAt: {
                    $gte: startOfYear,
                    $lt: endOfYear
                }
            })

            const sequenceNumber = (yearlyReviews + 1).toString().padStart(4, '0')
            return `RV-${year}-${roomId}-${sequenceNumber}`
        } catch (error) {
            const timestamp = Date.now().toString().slice(-6)
            return `RV-${year}-${roomId}-${timestamp}`
        }
    }

    // GET /review/room/:roomId
    async getReviewsByRoom(req, res) {
        const { roomId } = req.params
        const { page = 1, limit = 10 } = req.query

        try {
            const reviews = await Review.find({ roomId })
                .populate('userId', 'fullname')
                .sort({ createdAt: -1 })
                .limit(limit * 1)
                .skip((page - 1) * limit)

            const total = await Review.countDocuments({ roomId })

            if (!reviews || reviews.length === 0) {
                return res.status(404).json({ 
                    message: 'Không tìm thấy đánh giá nào cho phòng này!' 
                })
            }

            res.status(200).json({
                message: 'Lấy danh sách đánh giá thành công!',
                reviews: reviews,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                totalReviews: total
            })

        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    // GET /review/:id
    async getReviewById(req, res) {
        const { reviewId } = req.params

        try {
            const review = await Review.findOne({ reviewId })
                .populate('userId', 'fullname')
                .populate('roomId', 'name')

            if (!review) {
                return res.status(404).json({ 
                    message: 'Không tìm thấy đánh giá!' 
                })
            }

            res.status(200).json({ 
                message: 'Lấy đánh giá thành công!',
                review: review
            })

        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    // PUT /review/:id
    async updateReview(req, res) {
        const { reviewId } = req.params
        const { userId, content, rating } = req.body

        try {
            const review = await Review.findOne({ reviewId })

            if (!review) {
                return res.status(404).json({ 
                    message: 'Không tìm thấy đánh giá!' 
                })
            }

            if (review.userId.toString() !== userId) {
                return res.status(403).json({ 
                    message: 'Bạn chỉ có thể sửa đánh giá của chính mình!' 
                })
            }

            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
            if (review.createdAt < twentyFourHoursAgo) {
                return res.status(400).json({ 
                    message: 'Không thể sửa đánh giá sau 24 giờ!' 
                })
            }

            const updatedReview = await Review.findOneAndUpdate(
                { reviewId: reviewId },
                { 
                    content, 
                    rating,
                    updatedAt: new Date()
                },
                { new: true, runValidators: true }
            )

            res.status(200).json({ 
                message: 'Cập nhật đánh giá thành công!', 
                review: updatedReview 
            })

        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    // DELETE /review/:id
    async deleteReview(req, res) {
        const { reviewId } = req.params
        const { userId, userRole } = req.body

        try {
            const review = await Review.findOne({ reviewId })

            if (!review) {
                return res.status(404).json({ 
                    message: 'Không tìm thấy đánh giá!' 
                })
            }

            if (review.userId.toString() !== userId && userRole !== 'admin') {
                return res.status(403).json({ 
                    message: 'Bạn không có quyền xóa đánh giá này!' 
                })
            }

            await Review.findOneAndDelete({ reviewId: reviewId })

            await Booking.findOneAndUpdate(
                { bookingId: review.bookingId }, 
                { reviewed: false }
            )

            res.status(200).json({ 
                message: 'Xóa đánh giá thành công!' 
            })

        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    // GET /review/room/:roomId/rating
    async getRoomAverageRating(req, res) {
        const { roomId } = req.params

        try {
            const result = await Review.aggregate([
                {
                    $match: { roomId: roomId }
                },
                {
                    $group: {
                        _id: '$roomId',
                        averageRating: { $avg: '$rating' },
                        totalReviews: { $sum: 1 },
                        ratingDistribution: {
                            $push: '$rating'
                        }
                    }
                }
            ])

            if (result.length === 0) {
                return res.status(200).json({
                    message: 'Chưa có đánh giá nào cho phòng này!',
                    averageRating: 0,
                    totalReviews: 0,
                    ratingDistribution: {
                        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
                    }
                })
            }

            const ratingDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            result[0].ratingDistribution.forEach(rating => {
                if (rating >= 1 && rating <= 5) {
                    ratingDist[rating]++
                }
            })

            res.status(200).json({
                message: 'Lấy thông tin rating thành công!',
                averageRating: result[0].averageRating.toFixed(1),
                totalReviews: result[0].totalReviews,
                ratingDistribution: ratingDist
            })

        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }
}

module.exports = new ReviewController()