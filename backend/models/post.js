const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    content: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: false,
    },

    likes: {
        likes: {
            type: Number,
            required: false,
        },
        users: {
            userId: [{
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: false,
            }],
        },
    },

    comments: [{
        content: {
            type: String,
            required: false,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        name: {
            type: String,
            required: false,
        },
        surname: {
            type: String,
            required: false,
        },
        nickname: {
            type: String,
            required: false,
        }
    }],

    totalComments: {
        type: Number,
        required: false,
    },

    userId: {
        ref: 'User',
        type: Schema.Types.ObjectId,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);