# InvoicePro-NG Backend API

A robust and scalable backend API for the InvoicePro-NG invoicing system built with Express.js, MongoDB, and modern security practices.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [Development Workflow](#development-workflow)
- [Team Rules](#team-rules)
- [Dependencies](#dependencies)

## 🎯 Project Overview

InvoicePro-NG Backend is a complete invoicing system API that handles:

- **User Authentication** - Registration, login, and session management
- **Invoice Management** - Create, read, update, and delete invoices
- **User Management** - User profiles and business information
- **Security** - JWT authentication, rate limiting, password hashing, and CORS protection

**Version:** 1.0.0  
**License:** ISC

## ✨ Features

- ✅ User registration with email validation
- ✅ Secure user login with JWT tokens
- ✅ Session management with secure cookies
- ✅ Password hashing with bcryptjs
- ✅ Rate limiting to prevent abuse
- ✅ CORS support with origin validation
- ✅ Helmet security headers
- ✅ MongoDB integration with Mongoose
- ✅ Zod schema validation
- ✅ Comprehensive error handling
- ✅ Health check endpoint
- ✅ User roles (user, admin, superAdmin)

## 📦 Prerequisites

- Node.js 14.x or higher
- npm or yarn
- MongoDB (local or cloud instance like MongoDB Atlas)
- Git

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/121kelvinkane/InvoicePro-NG-backend.git
   cd InvoicePro-NG-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🔧 Environment Setup

1. **Create a `.env` file in the root directory:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your environment variables:**
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000

   # Database
   MONGO_URI=mongodb://localhost:27017/invoicepro-ng
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/invoicepro-ng

   # JWT Configuration
   ACCESS_TOKEN=your_jwt_secret_key_here

   # Client Origin (CORS)
   CLIENT_ORIGIN=http://localhost:3000,http://localhost:3001
   # For production: use specific domain URLs
   # For development: can use * to allow all origins
   ```

### Environment Variables Explanation

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` or `production` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/invoicepro-ng` |
| `ACCESS_TOKEN` | JWT secret key | Generate a random string |
| `CLIENT_ORIGIN` | Allowed CORS origins | `http://localhost:3000` |

## 🏃 Running the Project

### Development Mode (with hot reload)
```bash
npm run dev
```
The server will start with nodemon and auto-reload on file changes.

### Production Mode
```bash
npm start
```
The server runs directly without hot-reload.

### Server Output
```
API running on http://localhost:5000
```

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Health Check
**Check API status and uptime**

```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "uptime": 123.456
  }
}
```

---

### Authentication Endpoints

#### 1. Sign Up (Register)
**Create a new user account**

```http
POST /auth/sign-up
```

**Rate Limited:** Yes (prevents registration abuse)

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Validation Rules:**
- `fullName`: String, 3-100 characters, trimmed, normalized whitespace
- `email`: Valid email format, converted to lowercase
- `password`: Minimum 8 characters, maximum 100 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "user": {
      "userId": "USR_1234567890",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation errors
- `409 Conflict` - Email already exists

**Example Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Sign Up failed",
    "details": [
      {
        "field": "email",
        "message": "Please enter a valid email address."
      }
    ]
  }
}
```

---

#### 2. Sign In (Login)
**Authenticate user and receive JWT token**

```http
POST /auth/sign-in
```

**Rate Limited:** Yes (prevents brute force attacks)

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Validation Rules:**
- `email`: Valid email format, required
- `password`: Required, minimum 1 character

**Success Response (200):**
```json
{
  "success": true,
  "message": "Sign in successful",
  "data": {
    "user": {
      "userId": "USR_1234567890",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Invalid credentials

**Example Error:**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_ERROR",
    "message": "Invalid Credentials"
  }
}
```

---

#### 3. Sign Out (Logout)
**End user session and clear authentication cookie**

```http
POST /auth/sign-out
```

**Headers:**
- No authentication required for this endpoint

**Success Response (200):**
```json
{
  "success": true,
  "message": "You have been signed out"
}
```

**Error Responses:**
- `500 Internal Server Error` - Server error during logout

---

## 📊 Database Models

### User Model

```javascript
{
  userId: String,              // Unique user ID (auto-generated)
  fullName: String,            // User's full name
  email: String,               // Unique email address
  password: String,            // Hashed password (never stored in plain text)
  role: String,                // "user", "admin", or "superAdmin" (default: "user")
  isVerified: Boolean,         // Email verification status (default: false)
  resetPasswordToken: String,  // For password reset functionality
  resetPasswordExpires: Date,  // Password reset token expiration
  createdAt: Date,             // Account creation timestamp
  updatedAt: Date              // Last update timestamp
}
```

**Indexes:**
- `userId` - Unique index for fast lookups
- `email` - Unique index for email-based queries

---

## 📁 Project Structure

```
InvoicePro-NG-backend/
├── src/
│   ├── app.js                          # Express app configuration
│   ├── server.js                       # Server entry point
│   ├── config/
│   │   ├── db.js                       # MongoDB connection setup
│   │   └── env.js                      # Environment variables
│   ├── controllers/
│   │   └── auth/
│   │       ├── signUp.js               # Registration logic
│   │       ├── signIn.js               # Login logic
│   │       └── signOut.js              # Logout logic
│   │   └── invoice/                    # Invoice controllers (to be implemented)
│   ├── middlewares/
│   │   ├── authenticate.js             # JWT verification middleware
│   │   ├── userId.js                   # User ID generator middleware
│   │   └── invoiceId.js                # Invoice ID generator middleware
│   ├── models/
│   │   ├── user.model.js               # User database schema
│   │   ├── business.model.js           # Business profile schema
│   │   └── invoice.model.js            # Invoice schema
│   ├── routes/
│   │   ├── index.js                    # Main route aggregator
│   │   └── userRouter.js               # Authentication routes
│   ├── schema/
│   │   └── auth.schema.js              # Zod validation schemas
│   ├── services/
│   │   └── rateLimit.js                # Rate limiting configuration
│   └── utils/
│       ├── generateToken.js            # JWT token generation
│       ├── response.js                 # Success/error response helpers
│       └── userResponse.js             # User-specific response formatting
├── docs/
│   └── team-rules.md                   # Team development guidelines
├── package.json                        # Dependencies and scripts
├── .env.example                        # Environment template
└── README.md                           # This file
```

---

## 🔒 Security Features

### 1. **Password Security**
- Passwords are hashed using bcryptjs (salt rounds: 10)
- Never stored or logged in plain text
- Minimum 8 characters required

### 2. **JWT Authentication**
- Token-based authentication using JSON Web Tokens
- Secure secret key in environment variables
- Tokens issued on successful login/registration

### 3. **Rate Limiting**
- **Registration:** Limited to prevent account creation abuse
- **Login:** Limited to prevent brute force attacks
- Configured per endpoint

### 4. **CORS Protection**
- Origin validation with configurable client origins
- Credentials support for cookie-based sessions
- Prevents unauthorized cross-origin requests

### 5. **Helmet Security Headers**
- Protects against common web vulnerabilities
- Sets security-related HTTP headers
- Enabled by default in app.js

### 6. **Input Validation**
- Zod schema validation on all endpoints
- Type checking and format validation
- Comprehensive error messages

### 7. **Secure Cookies**
- HTTP-only cookies for session management
- Cleared on sign-out
- CORS-compatible configuration

---

## 👥 Development Workflow

### Branch Strategy

```
main (production-ready code)
  ↓
feature branches (new features)
  ↓
Pull Request (code review)
  ↓
Merge (after approval)
```

### Branch Naming Conventions

```
feature/endpoint-name          # New features
fix/bug-description            # Bug fixes
docs/documentation-topic       # Documentation updates
chore/task-description         # Maintenance tasks
refactor/component-name        # Code refactoring
```

### Commit Message Format

```
<type>: <description>

Examples:
- feat: add user registration endpoint
- fix: handle duplicate email validation
- docs: update API documentation
- chore: add environment variables
- refactor: improve error handling
```

### Pull Request Process

1. Create feature branch from `main`
2. Make meaningful commits
3. Push branch to repository
4. Open Pull Request with clear description
5. Wait for Team Lead review
6. Address requested changes
7. Merge after approval

### Definition of Done

A task is complete when:
- ✅ Code works locally
- ✅ Follows project structure
- ✅ Includes validation and error handling
- ✅ Has clear commit messages
- ✅ Pull Request is approved
- ✅ Code is merged into main

---

## 📚 Team Rules

See [docs/team-rules.md](docs/team-rules.md) for detailed team development guidelines.

---

## 📦 Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.2.1 | Web framework |
| `mongoose` | ^9.9.2 | MongoDB ODM |
| `bcryptjs` | ^3.0.3 | Password hashing |
| `jsonwebtoken` | ^9.0.3 | JWT token generation |
| `cors` | ^2.8.6 | Cross-origin resource sharing |
| `helmet` | ^8.3.0 | Security headers |
| `dotenv` | ^17.4.2 | Environment variables |
| `cookie-parser` | ^1.4.7 | Cookie parsing |
| `express-rate-limit` | ^8.6.2 | Rate limiting |
| `zod` | ^4.4.3 | Schema validation |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `nodemon` | ^3.1.14 | Auto-reload on file changes |

### Installation
```bash
npm install
```

---

## 🧪 Testing (To Be Implemented)

### Running Tests
```bash
npm test
```

### Test Structure
- Unit tests for utility functions
- Integration tests for API endpoints
- Authentication and validation tests

---

## 🐛 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [] // Optional field-level errors
  }
}
```

### Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful request |
| 201 | Created | Resource created |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Invalid credentials |
| 409 | Conflict | Email already exists |
| 500 | Server Error | Internal error |

---

## 🔄 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

---

## 📝 Upcoming Features

- ✅ Invoice CRUD operations
- ✅ Customer management
- ✅ Business profiles
- ✅ Email verification
- ✅ Password reset functionality
- ✅ 2FA/TOTP authentication
- ✅ Invoice templates
- ✅ Payment integration

---

## 🤝 Contributing

1. Follow the development workflow
2. Adhere to branch naming conventions
3. Write meaningful commit messages
4. Open a Pull Request for review
5. Wait for Team Lead approval before merging

---

## 📧 Support

For issues or questions, please create an issue in the GitHub repository:
https://github.com/121kelvinkane/InvoicePro-NG-backend/issues

---

## 📄 License

ISC License - See LICENSE file for details

---

**Last Updated:** 2026  
**Repository:** https://github.com/121kelvinkane/InvoicePro-NG-backend
