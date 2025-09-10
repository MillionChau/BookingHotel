const express = require('express')
const router = express.Router()
const revenueController = require('../controllers/revenueController')

router.get('/hotel/:hotelId', revenueController.getRevenueByHotel)
router.get('/', revenueController.getRevenueByPeriod)

module.exports = router