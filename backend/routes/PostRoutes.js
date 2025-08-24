const express = require('express');
const router = express.Router();

const upload = require("../middleware/Multer.js")

const {
    getAllPosts,
    createPost,
    deleteAllPosts,
    getPostById,
    updatePostById,
    deletePostById,
    getAllPostsForUser,
} = require("../controllers/PostController")

// SUPER HANDY GET USER FROM TOKEN
const getUserFromToken = require('../middleware/AuthMiddleware.js');

router.get('/', getAllPosts)
router.get('/:id', getPostById)
router.get('/user/:id', getUserFromToken, getAllPostsForUser)

router.post('/', getUserFromToken, upload.single("image"), createPost);

router.delete('/delete', getUserFromToken, deleteAllPosts);
router.delete('/:id', getUserFromToken, deletePostById);

router.patch('/:id', getUserFromToken, upload.single("image"), updatePostById);

module.exports = router;




