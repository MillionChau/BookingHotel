const mongoose = require('mongoose')

const reviewidSchema = new mongoose.Schema({
  reviewId: String,
  bookingId: String,
  content: String,
  rating: String,
  addedDate: DateTime,
})

module.exports = mongoose.model('Review', reviewSchema)