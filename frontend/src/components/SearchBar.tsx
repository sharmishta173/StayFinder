import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiCalendar, FiUsers, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createPortal } from 'react-dom';

interface SearchBarProps {
  className?: string;
}

interface RecentSearch {
  location: string;
  dates?: string;
}

interface SuggestedDestination {
  name: string;
  description?: string;
  icon?: React.ReactNode;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const locationObj = useLocation();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  
  const locationRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  // Recent searches (would typically be stored in localStorage or context)
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([
    { location: 'Pondicherry', dates: '19-21 Jun' },
    { location: 'North Goa', dates: '15-20 Jul' }
  ]);

  // Suggested destinations - aligned with the available destinations in the model
  const suggestedDestinations: SuggestedDestination[] = [
    { name: 'Nearby', description: 'Find what\'s around you', icon: <FiMapPin className="text-blue-500" /> },
    { name: 'North Goa', description: 'Popular beach destination', icon: <FiMapPin className="text-green-500" /> },
    { name: 'Ooty', description: 'Great for a weekend getaway', icon: <FiMapPin className="text-orange-500" /> },
    { name: 'Pondicherry', description: 'Charming coastal town', icon: <FiMapPin className="text-red-500" /> },
    { name: 'Mysore', description: 'City of palaces', icon: <FiMapPin className="text-purple-500" /> },
    { name: 'Jaipur', description: 'The Pink City', icon: <FiMapPin className="text-green-500" /> },
    { name: 'Darjeeling', description: 'Famous for tea gardens', icon: <FiMapPin className="text-blue-500" /> },
    { name: 'Munnar', description: 'Beautiful hill station', icon: <FiMapPin className="text-orange-500" /> },
    { name: 'Andaman', description: 'Tropical island paradise', icon: <FiMapPin className="text-teal-500" /> }
  ];
  
