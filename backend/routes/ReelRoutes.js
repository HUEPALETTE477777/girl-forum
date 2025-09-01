const express = require('express');
const router = express.Router();

const upload = require("../middleware/Multer.js")

const {
    createReel,
    getAllReels,
    getReel
} = require("../controllers/ReelController")

// SUPER HANDY GET USER FROM TOKEN
const getUserFromToken = require('../middleware/AuthMiddleware.js');

router.get('/', getUserFromToken, getAllReels);
router.get('/video/:id', getUserFromToken, getReel);

router.post('/create', getUserFromToken, upload.single("video"), createReel);

module.exports = router;