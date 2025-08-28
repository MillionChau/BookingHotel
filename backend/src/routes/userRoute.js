const express = require('express')
const { changeUserPassword, updateUserInfo } = require('../controllers/userController')
const router = express.Router()

router.patch('/change-password/:userId', changeUserPassword)
router.put('/update-user/:userId', updateUserInfo)

module.exports = router