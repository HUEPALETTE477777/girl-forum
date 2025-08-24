const Post = require("../models/PostSchema");
const Comment = require("../models/CommentSchema");
const User = require("../models/UserSchema")

const sanitizeHtml = require('sanitize-html');

const CLOUDINARY_UPLOAD = require("../config/cloudinary")

// GET /api/posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}

// GET /api/posts/user/:id
const getAllPostsForUser = async (req, res) => {
    try {
        const id = req.params.id;
        const targetUser = await User.findOne({ user_id : id });

        if (!targetUser) {
            return res.status(404).json({ message: "CRIMINAL NO USER FOUND!"});
        }

        const targetUserPosts = await Post.find({ 
            'author.user_id': targetUser.user_id,
        });

        res.status(200).json({ message: "SUCCESSFULLY RETRIEVED POSTS", posts: targetUserPosts});

    } catch (err) {
        console.error(err);
    }
}

// POST /api/posts
const createPost = async (req, res) => {
    try {
        const sanitizedContent = sanitizeHtml(req.body.content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(
                [
                    'div',
                    'span',
                    'p',
                    'h1',
                    'h2',
                    'h3',
                    'pre',
                    'ul',
                    'ol',
                    'blockquote',
                ]
            ),
            allowedAttributes: {
                a: ['href', 'target'],
                img: ['src', 'alt'],
            },
            allowedSchemes: ['http', 'https', 'mailto'],
        });

        let extractedImageURL;

        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cloudRes = await CLOUDINARY_UPLOAD(dataURI);
            extractedImageURL = cloudRes?.url;
        }

        const postObj = new Post({
            author: { user_id: req.user.user_id, username: req.user.username, avatar: req.user.avatar },
            title: req.body.title,
            content: sanitizedContent,
            image: extractedImageURL,
        })

        let newPost = await postObj.save();
        res.status(200).json({ post: newPost });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}

// DELETE /api/posts/delete
const deleteAllPosts = async (req, res) => {
    try {
        const posts = await Post.deleteMany({});
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
    }
}

// GET /api/posts/:id
const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.find({ post_id: postId });
        res.status(200).json({ message: "SUCCESSFULLY RETRIEVED POST!", post: [...post] })
    } catch (err) {
        console.error(err);
    }
}

// PATCH /api/posts/:id
const updatePostById = async (req, res) => {
    try {
        const postId = req.params.id;

        let extractedImageURL;

        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cloudRes = await CLOUDINARY_UPLOAD(dataURI);
            extractedImageURL = cloudRes?.url;
        }

        const post = await Post.findOneAndUpdate(
            {
                $and: [
                    { "post_id": postId },
                    { "author.user_id": req.user.user_id },
                ]
            },
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    image: extractedImageURL,
                }
            },
            { new: true },
        );


        if (!post) {
            return res.status(404).json({ message: "CANNOT EDIT POST! NO PERMISSION OR NOT FOUND" })
        }

        res.status(200).json({
            message: "SUCCESSFULLY UPDATED POST!",
            updatedPost: post,
        })

    } catch (err) {
        console.error(err);
    }
}

// DELETE /api/posts/:id
const deletePostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findOneAndDelete({ post_id: postId });

        if (!post) {
            return res.status(404).json({ message: "POST NOT FOUND LA MIGRA!" });
        }

        await Comment.deleteMany({ post: post });

        return res.status(200).json({ message: "SUCCESSFULLY DELETED POST!"});
    } catch (err) {
        console.error(err);
    }
}


module.exports = {
    getAllPosts,
    createPost,
    deleteAllPosts,
    getPostById,
    updatePostById,
    deletePostById,
    getAllPostsForUser,
}