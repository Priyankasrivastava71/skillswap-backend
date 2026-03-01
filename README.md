# SkillSwap – Backend

## 📖 Project Overview

SkillSwap Backend is the server-side of the SkillSwap platform.  
It handles user authentication, skill matching, session requests, feedback system, posts, comments, resources, and notifications.

The backend is built using Node.js and Express, and it uses Supabase (PostgreSQL) as the database.

It provides RESTful APIs that connect with the frontend application.

---

## 🛠 Tech Stack

- Node.js
- Express.js
- Supabase (PostgreSQL)
- JWT (Authentication)
- Bcrypt (Password Hashing)
- CORS
- Dotenv

Deployment:
- Backend deployed on Render

---

## 🌍 Backend Deployment Link

Live API Base URL:

https://skillswap-backend-5k4u.onrender.com

API Base Path:

https://skillswap-backend-5k4u.onrender.com/api

---

## 🔐 Authentication

The backend uses JWT-based authentication.

After successful login, a JWT token is generated and must be sent in headers:

Authorization: Bearer <token>

Protected routes require a valid token.

---

## 📌 API Documentation

### 🔑 Auth Routes

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |

---

### 👤 User Routes

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | /api/users | Get all users |
| GET | /api/users/matches | Get matched users |
| GET | /api/users/search?skill= | Search users by skill |
| GET | /api/users/top-rated | Get top rated users |
| GET | /api/users/profile | Get logged-in user profile |
| PUT | /api/users/profile | Update profile |

---

### 🔄 Request Routes

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/requests | Send skill request |
| GET | /api/requests | Get my requests |
| PUT | /api/requests/:id | Accept / Reject request |
| PUT | /api/requests/:id/schedule | Schedule session |
| PUT | /api/requests/:id/complete | Mark session completed |

---

### ⭐ Feedback Routes

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/feedback | Submit feedback and rating |

---

### 📝 Post Routes

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/posts | Create post |
| GET | /api/posts | Get all posts |
| DELETE | /api/posts/:id | Delete own post |

---

### 💬 Comment Routes

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/comments | Add comment |
| GET | /api/comments/:postId | Get comments by post |
| DELETE | /api/comments/:id | Delete own comment |

---

### 📚 Resource Routes

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/resources | Add resource |
| GET | /api/resources | Get all resources |

---

### 🔔 Notification Routes

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | /api/notifications | Get my notifications |
| PUT | /api/notifications/:id | Mark notification as read |

---

## 🗄 Database Schema Explanation

The project uses Supabase (PostgreSQL) database with the following tables:

### Users Table
- id (UUID, Primary Key)
- name
- email
- password
- bio
- skills_offered (array)
- skills_wanted (array)
- rating
- created_at
- updated_at

### Requests Table
- id
- sender_id
- receiver_id
- skill_requested
- status
- scheduled_date
- session_date
- session_time
- duration
- session_mode
- session_status
- created_at
- updated_at

### Feedback Table
- id
- request_id
- given_by
- given_to
- rating
- comment
- created_at
- updated_at

### Posts Table
- id
- user_id
- title
- content
- created_at

### Comments Table
- id
- post_id
- user_id
- content
- created_at

### Resources Table
- id
- user_id
- title
- link
- description
- created_at

### Notifications Table
- id
- user_id
- type
- message
- related_id
- is_read
- created_at
- updated_at

---

## ⚙️ Installation Steps

1. Clone the repository:
   git clone <your-backend-repo-link>

2. Install dependencies:
   npm install

3. Create a .env file and add:

   PORT=5000  
   JWT_SECRET=your_secret_key  
   SUPABASE_URL=your_supabase_url  
   SUPABASE_SERVICE_KEY=your_service_role_key  

4. Run the server:
   npm run dev

Server will start on:
http://localhost:5000

---

## 📂 Project Structure

backend/
│── config/
│   └── supabaseClient.js
│
│── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── requestController.js
│   ├── feedbackController.js
│   ├── postController.js
│   ├── commentController.js
│   ├── resourceController.js
│   └── notificationController.js
│
│── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
│
│── routes/
│
│── utils/
│   ├── generateToken.js
│   └── responseHandler.js
│
│── server.js
│── package.json