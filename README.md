# 🚀 SkillSwap Backend API

Backend API for SkillSwap – A Skill Exchange Platform.

Built using:
- Node.js
- Express.js
- Supabase (PostgreSQL)
- JWT Authentication
- REST API Architecture

---

## 📌 Overview

SkillSwap allows users to:

- Register and login securely
- Create and update profiles
- Match skills with other users
- Send and manage exchange requests
- Schedule sessions
- Give feedback and ratings
- Share resources
- Post in a community forum
- Receive notifications

This backend manages authentication, authorization, business logic, and database operations.

---

# 🏗 Tech Stack

- Node.js
- Express.js
- Supabase (PostgreSQL)
- JWT
- bcrypt
- REST API

---

# 📂 Project Structure

backend/

• controllers → All business logic files  
• routes → API route definitions  
• middleware → Authentication & error handling  
• utils → Helper functions  
• config → Supabase connection  
• server.js → Main entry file  
• .env → Environment variables  
• README.md → Project documentation

---

# 🔐 Authentication

### Features

- Register User
- Login User
- JWT Token Generation
- Protected Routes via auth middleware

### Security

- Password hashing using bcrypt
- Token verification using JWT_SECRET
- Authorization header validation

---

# 👤 User Controller

Functions:

- getProfile
- updateProfile
- getAllUsers
- getUserById
- getMatches (skill overlap logic)
- searchUsersBySkill
- getTopRatedUsers

Supports:
- Skill matching
- Search by skill
- Sorting by rating
- Profile management

---

# 🤝 Request Controller (Skill Exchange)

Features:

- Send Request
- Accept / Reject Request
- Schedule Session
- Update Session Details
- Mark Session as Completed
- Authorization checks (sender/receiver validation)
- Automatic notification creation

Ensures:
- Only receiver can accept/reject
- Both users can schedule session
- Only session participants can mark completed

---

# ⭐ Feedback System

- Submit rating (1–5)
- Add comment
- Only allowed after session completion
- Prevent duplicate feedback
- Auto recalculate average rating
- Update user rating
- Create notification for rated user

---

# 💬 Community Forum

## Posts

- Create Post
- Get All Posts (with user & comments)
- Delete Own Post

## Comments

- Add Comment
- Get Comments by Post
- Delete Own Comment

---

# 📚 Resource Sharing

- Add Resource
- Get All Resources

---

# 🔔 Notification System

- Get My Notifications
- Mark Notification as Read
- Ownership validation
- Auto notifications triggered for:
  - New request
  - Request accepted
  - Session scheduled
  - Feedback received

---

# 🛡 Middleware

## authMiddleware

- Verifies JWT token
- Protects private routes
- Attaches authenticated user to request

## errorMiddleware

- Global error handling
- Standardized error responses

---

# 🛠 Utilities

## generateToken.js

- Generates JWT token
- Encodes user ID

## responseHandler.js

- successResponse()
- errorResponse()
- Consistent API response format

---

# 🗄 Database (Supabase – PostgreSQL)

This project uses Supabase with PostgreSQL and a defined database schema.

## Tables

- users
- requests
- feedback
- posts
- comments
- resources
- notifications

### Schema Features

- UUID primary keys
- Foreign key constraints
- Cascading deletes
- Array-based skill storage
- Skill overlap matching
- Rating aggregation logic
- Session scheduling fields
- Notification tracking

---

# 🔑 Environment Variables

Create a `.env` file in the backend root:

PORT=5000  
JWT_SECRET=your_secret_key  
SUPABASE_URL=your_supabase_url  
SUPABASE_KEY=your_supabase_key

---

# ▶️ Running the Backend

Install dependencies:

npm install

Start development server:

npm run dev

---

# 📡 API Base URL

/api

Example Endpoints:

POST   /api/auth/register POST   /api/auth/login GET    /api/users POST   /api/requests GET    /api/posts GET    /api/resources GET    /api/notifications