const Comment = require("../models/CommentSchema")
const Post = require("../models/PostSchema")
const User = require("../models/UserSchema")

const CLOUDINARY_UPLOAD = require("../config/cloudinary")

// GET /api/comment/
const getAllComments = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "IMMIGRANT YOU MUST BE LOGGED IN!" });
        }

        const allComments = await Comment.find({});

        res.status(200).json({ comments: allComments })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err });
    }
}

// GET /api/comment/users/:id
const getAllCommentsForUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "IMMIGRANT YOU MUST BE LOGGED IN!" });
        }

        const id = req.params.id;
        const user = await User.findOne({ user_id: id });

        if (!user) {
            return res.status(404).json({ message: "USER NOT FOUND!" });
        }

        const targetUserComments = await Comment.find({ 'commenter.user_id': id });

        // USE A SET TO STORE THE DIFFERENT POSTS 
        // NOW WE ONLY FETCH THOSE AMOUNT OF POSTS 
        const uniquePostIds = [...new Set(targetUserComments.map(comment => comment.post.toString()))];
        const posts = await Post.find({ _id: { $in: uniquePostIds } });

        const postMap = {};
        posts.forEach(post => {
            postMap[post._id.toString()] = post;
        });

        const groupedComments = {};

        targetUserComments.forEach(comment => {
            const postId = comment.post.toString();

            if (!groupedComments[postId]) {
                groupedComments[postId] = {
                    post: postMap[postId],
                    comments: []
                };
            }
            groupedComments[postId].comments.push({
                _id: comment._id,
                user_id: comment.commenter.user_id,
                username: comment.commenter.username,
                avatar: comment.commenter.avatar,
                comment: comment.comment,
                comment_id: comment.comment_id,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                image: comment.image || null
            });
        });

        const groupedArray = Object.values(groupedComments);

        return res.status(200).json({
            message: "SUCCESSFULLY GOT ALL COMMENTS FOR TARGET USER!",
            comments: groupedArray,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err });
    }

}


// POST /api/comment/post/:id
const createCommentUnderPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const postObject = await Post.findOne({ post_id: postId })

        let extractedImageURL;

        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cloudRes = await CLOUDINARY_UPLOAD(dataURI);
            extractedImageURL = cloudRes?.url;
        }

        const payload = {
            post: postObject._id,
            commenter: { user_id: req.user.user_id, username: req.user.username, avatar: req.user.avatar },
            image: extractedImageURL,
            comment: req.body.comment,
        }

        const newComment = await new Comment(payload).save();

        newComment.parentComment = newComment._id;
        await newComment.save();

        res.status(200).json({ message: "SUCCESSFULLY MADE COMMENT! ", comment: newComment })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err });
    }
}

// POST /api/comment/:commentId/reply
const createReplyToComment = async (req, res) => {
    try {
        const parentCommentId = req.params.commentId;

        if (!parentCommentId) {
            return res.status(404).json({ message: "COMMENT DOES NOT EXIST CUNT!" })
        }

        const parentComment = await Comment.findOne({ comment_id: Number(parentCommentId) })
        const parentCommentOID = parentComment._id;

        let extractedImageURL;

        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cloudRes = await CLOUDINARY_UPLOAD(dataURI);
            extractedImageURL = cloudRes?.url;
        }

        const payload = {
            post: parentComment.post,
            commenter: { user_id: req.user.user_id, username: req.user.username, avatar: req.user?.avatar },
            parentComment: parentCommentOID,
            image: extractedImageURL,
            comment: req.body.comment,
        }

        const newComment = new Comment(payload);
        await newComment.save();

        res.status(200).json({
            message: "SUCCESSFULLY REPLIED TO A COMMENT!!",
            comment: newComment,
        })

    } catch (err) {
        console.error(err);
    }
}

// PATCH /api/comment/:commentId/edit
const editCommentUnderPost = async (req, res) => {
    try {
        const commentId = req.params.commentId;

        let extractedImageURL;

        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cloudRes = await CLOUDINARY_UPLOAD(dataURI);
            extractedImageURL = cloudRes?.url;
        }

        const comment = await Comment.findOneAndUpdate(
            {
                $and: [
                    { "comment_id": Number(commentId) },
                    { "commenter.user_id": req.user.user_id },
                ]
            },
            {
                $set: {
                    comment: req.body.comment,
                    image: extractedImageURL,
                }
            },
            { new: true },
        );

        if (!comment) {
            return res.status(404).json({ message: "WHERE IS UR COMMENT IMMIGRANT! " })
        }

        res.status(200).json({
            message: "SUCCESSFULLY UPDATED COMMENT!",
            updatedComment: comment,
        })


    } catch (err) {
        console.error(err);
    }
}


// GET /api/comment/:commentId/reply
const getAllRepliesUnderComment = async (req, res) => {
    try {
        const parentCommentId = parseInt(req.params.commentId);

        if (!parentCommentId) {
            return res.status(400).json({ message: "WHERE IS YOUR COMMENT ID" });
        }

        const parentComment = await Comment.findOne({ comment_id: parentCommentId });

        if (!parentComment) {
            return res.status(404).json({ message: "COMMENT NOT FOUND!" });
        }

        const parentCommentOID = parentComment._id;

        const replies = await Comment.find({
            parentComment: parentCommentOID,
            _id: { $ne: parentCommentOID }
        });

        res.status(200).json({
            message: "SUCCESSFULLY RETRIEVED ALL REPLIES TO COMMENT",
            parent: parentComment,
            replies: replies
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err });
    }
};

// GET /api/comment/post/:id
const getAllCommentsUnderPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const postObject = await Post.findOne({ post_id: postId });

        const allCommentsUnderPost = await Comment.find({ post: postObject });

        res.status(200).json({
            message: "SUCCESSFULLY RETRIEVED ALL COMMENTS UNDER POST",
            post: postObject,
            comments: allCommentsUnderPost,
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err });
    }
}


module.exports = {
    getAllComments,
    createCommentUnderPost,
    createReplyToComment,
    getAllCommentsUnderPost,
    getAllRepliesUnderComment,
    editCommentUnderPost,
    getAllCommentsForUser,
};