const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  bookingId: String,
  userId: String,
  userId: String,
  checkinDate: DateTime,
  checkOutDate: DateTime,
  status: String,
  paymentStatus: String,
  paymentMethod: String,
  unitPrice: Number,
  paymentDay: DateTime,
  totalPrice: Number,
})

module.exports = mongoose.model('Booking', bookingSchema)