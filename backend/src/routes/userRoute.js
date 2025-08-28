const express = require('express')
const { changeUserPassword, updateUserInfo, getUserInfo, getAllUserInfo } = require('../controllers/userController')
const router = express.Router()

router.patch('/change-password/:userId', changeUserPassword)
router.put('/update-user/:userId', updateUserInfo)
router.get('/user-info/:userId', getUserInfo)
router.get('/all-user', getAllUserInfo)

module.exports = router