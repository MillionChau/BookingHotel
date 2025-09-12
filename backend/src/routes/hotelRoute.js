const express = require('express')
const hotelController = require('../controllers/hotelController')
const router = express.Router()

router.get('/all', hotelController.getAllHotel)
router.get('/:hotelId', hotelController.getHotelById)
router.post('/create', hotelController.createHotel)
router.put('/update/:hotelId', hotelController.updateHotel)
router.delete('/delete/:hotelId', hotelController.deleteHotel)

module.exports = router