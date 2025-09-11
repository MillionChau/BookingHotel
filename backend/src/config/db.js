const mongoose = require('mongoose')
require('dotenv').config()

async function connect() {
    try {
        const connectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/my_course'
        
        await mongoose.connect(connectionString)
        
        console.log('Connect MongoDB Successful!')

        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB')
        })
        
        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err)
        })
        
        mongoose.connection.on('disconnected', () => {
            console.warn('Mongoose disconnected from DB')
        })
        
    } catch(err) {
        console.error('MongoDB Connection Error:', err.message)
        process.exit(1)
    }
}

module.exports = { connect }