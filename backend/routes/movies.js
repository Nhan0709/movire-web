const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const Movie = require('../models/Movie');
const User = require('../models/User');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Helper function to fetch from TMDB
const fetchFromTMDB = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'vi-VN',
                ...params
            }
        });
        return response.data;
    } catch (error) {
        console.error('TMDB API Error:', error.message);
        throw error;
    }
};

// @route   GET /api/movies/popular
// @desc    Get popular movies with pagination
// @access  Public
router.get('/popular', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const data = await fetchFromTMDB('/movie/popular', { page });

        res.json({
            results: data.results,
            page: data.page,
            total_pages: data.total_pages,
            total_results: data.total_results
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching popular movies' });
    }
});

// @route   GET /api/movies/trending
// @desc    Get trending movies
// @access  Public
router.get('/trending', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const timeWindow = req.query.time_window || 'week'; // day or week
        const data = await fetchFromTMDB(`/trending/movie/${timeWindow}`, { page });

        res.json({
            results: data.results,
            page: data.page,
            total_pages: data.total_pages,
            total_results: data.total_results
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trending movies' });
    }
});

// @route   GET /api/movies/top-rated
// @desc    Get top rated movies
// @access  Public
router.get('/top-rated', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const data = await fetchFromTMDB('/movie/top_rated', { page });

        res.json({
            results: data.results,
            page: data.page,
            total_pages: data.total_pages,
            total_results: data.total_results
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching top rated movies' });
    }
});

// @route   GET /api/movies/upcoming
// @desc    Get upcoming movies
// @access  Public
router.get('/upcoming', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const data = await fetchFromTMDB('/movie/upcoming', { page });

        res.json({
            results: data.results,
            page: data.page,
            total_pages: data.total_pages,
            total_results: data.total_results
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching upcoming movies' });
    }
});

// @route   GET /api/movies/search
// @desc    Search movies
// @access  Public
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        const page = parseInt(req.query.page) || 1;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const data = await fetchFromTMDB('/search/movie', { query, page });

        res.json({
            results: data.results,
            page: data.page,
            total_pages: data.total_pages,
            total_results: data.total_results
        });
    } catch (error) {
        res.status(500).json({ message: 'Error searching movies' });
    }
});

// @route   GET /api/movies/genres
// @desc    Get all movie genres
// @access  Public
router.get('/genres', async (req, res) => {
    try {
        const data = await fetchFromTMDB('/genre/movie/list');
        res.json(data.genres);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching genres' });
    }
});

// @route   GET /api/movies/by-genre/:genreId
// @desc    Get movies by genre
// @access  Public
router.get('/by-genre/:genreId', async (req, res) => {
    try {
        const genreId = req.params.genreId;
        const page = parseInt(req.query.page) || 1;

        const data = await fetchFromTMDB('/discover/movie', {
            with_genres: genreId,
            page
        });

        res.json({
            results: data.results,
            page: data.page,
            total_pages: data.total_pages,
            total_results: data.total_results
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movies by genre' });
    }
});

// @route   GET /api/movies/:id
// @desc    Get movie details
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const movieId = req.params.id;

        // Fetch movie details from TMDB
        const movie = await fetchFromTMDB(`/movie/${movieId}`, {
            append_to_response: 'videos,credits,similar,reviews'
        });

        // Get local ratings if exists
        let localMovie = await Movie.findOne({ tmdbId: movieId });

        res.json({
            ...movie,
            localRatings: localMovie?.averageLocalRating || 0,
            totalLocalRatings: localMovie?.totalRatings || 0,
            views: localMovie?.views || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movie details' });
    }
});

// @route   POST /api/movies/:id/rate
// @desc    Rate a movie
// @access  Private
router.post('/:id/rate', auth, async (req, res) => {
    try {
        const movieId = parseInt(req.params.id);
        const { rating } = req.body;
        const userId = req.user.id;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Find or create movie in local database
        let movie = await Movie.findOne({ tmdbId: movieId });
        if (!movie) {
            const tmdbMovie = await fetchFromTMDB(`/movie/${movieId}`);
            movie = new Movie({
                tmdbId: movieId,
                title: tmdbMovie.title,
                overview: tmdbMovie.overview,
                releaseDate: tmdbMovie.release_date,
                posterPath: tmdbMovie.poster_path,
                backdropPath: tmdbMovie.backdrop_path,
                voteAverage: tmdbMovie.vote_average,
                genres: tmdbMovie.genres.map(g => g.name),
                runtime: tmdbMovie.runtime
            });
        }

        // Update user rating
        const user = await User.findById(userId);
        const existingRatingIndex = user.ratings.findIndex(r => r.movieId === movieId);

        if (existingRatingIndex > -1) {
            // Update existing rating
            const oldRating = user.ratings[existingRatingIndex].rating;
            user.ratings[existingRatingIndex].rating = rating;
            user.ratings[existingRatingIndex].createdAt = new Date();

            // Update movie rating
            const movieRatingIndex = movie.localRatings.findIndex(r => r.userId.toString() === userId);
            if (movieRatingIndex > -1) {
                movie.localRatings[movieRatingIndex].rating = rating;
                movie.localRatings[movieRatingIndex].createdAt = new Date();
            }
        } else {
            // Add new rating
            user.ratings.push({ movieId, rating });
            movie.localRatings.push({ userId, rating });
            movie.totalRatings += 1;
        }

        // Recalculate average rating
        const sum = movie.localRatings.reduce((acc, r) => acc + r.rating, 0);
        movie.averageLocalRating = sum / movie.localRatings.length;

        await user.save();
        await movie.save();

        res.json({
            message: 'Rating saved successfully',
            averageRating: movie.averageLocalRating,
            totalRatings: movie.totalRatings,
            userRating: rating
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving rating' });
    }
});

// @route   POST /api/movies/:id/view
// @desc    Increment view count
// @access  Public
router.post('/:id/view', async (req, res) => {
    try {
        const movieId = parseInt(req.params.id);

        let movie = await Movie.findOne({ tmdbId: movieId });
        if (!movie) {
            const tmdbMovie = await fetchFromTMDB(`/movie/${movieId}`);
            movie = new Movie({
                tmdbId: movieId,
                title: tmdbMovie.title,
                overview: tmdbMovie.overview,
                releaseDate: tmdbMovie.release_date,
                posterPath: tmdbMovie.poster_path,
                backdropPath: tmdbMovie.backdrop_path,
                voteAverage: tmdbMovie.vote_average,
                genres: tmdbMovie.genres.map(g => g.name),
                runtime: tmdbMovie.runtime,
                views: 1
            });
        } else {
            movie.views += 1;
        }

        await movie.save();

        res.json({ views: movie.views });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating view count' });
    }
});

// Helper function to search Internet Archive for movie video
const searchInternetArchive = async (title, year) => {
    try {
        // Clean title for search
        const cleanTitle = title.replace(/[^\w\s]/g, '').trim();

        // Build search query
        const query = `mediatype:movies AND title:(${cleanTitle})${year ? ` AND year:${year}` : ''}`;
        console.log('[IA Search] Query:', query);

        // Search Internet Archive
        const searchUrl = 'https://archive.org/advancedsearch.php';
        const searchParams = {
            q: query,
            'fl[]': ['identifier', 'title', 'year', 'licenseurl', 'creator', 'description'],
            output: 'json',
            rows: 10
        };

        const searchResponse = await axios.get(searchUrl, { params: searchParams });
        const results = searchResponse.data.response.docs;
        console.log('[IA Search] Found', results.length, 'results');

        if (results.length === 0) {
            console.log('[IA Search] No results found');
            return null;
        }

        // Find best match - prefer exact title and year match with valid license
        let bestMatch = null;
        for (const result of results) {
            console.log('[IA Search] Checking:', result.identifier, '- License:', result.licenseurl);

            // Check if it has a valid public domain/CC license
            const hasValidLicense = result.licenseurl && (
                result.licenseurl.includes('publicdomain') ||
                result.licenseurl.includes('creativecommons.org')
            );

            if (!hasValidLicense) {
                console.log('[IA Search] Rejected - no valid license');
                continue;
            }

            // Check title similarity
            const resultTitle = (result.title || '').toLowerCase();
            const searchTitle = cleanTitle.toLowerCase();

            // Clean both titles for comparison (remove all punctuation)
            const cleanResultTitle = resultTitle.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
            const cleanSearchTitle = searchTitle.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();

            console.log('[IA Search] Comparing titles:', cleanResultTitle, 'vs', cleanSearchTitle);

            if (cleanResultTitle.includes(cleanSearchTitle) || cleanSearchTitle.includes(cleanResultTitle)) {
                // Check year match if available
                if (year && result.year) {
                    const yearDiff = Math.abs(parseInt(result.year) - parseInt(year));
                    console.log('[IA Search] Year diff:', yearDiff, '(allowed: ≤1)');
                    if (yearDiff <= 1) { // Allow 1 year difference
                        bestMatch = result;
                        console.log('[IA Search] ✓ Match found:', result.identifier);
                        break;
                    } else {
                        console.log('[IA Search] Rejected - year mismatch');
                    }
                } else {
                    bestMatch = result;
                    console.log('[IA Search] ✓ Match found (no year check):', result.identifier);
                    break;
                }
            } else {
                console.log('[IA Search] Rejected - title mismatch');
            }
        }

        if (!bestMatch) {
            console.log('[IA Search] No best match found after filtering');
            return null;
        }

        // Get metadata to find video file
        const metadataUrl = `https://archive.org/metadata/${bestMatch.identifier}`;
        const metadataResponse = await axios.get(metadataUrl);
        const metadata = metadataResponse.data;

        // Find best video file (prefer h.264 derivative for streaming)
        const files = metadata.files || [];
        let videoFile = files.find(f => f.format === 'h.264' && f.source === 'derivative');

        // Fallback to any h.264 if derivative not found
        if (!videoFile) {
            videoFile = files.find(f => f.format === 'h.264');
        }

        // Fallback to MPEG4 if h.264 not available
        if (!videoFile) {
            videoFile = files.find(f =>
                f.format === 'MPEG4' &&
                f.name.toLowerCase().match(/\.(mp4|mpeg4)$/)
            );
        }

        if (!videoFile) {
            return null;
        }

        // Construct video URL with proper encoding
        const server = metadata.server || metadata.d1 || 'archive.org';
        const dir = metadata.dir || `/items/${bestMatch.identifier}`;
        const encodedFilename = encodeURIComponent(videoFile.name);
        const videoUrl = `https://${server}${dir}/${encodedFilename}`;

        return {
            identifier: bestMatch.identifier,
            title: bestMatch.title,
            year: bestMatch.year,
            licenseurl: bestMatch.licenseurl,
            videoUrl: videoUrl,
            width: videoFile.width,
            height: videoFile.height,
            duration: videoFile.length,
            format: videoFile.format
        };

    } catch (error) {
        console.error('Internet Archive API Error:', error.message);
        return null;
    }
};

// @route   GET /api/movies/:id/video
// @desc    Get video source from Internet Archive
// @access  Public
router.get('/:id/video', async (req, res) => {
    try {
        const movieId = req.params.id;

        // Get movie details from TMDB
        const movie = await fetchFromTMDB(`/movie/${movieId}`);

        if (!movie) {
            return res.status(404).json({
                available: false,
                source: null,
                videoUrl: null,
                message: 'Không tìm thấy thông tin phim.'
            });
        }

        // Extract year from release date
        const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;

        // Search Internet Archive
        const videoData = await searchInternetArchive(movie.title, year);

        if (!videoData) {
            return res.json({
                available: false,
                source: null,
                videoUrl: null,
                message: 'Chưa có nguồn xem full hợp pháp cho phim này.'
            });
        }

        res.json({
            available: true,
            source: 'Internet Archive',
            videoUrl: videoData.videoUrl,
            title: videoData.title,
            identifier: videoData.identifier,
            year: videoData.year,
            license: videoData.licenseurl,
            metadata: {
                width: videoData.width,
                height: videoData.height,
                duration: videoData.duration,
                format: videoData.format
            }
        });

    } catch (error) {
        console.error('Error fetching video source:', error);
        res.status(500).json({
            available: false,
            source: null,
            videoUrl: null,
            message: 'Lỗi khi tìm kiếm video.'
        });
    }
});

module.exports = router;
