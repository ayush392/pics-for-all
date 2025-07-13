# pics-for-all

A full-stack platform for browsing and contributing high-quality nature and wildlife photographs. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), featuring Cloudinary AI Vision for auto-tagging, captioning, and content moderation. Users can upload, share, discover, and interact with high-quality images in a beautiful, responsive interface.

## 🌟 Features

### Core Functionality
- **Image Upload & Management**: Upload images with descriptions, tags, and location data
- **User Authentication**: Secure signup/login with JWT tokens
- **Image Gallery**: Responsive masonry layout for browsing images
- **Search & Discovery**: Search images by tags and descriptions
- **User Profiles**: View user profiles and their uploaded images
- **Like System**: Like and unlike images with real-time updates
- **Image Details**: Detailed view with metadata and interactions

### Technical Features
- **Cloudinary AI Vision**: Auto-tagging, captioning, and content moderation
- **Cloud Storage**: Images stored on Cloudinary with automatic thumbnails
- **Responsive Design**: Mobile-first approach with Bootstrap
- **Real-time Updates**: Dynamic content updates without page refresh
- **Image Optimization**: Automatic image resizing and compression
- **Security**: Password hashing, JWT authentication, and CORS protection

## 🚀 Live Demo

- **Frontend**: [https://pics-for-all.vercel.app/](https://pics-for-all.vercel.app/)
- **Backend API**: Deployed on Vercel

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - UI framework
- **React Router DOM** - Client-side routing
- **React Hot Toast** - User notifications
- **React Responsive Masonry** - Image gallery layout
- **Bootstrap** - CSS framework for responsive design
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud image storage with AI Vision
- **Nodemailer** - Email notifications

### Development Tools
- **Nodemon** - Development server with auto-restart
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## 📁 Project Structure

```
pics-for-all/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   └── icons/         # SVG icons
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── db/              # Database connection
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 20 or higher)
- MongoDB database
- Cloudinary account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pics-for-all.git
   cd pics-for-all
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create `.env` files in both `server/` and `client/` directories:

   **Server (.env)**
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ALLOWED_ORIGINS=http://localhost:3000
   PORT=4000
   ```

   **Client (.env)**
   ```env
   REACT_APP_BACKEND_URI=http://localhost:4000
   ```

5. **Start the development servers**

   **Backend (Terminal 1)**
   ```bash
   cd server
   npm run dev
   ```

   **Frontend (Terminal 2)**
   ```bash
   cd client
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## 📖 API Endpoints

### Authentication
- `POST /api/user/signup` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/profile` - Get user profile (protected)

### Posts/Images
- `GET /api/posts` - Get all images
- `POST /api/posts` - Upload new image (protected)
- `GET /api/posts/:id` - Get specific image
- `PUT /api/posts/:id` - Update image (protected)
- `DELETE /api/posts/:id` - Delete image (protected)
- `POST /api/posts/:id/like` - Like/unlike image (protected)

## 🔧 Configuration

### Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Add them to your server `.env` file

### MongoDB Setup
1. Create a MongoDB database (local or Atlas)
2. Get your connection string
3. Add it to your server `.env` file



## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Ayush** - [https://github.com/ayush392](https://github.com/ayush392)

## 🙏 Acknowledgments

- Bootstrap for the responsive design framework
- Cloudinary for image storage and optimization
- React community for excellent documentation and tools

---

⭐ If you find this project helpful, please give it a star!