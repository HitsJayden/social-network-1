const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
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

    posts: [
        {
            content: { type: String, required: true },
            postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);