const express = require('express')
const router = express.Router()
const revenueController = require('../controllers/revenueController')

router.get('/hotel/:hotelId', revenueController.getRevenueByHotel)
router.get('/monthly', revenueController.getMonthlyRevenue)
router.get('/stats', revenueController.getRevenueStats)
router.get('/all', revenueController.getAllRevenue)

module.exports = router