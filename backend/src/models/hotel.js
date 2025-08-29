const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
  hotelId: String,
  name: String,
  address: String,
  description: String,
  manager: String,
  rating: Number,
  imageUrl: String,
})

module.exports = mongoose.model('Hotel', hotelSchema)