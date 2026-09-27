// Movie Database
const moviesData = [
    {
        id: 1,
        title: "Avengers: Endgame",
        year: 2019,
        rating: 8.4,
        duration: "181 phút",
        category: "action",
        genres: ["Hành động", "Phiêu lưu", "Khoa học viễn tưởng"],
        description: "Sau sự kiện hủy diệt của Thanos, các Avengers tập hợp một lần cuối để đảo ngược hành động của ác nhân và khôi phục lại trật tự vũ trụ.",
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500",
        videoUrl: "https://www.youtube.com/embed/TcMBFSGVi1c"
    },
    {
        id: 2,
        title: "The Dark Knight",
        year: 2008,
        rating: 9.0,
        duration: "152 phút",
        category: "action",
        genres: ["Hành động", "Tội phạm", "Chính kịch"],
        description: "Batman phải đối mặt với kẻ thù nguy hiểm nhất của mình - Joker, kẻ đang tạo ra sự hỗn loạn và khủng bố ở Gotham City.",
        poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500",
        videoUrl: "https://www.youtube.com/embed/EXeTwQWrcwY"
    },
    {
        id: 3,
        title: "Inception",
        year: 2010,
        rating: 8.8,
        duration: "148 phút",
        category: "sci-fi",
        genres: ["Khoa học viễn tưởng", "Hành động", "Giật gân"],
        description: "Một kẻ trộm chuyên đánh cắp bí mật từ tiềm thức người khác được giao nhiệm vụ cấy một ý tưởng vào tâm trí CEO.",
        poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500",
        videoUrl: "https://www.youtube.com/embed/YoHD9XEInc0"
    },
    {
        id: 4,
        title: "Parasite",
        year: 2019,
        rating: 8.5,
        duration: "132 phút",
        category: "drama",
        genres: ["Chính kịch", "Giật gân", "Hài"],
        description: "Câu chuyện về hai gia đình - một giàu có và một nghèo khó, khi số phận họ đan xen vào nhau theo cách bất ngờ.",
        poster: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=500",
        videoUrl: "https://www.youtube.com/embed/5xH0HfJHsaY"
    },
    {
        id: 5,
        title: "The Shawshank Redemption",
        year: 1994,
        rating: 9.3,
        duration: "142 phút",
        category: "drama",
        genres: ["Chính kịch"],
        description: "Hai tù nhân kết bạn trong nhiều năm, tìm thấy sự an ủi và cứu chuộc thông qua những hành động tử tế.",
        poster: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=500",
        videoUrl: "https://www.youtube.com/embed/6hB3S9bIaco"
    },
    {
        id: 6,
        title: "Interstellar",
        year: 2014,
        rating: 8.6,
        duration: "169 phút",
        category: "sci-fi",
        genres: ["Khoa học viễn tưởng", "Phiêu lưu", "Chính kịch"],
        description: "Một nhóm nhà khám phá du hành xuyên không gian qua lỗ sâu để tìm kiếm hy vọng mới cho nhân loại.",
        poster: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500",
        videoUrl: "https://www.youtube.com/embed/zSWdZVtXT7E"
    },
    {
        id: 7,
        title: "The Conjuring",
        year: 2013,
        rating: 7.5,
        duration: "112 phút",
        category: "horror",
        genres: ["Kinh dị", "Giật gân", "Bí ẩn"],
        description: "Các nhà điều tra huyền bí Ed và Lorraine Warren giúp một gia đình bị ám bởi linh hồn ác độc trong trang trại.",
        poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500",
        videoUrl: "https://www.youtube.com/embed/k10ETZ41q5o"
    },
    {
        id: 8,
        title: "Superbad",
        year: 2007,
        rating: 7.6,
        duration: "113 phút",
        category: "comedy",
        genres: ["Hài", "Tuổi teen"],
        description: "Hai bạn thân cấp ba cố gắng tận hưởng những ngày cuối cùng trước khi tốt nghiệp với một đêm tiệc điên rồ.",
        poster: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=500",
        videoUrl: "https://www.youtube.com/embed/4eaZ_48ZYog"
    },
    {
        id: 9,
        title: "Spider-Man: No Way Home",
        year: 2021,
        rating: 8.2,
        duration: "148 phút",
        category: "action",
        genres: ["Hành động", "Phiêu lưu", "Khoa học viễn tưởng"],
        description: "Peter Parker tìm kiếm sự giúp đỡ từ Doctor Strange, nhưng phép thuật đã mở ra đa vũ trụ với những hậu quả nguy hiểm.",
        poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500",
        videoUrl: "https://www.youtube.com/embed/JfVOs4VSpmA"
    },
    {
        id: 10,
        title: "Joker",
        year: 2019,
        rating: 8.4,
        duration: "122 phút",
        category: "drama",
        genres: ["Chính kịch", "Tội phạm", "Giật gân"],
        description: "Câu chuyện nguồn gốc về Joker, một diễn viên hài thất bại bị xã hội ruồng bỏ và dần rơi vào con đường tội phạm.",
        poster: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=500",
        videoUrl: "https://www.youtube.com/embed/zAGVQLHvwOY"
    },
    {
        id: 11,
        title: "A Quiet Place",
        year: 2018,
        rating: 7.5,
        duration: "90 phút",
        category: "horror",
        genres: ["Kinh dị", "Chính kịch", "Khoa học viễn tưởng"],
        description: "Một gia đình phải sống trong im lặng tuyệt đối để tránh bị các sinh vật bí ẩn săn đuổi bằng âm thanh.",
        poster: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=500",
        videoUrl: "https://www.youtube.com/embed/WR7cc5t7tv8"
    },
    {
        id: 12,
        title: "The Hangover",
        year: 2009,
        rating: 7.7,
        duration: "100 phút",
        category: "comedy",
        genres: ["Hài", "Bí ẩn"],
        description: "Sau một đêm độc thân điên cuồng ở Las Vegas, ba người bạn thức dậy mà không nhớ gì và phải tìm chú rể mất tích.",
        poster: "https://images.unsplash.com/photo-1514168757508-07ffe9ae125b?w=500",
        videoUrl: "https://www.youtube.com/embed/tcdUhdOlz9M"
    }
];

