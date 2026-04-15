const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authcontroller');
const favoritesController = require("../../controllers/favcontroller");
const isAuth = require('../middlewares/middlewares');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', isAuth, authController.me);

router.get("/api/favorites", isAuthenticated, favController.getFavorites);
router.post("/api/favorites/toggle", isAuthenticated, favController.toggleFavorite);

module.exports = router;