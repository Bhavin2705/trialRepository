# Interview Mirror Server

A robust TypeScript Express.js server for the Interview Mirror application with MongoDB, JWT authentication, and AI-powered interview features.

## 🚀 Production Deployment on Render

### Prerequisites
1. MongoDB Atlas cluster set up
2. OpenRouter API key for AI features  
3. SMTP credentials for email functionality

### Environment Variables
Set these in your Render dashboard:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://Bhavin2005:YOUR_PASSWORD@cluster1.mmzsbrb.mongodb.net/interview-mirror?retryWrites=true&w=majority&appName=Cluster1
JWT_SECRET=your-super-secure-jwt-secret-here
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key
CLIENT_URL=https://your-frontend-domain.onrender.com
ALLOWED_ORIGINS=https://your-frontend-domain.onrender.com
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Deployment Steps
1. Connect your GitHub repository to Render
2. Set build command: `cd server && npm install && npm run build`
3. Set start command: `cd server && npm start`
4. Add environment variables listed above
5. Deploy!

### Health Check
Your server includes a health check endpoint at `/health`

## 🚀 Features

- **Authentication & Authorization**: Secure JWT-based auth with HTTP-only cookies
- **Email Verification**: Complete email verification workflow
- **Interview Sessions**: Create, manage, and analyze interview sessions
- **AI Integration**: OpenRouter/OpenAI integration for feedback generation
- **File Upload**: Secure video/audio recording upload with validation
- **Rate Limiting**: Multiple rate limiting strategies for different endpoints
- **Real-time Analytics**: Dashboard with session statistics and progress tracking
- **Data Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Centralized error handling with detailed logging
- **Security**: Helmet, CORS, HPP, and MongoDB sanitization

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with HTTP-only cookies
- **File Upload**: Multer with custom storage
- **Email**: Nodemailer with SMTP
- **AI**: OpenRouter API integration
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Testing**: Jest with TypeScript support

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit environment variables
# Add your MongoDB URI, JWT secret, OpenRouter API key, etc.
```

## 🔧 Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interview-mirror
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
COOKIE_EXPIRE=30

EMAIL_FROM=noreply@interviewmirror.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password

OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

CLIENT_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

MAX_FILE_SIZE=104857600
UPLOAD_PATH=./uploads

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build:prod

# Start production server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📁 Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic services
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

## 🔒 Security Features

- JWT tokens with HTTP-only cookies
- Password hashing with bcrypt
- Rate limiting on all endpoints
- Input validation and sanitization
- MongoDB injection protection
- HTTP parameter pollution protection
- Security headers with Helmet
- CORS configuration

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify-email/:token` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password/:token` - Password reset

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `DELETE /api/users/account` - Delete account
- `GET /api/users/dashboard` - Get dashboard data

### Sessions
- `POST /api/sessions` - Create interview session
- `GET /api/sessions` - Get user sessions
- `GET /api/sessions/:id` - Get specific session
- `PUT /api/sessions/:id` - Update session
- `POST /api/sessions/:id/complete` - Complete session
- `GET /api/sessions/:id/feedback` - Get session feedback

### Uploads
- `POST /api/uploads/recording` - Upload recording
- `POST /api/uploads/avatar` - Upload avatar
- `DELETE /api/uploads/file` - Delete file

## 🚀 Deployment

### Render Deployment

1. Push your code to GitHub
2. Connect your repository to Render
3. Set environment variables in Render dashboard
4. Deploy using the provided `render.yaml` configuration

### Environment Setup

Make sure to set these secrets in your Render dashboard:
- `MONGODB_URI`
- `JWT_SECRET` 
- `OPENROUTER_API_KEY`
- `SMTP_EMAIL`
- `SMTP_PASSWORD`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📈 Performance

- Compression middleware for response optimization
- File upload size limits and validation
- Database query optimization with indexes
- Rate limiting to prevent abuse
- Efficient pagination for large datasets

## 🔄 Error Handling

- Centralized error handling middleware
- Detailed error logging
- User-friendly error messages
- Development vs production error responses
- Async error catching with wrapper

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 👨‍💻 Author

Created by bhavin2705

---

For frontend implementation, this server provides a complete REST API that can be consumed by any frontend framework (React, Vue, Angular, etc.).# Interview-Mirror-Backend
