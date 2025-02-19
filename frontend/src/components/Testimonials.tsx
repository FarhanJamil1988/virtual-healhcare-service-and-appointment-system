import React from 'react';

import client1 from '../assets/images/client1.jpg';
import client2 from '../assets/images/client2.jpg';
import client3 from '../assets/images/client3.jpg';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Business Owner',
      image: client1,
      quote:
        "This appointment system has transformed how I manage my business. It's efficient and user-friendly!",
    },
    {
      name: 'Michael Chen',
      role: 'Healthcare Professional',
      image: client2,
      quote:
        "The best scheduling solution I've used. My patients love how easy it is to book appointments.",
    },
    {
      name: 'Emma Davis',
      role: 'Salon Manager',
      image: client3,
      quote:
        "Streamlined our booking process completely. Couldn't be happier with the results!",
    },
  ];

  return (
    <div className="py-24 bg-gray-900">
      {/* Responsive container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-emerald-400 font-semibold tracking-wide uppercase">
            Testimonials
          </h2>
          <p className="mt-2 text-2xl font-extrabold text-white sm:text-4xl">
            What Our Clients Say
          </p>
          <p className="mt-4 text-md text-gray-400 mx-auto">
            Don't just take our word for it - hear from our satisfied users
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl shadow-xl p-8 transform transition duration-500 hover:-translate-y-2 hover:shadow-emerald-500/10"
            >
              <div className="flex items-center mb-6">
                <img
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-400"
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div className="ml-4">
                  <div className="font-medium text-white">{testimonial.name}</div>
                  <div className="text-emerald-400">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-gray-300 italic">{testimonial.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
