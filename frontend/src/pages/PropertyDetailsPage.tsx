import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const PropertyDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [privacyType, setPrivacyType] = useState<string | null>(null);
  const [addressDetails, setAddressDetails] = useState<any>(null);
  const [photoCount, setPhotoCount] = useState<number>(0);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('1');
  const [beds, setBeds] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [amenities, setAmenities] = useState<string[]>([]);

  // Available amenities
  const availableAmenities = [
    'Wifi', 'TV', 'Kitchen', 'Washer', 'Free parking', 'Paid parking',
    'Air conditioning', 'Dedicated workspace', 'Pool', 'Hot tub',
    'Patio', 'BBQ grill', 'Outdoor dining', 'Fire pit', 'Gym',
    'Beach access', 'Lake access', 'Ski-in/ski-out', 'Outdoor shower',
    'Smoke alarm', 'First aid kit', 'Fire extinguisher', 'Carbon monoxide alarm'
  ];

  // Get the previous steps' data from session storage on component mount
  useEffect(() => {
    const storedPropertyType = sessionStorage.getItem('propertyType');
    const storedPrivacyType = sessionStorage.getItem('privacyType');
    const storedAddressDetails = sessionStorage.getItem('addressDetails');
    const storedPhotoCount = sessionStorage.getItem('photoCount');
    
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
    
    if (storedAddressDetails) {
      try {
        setAddressDetails(JSON.parse(storedAddressDetails));
      } catch (e) {
        navigate('/become-host/address-details');
        return;
      }
    } else {
      navigate('/become-host/address-details');
      return;
    }

    if (storedPhotoCount) {
      setPhotoCount(parseInt(storedPhotoCount, 10));
    } else {
      navigate('/become-host/photos');
      return;
    }
  }, [navigate]);

  const handleAmenityToggle = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    // Validate form
    if (!title.trim()) {
      alert('Please enter a title for your property');
      return;
    }

    if (!description.trim()) {
      alert('Please enter a description for your property');
      return;
    }

    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    // Store property details in session storage
    const propertyDetails = {
      title,
      description,
      price: Number(price),
      bedrooms: Number(bedrooms),
      beds: Number(beds),
      bathrooms: Number(bathrooms),
      amenities
    };

    sessionStorage.setItem('propertyDetails', JSON.stringify(propertyDetails));

    // Navigate to the final review page
    navigate('/become-host/review');
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

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">Tell us more about your place</h1>
          
          <div className="space-y-8">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-lg font-medium mb-2">Create a title for your place</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Cozy beachfront villa with stunning views"
                maxLength={50}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-right text-sm text-gray-500 mt-1">{title.length}/50</p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-lg font-medium mb-2">Create a description for your place</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell potential guests what makes your place special..."
                rows={4}
                maxLength={500}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-right text-sm text-gray-500 mt-1">{description.length}/500</p>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-lg font-medium mb-2">Set your price per night</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                <input
                  type="text"
                  id="price"
                  value={price}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setPrice(value);
                  }}
                  placeholder="0"
                  className="w-full p-3 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Bedrooms, Beds, Bathrooms */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="bedrooms" className="block text-lg font-medium mb-2">Bedrooms</label>
                <select
                  id="bedrooms"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="beds" className="block text-lg font-medium mb-2">Beds</label>
                <select
                  id="beds"
                  value={beds}
                  onChange={(e) => setBeds(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {[...Array(16)].map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="bathrooms" className="block text-lg font-medium mb-2">Bathrooms</label>
                <select
                  id="bathrooms"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {[...Array(8)].map((_, i) => (
                    <option key={i} value={(i + 1) * 0.5}>{(i + 1) * 0.5}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-medium mb-3">What amenities do you offer?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableAmenities.map((amenity) => (
                  <div 
                    key={amenity}
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${amenities.includes(amenity) ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}`}
                  >
                    <span>{amenity}</span>
                  </div>
                ))}
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
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
};

export default PropertyDetailsPage;