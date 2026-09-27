// Application State
let currentPage = 'home';
let currentMovies = [];
let currentMovieId = null;
let currentPagination = { page: 1, total_pages: 1 };
let userFavorites = [];
let userRatings = [];
let genres = [];
let player = null;

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    showLoading(true);
    await loadGenres();
    await loadUserData();
    await loadHeroSection();
    await loadMovies();
    initializeEventListeners();
    showLoading(false);
});

// Load Genres
async function loadGenres() {
    try {
        genres = await api.getGenres();
        renderCategories();
    } catch (error) {
        console.error('Error loading genres:', error);
    }
}

// Load User Data
async function loadUserData() {
    if (!authManager.isAuthenticated) return;

    try {
        const [favorites, ratings] = await Promise.all([
            api.getFavorites(),
            api.getUserRatings()
        ]);
        userFavorites = favorites;
        userRatings = ratings;
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Render Categories
function renderCategories() {
    const categoriesList = document.getElementById('categoriesList');

    const allButton = `<button class="category-btn active" data-genre="all">Tất cả</button>`;
    const genreButtons = genres.slice(0, 10).map(genre =>
        `<button class="category-btn" data-genre="${genre.id}">${genre.name}</button>`
    ).join('');

    categoriesList.innerHTML = allButton + genreButtons;
}

// Load Hero Section
async function loadHeroSection() {
    try {
        const data = await api.getPopularMovies(1);
        const heroMovie = data.results[0];

        if (heroMovie) {
            const heroSection = document.getElementById('heroSection');
            heroSection.style.backgroundImage = `url('${getBackdropUrl(heroMovie.backdrop_path)}')`;

            document.getElementById('heroTitle').textContent = heroMovie.title;
            document.getElementById('heroDescription').textContent = heroMovie.overview || 'Không có mô tả';

            const metaHtml = `
                <span class="rating"><i class="fas fa-star"></i> ${heroMovie.vote_average.toFixed(1)}</span>
                <span>${formatDate(heroMovie.release_date)}</span>
            `;
            document.getElementById('heroMeta').innerHTML = metaHtml;

            document.getElementById('heroPlayBtn').onclick = () => openMovieModal(heroMovie.id);
            document.getElementById('heroFavoriteBtn').onclick = () => toggleFavorite(heroMovie.id);
        }
    } catch (error) {
        console.error('Error loading hero:', error);
    }
}

// Load Movies
async function loadMovies(page = 1) {
    showLoading(true);
    try {
        let data;

        switch (currentPage) {
            case 'trending':
                data = await api.getTrendingMovies(page);
                document.getElementById('sectionTitle').textContent = 'Phim xu hướng';
                break;
            case 'top-rated':
                data = await api.getTopRatedMovies(page);
                document.getElementById('sectionTitle').textContent = 'Phim đánh giá cao';
                break;
            case 'upcoming':
                data = await api.getUpcomingMovies(page);
                document.getElementById('sectionTitle').textContent = 'Phim sắp chiếu';
                break;
            case 'favorites':
                await loadFavorites();
                showLoading(false);
                return;
            default:
                data = await api.getPopularMovies(page);
                document.getElementById('sectionTitle').textContent = 'Phim phổ biến';
        }

        currentMovies = data.results;
        currentPagination = {
            page: data.page,
            total_pages: Math.min(data.total_pages, 500) // TMDB limit
        };

        renderMovies();
        renderPagination();
    } catch (error) {
        console.error('Error loading movies:', error);
        showToast('Lỗi tải phim. Vui lòng thử lại!');
    }
    showLoading(false);
}

// Load Favorites
async function loadFavorites() {
    if (!authManager.requireAuth()) return;

    try {
        const favoriteIds = await api.getFavorites();

        if (favoriteIds.length === 0) {
            document.getElementById('favoritesGrid').innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <i class="fas fa-heart"></i>
                    <h3>Chưa có phim yêu thích</h3>
                    <p>Thêm phim vào danh sách yêu thích để xem sau</p>
                </div>
            `;
            return;
        }

        // Fetch movie details for favorites
        const moviePromises = favoriteIds.map(id => api.getMovieDetails(id));
        const movies = await Promise.all(moviePromises);

        const grid = document.getElementById('favoritesGrid');
        grid.innerHTML = movies.map(movie => createMovieCard(movie)).join('');
    } catch (error) {
        console.error('Error loading favorites:', error);
        showToast('Lỗi tải phim yêu thích!');
    }
}

// Render Movies
function renderMovies() {
    const moviesGrid = document.getElementById('moviesGrid');

    if (currentMovies.length === 0) {
        moviesGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-film"></i>
                <h3>Không tìm thấy phim</h3>
                <p>Thử tìm kiếm với từ khóa khác</p>
            </div>
        `;
        return;
    }

    moviesGrid.innerHTML = currentMovies.map(movie => createMovieCard(movie)).join('');
}

// Create Movie Card
function createMovieCard(movie) {
    const isFavorite = userFavorites.includes(movie.id);

    return `
        <div class="movie-card" onclick="openMovieModal(${movie.id})">
            <button class="favorite-btn ${isFavorite ? 'active' : ''}"
                    onclick="event.stopPropagation(); toggleFavorite(${movie.id})">
                <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
            </button>
            <img src="${getImageUrl(movie.poster_path)}"
                 alt="${movie.title}"
                 class="movie-poster"
                 loading="lazy">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-details">
                    <span class="rating"><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}</span>
                    <span>${formatDate(movie.release_date)}</span>
                </div>
            </div>
        </div>
    `;
}

// Render Pagination
function renderPagination() {
    const pagination = document.getElementById('pagination');
    const { page, total_pages } = currentPagination;

    if (total_pages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // Previous button
    if (page > 1) {
        paginationHTML += `<button class="page-btn" onclick="changePage(${page - 1})"><i class="fas fa-chevron-left"></i></button>`;
    }

    // Page numbers
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(total_pages, page + 2);

    if (startPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="page-dots">...</span>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="page-btn ${i === page ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }

    if (endPage < total_pages) {
        if (endPage < total_pages - 1) {
            paginationHTML += `<span class="page-dots">...</span>`;
        }
        paginationHTML += `<button class="page-btn" onclick="changePage(${total_pages})">${total_pages}</button>`;
    }

    // Next button
    if (page < total_pages) {
        paginationHTML += `<button class="page-btn" onclick="changePage(${page + 1})"><i class="fas fa-chevron-right"></i></button>`;
    }

    pagination.innerHTML = paginationHTML;
}

// Change Page
function changePage(page) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadMovies(page);
}

// Toggle Favorite
async function toggleFavorite(movieId) {
    if (!authManager.requireAuth()) return;

    try {
        const isFavorite = userFavorites.includes(movieId);

        if (isFavorite) {
            await api.removeFromFavorites(movieId);
            userFavorites = userFavorites.filter(id => id !== movieId);
            showToast('Đã xóa khỏi yêu thích');
        } else {
            await api.addToFavorites(movieId);
            userFavorites.push(movieId);
            showToast('Đã thêm vào yêu thích');
        }

        // Update UI
        if (currentPage === 'favorites') {
            loadFavorites();
        } else {
            renderMovies();
        }

        // Update modal if open
        if (currentMovieId === movieId) {
            updateModalFavoriteButton();
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        showToast('Có lỗi xảy ra!');
    }
}

// Open Movie Modal
async function openMovieModal(movieId) {
    currentMovieId = movieId;
    showLoading(true);

    try {
        const movie = await api.getMovieDetails(movieId);

        // Increment view count
        api.incrementViewCount(movieId).catch(console.error);

        const modal = document.getElementById('movieModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Set movie details
        document.getElementById('modalTitle').textContent = movie.title;
        document.getElementById('modalDescription').textContent = movie.overview || 'Không có mô tả';

        const ratingHtml = `<i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}`;
        document.getElementById('modalRating').innerHTML = ratingHtml;
        document.getElementById('modalYear').textContent = formatDate(movie.release_date);
        document.getElementById('modalDuration').textContent = formatRuntime(movie.runtime);
        document.getElementById('modalViews').innerHTML = `<i class="fas fa-eye"></i> ${formatNumber(movie.views)} lượt xem`;

        // Genres
        const genresHtml = movie.genres.map(g => `<span class="genre-tag">${g.name}</span>`).join('');
        document.getElementById('modalGenres').innerHTML = genresHtml;

        // Local ratings
        document.getElementById('localRating').textContent = movie.localRatings?.toFixed(1) || '0.0';
        document.getElementById('totalRatings').textContent = movie.totalLocalRatings || 0;

        // User's rating
        const userRating = userRatings.find(r => r.movieId === movieId);
        updateStarRating(userRating?.rating || 0);

        // Favorite button
        updateModalFavoriteButton();

        // Cast
        if (movie.credits?.cast) {
            renderCast(movie.credits.cast.slice(0, 6));
        }

        // Similar movies
        if (movie.similar?.results) {
            renderSimilarMovies(movie.similar.results.slice(0, 6));
        }

        // Initialize video player with movieId
        await initializePlayer(movieId);

    } catch (error) {
        console.error('Error loading movie details:', error);
        showToast('Lỗi tải thông tin phim!');
        closeMovieModal();
    }

    showLoading(false);
}

// Initialize Video Player
async function initializePlayer(movieId) {
    const playerContainer = document.getElementById('videoContainer');

    // Destroy existing player
    if (player) {
        player.destroy();
        player = null;
    }
    playerContainer.parentElement.querySelectorAll('.video-license-info').forEach(info => info.remove());

    // Show loading state
    playerContainer.innerHTML = '<div class="video-loading"><div class="spinner"></div><p>Đang tìm nguồn video...</p></div>';

    try {
        // Get video source from Internet Archive
        const videoData = await api.getVideoSource(movieId);

        // Ignore a late response if the user has already opened another movie.
        if (currentMovieId !== movieId) return;

        if (!videoData.available) {
            // No video available
            playerContainer.innerHTML = `<div class="no-video">
                <i class="fas fa-film"></i>
                <p>${videoData.message || 'Chưa có nguồn xem full hợp pháp cho phim này.'}</p>
            </div>`;
            return;
        }

        // Create video element with source
        playerContainer.innerHTML = '';
        const videoElement = document.createElement('video');
        videoElement.id = 'player';
        videoElement.setAttribute('playsinline', '');
        videoElement.setAttribute('controls', '');
        videoElement.preload = 'metadata';

        const source = document.createElement('source');
        source.src = videoData.videoUrl;
        source.type = 'video/mp4';

        videoElement.appendChild(source);
        playerContainer.appendChild(videoElement);

        // Initialize Plyr with HTML5 video
        player = new Plyr('#player', {
            controls: [
                'play-large',
                'play',
                'progress',
                'current-time',
                'duration',
                'mute',
                'volume',
                'settings',
                'fullscreen'
            ],
            settings: ['quality', 'speed'],
            quality: {
                default: videoData.metadata?.height || 720,
                options: [1080, 720, 480]
            },
            speed: {
                selected: 1,
                options: [0.5, 0.75, 1, 1.25, 1.5, 2]
            }
        });

        // Handle video errors
        videoElement.addEventListener('error', (e) => {
            console.error('Video playback error:', e);
            playerContainer.innerHTML = `<div class="no-video">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Không thể phát video. Vui lòng thử lại sau.</p>
                <small>Nguồn: ${videoData.source}</small>
            </div>`;
        });

        // Show video metadata
        if (videoData.license) {
            const licenseInfo = document.createElement('div');
            licenseInfo.className = 'video-license-info';
            licenseInfo.innerHTML = `
                <small>
                    <i class="fas fa-info-circle"></i>
                    Nguồn: ${videoData.source} -
                    <a href="${videoData.license}" target="_blank" rel="noopener">License</a>
                </small>
            `;
            playerContainer.parentElement.appendChild(licenseInfo);
        }

    } catch (error) {
        console.error('Error initializing player:', error);
        if (currentMovieId !== movieId) return;
        playerContainer.innerHTML = `<div class="no-video">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Lỗi khi tải video. Vui lòng thử lại sau.</p>
        </div>`;
    }
}

// Close Movie Modal
function closeMovieModal() {
    const modal = document.getElementById('movieModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';

    if (player) {
        player.destroy();
        player = null;
    }

    currentMovieId = null;
}

// Update Modal Favorite Button
function updateModalFavoriteButton() {
    const isFavorite = userFavorites.includes(currentMovieId);
    const icon = document.getElementById('modalFavoriteIcon');
    const text = document.getElementById('modalFavoriteText');

    icon.className = isFavorite ? 'fas fa-heart' : 'far fa-heart';
    text.textContent = isFavorite ? 'Đã yêu thích' : 'Yêu thích';
}

// Toggle Favorite from Modal
function toggleFavoriteFromModal() {
    if (currentMovieId) {
        toggleFavorite(currentMovieId);
    }
}

// Render Cast
function renderCast(cast) {
    const castGrid = document.getElementById('castGrid');

    if (!cast || cast.length === 0) {
        document.getElementById('castSection').style.display = 'none';
        return;
    }

    document.getElementById('castSection').style.display = 'block';
    castGrid.innerHTML = cast.map(person => `
        <div class="cast-card">
            <img src="${person.profile_path ? getImageUrl(person.profile_path, 'w185') : 'https://via.placeholder.com/185x278?text=No+Image'}"
                 alt="${person.name}">
            <div class="cast-info">
                <div class="cast-name">${person.name}</div>
                <div class="cast-character">${person.character}</div>
            </div>
        </div>
    `).join('');
}

// Render Similar Movies
function renderSimilarMovies(movies) {
    const similarGrid = document.getElementById('similarGrid');

    if (!movies || movies.length === 0) {
        document.getElementById('similarSection').style.display = 'none';
        return;
    }

    document.getElementById('similarSection').style.display = 'block';
    similarGrid.innerHTML = movies.map(movie => `
        <div class="similar-card" onclick="closeMovieModal(); openMovieModal(${movie.id})">
            <img src="${getImageUrl(movie.poster_path, 'w342')}" alt="${movie.title}">
            <div class="similar-info">
                <div class="similar-title">${movie.title}</div>
                <div class="similar-rating">
                    <i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}
                </div>
            </div>
        </div>
    `).join('');
}

// Star Rating
function updateStarRating(rating) {
    const stars = document.querySelectorAll('#starRating i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
        } else {
            star.className = 'far fa-star';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('#starRating i');
    stars.forEach(star => {
        star.addEventListener('click', async () => {
            if (!authManager.requireAuth()) return;

            const rating = parseInt(star.dataset.rating);

            try {
                const result = await api.rateMovie(currentMovieId, rating);
                updateStarRating(rating);

                document.getElementById('localRating').textContent = result.averageRating.toFixed(1);
                document.getElementById('totalRatings').textContent = result.totalRatings;

                // Update user ratings
                const existingIndex = userRatings.findIndex(r => r.movieId === currentMovieId);
                if (existingIndex > -1) {
                    userRatings[existingIndex].rating = rating;
                } else {
                    userRatings.push({ movieId: currentMovieId, rating });
                }

                showToast(`Đã đánh giá ${rating} sao`);
            } catch (error) {
                console.error('Error rating movie:', error);
                showToast('Có lỗi xảy ra!');
            }
        });

        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.dataset.rating);
            stars.forEach((s, i) => {
                s.style.color = i < rating ? '#ffd700' : '#555';
            });
        });
    });

    document.getElementById('starRating').addEventListener('mouseleave', () => {
        const userRating = userRatings.find(r => r.movieId === currentMovieId);
        const rating = userRating?.rating || 0;
        stars.forEach((s, i) => {
            s.style.color = i < rating ? '#ffd700' : '#555';
        });
    });
});

// Search
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();

    if (query.length === 0) {
        loadMovies();
        return;
    }

    if (query.length < 2) return;

    searchTimeout = setTimeout(async () => {
        showLoading(true);
        try {
            const data = await api.searchMovies(query);
            currentMovies = data.results;
            currentPagination = {
                page: data.page,
                total_pages: Math.min(data.total_pages, 500)
            };
            document.getElementById('sectionTitle').textContent = `Kết quả tìm kiếm: "${query}"`;
            renderMovies();
            renderPagination();
        } catch (error) {
            console.error('Error searching:', error);
            showToast('Lỗi tìm kiếm!');
        }
        showLoading(false);
    }, 500);
});

// Navigation
function navigateTo(page) {
    currentPage = page;
    currentPagination.page = 1;

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });

    // Show/hide sections
    const moviesSection = document.querySelector('.movies-section');
    const favoritesSection = document.getElementById('favoritesSection');
    const heroSection = document.getElementById('heroSection');
    const categoriesSection = document.getElementById('categoriesSection');

    if (page === 'favorites') {
        moviesSection.style.display = 'none';
        favoritesSection.style.display = 'block';
        heroSection.style.display = 'none';
        categoriesSection.style.display = 'none';
        loadFavorites();
    } else {
        moviesSection.style.display = 'block';
        favoritesSection.style.display = 'none';
        heroSection.style.display = 'flex';
        categoriesSection.style.display = 'block';
        loadMovies();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Event Listeners
function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });

    // Categories
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('category-btn')) {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const genreId = e.target.dataset.genre;
            showLoading(true);

            try {
                let data;
                if (genreId === 'all') {
                    data = await api.getPopularMovies(1);
                } else {
                    data = await api.getMoviesByGenre(genreId, 1);
                }

                currentMovies = data.results;
                currentPagination = {
                    page: data.page,
                    total_pages: Math.min(data.total_pages, 500)
                };
                renderMovies();
                renderPagination();
            } catch (error) {
                console.error('Error loading genre:', error);
                showToast('Lỗi tải phim!');
            }

            showLoading(false);
        }
    });

    // Close modal on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMovieModal();
            closeAuthModal();
        }
    });
}

// Utility Functions
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = show ? 'flex' : 'none';
}

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function showProfile() {
    showToast('Tính năng đang phát triển');
}
