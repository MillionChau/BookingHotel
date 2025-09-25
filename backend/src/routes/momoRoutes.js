const express = require('express');
const router = express.Router();
const momoController = require('../controllers/momoController');

router.post('/create', momoController.createPayment);
router.post('/callback', momoController.handleCallback);

module.exports = router;
