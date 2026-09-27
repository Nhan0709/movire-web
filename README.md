# 🎬 CinemaHub - Nền tảng xem phim trực tuyến

Web xem phim hiện đại với đầy đủ tính năng: tích hợp TMDB API, hệ thống đăng ký/đăng nhập, đánh giá phim, phân trang, video player nâng cao và nhiều hơn nữa.

![CinemaHub Banner](https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=400&fit=crop)

## ✨ Tính năng

### 🎯 Tính năng chính
- ✅ **Tích hợp TMDB API** - Dữ liệu phim thực tế từ The Movie Database
- ✅ **Hệ thống Authentication** - Đăng ký, đăng nhập với JWT
- ✅ **Đánh giá phim** - Hệ thống đánh giá 1-5 sao cho mỗi phim
- ✅ **Yêu thích phim** - Lưu phim yêu thích vào tài khoản
- ✅ **Phân trang** - Duyệt qua hàng nghìn bộ phim
- ✅ **Tìm kiếm** - Tìm kiếm phim theo tên
- ✅ **Lọc theo thể loại** - Hành động, hài, kinh dị, khoa học viễn tưởng...
- ✅ **Video Player nâng cao** - Plyr.js với YouTube embed
- ✅ **Responsive Design** - Hoạt động tốt trên mọi thiết bị
- ✅ **Dark Theme** - Giao diện tối hiện đại, dễ nhìn

### 📊 Dữ liệu & Thống kê
- Phim phổ biến
- Phim xu hướng (theo tuần/ngày)
- Phim đánh giá cao
- Phim sắp chiếu
- Lượt xem cho mỗi phim
- Thông tin diễn viên
- Phim tương tự

### 🎨 Giao diện
- Hero section với phim nổi bật
- Grid layout responsive
- Modal popup xem chi tiết phim
- Toast notifications
- Loading spinner
- Dropdown menu người dùng

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Axios** - HTTP client
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Express Rate Limit** - Rate limiting

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling với custom properties
- **Vanilla JavaScript** - Logic (không dùng framework)
- **Plyr.js** - Video player
- **Font Awesome** - Icons

### API
- **TMDB API** - The Movie Database API

## 📋 Yêu cầu hệ thống

- Node.js >= 14.x
- MongoDB >= 4.x
- NPM hoặc Yarn
- TMDB API Key (miễn phí)

## 🚀 Cài đặt

### 1. Clone repository

```bash
cd movie-website
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` trong thư mục `backend`:

```bash
cp .env.example .env
```

Cập nhật file `.env` với thông tin của bạn:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/cinemahub

# JWT Secret (thay đổi thành chuỗi ngẫu nhiên phức tạp)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# TMDB API (lấy tại https://www.themoviedb.org/settings/api)
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. Cấu hình Frontend

Mở file `config.js` và cập nhật TMDB API key:

```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:5000/api',
    TMDB_IMAGE_BASE: 'https://image.tmdb.org/t/p',
    TMDB_API_KEY: 'your_tmdb_api_key_here', // Thay bằng API key của bạn
};
```

### 5. Cài đặt MongoDB

#### Windows
1. Tải MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Cài đặt với MongoDB Compass (GUI tool)
3. Khởi động MongoDB service

#### Mac (Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu)
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 6. Lấy TMDB API Key

1. Truy cập: https://www.themoviedb.org/signup
2. Đăng ký tài khoản miễn phí
3. Vào Settings → API → Create → Developer
4. Điền thông tin ứng dụng
5. Copy API Key (v3 auth)

## 🎮 Chạy ứng dụng

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server chạy tại: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
# Sử dụng Live Server extension trong VS Code
# Hoặc cài đặt http-server global:
npm install -g http-server
http-server -p 3000
```
Frontend chạy tại: http://localhost:3000

### Production Mode

**Backend:**
```bash
cd backend
NODE_ENV=production npm start
```

**Frontend:**
- Deploy lên Netlify, Vercel, hoặc hosting tĩnh
- Cập nhật `API_BASE_URL` trong `config.js` thành URL production của backend

## 📁 Cấu trúc dự án

```
movie-website/
├── backend/
│   ├── models/
│   │   ├── Movie.js          # Movie schema
│   │   └── User.js           # User schema
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── movies.js         # Movie routes (TMDB integration)
│   │   └── users.js          # User routes
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── .env.example          # Environment variables template
│   ├── package.json          # Backend dependencies
│   └── server.js             # Express server
│
├── index.html                # Main HTML file
├── styles.css                # All CSS styles
├── config.js                 # Configuration & utilities
├── api.js                    # API service layer
├── auth.js                   # Authentication manager
├── app.js                    # Main application logic
└── README.md                 # This file
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại (protected)

