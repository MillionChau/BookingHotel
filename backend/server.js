require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const allRoutes = require('./src/routes/index')
const db = require('./src/config/db')
const app = express()
require('./src/services/roomScheduler')
const momoRoutes = require('./src/routes/momoRoutes');
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

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

const { register } = require('./src/config/metrics');

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

app.use('/api', allRoutes)

const port = process.env.PORT || 5000
const server = process.env.NODE_ENV !== 'test' 
  ? app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on http://0.0.0.0:${port}`)
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