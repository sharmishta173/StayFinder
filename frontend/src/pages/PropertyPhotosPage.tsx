import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiX, FiImage } from 'react-icons/fi';

const PropertyPhotosPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [privacyType, setPrivacyType] = useState<string | null>(null);
  const [addressDetails, setAddressDetails] = useState<any>(null);

  // Get the previous steps' data from session storage on component mount
  useEffect(() => {
    const storedPropertyType = sessionStorage.getItem('propertyType');
    const storedPrivacyType = sessionStorage.getItem('privacyType');
    const storedAddressDetails = sessionStorage.getItem('addressDetails');
    
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
    }
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...newFiles]);
      
      // Create preview URLs for the new files
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    // Remove the photo and its preview URL
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
    
    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]); // Clean up the URL object
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleNext = () => {
    if (photos.length === 0) {
      alert('Please upload at least one photo of your property');
      return;
    }

    // Store the photos in session storage (this is just for demonstration)
    // In a real app, you would likely upload these to a server
    sessionStorage.setItem('photoCount', photos.length.toString());
    
    // Navigate to the next step in the flow (property details)
    navigate('/become-host/property-details');
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
          <h1 className="text-3xl font-bold text-center mb-4">Add some photos of your place</h1>
          <p className="text-center text-gray-600 mb-8">You'll need 5 photos to get started. You can add more or make changes later.</p>
          
          <div className="mb-8">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            
            {photos.length === 0 ? (
              <div 
                onClick={handleUploadClick}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <FiUpload className="text-4xl mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">Drag your photos here</p>
                <p className="text-gray-500 text-sm mb-4">Choose at least 5 photos</p>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                  Upload from your device
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Property photo ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
                      >
                        <FiX className="text-gray-700" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2">
                          Cover photo
                        </div>
                      )}
                    </div>
                  ))}
                  <div 
                    onClick={handleUploadClick}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <FiImage className="text-2xl text-gray-400 mb-2" />
                    <span className="text-gray-600 text-sm">Add more</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {photos.length < 5 
                    ? `Add ${5 - photos.length} more photo${5 - photos.length !== 1 ? 's' : ''}` 
                    : 'You can add more photos after publishing'}
                </p>
              </div>
            )}
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
            disabled={photos.length < 5}
            className={`px-6 py-2 rounded-md ${photos.length >= 5 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
};

export default PropertyPhotosPage;