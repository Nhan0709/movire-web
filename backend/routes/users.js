const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/users/favorites
// @desc    Get user's favorite movies
// @access  Private
router.get('/favorites', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('favorites');
        res.json(user.favorites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching favorites' });
    }
});

// @route   POST /api/users/favorites/:movieId
// @desc    Add movie to favorites
// @access  Private
router.post('/favorites/:movieId', auth, async (req, res) => {
    try {
        const movieId = parseInt(req.params.movieId);
        const user = await User.findById(req.user.id);

        if (user.favorites.includes(movieId)) {
            return res.status(400).json({ message: 'Movie already in favorites' });
        }

        user.favorites.push(movieId);
        await user.save();

        res.json({ message: 'Added to favorites', favorites: user.favorites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding to favorites' });
    }
});

// @route   DELETE /api/users/favorites/:movieId
// @desc    Remove movie from favorites
// @access  Private
router.delete('/favorites/:movieId', auth, async (req, res) => {
    try {
        const movieId = parseInt(req.params.movieId);
        const user = await User.findById(req.user.id);

        user.favorites = user.favorites.filter(fav => fav !== movieId);
        await user.save();

        res.json({ message: 'Removed from favorites', favorites: user.favorites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing from favorites' });
    }
});

// @route   GET /api/users/ratings
// @desc    Get user's movie ratings
// @access  Private
router.get('/ratings', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('ratings');
        res.json(user.ratings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching ratings' });
    }
});

// @route   GET /api/users/watch-history
// @desc    Get user's watch history
// @access  Private
router.get('/watch-history', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('watchHistory');
        res.json(user.watchHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching watch history' });
    }
});

// @route   POST /api/users/watch-history/:movieId
// @desc    Add movie to watch history
// @access  Private
router.post('/watch-history/:movieId', auth, async (req, res) => {
    try {
        const movieId = parseInt(req.params.movieId);
        const { progress } = req.body;
        const user = await User.findById(req.user.id);

        // Find if movie already in history
        const existingIndex = user.watchHistory.findIndex(item => item.movieId === movieId);

        if (existingIndex > -1) {
            // Update existing entry
            user.watchHistory[existingIndex].watchedAt = new Date();
            user.watchHistory[existingIndex].progress = progress || 0;
        } else {
            // Add new entry
            user.watchHistory.push({
                movieId,
                progress: progress || 0
            });
        }

        await user.save();

        res.json({ message: 'Watch history updated', watchHistory: user.watchHistory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating watch history' });
    }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
    try {
        const { username, avatar } = req.body;
        const user = await User.findById(req.user.id);

        if (username) user.username = username;
        if (avatar) user.avatar = avatar;

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});

module.exports = router;
