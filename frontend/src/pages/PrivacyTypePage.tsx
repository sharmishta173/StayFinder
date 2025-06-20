import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHome, FiUsers, FiUser } from 'react-icons/fi';

const PrivacyTypePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [propertyType, setPropertyType] = useState<string | null>(null);

  // Get the property type from session storage on component mount
  useEffect(() => {
    const storedPropertyType = sessionStorage.getItem('propertyType');
    if (storedPropertyType) {
      setPropertyType(storedPropertyType);
    } else {
      // If no property type is found, redirect back to property type selection
      navigate('/become-host/property-type');
    }
  }, [navigate]);

  const privacyTypes = [
    { 
      id: 'entire_place', 
      name: 'An entire place', 
      description: 'Guests have the whole place to themselves.',
      icon: <FiHome className="text-2xl" /> 
    },
    { 
      id: 'private_room', 
      name: 'A room', 
      description: 'Guests have their own room in a home, plus access to shared spaces.',
      icon: <FiUser className="text-2xl" /> 
    },
    { 
      id: 'shared_room', 
      name: 'A shared room in a hostel', 
      description: 'Guests sleep in a shared room in a professionally managed hostel with staff on-site 24/7.',
      icon: <FiUsers className="text-2xl" /> 
    },
  ];

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleNext = () => {
    if (selectedType) {
      // Store the selected privacy type in session storage
      sessionStorage.setItem('privacyType', selectedType);
      // Navigate to the next step in the flow
      navigate('/become-host/location');
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
          <h1 className="text-3xl font-bold text-center mb-8">What type of place will guests have?</h1>
          
          <div className="space-y-4">
            {privacyTypes.map((type) => (
              <button
                key={type.id}
                className={`w-full p-6 border rounded-xl flex items-center justify-between transition-all ${selectedType === type.id ? 'border-black' : 'border-gray-300 hover:border-gray-400'}`}
                onClick={() => handleTypeSelect(type.id)}
              >
                <div className="flex items-center">
                  <div className="mr-4">{type.icon}</div>
                  <div className="text-left">
                    <div className="font-medium">{type.name}</div>
                    <div className="text-sm text-gray-500">{type.description}</div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                  {selectedType === type.id && (
                    <div className="w-6 h-6 rounded-full bg-black"></div>
                  )}
                </div>
              </button>
            ))}
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
            disabled={!selectedType}
            className={`px-6 py-2 rounded-md ${selectedType ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyTypePage;