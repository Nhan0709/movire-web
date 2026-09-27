const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    tmdbId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    overview: String,
    releaseDate: Date,
    posterPath: String,
    backdropPath: String,
    voteAverage: Number,
    voteCount: Number,
    genres: [String],
    runtime: Number,

    // Local ratings from users
    localRatings: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    averageLocalRating: {
        type: Number,
        default: 0
    },

    totalRatings: {
        type: Number,
        default: 0
    },

    views: {
        type: Number,
        default: 0
    },

    lastFetched: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
movieSchema.index({ tmdbId: 1 });
movieSchema.index({ title: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
