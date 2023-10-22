const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    id: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true,
        minlength: 6
    },
    text: {
        type: String,
        required: true,
        minlength: 6
    },
    author: {
        type: String,
        required: true
    }
});

// Actualiza 'updatedAt' antes de guardar
postSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
