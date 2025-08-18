const mongoose = require('mongoose');
const ApplyAutoIncrementingField = require('../utils/AutoIncrementFields');
const { Schema } = mongoose;

const PostSchema = new Schema({
    post_id: {
        type: Number,
        unique: true,
        index: true,
    },

    author: {
        user_id: { type: String, required: false },
        username: { type: String, required: false },
        avatar: { type: String, required: false },
    },
    
    title: {
        type: String,
        required: true,
    },

    content: {
        type: String,
        required: false,
    },

    image: {
        type: String,
        required: false,
    }

},
    {
        timestamps: true,
    }
);

ApplyAutoIncrementingField(PostSchema, "post_id");


module.exports = mongoose.model('Post', PostSchema);