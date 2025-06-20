import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import { FaBuilding, FaUmbrellaBeach, FaHotel, FaHome } from 'react-icons/fa';

const PropertyTypePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const propertyTypes = [
    { id: 'home', name: 'Home', icon: <FaHome className="text-3xl" /> },
    { id: 'apartment', name: 'Apartment', icon: <FaBuilding className="text-3xl" /> },
    { id: 'villa', name: 'Villa', icon: <FaHotel className="text-3xl" /> },
    { id: 'cottage', name: 'Cottage', icon: <FiHome className="text-3xl" /> },
    { id: 'resort', name: 'Resort', icon: <FaUmbrellaBeach className="text-3xl" /> },
  ];

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleNext = () => {
    if (selectedType) {
      // Store the selected property type in session storage or context
      sessionStorage.setItem('propertyType', selectedType);
      // Navigate to the next step in the flow
      navigate('/become-host/privacy-type');
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
          <h1 className="text-3xl font-bold text-center mb-2">What kind of place will you host?</h1>
          <p className="text-center text-gray-600 mb-8">Choose the option that best describes your property</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {propertyTypes.map((type) => (
              <button
                key={type.id}
                className={`p-6 border rounded-xl flex flex-col items-center justify-center transition-all ${selectedType === type.id ? 'border-black' : 'border-gray-300 hover:border-gray-400'}`}
                onClick={() => handleTypeSelect(type.id)}
              >
                <div className="mb-2">{type.icon}</div>
                <span>{type.name}</span>
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

export default PropertyTypePage;