// API Service Layer
class API {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
        this.token = localStorage.getItem('token');
    }

    // Get auth headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Handle response
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Network error' }));
            throw new Error(error.message || 'Something went wrong');
        }
        return response.json();
    }

    // Auth APIs
    async register(username, email, password) {
        const response = await fetch(`${this.baseURL}/auth/register`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ username, email, password })
        });
        const data = await this.handleResponse(response);
        if (data.token) {
            this.token = data.token;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    }

    async login(email, password) {
        const response = await fetch(`${this.baseURL}/auth/login`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ email, password })
        });
        const data = await this.handleResponse(response);
        if (data.token) {
            this.token = data.token;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    }

    async getMe() {
        const response = await fetch(`${this.baseURL}/auth/me`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // Movie APIs
    async getPopularMovies(page = 1) {
        const response = await fetch(`${this.baseURL}/movies/popular?page=${page}`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async getTrendingMovies(page = 1, timeWindow = 'week') {
        const response = await fetch(`${this.baseURL}/movies/trending?page=${page}&time_window=${timeWindow}`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async getTopRatedMovies(page = 1) {
        const response = await fetch(`${this.baseURL}/movies/top-rated?page=${page}`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async getUpcomingMovies(page = 1) {
        const response = await fetch(`${this.baseURL}/movies/upcoming?page=${page}`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async searchMovies(query, page = 1) {
        const response = await fetch(`${this.baseURL}/movies/search?q=${encodeURIComponent(query)}&page=${page}`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async getGenres() {
        const response = await fetch(`${this.baseURL}/movies/genres`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async getMoviesByGenre(genreId, page = 1) {
        const response = await fetch(`${this.baseURL}/movies/by-genre/${genreId}?page=${page}`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async getMovieDetails(movieId) {
        const response = await fetch(`${this.baseURL}/movies/${movieId}`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async rateMovie(movieId, rating) {
        const response = await fetch(`${this.baseURL}/movies/${movieId}/rate`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ rating })
        });
        return this.handleResponse(response);
    }

    async incrementViewCount(movieId) {
        const response = await fetch(`${this.baseURL}/movies/${movieId}/view`, {
            method: 'POST',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async getVideoSource(movieId) {
        const response = await fetch(`${this.baseURL}/movies/${movieId}/video`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    // User APIs
    async getFavorites() {
        const response = await fetch(`${this.baseURL}/users/favorites`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async addToFavorites(movieId) {
        const response = await fetch(`${this.baseURL}/users/favorites/${movieId}`, {
            method: 'POST',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async removeFromFavorites(movieId) {
        const response = await fetch(`${this.baseURL}/users/favorites/${movieId}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async getUserRatings() {
        const response = await fetch(`${this.baseURL}/users/ratings`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async getWatchHistory() {
        const response = await fetch(`${this.baseURL}/users/watch-history`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async addToWatchHistory(movieId, progress = 0) {
        const response = await fetch(`${this.baseURL}/users/watch-history/${movieId}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ progress })
        });
        return this.handleResponse(response);
    }

    async getProfile() {
        const response = await fetch(`${this.baseURL}/users/profile`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async updateProfile(username, avatar) {
        const response = await fetch(`${this.baseURL}/users/profile`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify({ username, avatar })
        });
        return this.handleResponse(response);
    }
}

// Initialize API
const api = new API();
