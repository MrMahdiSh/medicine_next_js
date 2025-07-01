import React from 'react';

const AccessDenied = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
      <div className="bg-red-600 p-8 rounded shadow-md text-center">
        <h1 className="text-red-500 text-3xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">
          You do not have permission to access this page.
        </p>
        <p>
          Please contact the system administrator.
        </p>
      </div>
    </div>
  );
};

export default AccessDenied;