import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiUser, FiHeart, FiHome, FiLogOut, FiList, FiCalendar, FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-primary-600 text-2xl font-bold">StayFinder</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {isAuthenticated && user?.role === 'host' && (
            <Link 
              to="/host/dashboard" 
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Host Dashboard
            </Link>
          )}
          
          {isAuthenticated && user?.role === 'guest' && (
            <Link 
              to="/become-host/property-type" 
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Become a Host
            </Link>
          )}

          {/* User Menu (Desktop) */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors focus:outline-none"
            >
              <FiMenu className="text-lg" />
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture.startsWith('http') 
                      ? user.profilePicture 
                      : `${process.env.REACT_APP_API_URL}/${user.profilePicture}`
                    } 
                    alt={user.username} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="text-gray-500" />
                )}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUser className="mr-2" /> Profile
                    </Link>
                    {user?.role === 'guest' && (
                      <>
                        <Link
                          to="/trips"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FiCalendar className="mr-2" /> Trips
                        </Link>
                        <Link
                          to="/wishlist"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FiHeart className="mr-2" /> Wishlist
                        </Link>
                      </>
                    )}
                    {user?.role === 'host' && (
                      <>
                        <Link
                          to="/host/listings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FiHome className="mr-2" /> My Listings
                        </Link>
                        <Link
                          to="/host/bookings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FiList className="mr-2" /> Bookings
                        </Link>
                      </>
                    )}
                    <Link
                      to="/notifications"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiBell className="mr-2" /> Notifications
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
        >
          <FiMenu className="text-2xl" />
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50">
            <div className="py-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                      {user?.profilePicture ? (
                        <img 
                          src={user.profilePicture.startsWith('http') 
                            ? user.profilePicture 
                            : `${process.env.REACT_APP_API_URL}/${user.profilePicture}`
                          } 
                          alt={user.username} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser className="mr-2" /> Profile
                  </Link>
                  {user?.role === 'host' && (
                    <>
                      <Link
                        to="/host/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiHome className="mr-2" /> Host Dashboard
                      </Link>
                      <Link
                        to="/host/listings"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiHome className="mr-2" /> My Listings
                      </Link>
                      <Link
                        to="/host/bookings"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiList className="mr-2" /> Bookings
                      </Link>
                    </>
                  )}
                  {user?.role === 'guest' && (
                    <>
                      <Link
                        to="/trips"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiCalendar className="mr-2" /> Trips
                      </Link>
                      <Link
                        to="/wishlist"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiHeart className="mr-2" /> Wishlist
                      </Link>
                      <Link
                        to="/become-host/property-type"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiHome className="mr-2" /> Become a Host
                      </Link>
                    </>
                  )}
                  <Link
                    to="/notifications"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiBell className="mr-2" /> Notifications
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;