### Movies
- `GET /api/movies/popular?page=1` - Phim phổ biến
- `GET /api/movies/trending?page=1&time_window=week` - Phim xu hướng
- `GET /api/movies/top-rated?page=1` - Phim đánh giá cao
- `GET /api/movies/upcoming?page=1` - Phim sắp chiếu
- `GET /api/movies/search?q=query&page=1` - Tìm kiếm phim
- `GET /api/movies/genres` - Danh sách thể loại
- `GET /api/movies/by-genre/:genreId?page=1` - Phim theo thể loại
- `GET /api/movies/:id` - Chi tiết phim
- `POST /api/movies/:id/rate` - Đánh giá phim (protected)
- `POST /api/movies/:id/view` - Tăng lượt xem

### Users
- `GET /api/users/favorites` - Danh sách yêu thích (protected)
- `POST /api/users/favorites/:movieId` - Thêm vào yêu thích (protected)
- `DELETE /api/users/favorites/:movieId` - Xóa khỏi yêu thích (protected)
- `GET /api/users/ratings` - Đánh giá của user (protected)
- `GET /api/users/watch-history` - Lịch sử xem (protected)
- `POST /api/users/watch-history/:movieId` - Thêm vào lịch sử (protected)
- `GET /api/users/profile` - Thông tin profile (protected)
- `PUT /api/users/profile` - Cập nhật profile (protected)

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# Get popular movies
curl http://localhost:5000/api/movies/popular
```

## 🎨 Tùy chỉnh

### Thay đổi màu sắc

Sửa CSS variables trong `styles.css`:

```css
:root {
    --primary-color: #e50914;      /* Màu chủ đạo */
    --secondary-color: #221f1f;    /* Màu phụ */
    --dark-bg: #141414;            /* Màu nền */
    --card-bg: #2f2f2f;            /* Màu card */
    --text-primary: #ffffff;        /* Màu chữ chính */
    --text-secondary: #b3b3b3;     /* Màu chữ phụ */
}
```

### Thêm tính năng mới

1. **Backend**: Tạo route mới trong `backend/routes/`
2. **Frontend**: Thêm API call trong `api.js`
3. **UI**: Cập nhật `app.js` và `index.html`

## 🐛 Xử lý lỗi thường gặp

### 1. MongoDB connection error
```
❌ MongoDB connection error: connect ECONNREFUSED
```
**Giải pháp**: Đảm bảo MongoDB đang chạy:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongodb
```

### 2. CORS error
```
Access to fetch at 'http://localhost:5000' blocked by CORS
```
**Giải pháp**: Kiểm tra `FRONTEND_URL` trong `.env` khớp với URL frontend của bạn

### 3. TMDB API error
```
Error fetching popular movies: Request failed with status code 401
```
**Giải pháp**: Kiểm tra TMDB API key trong `.env` và `config.js`

### 4. JWT token invalid
```
Token is not valid
```
**Giải pháp**: Đăng xuất và đăng nhập lại, hoặc xóa localStorage

## 🚀 Deployment

### Backend (Heroku, Railway, Render)

1. Tạo tài khoản trên platform
2. Kết nối Git repository
3. Thiết lập environment variables
4. Deploy từ `backend` folder

### Frontend (Netlify, Vercel)

1. Build production files
2. Cập nhật `API_BASE_URL` trong `config.js`
3. Deploy thư mục root

### Database (MongoDB Atlas)

1. Tạo cluster miễn phí tại https://www.mongodb.com/cloud/atlas
2. Lấy connection string
3. Cập nhật `MONGODB_URI` trong `.env`

## 📈 Roadmap

- [ ] Bình luận phim
- [ ] Chia sẻ lên mạng xã hội
- [ ] Watchlist / danh sách xem sau
- [ ] Recommendations cá nhân hóa
- [ ] Admin panel
- [ ] Multi-language support
- [ ] PWA support
- [ ] Real-time notifications
- [ ] Video streaming thực tế (thay vì YouTube)

## 🤝 Đóng góp

Contributions, issues và feature requests đều được chào đón!

## 📝 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

## 🙏 Credits

- **TMDB** - The Movie Database API
- **Plyr.js** - Video player
- **Font Awesome** - Icons
- **Unsplash** - Placeholder images

## 📧 Liên hệ

Nếu có câu hỏi hoặc cần hỗ trợ, vui lòng tạo issue trên GitHub.

---

**Made with ❤️ by CinemaHub Team**

🎬 Happy Coding & Enjoy Movies! 🍿
