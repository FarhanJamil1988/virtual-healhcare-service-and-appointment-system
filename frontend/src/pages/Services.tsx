
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import client1 from '../assets/images/client1.jpg';
import client2 from '../assets/images/client2.jpg';
import client3 from '../assets/images/client3.jpg';

const Services = () => {
  const services = [
    {
      title: 'General Consultation',
      description: 'Regular check-ups and general health consultations',
      icon: '👨‍⚕️',
      price: '$50',
      duration: '30 min'
    },
    {
      title: 'Specialist Consultation',
      description: 'Consultations with specialized medical professionals',
      icon: '🏥',
      price: '$100',
      duration: '45 min'
    },
    {
      title: 'Emergency Care',
      description: 'Immediate medical attention for urgent cases',
      icon: '🚑',
      price: '$150',
      duration: '60 min'
    },
    {
      title: 'Follow-up Visit',
      description: 'Follow-up consultations for ongoing treatment',
      icon: '📋',
      price: '$30',
      duration: '20 min'
    }
  ];

  const features = [
    {
      title: 'Online Booking',
      description: 'Easy and convenient appointment scheduling through our platform',
      icon: '🖥️'
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock medical assistance and emergency care',
      icon: '⏰'
    },
    {
      title: 'Expert Doctors',
      description: 'Highly qualified and experienced medical professionals',
      icon: '👨‍⚕️'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Patient',
      content: 'Excellent service and professional staff. The online booking system made it so convenient.',
      image: client1
    },
    {
      name: 'Michael Brown',
      role: 'Patient',
      content: 'Great experience with the specialist consultation. Very thorough and professional.',
      image: client2
    },
    {
      name: 'Emma Davis',
      role: 'Patient',
      content: 'The follow-up visit was very helpful. The doctor provided clear explanations and recommendations.',
      image: client3
    }
  ];

  return (
    <>
      <Navbar />
      <div className="bg-gray-900 min-h-screen pt-20">
        <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Our Services</h1>
            <p className="text-md text-gray-300 max-w-2xl mx-auto">
              We offer a wide range of medical services to meet your healthcare needs
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400 mb-4">{service.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-300">
                  <span>{service.price}</span>
                  <span>{service.duration}</span>
                </div>
                <Link
                  to="/patient/login"
                  className="mt-6 block text-center bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white text-center mb-12">
              What We Offer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-900 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        

        {/* Testimonials Section */}
        <div className="bg-gray-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              What Our Patients Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-900 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-white font-semibold">{testimonial.name}</h3>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300">{testimonial.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-emerald-500 to-teal-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white text-md mb-8">
              Book your appointment now and take the first step towards better health
            </p>
            <Link
              to="/patient/login"
              className="inline-block bg-white text-emerald-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Services; 