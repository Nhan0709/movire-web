// Configuration
const CONFIG = {
    API_BASE_URL: 'http://localhost:5000/api',
    TMDB_IMAGE_BASE: 'https://image.tmdb.org/t/p',
    TMDB_API_KEY: 'your_tmdb_api_key_here', // Replace with your TMDB API key
};

// Get image URL with fallback
function getImageUrl(path, size = 'w500') {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
    return `${CONFIG.TMDB_IMAGE_BASE}/${size}${path}`;
}

// Get backdrop image URL
function getBackdropUrl(path, size = 'original') {
    if (!path) return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920';
    return `${CONFIG.TMDB_IMAGE_BASE}/${size}${path}`;
}

// Format runtime
function formatRuntime(minutes) {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.getFullYear();
}

// Format number
function formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}
