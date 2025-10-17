const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()

router.get('/all-user', userController.getAllUserInfo)
router.patch('/change-password/:userId', userController.changeUserPassword)
router.put('/update-user/:userId', userController.updateUserInfo)
router.get('/user-info/:userId', userController.getUserInfo)
router.delete('/delete/:userId', userController.deleteUser)

module.exports = router