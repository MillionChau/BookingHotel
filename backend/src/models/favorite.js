const mongoose = require('mongoose')

const favoriteSchema = new mongoose.Schema({
  hotelId: String,
  userId: String,
  addedDate: Date,
})

module.exports = mongoose.model('Favorite', favoriteSchema)