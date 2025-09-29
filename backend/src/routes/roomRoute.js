const express = require('express')
const roomController = require('../controllers/roomController')
const { route } = require('./authRoute')
const router = express.Router()

router.post('/create', roomController.createRoom)
router.put('/update/:roomId', roomController.updateRoom)
router.get('/all', roomController.getAllRoom)
router.get('/hotel/:hotelId', roomController.getRoomsByHotel)
router.get('/:roomId', roomController.getRoomById)
router.delete('/delete/:roomId', roomController.deleteRoom)
router.get('/hotel/:hotelId/occupancy', roomController.getHotelOccupany)
router.get('/hotel/:hotelId/occupied-count', roomController.getOccupiedRoomCount)

module.exports = router