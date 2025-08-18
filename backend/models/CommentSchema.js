const mongoose = require('mongoose');
const ApplyAutoIncrementingField = require('../utils/AutoIncrementFields');
const { Schema } = mongoose;

const CommentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },

    commenter: {
        user_id: { type: String, required: true },
        username: { type: String, required: true },
        avatar: { type: String, required: false },
    },

    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: false,
    },

    image: {
        type: String,
        required: false,
    },

    comment: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true,
    }
);

ApplyAutoIncrementingField(CommentSchema, "comment_id");

module.exports = mongoose.model('Comment', CommentSchema);
