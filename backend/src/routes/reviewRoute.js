const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController')

router.post('/create', reviewController.createReview)
router.get('/room/:roomId', reviewController.getReviewsByRoom)
router.get('/:reviewId', reviewController.getReviewById)
router.put('/:reviewId', reviewController.updateReview)
router.delete('/:reviewId', reviewController.deleteReview)
router.get('/room/:roomId/rating', reviewController.getRoomAverageRating)

module.exports = router