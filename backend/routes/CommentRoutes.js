const express = require('express');
const router = express.Router();

const upload = require("../middleware/Multer.js")

const {
    getAllCommentsForUser,
    createCommentUnderPost,
    createReplyToComment,
    getAllCommentsUnderPost,
    getAllRepliesUnderComment,
    editCommentUnderPost,
} = require("../controllers/CommentController.js")

// SUPER HANDY GET USER FROM TOKEN, ALL RELY ON USER
const getUserFromToken = require('../middleware/AuthMiddleware.js'); 

router.get("/", getUserFromToken, getAllCommentsForUser);
router.get("/post/:id", getUserFromToken, getAllCommentsUnderPost);
router.get("/:commentId/reply", getUserFromToken, upload.single("image"), getAllRepliesUnderComment);

router.post("/post/:id", getUserFromToken, upload.single("image"), createCommentUnderPost)
router.post("/:commentId/reply", getUserFromToken, upload.single("image"), createReplyToComment);

router.patch("/:commentId/edit", getUserFromToken, upload.single("image"), editCommentUnderPost);

module.exports = router;