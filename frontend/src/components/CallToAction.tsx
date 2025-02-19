import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 py-16">
      <div className="w-full">
        <div className="relative z-10 text-center">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
          <h2 className="text-xl font-semibold text-white sm:text-4xl">
            Ready to streamline your appointments?
          </h2>
          <p className="mt-4 text-md text-gray-300">
            Join thousands of satisfied users who have transformed their scheduling experience
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link to={`/patient/login`} className="w-3/4  mx-auto sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-emerald-400 hover:bg-emerald-500 transition duration-300 shadow-lg hover:shadow-emerald-500/50">
              Get Started Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link to={`/patient/login`} className="w-3/4  mx-auto sm:w-auto inline-flex items-center justify-center px-6 py-3 border-2 border-emerald-400 text-base font-medium rounded-md text-emerald-400 hover:bg-emerald-400 hover:text-gray-900 transition duration-300">
              Watch Demo
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction; 