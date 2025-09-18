const express = require('express')
const roomController = require('../controllers/roomController')
const router = express.Router()

router.get('/all', roomController.getAllRoom)
router.post('/create', roomController.createRoom)
router.put('/:id', roomController.updateRoom)
router.get('/hotel/:hotelId', roomController.getRoomsByHotel)
router.get('/:id', roomController.getRoomById)
router.delete('/:id', roomController.deleteRoom)
router.get('/hotel/:hotelId/occupancy', roomController.getHotelOccupany)
router.get('/hotel/:hotelId/occupied-count', roomController.getOccupiedRoomCount)

module.exports = router