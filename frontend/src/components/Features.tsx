import { Link } from "react-router-dom";

const Features = () => {
  const features = [
    {
      title: 'Intelligent Appointment Booking',
      description:
        'Schedule consultations with top healthcare professionals using a system that adapts to your needs.',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      title: 'Real-time Doctor Availability',
      description:
        'Instantly check the availability of doctors and secure the ideal time for your consultation.',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Automated Reminders',
      description:
        'Receive timely notifications via email, SMS, or push alerts so you never miss your consultation.',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
    },
    {
      title: 'Seamless Calendar Sync',
      description:
        'Integrate your appointments with Google Calendar, Outlook, and more to stay organized.',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];
  

  return (
    <div className="py-16 sm:py-24 bg-gray-900">
    {/* Responsive container */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="text-center px-4">
  <h2 className="text-base sm:text-lg text-emerald-400 font-semibold tracking-wide uppercase">
    Features
  </h2>
  <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
    Everything you need for efficient scheduling
  </p>
  <p className="mt-4 max-w-md sm:max-w-2xl text-base sm:text-xl text-gray-400 mx-auto">
    Our platform is designed to make appointment booking and management as seamless as possible.
  </p>
</div>

  
      {/* Features grid */}
      <div className="mt-16 sm:mt-20">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="relative">
              <div className="relative bg-gray-800 rounded-2xl p-6 sm:p-8 transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
                {/* Icon container */}
                <div className="absolute -top-4 -right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center transform -rotate-12">
                  <div className="text-white transform rotate-12">{feature.icon}</div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-6 sm:mt-8">
                  {feature.title}
                </h3>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-400">
                  {feature.description}
                </p>
                <div className="mt-4 sm:mt-6">
                  <Link to={`/patient/login`} className="text-emerald-400 hover:text-emerald-300 inline-flex items-center text-sm sm:text-base">
                    Learn more
                    <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
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

export default Features;
