import React from 'react';
import { Link } from 'react-router-dom';

const WorkInProgress: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            🚧 Work in Progress
          </h2>
          <p className="mt-2 text-gray-400">
            We're currently working on the medicine purchase feature. Please check back later!
          </p>
        </div>
        <div className="mt-4">
          <Link
            to="/patient/dashboard"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkInProgress; 