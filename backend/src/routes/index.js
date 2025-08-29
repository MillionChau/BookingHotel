const express = require('express')
const router = express.Router()

const authRoutes = require('./authRoute')
const userRoutes = require('./userRoute')
const hotelRoutes = require('./hotelRoute')

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/hotel', hotelRoutes)

module.exports = router