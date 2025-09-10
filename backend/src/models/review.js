const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  reviewId: String,
  roomId: String,
  userId: String,
  bookingId: String,
  content: String,
  rating: String,
  addedDate: Date,
})

module.exports = mongoose.model('Review', reviewSchema)