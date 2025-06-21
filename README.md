# StayFinder - Property Listing and Booking Platform

StayFinder is a comprehensive property listing and booking platform similar to Airbnb, with a strong focus on the Indian market and currency (INR). This application allows users to browse, search, and book properties across India, as well as list their own properties as hosts.


## Project Structure

The project is organized into two main directories:

- `backend/`: Node.js with Express.js server and MongoDB with Mongoose for the database
- `frontend/`: React application for the client-side interface

## Features

- **User Authentication & Authorization**
  - Secure registration and login using JWT and bcrypt.js
  - User roles: Guest and Host
  - Profile management

- **Property Listings**
  - Browse listings with details (images, amenities, location, etc.)
  - Search and filter properties by location, price, dates, etc.
  - View detailed information about specific properties

- **Booking Management**
  - Book properties for specific dates
  - View booking history
  - Manage bookings as a host

- **Wishlist**
  - Save favorite properties to a personal wishlist

- **Host Dashboard**
  - Manage property listings (create, update, delete)
  - View and manage bookings for properties

- **Mock Payment Integration**
  - UPI ID input options
  - Card payment options

## Demo Video

👉 [Watch the demo here] (https://youtu.be/9JTmxiXQJ9k)



## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt.js for password hashing

### Frontend
- React
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the server: `npm start`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## API Documentation

The API follows RESTful principles and includes endpoints for user authentication, property listings, bookings, and more. Detailed documentation can be found in the backend README.

## License

This project is licensed under the MIT License.
 
 
