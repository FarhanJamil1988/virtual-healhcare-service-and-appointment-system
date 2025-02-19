
import { Link } from 'react-router-dom';
import chairImg from '../assets/chair.png'

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-purple-900 to-violet-900 overflow-hidden">
    {/* Background overlays */}
    <div className="absolute  inset-0">
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50"></div>
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-30"></div>
    </div>
  

    <div className="relative   max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative  pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pb-24">
        <div className="mt-6 sm:mt-8 lg:mt-12">
          {/* Grid container */}
          <div className="grid mt-20 grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column - Text Content */}
            <div className="px-4 sm:px-6 text-center lg:text-left lg:col-span-6">
              <h1 className="max-w-md mx-auto lg:mx-0">
                <span className="block text-sm sm:text-base font-semibold uppercase tracking-wide text-emerald-400">
                  Doctor's Appointment Booking
                </span>
                <span className="mt-2 block text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight font-extrabold">
                  <span className="block text-white">Book Your Appointments</span>
                  <span className="block text-emerald-400 mt-1">With Confidence</span>
                </span>
              </h1>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg lg:text-xl text-gray-300 max-w-md mx-auto lg:mx-0">
                Experience seamless scheduling with our intelligent appointment booking system. 
                Manage your time efficiently and stay organized with automated reminders.
              </p>
              
              {/* CTA Buttons */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4">
                <Link to={`/patient/login`} className="w-3/4 md:w-1/2 mx-auto sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-emerald-400 hover:bg-emerald-500 transition duration-300 shadow-lg hover:shadow-emerald-500/50">
                  Book Appointment
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <button className=" w-3/4 md:w-1/2 mx-auto sm:w-auto inline-flex items-center justify-center px-6 py-3 border-2 border-emerald-400 text-base font-medium rounded-md text-emerald-400 hover:bg-emerald-400 hover:text-black transition duration-300">
                  Watch Demo
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
  
            {/* Right Column - Image */}
            <div className="mt-8 sm:mt-10 lg:mt-0 lg:col-span-6">
              <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
                <img
                  className="w-full h-auto rounded-lg shadow-xl"
                  src={chairImg}
                  alt="Appointment booking"
                  loading="eager"
                />
                {/* Add a subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default Hero;
