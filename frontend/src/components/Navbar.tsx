import  { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">
                Virtual HealthCare Service
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium ${
                isActive('/') ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'
              }`}
            >
              Home
            </Link>
            <Link
              to="/services"
              className={`px-3 py-2 text-sm font-medium ${
                isActive('/services') ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'
              }`}
            >
              Services
            </Link>
        

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={`/${user.role}/dashboard`}
                  className="text-gray-300 hover:text-emerald-400"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/patient/login"
                  className="text-gray-300 hover:text-emerald-400"
                >
                  Login
                </Link>
                <Link
                  to="/patient/register"
                  className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-gray-800`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') ? 'text-emerald-400 bg-gray-700' : 'text-gray-300 hover:text-emerald-400'
            }`}
          >
            Home
          </Link>
          <Link
            to="/services"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/services') ? 'text-emerald-400 bg-gray-700' : 'text-gray-300 hover:text-emerald-400'
            }`}
          >
            Services
          </Link>
        

          {user ? (
            <>
              <Link
                to={`/${user.role}/dashboard`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-emerald-400"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/patient/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-emerald-400"
              >
                Login
              </Link>
              <Link
                to="/patient/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-emerald-400 hover:text-emerald-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 