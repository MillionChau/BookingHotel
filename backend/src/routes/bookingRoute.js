const express = require('express')
const bookingController = require('../controllers/bookingController')
const router = express.Router()

router.get('/', bookingController.getAllBookings)
router.post('/create', bookingController.createBooking)
router.get('/user/:userId', bookingController.getBookingsByUser)
router.put('/:bookingId/payment', bookingController.updatePaymentStatus)
router.get('/:bookingId', bookingController.getBookingById)
router.patch('/:bookingId/cancel', bookingController.cancelBooking)

module.exports = router