// State Management
let currentCategory = 'all';
let currentPage = 'home';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentMovieId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderMovies();
    initializeEventListeners();
    updateFavoriteButtons();
});

// Event Listeners
function initializeEventListeners() {
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            renderMovies();
        });
    });

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
            currentPage = e.target.dataset.page;
            switchPage(currentPage);
        });
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        renderMovies(searchTerm);
    });

    // Close modal on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Render Movies
function renderMovies(searchTerm = '') {
    const moviesGrid = document.getElementById('moviesGrid');
    let filteredMovies = moviesData;

    // Filter by category
    if (currentCategory !== 'all') {
        filteredMovies = filteredMovies.filter(movie => movie.category === currentCategory);
    }

    // Filter by search term
    if (searchTerm) {
        filteredMovies = filteredMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.description.toLowerCase().includes(searchTerm)
        );
    }

    if (filteredMovies.length === 0) {
        moviesGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-film"></i>
                <h3>Không tìm thấy phim</h3>
                <p>Thử tìm kiếm với từ khóa khác hoặc chọn thể loại khác</p>
            </div>
        `;
        return;
    }

    moviesGrid.innerHTML = filteredMovies.map(movie => `
        <div class="movie-card" onclick="openMovieModal(${movie.id})">
            <button class="favorite-btn ${favorites.includes(movie.id) ? 'active' : ''}"
                    onclick="event.stopPropagation(); toggleFavorite(${movie.id})">
                <i class="${favorites.includes(movie.id) ? 'fas' : 'far'} fa-heart"></i>
            </button>
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-details">
                    <span class="rating"><i class="fas fa-star"></i> ${movie.rating}</span>
                    <span>${movie.year}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Render Favorites
function renderFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const favoriteMovies = moviesData.filter(movie => favorites.includes(movie.id));

    if (favoriteMovies.length === 0) {
        favoritesGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-heart"></i>
                <h3>Chưa có phim yêu thích</h3>
                <p>Thêm phim vào danh sách yêu thích để xem sau</p>
            </div>
        `;
        return;
    }

    favoritesGrid.innerHTML = favoriteMovies.map(movie => `
        <div class="movie-card" onclick="openMovieModal(${movie.id})">
            <button class="favorite-btn active"
                    onclick="event.stopPropagation(); toggleFavorite(${movie.id})">
                <i class="fas fa-heart"></i>
            </button>
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-details">
                    <span class="rating"><i class="fas fa-star"></i> ${movie.rating}</span>
                    <span>${movie.year}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Switch Page
function switchPage(page) {
    const moviesSection = document.querySelector('.movies-section');
    const favoritesSection = document.getElementById('favoritesSection');
    const heroSection = document.getElementById('heroSection');
    const categoriesSection = document.querySelector('.categories-section');

    if (page === 'favorites') {
        moviesSection.style.display = 'none';
        favoritesSection.style.display = 'block';
        heroSection.style.display = 'none';
        categoriesSection.style.display = 'none';
        renderFavorites();
    } else {
        moviesSection.style.display = 'block';
        favoritesSection.style.display = 'none';
        heroSection.style.display = 'flex';
        categoriesSection.style.display = 'block';
        renderMovies();
    }
}

// Toggle Favorite
function toggleFavorite(movieId) {
    const index = favorites.indexOf(movieId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(movieId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButtons();

    if (currentPage === 'favorites') {
        renderFavorites();
    } else {
        renderMovies();
    }

    // Update modal if open
    if (currentMovieId === movieId) {
        updateModalFavoriteButton();
    }
}

// Update Favorite Buttons
function updateFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const movieId = parseInt(btn.getAttribute('onclick').match(/\d+/)[0]);
        if (favorites.includes(movieId)) {
            btn.classList.add('active');
            btn.querySelector('i').className = 'fas fa-heart';
        } else {
            btn.classList.remove('active');
            btn.querySelector('i').className = 'far fa-heart';
        }
    });
}

// Play Movie
function playMovie(movieId) {
    openMovieModal(movieId);
}

// Open Movie Modal
function openMovieModal(movieId) {
    const movie = moviesData.find(m => m.id === movieId);
    if (!movie) return;

    currentMovieId = movieId;

    const modal = document.getElementById('movieModal');
    const videoPlayer = document.getElementById('videoPlayer');

    // Set video
    videoPlayer.src = movie.videoUrl;

    // Set details
    document.getElementById('modalTitle').textContent = movie.title;
    document.getElementById('modalRating').innerHTML = `<i class="fas fa-star"></i> ${movie.rating}`;
    document.getElementById('modalYear').textContent = movie.year;
    document.getElementById('modalDuration').textContent = movie.duration;
    document.getElementById('modalDescription').textContent = movie.description;

    // Set genres
    const genresHtml = movie.genres.map(genre =>
        `<span class="genre-tag">${genre}</span>`
    ).join('');
    document.getElementById('modalGenres').innerHTML = genresHtml;

    // Update favorite button
    updateModalFavoriteButton();

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('movieModal');
    const videoPlayer = document.getElementById('videoPlayer');

    modal.classList.remove('active');
    videoPlayer.src = '';
    currentMovieId = null;
    document.body.style.overflow = 'auto';
}

// Toggle Favorite from Modal
function toggleFavoriteFromModal() {
    if (currentMovieId) {
        toggleFavorite(currentMovieId);
    }
}

// Update Modal Favorite Button
function updateModalFavoriteButton() {
    const isFavorite = favorites.includes(currentMovieId);
    const icon = document.getElementById('modalFavoriteIcon');
    const text = document.getElementById('modalFavoriteText');

    if (isFavorite) {
        icon.className = 'fas fa-heart';
        text.textContent = 'Đã yêu thích';
    } else {
        icon.className = 'far fa-heart';
        text.textContent = 'Yêu thích';
    }
}
