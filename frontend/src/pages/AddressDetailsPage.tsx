import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const AddressDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    country: 'India - IN',
    flatHouseInfo: '',
    streetAddress: '',
    landmark: '',
    district: '',
    city: '',
    state: '',
    pinCode: ''
  });
  
  // Property type is used in useEffect to validate navigation flow
  // Property type is used in useEffect for navigation validation
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [privacyType, setPrivacyType] = useState<string | null>(null);
  const [generalAddress, setGeneralAddress] = useState<string | null>(null);

  // Get the previous steps' data from session storage on component mount
  useEffect(() => {
    const storedPropertyType = sessionStorage.getItem('propertyType');
    const storedPrivacyType = sessionStorage.getItem('privacyType');
    const storedAddress = sessionStorage.getItem('address');
    
    if (storedPropertyType) {
      setPropertyType(storedPropertyType);
    } else {
      navigate('/become-host/property-type');
      return;
    }
    
    if (storedPrivacyType) {
      setPrivacyType(storedPrivacyType);
    } else {
      navigate('/become-host/privacy-type');
      return;
    }
    
    if (storedAddress) {
      setGeneralAddress(storedAddress);
      // Try to parse the address to pre-fill some fields
      // This is a simplified example - in a real app, you might use a geocoding service
      if (storedAddress.includes('Bengaluru') || storedAddress.includes('Bangalore')) {
        setFormData(prev => ({
          ...prev,
          city: 'Bengaluru',
          state: 'Karnataka'
        }));
      }
    } else {
      navigate('/become-host/location');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    // Validate the form
    if (!formData.country || !formData.streetAddress || !formData.city || !formData.state) {
      alert('Please fill in all required fields');
      return;
    }

    // Store the address details in session storage
    sessionStorage.setItem('addressDetails', JSON.stringify(formData));
    
    // Navigate to the next step in the flow (photos upload)
    navigate('/become-host/photos');
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
          <h1 className="text-3xl font-bold text-center mb-8">Confirm your address</h1>
          <p className="text-center text-gray-600 mb-8">Your address is only shared with guests after they've made a reservation.</p>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country/region</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="India - IN">India - IN</option>
                {/* Add more countries as needed */}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flat, house, etc. (if applicable)</label>
              <input
                type="text"
                name="flatHouseInfo"
                value={formData.flatHouseInfo}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Apartment number, suite, floor, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street address</label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Street name, number"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nearby landmark (if applicable)</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Nearby landmark"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District/locality (if applicable)</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="District or locality"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City/town</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="City or town"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State/union territory</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="State or union territory"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PIN code</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="PIN code"
              />
            </div>
          </form>
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
            className="px-6 py-2 rounded-md bg-black text-white"
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AddressDetailsPage;