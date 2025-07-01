# CHIP - Community Health Integrated Platform

CHIP is a comprehensive web application for managing community health resources, user registrations, and geographical data management.

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Styling**: Tailwind CSS with shadcn/ui components
- **Form Handling**: React Hook Form with Zod validation
- **API Requests**: Axios

## Features

- User authentication (Email/Password and Mobile OTP)
- Multi-step registration process
- Geographical data selection (state, division, district, etc.)
- Dashboard with role-based access
- Dark/light theme support

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd CHIPV2-Web
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your API endpoints

4. Start the development server
   ```
   npm run dev
   ```

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build

### Mock API

The application includes a JSON server mock API for development:

```
npm run mock-api
```

## Project Structure

- `/src/components` - UI components
- `/src/features` - Feature-based slices and logic
- `/src/api` - API clients
- `/src/hooks` - Custom React hooks
- `/src/routes` - Application routing
- `/src/pages` - Top-level page components
- `/src/lib` - Utility functions

## Environment Variables

Configuration is managed through environment variables:

- `VITE_API_URL` - User authentication API endpoint
- `VITE_GEO_API_URL` - Geographical data API endpoint
- `VITE_DEV_MODE` - Enable/disable development features
- `VITE_APP_ENV` - Application environment (development, staging, production)

## License

[License information]