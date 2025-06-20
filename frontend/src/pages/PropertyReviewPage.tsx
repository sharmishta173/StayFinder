import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiHome, FiMapPin, FiDollarSign, FiImage, FiList } from 'react-icons/fi';

const PropertyReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [propertyData, setPropertyData] = useState<{
    propertyType: string | null;
    privacyType: string | null;
    addressDetails: any;
    photoCount: number;
    propertyDetails: any;
  }>({
    propertyType: null,
    privacyType: null,
    addressDetails: null,
    photoCount: 0,
    propertyDetails: null,
  });

  // Get all the data from session storage on component mount
  useEffect(() => {
    const storedPropertyType = sessionStorage.getItem('propertyType');
    const storedPrivacyType = sessionStorage.getItem('privacyType');
    const storedAddressDetails = sessionStorage.getItem('addressDetails');
    const storedPhotoCount = sessionStorage.getItem('photoCount');
    const storedPropertyDetails = sessionStorage.getItem('propertyDetails');
    
    let isValid = true;
    const newPropertyData = { ...propertyData };

    if (storedPropertyType) {
      newPropertyData.propertyType = storedPropertyType;
    } else {
      isValid = false;
    }
    
    if (storedPrivacyType) {
      newPropertyData.privacyType = storedPrivacyType;
    } else {
      isValid = false;
    }
    
    if (storedAddressDetails) {
      try {
        newPropertyData.addressDetails = JSON.parse(storedAddressDetails);
      } catch (e) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (storedPhotoCount) {
      newPropertyData.photoCount = parseInt(storedPhotoCount, 10);
    } else {
      isValid = false;
    }

    if (storedPropertyDetails) {
      try {
        newPropertyData.propertyDetails = JSON.parse(storedPropertyDetails);
      } catch (e) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (!isValid) {
      // If any required data is missing, redirect to the first step
      navigate('/become-host/property-type');
      return;
    }

    setPropertyData(newPropertyData);
  }, [navigate, propertyData]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (section: string) => {
    switch (section) {
      case 'property-type':
        navigate('/become-host/property-type');
        break;
      case 'privacy-type':
        navigate('/become-host/privacy-type');
        break;
      case 'location':
        navigate('/become-host/location');
        break;
      case 'photos':
        navigate('/become-host/photos');
        break;
      case 'details':
        navigate('/become-host/property-details');
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // In a real application, you would send all the data to your backend API
      // For this example, we'll just simulate a delay and then redirect
      
      // Combine all the data from session storage
      const listingData = {
        propertyType: propertyData.propertyType,
        privacyType: propertyData.privacyType,
        address: propertyData.addressDetails,
        // In a real app, you would handle the actual photo files here
        photoCount: propertyData.photoCount,
        ...propertyData.propertyDetails
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Clear session storage for the listing creation flow
      sessionStorage.removeItem('propertyType');
      sessionStorage.removeItem('privacyType');
      sessionStorage.removeItem('addressDetails');
      sessionStorage.removeItem('photoCount');
      sessionStorage.removeItem('propertyDetails');

      // Navigate to the host dashboard or a success page
      navigate('/host/listings', { 
        state: { 
          success: true, 
          message: 'Your listing has been created successfully!' 
        } 
      });
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('There was an error creating your listing. Please try again.');
      setIsLoading(false);
    }
  };

  // Format the full address for display
  const getFullAddress = () => {
    if (!propertyData.addressDetails) return '';
    
    const addr = propertyData.addressDetails;
    const parts = [
      addr.flatHouseInfo,
      addr.streetAddress,
      addr.landmark,
      addr.city,
      addr.district,
      addr.state,
      addr.pinCode,
      addr.country
    ].filter(Boolean);
    
    return parts.join(', ');
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
          <h1 className="text-3xl font-bold text-center mb-2">Review your listing</h1>
          <p className="text-center text-gray-600 mb-8">Make sure everything looks good before publishing your listing.</p>
          
          <div className="space-y-6">
            {/* Property Type Section */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-gray-50">
                <div className="flex items-center">
                  <FiHome className="text-gray-600 mr-2" />
                  <h3 className="font-medium">Property Type</h3>
                </div>
                <button 
                  onClick={() => handleEdit('property-type')}
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="p-4">
                <p>{propertyData.propertyType}</p>
                <p className="text-gray-600">{propertyData.privacyType}</p>
              </div>
            </div>

            {/* Location Section */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-gray-50">
                <div className="flex items-center">
                  <FiMapPin className="text-gray-600 mr-2" />
                  <h3 className="font-medium">Location</h3>
                </div>
                <button 
                  onClick={() => handleEdit('location')}
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="p-4">
                <p>{getFullAddress()}</p>
              </div>
            </div>

            {/* Photos Section */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-gray-50">
                <div className="flex items-center">
                  <FiImage className="text-gray-600 mr-2" />
                  <h3 className="font-medium">Photos</h3>
                </div>
                <button 
                  onClick={() => handleEdit('photos')}
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="p-4">
                <p>{propertyData.photoCount} photos uploaded</p>
                <p className="text-sm text-gray-500">Your cover photo will be the first image guests see</p>
              </div>
            </div>

            {/* Property Details Section */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-gray-50">
                <div className="flex items-center">
                  <FiList className="text-gray-600 mr-2" />
                  <h3 className="font-medium">Property Details</h3>
                </div>
                <button 
                  onClick={() => handleEdit('details')}
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="p-4">
                {propertyData.propertyDetails && (
                  <div className="space-y-3">
                    <h4 className="font-medium">{propertyData.propertyDetails.title}</h4>
                    <p className="text-sm text-gray-600">{propertyData.propertyDetails.description}</p>
                    
                    <div className="flex items-center">
                      <FiDollarSign className="text-gray-600 mr-1" />
                      <p className="font-medium">₹{propertyData.propertyDetails.price} per night</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="font-medium">{propertyData.propertyDetails.bedrooms}</span> bedroom{propertyData.propertyDetails.bedrooms !== 1 ? 's' : ''}
                      </div>
                      <div>
                        <span className="font-medium">{propertyData.propertyDetails.beds}</span> bed{propertyData.propertyDetails.beds !== 1 ? 's' : ''}
                      </div>
                      <div>
                        <span className="font-medium">{propertyData.propertyDetails.bathrooms}</span> bathroom{propertyData.propertyDetails.bathrooms !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    {propertyData.propertyDetails.amenities && propertyData.propertyDetails.amenities.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-1">Amenities</h5>
                        <div className="flex flex-wrap gap-2">
                          {propertyData.propertyDetails.amenities.map((amenity: string) => (
                            <span key={amenity} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md text-xs">
                              <FiCheck className="text-green-500 mr-1" />
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
            disabled={isLoading}
            className={`px-6 py-2 rounded-md ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'} text-white transition-colors`}
          >
            {isLoading ? 'Publishing...' : 'Publish your listing'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default PropertyReviewPage;