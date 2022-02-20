const express = require('express');
const router = express.Router();

const { login, signup, protect, me } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, me);

module.exports = router;
