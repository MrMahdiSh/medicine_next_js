import React from 'react';

const AccessDenied = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
      <div className="bg-red-600 p-8 rounded shadow-md text-center">
        <h1 className="text-red-500 text-3xl font-bold mb-4">عدم دسترسی</h1>
        <p className="mb-4">
          شما اجازه‌ی دسترسی به این صفحه را ندارید.
        </p>
        <p>
          لطفاً با مدیر سیستم تماس بگیرید.
        </p>
      </div>
    </div>
  );
};

export default AccessDenied;