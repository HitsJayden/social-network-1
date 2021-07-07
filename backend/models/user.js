const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    profileImage: {
        type: String,
        required: false,
    },

    surname: {
        type: String,
        required: true,
    },

    nickname: {
        type: String,
        required: false,
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    resetToken: {
        type: String,
        required: false,
    },

    resetTokenExpires: {
        type: Date,
        required: false,
    },

    tokenVerifyEmail: {
        type: String,
        required: false,
    },

    tokenVerifyEmailExpires: {
        type: Date,
        required: false,
    },

    posts: [{
            content: { type: String, required: true },
            postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
        }],

    friends: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    }],

    friendRequestSent: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    }],

    friendRequestReceived: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    }],

    notifications: [{
        message: { type: String, required: false },
        date: { type: Date, required: false },
    }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);