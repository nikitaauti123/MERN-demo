This is a MERN stack-based Mini Task Management System. Below are the setup instructions for both frontend and backend.

Tech Stack

Frontend: React.js, Vercel

Backend: Node.js, Express.js, MongoDB

Deployment: Vercel (Frontend), cPanel (Backend)

 Live Demo

 Vercel Deployment Link

Test Credentials
Admin

Email: admin@example.com

Password: admin123


📂 Project Structure

/project-root
│-- frontend/  # React application
│-- backend/   # Node.js/Express API
│-- README.md  # This file
Setup Instructions
Backend Setup

Navigate to the backend folder:

cd backend

Install dependencies:

npm install

Create a .env file in the backend folder and add the necessary environment variables (e.g., MongoDB URI, JWT secret).

<!-- JWT_SECRET=d30032d87810993269e5402bcdf935f92950428ffda00157bbc22817299873700be45ea50302dc817c61f09837869738601b22f03a62d680c703c22ff660d6f8
MONGODB_URI=mongodb://localhost:27017/test -->


Run the backend server:

npm run dev

The backend should be running at http://localhost:8000.

Frontend Setup

Navigate to the frontend folder:

cd frontend

Install dependencies:

npm install

Update the API URL in frontend/.env to match your backend URL.

Run the frontend application:

npm start

The frontend should be running at http://localhost:3000.