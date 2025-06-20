const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    imageUrl: {
        type: String, 
        default: null
    },
    imagePublicId: {
        type: String, 
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('post', postSchema)
