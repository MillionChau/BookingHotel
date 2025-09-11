const express = require('express')
const favoriteController = require('../controllers/favoriteController')
const router = express.Router()

router.post('/create', favoriteController.createFavorite)
router.delete('/:favoriteId', favoriteController.removeFavorite)
router.get('/check', favoriteController.checkFavorite)
router.get('/user/:userId', favoriteController.getUserFavorites)

module.exports = router
