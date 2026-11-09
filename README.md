# SkillSync — Developer Career Intelligence Platform

**Analyze job descriptions. Identify skill gaps. Build your career strategically.**

SkillSync is a full-stack developer career intelligence platform that helps developers evaluate their technical skills against real-world job requirements. Users can maintain their skill profiles, analyze job descriptions, identify missing skills, and track their progress through a personalized dashboard.

---

## Overview

Choosing what to learn next can be challenging for developers preparing for internships and job opportunities. SkillSync addresses this problem by comparing a developer's existing technical skills with the requirements extracted from job descriptions.

The platform provides a centralized space to manage skills, evaluate job compatibility, and monitor career-readiness progress.

## Features

### 1. Authentication and Account Management
- User registration and login.
- Secure password hashing using bcrypt.
- JWT-based authentication with HTTP-only cookies.
- Protected API routes.
- Password change and logout functionality.

### 2. Skill Management
- Add, view, update, and delete technical skills.
- Categorize proficiency as Beginner, Intermediate, or Advanced.
- Maintain a personalized skill profile.

### 3. Job Description Analyzer
- Analyze pasted job descriptions.
- Extract technical skills using a rule-based matching engine.
- Compare required skills against the user's saved skills.
- Identify matched and missing skills.
- Generate an overall skill-match percentage.

### 4. Analysis History
- Automatically save completed job analyses.
- View previous analysis results.
- Retrieve individual analysis details.
- Track previously identified skill gaps.

### 5. Interactive Dashboard
- View total skills and completed analyses.
- Monitor average proficiency.
- Visualize skill proficiency distribution.
- Identify frequently missing skills.
- Review recent activity and analysis results.

### 6. Profile and Settings
- Update personal and professional information.
- Manage education and experience details.
- Add GitHub and LinkedIn profile links.
- Switch between dark and light themes.
- Change account password.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| UI Components | Lucide React |
| Charts | Recharts |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT, bcryptjs, HTTP-only cookies |
| Validation | Zod |
| Version Control | Git, GitHub |

---

## Application Architecture

```text
                 ┌──────────────────────┐
                 │    Next.js Frontend  │
                 │   React + TypeScript │
                 └──────────┬───────────┘
                            │
                       REST API
                            │
                 ┌──────────▼───────────┐
                 │    Express Backend  │
                 │     TypeScript      │
                 └──────────┬───────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
         Authentication  Skill Module  Analyzer
              │             │             │
              └─────────────┼─────────────┘
                            │
                 ┌──────────▼───────────┐
                 │      Prisma ORM     │
                 └──────────┬───────────┘
                            │
                 ┌──────────▼───────────┐
                 │     PostgreSQL      │
                 └──────────────────────┘
```

## Project Structure

```text
SkillSync/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── analyzer/
│   │   │   └── dashboard/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── package.json
│
├── prisma/
│   └── schema.prisma
│
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js (LTS recommended)
- npm
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/SkillSync.git
cd SkillSync
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/skillsync"
JWT_SECRET="YOUR_SECURE_SECRET"
FRONTEND_URL="http://localhost:3000"
```

Configure the database connection using your local PostgreSQL credentials.

Generate the Prisma client and apply database migrations:

```bash
npm run db:generate
npm run db:migrate
```

Start the backend development server:

```bash
npm run dev
```

The backend will run at:

`http://localhost:5000`

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will run at:

`http://localhost:3000`

---

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Get authenticated user |
| POST | `/auth/logout` | Logout |
| PUT | `/auth/change-password` | Change password |

### User and Skills

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/profile` | Get profile |
| PUT | `/users/profile` | Update profile |
| GET | `/users/skills` | Get user skills |
| POST | `/
