import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin } from 'react-icons/fi';

const LocationPage: React.FC = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [privacyType, setPrivacyType] = useState<string | null>(null);

  // Get the property and privacy types from session storage on component mount
  useEffect(() => {
    const storedPropertyType = sessionStorage.getItem('propertyType');
    const storedPrivacyType = sessionStorage.getItem('privacyType');
    
    if (storedPropertyType) {
      setPropertyType(storedPropertyType);
    } else {
      // If no property type is found, redirect back to property type selection
      navigate('/become-host/property-type');
      return;
    }
    
    if (storedPrivacyType) {
      setPrivacyType(storedPrivacyType);
    } else {
      // If no privacy type is found, redirect back to privacy type selection
      navigate('/become-host/privacy-type');
    }
  }, [navigate]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleNext = () => {
    if (address.trim()) {
      // Store the address in session storage
      sessionStorage.setItem('address', address);
      // Navigate to the next step in the flow
      navigate('/become-host/address-details');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <button 
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <div className="flex-1 text-center">
            <img 
              src="/logo.svg" 
              alt="StayFinder" 
              className="h-8 inline-block"
            />
          </div>
          <div className="w-6"></div> {/* Empty div for spacing */}
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-center mb-4">Where's your place located?</h1>
          <p className="text-center text-gray-600 mb-8">Your address is only shared with guests after they've made a reservation.</p>
          
          <div className="relative w-full h-64 bg-green-100 rounded-lg mb-6 overflow-hidden">
            {/* This would be replaced with an actual map component */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-4 shadow-md">
                <FiMapPin className="text-xl" />
                <input
                  type="text"
                  placeholder="Enter your address"
                  className="border-none outline-none pl-2 w-64"
                  value={address}
                  onChange={handleAddressChange}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-4 border-t">
        <div className="container mx-auto flex justify-between items-center">
          <button 
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 underline"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!address.trim()}
            className={`px-6 py-2 rounded-md ${address.trim() ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LocationPage;