// Authentication Manager
class AuthManager {
    constructor() {
        this.user = this.getStoredUser();
        this.isAuthenticated = !!this.user;
    }

    getStoredUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    async login(email, password) {
        try {
            const data = await api.login(email, password);
            this.user = data.user;
            this.isAuthenticated = true;
            this.updateUI();
            return { success: true, message: 'Đăng nhập thành công!' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async register(username, email, password) {
        try {
            const data = await api.register(username, email, password);
            this.user = data.user;
            this.isAuthenticated = true;
            this.updateUI();
            return { success: true, message: 'Đăng ký thành công!' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    logout() {
        api.logout();
        this.user = null;
        this.isAuthenticated = false;
        this.updateUI();
        showToast('Đã đăng xuất');
        navigateTo('home');
    }

    updateUI() {
        const userMenu = document.getElementById('userMenu');

        if (this.isAuthenticated && this.user) {
            userMenu.innerHTML = `
                <div class="user-dropdown">
                    <button class="user-btn">
                        <img src="${this.user.avatar}" alt="${this.user.username}">
                        <span>${this.user.username}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="dropdown-menu">
                        <a href="#" onclick="showProfile()"><i class="fas fa-user"></i> Tài khoản</a>
                        <a href="#" onclick="navigateTo('favorites')"><i class="fas fa-heart"></i> Yêu thích</a>
                        <a href="#" onclick="authManager.logout()"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a>
                    </div>
                </div>
            `;

            // Add dropdown toggle
            const userBtn = userMenu.querySelector('.user-btn');
            const dropdownMenu = userMenu.querySelector('.dropdown-menu');

            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('show');
            });

            document.addEventListener('click', () => {
                dropdownMenu.classList.remove('show');
            });
        } else {
            userMenu.innerHTML = `
                <button class="btn btn-primary btn-sm" onclick="openAuthModal()">
                    <i class="fas fa-user"></i> Đăng nhập
                </button>
            `;
        }
    }

    requireAuth() {
        if (!this.isAuthenticated) {
            openAuthModal();
            return false;
        }
        return true;
    }
}

// Initialize Auth Manager
const authManager = new AuthManager();

// Auth Modal Functions
function openAuthModal() {
    document.getElementById('authModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    clearAuthForms();
}

function clearAuthForms() {
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
}

// Auth Tab Switching
document.addEventListener('DOMContentLoaded', () => {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;

            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(`${tabName}Form`).classList.add('active');
            clearAuthForms();
        });
    });

    // Login Form Submit
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorDiv = document.getElementById('loginError');

        errorDiv.textContent = '';

        const result = await authManager.login(email, password);

        if (result.success) {
            showToast(result.message);
            closeAuthModal();
            location.reload();
        } else {
            errorDiv.textContent = result.message;
        }
    });

    // Register Form Submit
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const errorDiv = document.getElementById('registerError');

        errorDiv.textContent = '';

        const result = await authManager.register(username, email, password);

        if (result.success) {
            showToast(result.message);
            closeAuthModal();
            location.reload();
        } else {
            errorDiv.textContent = result.message;
        }
    });

    // Initialize UI
    authManager.updateUI();
});
