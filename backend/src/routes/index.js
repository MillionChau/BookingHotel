const express = require('express')
const router = express.Router()

const authRoutes = require('./authRoute')
const userRoutes = require('./userRoute')
const hotelRoutes = require('./hotelRoute')
const bookingRoutes = require('./bookingRoute')
const reviewRoutes = require('./reviewRoute')
const favoriteRoutes = require('./favoriteRoute')
const roomRoutes = require('./roomRoute')

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/hotel', hotelRoutes)
router.use('/booking', bookingRoutes)
router.use('/review', reviewRoutes)
router.use('/favorite', favoriteRoutes)
router.use('/room', roomRoutes)

module.exports = router