const mongoose = require('mongoose');
const ApplyAutoIncrementingField = require('../utils/AutoIncrementFields');
const { Schema } = mongoose;

const ReelSchema = new Schema({
    reel_id: {
        type: Number,
        index: true,
        unique: true
    },

    author: {
        user_id: { type: String, required: false },
        username: { type: String, required: false },
        avatar: { type: String, required: false },
    },

    videoUrl: {
        type: String,
        required: true,
    },

    caption: {
        type: String,
        required: true,
    },

    hashtags: {
        type: [String],
        required: true,
    },

    views: {
        type: Number,
        default: 0
    },
  
},
    {
        timestamps: true,
    }
);

ApplyAutoIncrementingField(ReelSchema, "reel_id");


module.exports = mongoose.model("Reel", ReelSchema);
