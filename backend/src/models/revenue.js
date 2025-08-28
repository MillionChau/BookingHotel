const mongoose = require('mongoose')

const revenueSchema = new mongoose.Schema({
  revenueId: String,
  hotelId: String,
  month: Int,
  year: Int,
  totalPrice: Float,
})

module.exports = mongoose.model('Revenue', revenueSchema)