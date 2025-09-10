const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  bookingId: String,
  userId: String,
  hotelId: String,
  checkinDate: Date,
  checkOutDate: Date,
  status: String,
  paymentStatus: String,
  paymentMethod: String,
  unitPrice: Number,
  paymentDay: Date,
  totalPrice: Number,
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)