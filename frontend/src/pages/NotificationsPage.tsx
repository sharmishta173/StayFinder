import React from 'react';

const NotificationsPage: React.FC = () => {
  // In a real app, notifications would be fetched from an API
  const notifications: any[] = [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Notifications</h1>
      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No notifications</h2>
          <p className="text-gray-600">You're all caught up! You have no new notifications.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Map and display notifications here */}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage; 