import React from 'react';

const Stats = () => {
  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Appointments Booked', value: '50K+' },
    { label: 'Service Providers', value: '1000+' },
    { label: 'Customer Satisfaction', value: '99%' }
  ];

  return (
    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 py-20">
  {/* Responsive container */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="text-center transform hover:scale-105 transition-transform duration-300"
        >
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-500 mb-2">
            {stat.value}
          </div>
          <div className="text-gray-300 font-medium text-sm sm:text-base md:text-lg">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

  );
};

export default Stats;
