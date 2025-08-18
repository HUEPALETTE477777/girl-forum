const User = require('../models/UserSchema');
const Post = require("../models/PostSchema")
const bcrypt = require('bcrypt')

const GENERATE_JWT_TOKEN = require('../utils/GenerateToken');
const CLOUDINARY_UPLOAD = require("../config/cloudinary")

// GET /api/users/
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}

// POST /api/users/signup
const createUser = async (req, res) => {
    try {
        let hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
        })

        let savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}

// DELETE /api/users/delete
const deleteAllUsers = async (req, res) => {
    try {
        const users = await User.deleteMany({});
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}

// GET /api/users/:id
const getUserById = async (req, res) => {
    try {
        const UID = req.params.id;
        const user = await User.findOne({ user_id: UID });

        if (!user) { return res.status(404).json({ message: "USER NOT FOUND!" }); }

        res.status(200).json({ message: "FOUND USER", user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
};

// POST /api/users/login
const loginUser = async (req, res) => {
    try {
        const userPayload = await User.findOne({ username: req.body.username });
        if (!userPayload) {
            return res.status(404).json({ message: "USER NOT FOUND!" });
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, userPayload.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "WRONG PASSWORD" });
        }

        const token = GENERATE_JWT_TOKEN(userPayload, res);

        return res.status(200).json({
            message: "LOGIN SUCCESSFUL! TOKEN GENERATED",
            token: token,
            user: userPayload,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }

};

// POST /api/users/logout
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
        });
        res.status(200).json({ message: "USER LOGGED OUT! TOKEN CLEARED!" })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}

// DELETE /api/users/delete/:id
const deleteUser = async (req, res) => {
    try {
        const UID = req.params.id;
        const user = await User.findOne({ user_id: UID });
        await User.deleteOne(user);
        res.status(200).json({ message: "DELETED USER SUCCESSFULLY", userDeleted: user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}

// GET /api/users/user, USES AUTH MIDDLEWARE WITH REQ OBJ
const getUserByToken = async (req, res) => {
    try {
        res.status(200).json({ user: req.user });
    } catch (err) {
        console.error(err);
    }
};

// POST /api/users/user/search
const searchUserByUsername = async (req, res) => {
    try {
        const users = await User.find({
            username: { $regex: new RegExp(req.body.username, 'i') }
        });
        res.status(200).json({ message: "USER SEARCHED FOUND!", users: users });
    } catch (err) {
        console.error(err);
    }
}

/* 
    TODO FOR FUTURE ME:
    WHEN I CHANGE THE USERNAME, REFETCH ALL POSTS MADE BY THE USER,
    UPDATE THE POSTS AUTHOR ALONG WITH THE NAME CHANGE
*/

// PATCH /api/users/user
const patchUser = async (req, res) => {
    try {
        const filter = req.user;
        if (!filter) {
            return res.status(401).json({ message: "HEY IMMIGRANT YOU AREN'T LOGGED IN" });
        }

        let extractedImageURL;
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cloudRes = await CLOUDINARY_UPLOAD(dataURI);
            extractedImageURL = cloudRes?.url;
        }

        const updatePayload = {
            username: req.body.username,
            avatar: extractedImageURL,
        }

        const updatedUser = await User.findOneAndUpdate(filter, updatePayload, {
            new: true,
        });

        const updatedPost = await Post.updateMany(
            { 'author.user_id': req.user.user_id },
            {$set: {
                    "author.username": req.body.username,
                    "author.avatar": updatedUser.avatar
                }
            },
        );

        const token = GENERATE_JWT_TOKEN(updatedUser, res);

        res.status(200).json({
            message: "UPDATE SUCCESSFUL!",
            token: token,
            user: updatedUser,
            postsUpdated: updatedPost,
        });
    } catch (err) {
        if (err.code == 11000) {
            res.status(409).json({ message: "DUPLICATE USERNAME", errorCode: err.code })
        }
        return res.status(500).json({ message: "SERVER ERROR" });
    }
}


module.exports = { getAllUsers, createUser, deleteAllUsers, getUserById, loginUser, logoutUser, deleteUser, getUserByToken, searchUserByUsername, patchUser };