Healthcare Appointment Booking System

A full-stack web application to help users find doctors, view their profiles, and book appointments. Built using **React.js**  for the frontend and **Node.js + Express** with **SQLite** for the backend. Styled with **CSS** and secured using **JWT authentication**.

## Features

- User Signup/Login with JWT authentication
- View list of available doctors
- Doctor profile page with specialization & details
- Book appointments via a user-friendly form
- Form validation
- Fast and lightweight using SQLite
- Modern UI with CSS

## Tech Stack

### Frontend:
- React.js 
- CSS
- Fetch
- React Router DOM

### Backend:
- Node.js + Express
- SQLite3
- JWT for authentication
- CORS, Body-parser

### Installation

### 1. Clone the repository
git clone https://github.com/Tarun1888/NirogGyan1

### 2. Setup Backend

cd backend
npm install
node server.js

### 3. Setup Frontend

cd frontend
npm install
npm start

## Authentication

- **JWT tokens** are issued on successful login.
- Token is stored in `cookies` on the frontend.
- Protected routes check token validity before allowing access.