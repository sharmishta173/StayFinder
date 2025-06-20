import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ListingDetailPage from './pages/ListingDetailPage';
import ConfirmAndPayPage from './pages/ConfirmAndPayPage';
import ProfilePage from './pages/ProfilePage';
import TripsPage from './pages/TripsPage';
import WishlistPage from './pages/WishlistPage';
import HostDashboardPage from './pages/HostDashboardPage';
import HostListingsPage from './pages/HostListingsPage';
import HostBookingsPage from './pages/HostBookingsPage';
import SearchPage from './pages/SearchPage';
import NotificationsPage from './pages/NotificationsPage';

// Become a Host Flow Pages
import PropertyTypePage from './pages/PropertyTypePage';
import PrivacyTypePage from './pages/PrivacyTypePage';
import LocationPage from './pages/LocationPage';
import AddressDetailsPage from './pages/AddressDetailsPage';
import PropertyPhotosPage from './pages/PropertyPhotosPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import PropertyReviewPage from './pages/PropertyReviewPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <ToastContainer position="top-right" autoClose={5000} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/listings/:id" element={<ListingDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route 
                path="/confirm-pay" 
                element={
                  <ProtectedRoute>
                    <ConfirmAndPayPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* User Dashboard Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/trips" 
                element={
                  <ProtectedRoute>
                    <TripsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/wishlist" 
                element={
                  <ProtectedRoute>
                    <WishlistPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Host Dashboard Routes */}
              <Route 
                path="/host/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['host']}>
                    <HostDashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/host/listings" 
                element={
                  <ProtectedRoute allowedRoles={['host']}>
                    <HostListingsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/host/bookings" 
                element={
                  <ProtectedRoute allowedRoles={['host']}>
                    <HostBookingsPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Become a Host Flow Routes */}
              <Route 
                path="/become-host/property-type" 
                element={
                  <ProtectedRoute>
                    <PropertyTypePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/become-host/privacy-type" 
                element={
                  <ProtectedRoute>
                    <PrivacyTypePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/become-host/location" 
                element={
                  <ProtectedRoute>
                    <LocationPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/become-host/address-details" 
                element={
                  <ProtectedRoute>
                    <AddressDetailsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/become-host/photos" 
                element={
                  <ProtectedRoute>
                    <PropertyPhotosPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/become-host/property-details" 
                element={
                  <ProtectedRoute>
                    <PropertyDetailsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/become-host/review" 
                element={
                  <ProtectedRoute>
                    <PropertyReviewPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
