# StayFinder Frontend

This is the frontend for the StayFinder application, an Airbnb-like property listing and booking platform focused on the Indian market.

## Technology Stack

- React.js
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- React Context API for state management

## Features

- User authentication (login/register)
- Property listings with search and filters
- Property details with booking functionality
- User dashboard (profile, trips, wishlist)
- Host dashboard (manage listings, view bookings)
- Mock payment integration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Page components
- `src/context`: React Context for state management
- `src/services`: API service functions
- `src/utils`: Utility functions
- `src/assets`: Static assets (images, icons)

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
REACT_APP_API_URL=http://localhost:5000/api
```