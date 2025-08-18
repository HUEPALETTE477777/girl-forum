const mongoose = require('mongoose');
const { Schema } = mongoose;

const FriendshipSchema = new Schema({
    requester: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },

},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Friendship', FriendshipSchema);
