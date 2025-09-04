const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  bookingId: String,
  userId: String,
  userId: String,
  checkinDate: Date,
  checkOutDate: Date,
  paymentStatus: String,
  paymentMethod: String,
  unitPrice: Number,
  paymentDay: Date,
  totalPrice: Number,
})

module.exports = mongoose.model('Booking', bookingSchema)