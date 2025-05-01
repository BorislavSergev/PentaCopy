# PentaCopy Setup Guide

This guide will walk you through setting up and running the PentaCopy application, which consists of a React frontend built with Vite and an Express.js backend server.

## Prerequisites

- Node.js (v16+) and npm installed on your machine
- Git (optional, for cloning the repository)

## Installation

1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd pentacopy
   ```

2. Install all dependencies (both frontend and backend):
   ```bash
   npm run install:all
   ```
   This will install dependencies for both the frontend and the backend server.

## Environment Configuration

The project uses a single `.env` file in the root directory for both frontend and backend configurations:

1. Copy the example .env file or create a new one:
   ```bash
   cp .env.example .env   # If you have an example file
   ```

2. Edit the `.env` file and set your configuration:
   ```
   # Supabase Configuration
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   
   # Stripe Configuration
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
   STRIPE_SECRET_KEY=sk_test_your_test_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   
   # Application Configuration
   PORT=4000
   CLIENT_URL=http://localhost:5173
   ```

## Running the Application

### Development Mode

To start both the frontend and backend servers in development mode:

```bash
npm run dev
```

This will concurrently run:
- Frontend Vite server at http://localhost:5173
- Backend Express server at http://localhost:4000

### Running Frontend Only

```bash
npm run dev:frontend
```

### Running Backend Only

```bash
npm run dev:backend
```

## Building for Production

1. Build the frontend application:
   ```bash
   npm run build
   ```
   
   This will create optimized production files in the `dist` directory.

2. To preview the production build locally:
   ```bash
   npm run preview
   ```

## Project Structure

```
pentacopy/
├── .env                   # Shared environment variables
├── package.json           # Project configuration with scripts
├── public/                # Static assets
├── src/                   # Frontend source code
│   ├── components/        # React components
│   ├── lib/               # Shared libraries
│   ├── pages/             # Page components
│   └── App.jsx            # Main application component
├── server/                # Backend code
│   ├── server.js          # Express server entry point
│   └── package.json       # Backend dependencies
└── STRIPE_SETUP.md        # Guide for Stripe integration
```

## Additional Resources

- For Stripe integration details, refer to the [STRIPE_SETUP.md](./STRIPE_SETUP.md) file
- To customize the Vite configuration, edit `vite.config.js`
- For styling, the project uses Tailwind CSS, configured in `tailwind.config.js`

## Troubleshooting

- If you encounter CORS issues, ensure the backend server is running and the frontend is configured to use the correct API URL
- Check the server logs for any backend errors
- Verify your environment variables are correctly set
- For Stripe-related issues, refer to the Stripe Setup documentation 