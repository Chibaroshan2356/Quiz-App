import React from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';

const QuizDetails = () => {
  const { id } = useParams();

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Details</h2>
          <p className="text-gray-600">Quiz ID: {id}</p>
          <p className="text-gray-500 mt-2">This page will show detailed quiz information and analytics.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default QuizDetails;
