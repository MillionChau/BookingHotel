const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()

router.patch('/change-password/:userId', userController.changeUserPassword)
router.put('/update-user/:userId', userController.updateUserInfo)
router.get('/user-info/:userId', userController.getUserInfo)
router.get('/all-user', userController.getAllUserInfo)

module.exports = router