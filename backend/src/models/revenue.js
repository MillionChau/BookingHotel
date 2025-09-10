const mongoose = require('mongoose')

const revenueSchema = new mongoose.Schema({
  revenueId: String,
  hotelId: String,
  month: Number,
  year: Number,
  totalPrice: Number,
})

revenueSchema.index({ hotelId: 1, month: 1, year: 1 }, { unique: true })

module.exports = mongoose.model('Revenue', revenueSchema)