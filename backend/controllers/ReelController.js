const Reel = require('../models/ReelSchema')
const CLOUDINARY_UPLOAD = require("../config/cloudinary")

// POST /api/reels/create
const createReel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(404).json({ message: "NEED TO PUT IN A VIDEO" })
        }

        if (!req.body.caption) {
            return res.status(404).json({ message: "NEED TO PUT IN A CAPTION" })
        }

        console.log(req.file);

        let extractedVideoUrl;
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        const cloudRes = await CLOUDINARY_UPLOAD.cloudinaryVideoUpload(dataURI);
        extractedVideoUrl = cloudRes?.url;

        const payload = {
            author: { user_id: req.user.user_id, username: req.user.username, avatar: req.user.avatar },
            videoUrl: extractedVideoUrl,
            caption: req.body.caption,
            hashtags: req.body.hashtags,
        }

        console.log(payload);

        const newReel = new Reel(payload);
        await newReel.save();

        return res.status(200).json({ message: "REEL CREATED BANG BANG!", reel: newReel })
    } catch (err) {
        console.error(err);
    }
}

// GET /api/reels?page=1&limit=4
const getAllReels = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;

        const reels = await Reel.find({})
            .sort({ createdAt: -1 }) // NEWEST FIRST, DECREASING REEL ID
            .skip(skip)
            .limit(limit);

        const total = await Reel.countDocuments();
        
         res.status(200).json({
            message: "SUCCESSFULLY RETRIEVED REELS",
            reels,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        });

    } catch (err) { 
        console.error(err);
    }
}

// GET /api/reels/video/:id
const getReel = async (req, res) => {
    try {   
        const id = req.params.id;
        const reel = await Reel.find({ reel_id: id })

        if (!reel) {
            return res.status(404).json({ message: "REEL NOT FOUND NOOB"})
        }

        res.status(200).json({ message: "SUCCESSFULLY RETRIVED REEL!", reel: reel});
    } catch (err) {
        console.error(err);
    }
}


module.exports = {
    createReel,
    getAllReels,
    getReel
}