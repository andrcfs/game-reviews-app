const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    gameTitle: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewText: {
        type: String,
        required: true,
        trim: true
    },
    gameImage: {
        type: String,
        default: ''
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Índice composto para evitar duplicatas (um usuário, uma avaliação por jogo)
reviewSchema.index({ user: 1, gameTitle: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
