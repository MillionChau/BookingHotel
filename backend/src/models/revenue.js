const mongoose = require('mongoose')

const revenueSchema = new mongoose.Schema({
  revenueId: String,
  hotelId: String,
  month: Number,
  year: Number,
  totalPrice: Number,
})

module.exports = mongoose.model('Revenue', revenueSchema)