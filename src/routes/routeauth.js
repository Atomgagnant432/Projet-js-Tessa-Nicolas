const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authcontroller');
const favController = require("../../controllers/favcontroller");
const movieController = require("../../controllers/moviecontroller");
const isAuth = require('../middlewares/middlewares');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', isAuth, authController.me);

router.get('/tmdb-proxy/:type/:id', isAuth, movieController.getMovieDetails);
router.get("/favorites", isAuth, favController.getFavorites);
router.post("/favorites/toggle", isAuth, favController.toggleFavorite);

module.exports = router;