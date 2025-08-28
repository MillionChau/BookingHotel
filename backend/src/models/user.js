const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userId: String,
    fullname: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    role: {type: String, default: 'Customer'},
    createAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('User', userSchema)