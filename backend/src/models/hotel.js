const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
  hotelId: String,
  name: String,
  address: String,
  description: String,
  manager: String,
  rating: Number,
  imageUrl: String,
  createAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Hotel', hotelSchema)