# English Practice Platform

# English Practice Platform

An English learning platform designed to help users improve their IELTS Listening and Reading skills through structured practice, real exam-style exercises, and personalized progress tracking.

The system focuses on simulating real test scenarios, allowing users to practice effectively, identify weaknesses, and gradually enhance their performance over time.

---

## Features

- Authentication (JWT and OAuth2 with Google and Facebook)
- User management and role-based access
- English practice modules
- Progress tracking
- Email integration (SMTP)
- Redis caching and session management

---

## Tech Stack

### Backend
- Java (Spring Boot)
- Spring Security (JWT and OAuth2)
- MySQL
- Redis

### Frontend
- React.js

---

## Architecture

Client (React)
    ↓
Backend API (Spring Boot)
    ↓
Redis (Session / Cache)
    ↓
MySQL (Database)

---

## Authentication Flow

1. User logs in with email/password or OAuth (Google/Facebook)
2. Server validates credentials
3. Server generates JWT token
4. Session is stored in Redis
5. Client sends JWT in Authorization header for each request

---

## Setup and Run

### 1. Clone project

```bash
git clone https://github.com/QKhag0417/EnglishPractisePlatform.git
cd EnglishPractisePlatform
2. Setup environment variables

Create file:

env.properties

Example:

db.username=your_db_username
db.password=your_db_password

MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
3. Install dependencies
npm run setup

This will install dependencies for both frontend and backend.

4. Run project (development mode)
npm run dev

This command will:

Start frontend (React)

Start backend (Spring Boot)

5. Build project
npm run build
