const express = require('express')
const roomController = require('../controllers/roomController')
const router = express.Router()

router.get('/occupancy', roomController.occupancyRoom)
router.post('/create', roomController.createRoom)
router.put('/:id', roomController.updateRoom)
router.get('/hotel/:hotelId', roomController.getRoomsByHotel)
router.get('/:id', roomController.getRoomById)
router.delete('/:id', roomController.deleteRoom)

module.exports = router