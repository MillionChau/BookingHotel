const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
  hotelId:String,
  name:String,
  address:String,
  description:String,
  manager:String,
  rating:Int,
  imageUrl:String,
})

module.exports = mongoose.model('Hotel', hotelSchema)