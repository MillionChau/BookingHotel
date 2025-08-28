const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
roomId:String,
hotelId:String,
name:String,
type:String,
price:Float,
imageUrl:String,
status:String,
})

module.exports = mongoose.model('Room', roomSchema)