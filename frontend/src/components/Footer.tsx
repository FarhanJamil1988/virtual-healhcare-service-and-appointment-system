import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800">
      <div className="w-full">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">

                <h1 className="text-2xl font-bold text-white">Doctors Portal</h1>
              <p className="mt-4 text-gray-400 text-sm">
                Making appointment scheduling simple and efficient for everyone.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-white">Services</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">contact@example.com</li>
                <li className="text-gray-400">+1 (555) 123-4567</li>
                <li className="text-gray-400">123 Main Street</li>
                <li className="text-gray-400">New York, NY 10001</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-sm text-center">
              © {new Date().getFullYear()} Your Company Name. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 