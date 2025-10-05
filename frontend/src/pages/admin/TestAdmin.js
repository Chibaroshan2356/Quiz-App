import React from 'react';

const TestAdmin = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-green-600">✅ Admin Panel Loaded Successfully!</h1>
      <p className="mt-2 text-gray-700">If you can see this message, the admin routing is working correctly.</p>
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="font-semibold text-blue-800">Next Steps:</h2>
        <ul className="list-disc list-inside mt-2 text-blue-700">
          <li>Try accessing <a href="/admin/dashboard" className="text-blue-600 hover:underline">/admin/dashboard</a></li>
          <li>Check the browser console for any errors (Press F12)</li>
          <li>Verify your user has the 'admin' role</li>
        </ul>
      </div>
    </div>
  );
};

export default TestAdmin;
