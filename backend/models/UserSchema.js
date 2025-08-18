const mongoose = require('mongoose');
const ApplyAutoIncrementingField = require('../utils/AutoIncrementFields');
const { Schema } = mongoose;

const UserSchema = new Schema({
  user_id: {
    type: Number,
    unique: true,
    index: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  avatar: {
    type: String,
    default: "",
  }

},
  {
    timestamps: true,
  }
);

ApplyAutoIncrementingField(UserSchema, "user_id");

module.exports = mongoose.model('User', UserSchema);