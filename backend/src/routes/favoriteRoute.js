const express = require('express')
const favoriteController = require('../controllers/favoriteController')
const router = express.Router()

router.post('/favorites', favoriteController.createFavorite)
router.delete('/favorites/:favoriteId', favoriteController.removeFavorite)
router.get('/favorites/user/:userId', favoriteController.getUserFavorites)
router.get('/favorites/check', favoriteController.checkFavorite)
module.exports = router
