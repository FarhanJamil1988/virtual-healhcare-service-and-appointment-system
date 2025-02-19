import { Link } from "react-router-dom";


const Services = () => {
  const services =  [
    {
      title: "Primary Care",
      description: "Schedule routine check-ups and consultations with general practitioners.",
      icon: "🩺",
      color: "bg-emerald-500",
    },
    {
      title: "Specialist Consultations",
      description: "Connect with expert specialists for focused medical care.",
      icon: "👩‍⚕️",
      color: "bg-blue-500",
    },
    {
      title: "Telemedicine",
      description: "Consult with doctors virtually from the comfort of your home.",
      icon: "💻",
      color: "bg-indigo-500",
    },
    {
      title: "Lab & Diagnostics",
      description: "Book appointments for diagnostic tests and lab work easily.",
      icon: "🧪",
      color: "bg-purple-500",
    },
    {
      title: "Pediatric Care",
      description: "Access specialized care for your child's health and well-being.",
      icon: "👶",
      color: "bg-yellow-500",
    },
    {
      title: "Dental Appointments",
      description: "Schedule dental check-ups and treatments with trusted dentists.",
      icon: "🦷",
      color: "bg-pink-500",
    },
  ]
  
  return (
    <div className="py-24 bg-gray-900">
      {/* Responsive container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            Our Services
          </h2>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-300">
            Choose from our wide range of professional services
          </p>
        </div>

        {/* Services grid */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div key={index} className="relative group">
              <div className="relative bg-gray-800 rounded-lg p-8 transition-transform duration-300 group-hover:-translate-y-1">
                {/* Icon with background color */}
                <div
                  className={`absolute -top-4 left-4 ${service.color} rounded-full p-3 text-2xl`}
                >
                  {service.icon}
                </div>
                <h3 className="mt-4 text-lg sm:text-xl font-semibold text-white">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-gray-300">
                  {service.description}
                </p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link to={`/patient/login`} className="text-sm text-purple-400 hover:text-purple-300">
                    Learn more →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
