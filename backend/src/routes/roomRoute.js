const express = require('express')
const roomController = require('../controllers/roomController')
const router = express.Router()

router.post('/rooms', roomController.createRoom)
router.put('/rooms/:id', roomController.updateRoom)
router.get('/rooms/hotel/:hotelId', roomController.getRoomsByHotel)
router.get('/rooms/:id', roomController.getRoomById)
router.delete('/rooms/:id', roomController.deleteRoom)
module.exports = router