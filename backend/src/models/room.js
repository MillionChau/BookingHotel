const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomId: String,
    hotelId: String,
    name: String,
    type: String,
    price: Number,
    rating: { type: Number, default: 0 },
    imageUrl: String,
    status: String,
})

module.exports = mongoose.model('Room', roomSchema)