  // Popular Indian destinations for suggestions - aligned with HomePage.tsx
  const popularDestinations = [
    'Pondicherry',
    'North Goa',
    'Ooty',
    'Mysore',
    'Jaipur',
    'Darjeeling',
    'Munnar',
    'Andaman'
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
      if (guestsRef.current && !guestsRef.current.contains(event.target as Node)) {
        setShowGuestsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Calculate dropdown position
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  
  // Create a portal container for the dropdown
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  
  useEffect(() => {
    // Create a div for the portal if it doesn't exist
    let container = document.getElementById('search-suggestions-portal');
    if (!container) {
      container = document.createElement('div');
      container.id = 'search-suggestions-portal';
      container.style.position = 'fixed';
      container.style.zIndex = '9999';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.pointerEvents = 'none';
      document.body.appendChild(container);
    }
    setPortalContainer(container);
    
    // Update dropdown position when it's shown
    if (showLocationSuggestions && locationRef.current) {
      const updatePosition = () => {
        const rect = locationRef.current?.getBoundingClientRect();
        if (rect) {
          setDropdownPosition({
            top: rect.bottom,
            left: rect.left,
            width: rect.width
          });
        }
      };
      
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
    
    return () => {
      // Clean up only if we created it
      if (container && container.id === 'search-suggestions-portal' && !document.getElementById('search-suggestions-portal')?.childElementCount) {
        document.body.removeChild(container);
      }
    };
  }, [showLocationSuggestions]);

  useEffect(() => {
    const params = new URLSearchParams(locationObj.search);
    const loc = params.get('location') || '';
    const checkInParam = params.get('checkIn');
    const checkOutParam = params.get('checkOut');
    const guestsParam = params.get('guests');

    setLocation(loc);
    setCheckIn(checkInParam ? new Date(checkInParam) : null);
    setCheckOut(checkOutParam ? new Date(checkOutParam) : null);
    setGuests(guestsParam ? JSON.parse(guestsParam) : { adults: 1, children: 0, infants: 0 });
  }, [locationObj.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to recent searches when a search is performed
    if (location) {
      const newSearch: RecentSearch = { 
        location: location,
        dates: checkIn && checkOut ? 
          `${checkIn.toLocaleDateString('en-US', {day: '2-digit', month: 'short'})} - ${checkOut.toLocaleDateString('en-US', {day: '2-digit', month: 'short'})}` : 
          undefined
      };
      
      // Check if this location already exists in recent searches
      if (!recentSearches.some(search => search.location === location)) {
        setRecentSearches(prev => [newSearch, ...prev.slice(0, 4)]); // Keep only 5 recent searches
      }
    }
    
    const searchParams = new URLSearchParams();
    
    if (location) searchParams.append('location', location);
    if (checkIn) searchParams.append('checkIn', checkIn.toISOString().split('T')[0]);
    if (checkOut) searchParams.append('checkOut', checkOut.toISOString().split('T')[0]);
    const totalGuests = guests.adults + guests.children;
    if (totalGuests > 0) searchParams.append('guests', totalGuests.toString());
    
    navigate(`/search?${searchParams.toString()}`);
  };

  const selectLocation = (destination: string) => {
    setLocation(destination);
    setShowLocationSuggestions(false);
    
    // Save to recent searches when a location is selected
    const newSearch: RecentSearch = { location: destination };
    if (!recentSearches.some(search => search.location === destination)) {
      setRecentSearches(prev => [newSearch, ...prev.slice(0, 4)]);
    }

    // Immediately trigger search for the selected destination
    const searchParams = new URLSearchParams();
    if (destination) searchParams.append('location', destination);
    if (checkIn) searchParams.append('checkIn', checkIn.toISOString().split('T')[0]);
    if (checkOut) searchParams.append('checkOut', checkOut.toISOString().split('T')[0]);
    const totalGuests = guests.adults + guests.children;
    if (totalGuests > 0) searchParams.append('guests', totalGuests.toString());
    navigate(`/search?${searchParams.toString()}`);
  };
  
  const selectRecentSearch = (search: RecentSearch) => {
    setLocation(search.location);
    setShowLocationSuggestions(false);

    // Immediately trigger search for the selected recent search
    const searchParams = new URLSearchParams();
    if (search.location) searchParams.append('location', search.location);
    if (checkIn) searchParams.append('checkIn', checkIn.toISOString().split('T')[0]);
    if (checkOut) searchParams.append('checkOut', checkOut.toISOString().split('T')[0]);
    const totalGuests = guests.adults + guests.children;
    if (totalGuests > 0) searchParams.append('guests', totalGuests.toString());
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <div className={`bg-white rounded-xl shadow-md relative ${className}`}>
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row">
        {/* Location */}
        <div 
          ref={locationRef}
          className="relative flex-1 border-b md:border-b-0 md:border-r border-gray-200 z-10"
        >
          <div 
            className="px-6 py-4 cursor-text hover:bg-gray-50 transition-colors rounded-l-xl" 
            onClick={() => setShowLocationSuggestions(true)}
          >
            <label htmlFor="location" className="block text-xs font-semibold text-gray-800">
              Where
            </label>
            <div className="flex items-center mt-1">
              <FiSearch className="text-gray-500 mr-2" />
              <input
                id="location"
                type="text"
                placeholder="Search destinations"
                className="w-full border-none focus:ring-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setShowLocationSuggestions(true)}
              />
            </div>
          </div>

          {/* Location suggestions dropdown */}
          {showLocationSuggestions && portalContainer && createPortal(
            <div 
              className="fixed bg-white rounded-lg shadow-xl z-[9999] max-h-[80vh] overflow-y-auto border border-gray-200 pointer-events-auto"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${Math.max(350, dropdownPosition.width)}px`,
                marginTop: '2px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                borderRadius: '16px',
              }}
            >
              <div className="sticky top-0 bg-white p-2 border-b border-gray-200 flex justify-between items-center">
                <span className="text-sm font-medium">Search destinations</span>
                <button 
                  onClick={() => setShowLocationSuggestions(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  ×
                </button>
              </div>
              {/* Recent searches section */}
              {recentSearches.length > 0 && (
                <div className="p-4 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Recent searches</h4>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-150"
                        onClick={() => selectRecentSearch(search)}
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-red-50 rounded-md flex items-center justify-center mr-3">
                          <FiClock className="text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{search.location}</p>
                          {search.dates && <p className="text-xs text-gray-500">{search.dates}</p>}
                        </div>
                        {search.dates && (
                          <div className="ml-auto">
                            <FiArrowRight className="text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Suggested destinations section */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Suggested destinations</h4>
                <div className="space-y-2">
                  {suggestedDestinations
                    .filter(dest => dest.name.toLowerCase().includes(location.toLowerCase()) || location === '')
                    .map((destination, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-150"
                        onClick={() => selectLocation(destination.name)}
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center mr-3">
                          {destination.icon || <FiMapPin className="text-gray-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{destination.name}</p>
                          {destination.description && <p className="text-xs text-gray-500">{destination.description}</p>}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* Popular destinations section */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Popular destinations in India</h4>
                <div className="space-y-2">
                  {popularDestinations
                    .filter(dest => dest.toLowerCase().includes(location.toLowerCase()) || location === '')
                    .map((destination, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-150"
                        onClick={() => selectLocation(destination)}
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-50 rounded-md flex items-center justify-center mr-3">
                          <FiMapPin className="text-gray-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{destination}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>,
            portalContainer
          )}
        </div>

        {/* Check-in */}
        <div className="relative flex-1 border-b md:border-b-0 md:border-r border-gray-200">
          <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <label htmlFor="check-in" className="block text-xs font-semibold text-gray-800">
              Check in
            </label>
            <div className="flex items-center mt-1">
              <FiCalendar className="text-gray-500 mr-2" />
              <DatePicker
                id="check-in"
                selected={checkIn}
                onChange={(date) => setCheckIn(date)}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                minDate={new Date()}
                placeholderText="Add dates"
                className="w-full border-none focus:ring-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent"
                dateFormat="MMM d, yyyy"
              />
            </div>
          </div>
        </div>

        {/* Check-out */}
        <div className="relative flex-1 border-b md:border-b-0 md:border-r border-gray-200">
          <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <label htmlFor="check-out" className="block text-xs font-semibold text-gray-800">
              Check out
            </label>
            <div className="flex items-center mt-1">
              <FiCalendar className="text-gray-500 mr-2" />
              <DatePicker
                id="check-out"
                selected={checkOut}
                onChange={(date) => setCheckOut(date)}
                selectsEnd
                startDate={checkIn}
                endDate={checkOut}
                minDate={checkIn || new Date()}
                placeholderText="Add dates"
                className="w-full border-none focus:ring-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent"
                dateFormat="MMM d, yyyy"
              />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div ref={guestsRef} className="relative flex-1">
          <div 
            className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-r-xl" 
            onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
          >
            <label htmlFor="guests" className="block text-xs font-semibold text-gray-800">
              Who
            </label>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center">
                <FiUsers className="text-gray-500 mr-2" />
                <span className="text-gray-900">
                  {guests.adults + guests.children} guest{guests.adults + guests.children !== 1 ? 's' : ''}
                  {guests.infants > 0 ? `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}` : ''}
                </span>
              </div>
              <button 
                type="submit" 
                className="ml-4 bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 transition-colors shadow-md"
              >
                <FiSearch className="text-lg" />
              </button>
            </div>
          </div>

          {/* Guests dropdown */}
          {showGuestsDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg z-[99999] w-80 border border-gray-200">
              <div className="p-4 space-y-4">
                {/* Adults */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-gray-900 font-medium">Adults</span>
                    <p className="text-xs text-gray-500 mt-1">Ages 13 or above</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-xl font-bold text-black hover:bg-gray-100 transition-colors disabled:opacity-50"
                      onClick={() => setGuests(g => ({ ...g, adults: Math.max(1, g.adults - 1) }))}
                      disabled={guests.adults <= 1}
                      aria-label="Decrease adults"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-medium text-lg">{guests.adults}</span>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-xl font-bold text-black hover:bg-gray-100 transition-colors"
                      onClick={() => setGuests(g => ({ ...g, adults: g.adults + 1 }))}
                      aria-label="Increase adults"
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Children */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-gray-900 font-medium">Children</span>
                    <p className="text-xs text-gray-500 mt-1">Ages 2–12</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-xl font-bold text-black hover:bg-gray-100 transition-colors disabled:opacity-50"
                      onClick={() => setGuests(g => ({ ...g, children: Math.max(0, g.children - 1) }))}
                      disabled={guests.children <= 0}
                      aria-label="Decrease children"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-medium text-lg">{guests.children}</span>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-xl font-bold text-black hover:bg-gray-100 transition-colors"
                      onClick={() => setGuests(g => ({ ...g, children: g.children + 1 }))}
                      aria-label="Increase children"
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Infants */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-gray-900 font-medium">Infants</span>
                    <p className="text-xs text-gray-500 mt-1">Under 2</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-xl font-bold text-black hover:bg-gray-100 transition-colors disabled:opacity-50"
                      onClick={() => setGuests(g => ({ ...g, infants: Math.max(0, g.infants - 1) }))}
                      disabled={guests.infants <= 0}
                      aria-label="Decrease infants"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-medium text-lg">{guests.infants}</span>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-xl font-bold text-black hover:bg-gray-100 transition-colors"
                      onClick={() => setGuests(g => ({ ...g, infants: g.infants + 1 }))}
                      aria-label="Increase infants"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button 
                    type="button"
                    className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded-md text-sm font-medium"
                    onClick={() => setShowGuestsDropdown(false)}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;