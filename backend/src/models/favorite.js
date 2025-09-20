const mongoose = require('mongoose')

const favoriteSchema = new mongoose.Schema({
  hotelId: String,
  userId: String,
  addedDate: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Favorite', favoriteSchema)