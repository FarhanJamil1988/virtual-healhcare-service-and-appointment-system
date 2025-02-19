import React from 'react';

const HowItWorks = () => {
  const steps = [
    
    {
      number: '01',
      title: 'Pick a Time',
      description: 'Browse available time slots and choose what works best for your schedule.',
      icon: '📅'
    },
    {
      number: '02',
      title: 'Choose Service',
      description: 'Select from our wide range of professional services that best suit your needs.',
      icon: '🎯'
    },
    {
      number: '03',
      title: 'Select Doctor',
      description: 'Choose the doctor you want to see from our list of qualified professionals.',
      icon: '🔔'
    },
    {
      number: '04',
      title: 'Book Instantly',
      description: 'Confirm your appointment with instant booking confirmation.',
      icon: '✅'
    }
  ];

  return (
    <div className="py-16 sm:py-24 bg-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-base text-emerald-400 font-semibold tracking-wide uppercase">
          How It Works
        </h2>
        <p className="mt-2 text-2xl font-extrabold text-white sm:text-4xl">
          Book your appointment in 4 easy steps
        </p>
        <p className="mt-4 max-w-2xl text-md text-gray-400 mx-auto">
          Our simple booking process makes scheduling appointments effortless
        </p>
      </div>
  
      {/* Steps Grid */}
      <div className="mt-16 sm:mt-20">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="relative bg-gray-900 rounded-xl p-6 sm:p-8 transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
                {/* Icon Container */}
                <div className="absolute -top-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white">
                  {step.icon}
                </div>
                <div className="mt-6 sm:mt-8">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-400">
                    {step.number}
                  </span>
                  <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default HowItWorks; 