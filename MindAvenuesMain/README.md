# Personality Assessment App

A full-stack web application for personality assessments, built with Next.js (client) and Node.js/TypeScript (server).

## Features

- User authentication and registration
- Personality assessment tests
- Admin dashboard for managing users and assessments
- Payment integration with Razorpay
- PDF report generation
- Email notifications
- Image upload with Cloudinary
- Caching with Redis

## Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Material-UI
- Redux Toolkit
- Tailwind CSS

### Backend
- Node.js 20
- Express.js
- TypeScript
- MongoDB with Mongoose
- Redis for caching
- JWT authentication
- Razorpay for payments

## Getting Started

### Prerequisites
- Node.js 20.x
- Docker and Docker Compose (for containerized deployment)
- MongoDB (if not using Docker)
- Redis (if not using Docker)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Kartheek727/personality-assess.git
   cd personality-assess
   ```

2. Install dependencies for both client and server:
   ```bash
   # Client
   cd client
   npm install

   # Server
   cd ../server
   npm install
   ```

3. Set up environment variables:
   - Copy `server/envexample` to `server/.env`
   - Fill in the required environment variables (MongoDB URI, Redis config, JWT secret, etc.)

4. Start the development servers:
   ```bash
   # Terminal 1: Start the server
   cd server
   npm run dev

   # Terminal 2: Start the client
   cd client
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Deployment

1. Ensure Docker and Docker Compose are installed.

2. Set up environment variables in `server/.env`.

3. Run the application:
   ```bash
   docker-compose up --build
   ```

4. Access the application at [http://localhost:3000](http://localhost:3000).

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel.
2. Set environment variables in Vercel dashboard.
3. Deploy automatically on push to main branch.

### Backend (Railway, Heroku, or similar)
1. Choose a Node.js hosting platform.
2. Set environment variables.
3. Deploy from GitHub repository.
4. Ensure MongoDB and Redis are configured (use cloud services like MongoDB Atlas and Redis Cloud).

### Full Stack Deployment
- Use the provided Docker Compose setup for containerized deployment.
- Deploy to platforms like DigitalOcean App Platform, AWS ECS, or Google Cloud Run.

## Environment Variables

See `server/envexample` for all required environment variables.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test thoroughly.
5. Submit a pull request.

## License

This project is licensed under the ISC License.
