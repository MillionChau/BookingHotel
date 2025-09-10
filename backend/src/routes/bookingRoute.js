const express = require('express')
const bookingController = require('../controllers/bookingController')
const router = express.Router()

router.post('/create', bookingController.createBooking)
router.get('/user/:userId', bookingController.getBookingsByUser)
router.put('/:bookingId/payment', bookingController.updatePaymentStatus)
router.get('/:bookingId', bookingController.getBookingById)
router.put('/:bookingId/cancel', bookingController.cancelBooking)
router.get('/', bookingController.getAllBookings)

module.exports = router