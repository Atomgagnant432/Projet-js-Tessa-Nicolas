const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const isAuth = require('../middlewares/middlewares');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', isAuth, authController.me);

module.exports = router;