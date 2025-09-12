require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const allRoutes = require('./src/routes/index')
const db = require('./src/config/db')
const app = express()
require('./services/roomScheduler')

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

db.connect().then(() => {
  console.log('Database connection established')
}).catch(err => {
  console.error('Database connection failed:', err.message)
  process.exit(1)
})

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    database: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
    timestamp: new Date().toISOString()
  })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

app.use('', allRoutes)

const port = process.env.PORT || 5000
const server = process.env.NODE_ENV !== 'test' 
  ? app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  : null

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')
  server?.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed')
      process.exit(0)
    })
  })
})

module.exports = { app, server }