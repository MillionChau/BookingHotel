const express = require('express')
const router = express.Router()
const revenueController = require('../controllers/revenueController')

router.get('/revenue/hotel/:hotelId', revenueController.getRevenueByHotel)
router.get('/revenue/monthly', revenueController.getMonthlyRevenue)
router.get('/revenue/stats', revenueController.getRevenueStats)
router.get('/revenue/all', revenueController.getAllRevenue)

module.exports = router