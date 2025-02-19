// import React from 'react';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';

// const About = () => {
//   const team = [
//     {
//       name: 'Dr. John Doe',
//       role: 'Chief Medical Officer',
//       image: '/team/doctor1.jpg',
//       description: 'Experienced medical professional with over 15 years of practice'
//     },
//     {
//       name: 'Dr. Jane Smith',
//       role: 'Senior Specialist',
//       image: '/team/doctor2.jpg',
//       description: 'Specialized in internal medicine with a focus on preventive care'
//     }
//   ];

//   const stats = [
//     { label: 'Years of Experience', value: '15+' },
//     { label: 'Satisfied Patients', value: '10,000+' },
//     { label: 'Medical Specialists', value: '50+' },
//     { label: 'Clinic Locations', value: '5' }
//   ];

//   const values = [
//     {
//       title: 'Excellence',
//       description: 'Committed to providing the highest quality medical care',
//       icon: '🌟'
//     },
//     {
//       title: 'Integrity',
//       description: 'Maintaining the highest ethical standards in healthcare',
//       icon: '🤝'
//     },
//     {
//       title: 'Innovation',
//       description: 'Embracing the latest medical technologies and practices',
//       icon: '💡'
//     }
//   ];

//   return (
//     <>
//       <Navbar />
//       <div className="bg-gray-900 min-h-screen pt-20">
//         {/* Hero Section */}
//         <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 py-16">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//             <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
//             <p className="text-xl text-gray-300 max-w-2xl mx-auto">
//               Dedicated to providing quality healthcare services with a patient-first approach
//             </p>
//           </div>
//         </div>

//         {/* Stats Section */}
//         <div className="bg-gray-800 py-12">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//               {stats.map((stat, index) => (
//                 <div key={index} className="text-center">
//                   <div className="text-4xl font-bold text-emerald-400 mb-2">
//                     {stat.value}
//                   </div>
//                   <div className="text-gray-300">{stat.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Mission Section */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
//               <p className="text-gray-300 mb-4">
//                 We strive to provide accessible, high-quality healthcare services to our community.
//                 Our focus is on patient comfort, innovative medical solutions, and continuous improvement
//                 in healthcare delivery.
//               </p>
//               <ul className="text-gray-300 space-y-2">
//                 <li className="flex items-center">
//                   <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   Patient-centered care
//                 </li>
//                 <li className="flex items-center">
//                   <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   Quality healthcare services
//                 </li>
//                 <li className="flex items-center">
//                   <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   Innovative medical solutions
//                 </li>
//               </ul>
//             </div>
//             <div className="relative">
//               <img
//                 src="/about/mission.jpg"
//                 alt="Our Mission"
//                 className="rounded-lg shadow-xl"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Values Section */}
//         <div className="py-16">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {values.map((value, index) => (
//                 <div key={index} className="bg-gray-800 rounded-xl p-6 text-center">
//                   <div className="text-4xl mb-4">{value.icon}</div>
//                   <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
//                   <p className="text-gray-400">{value.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Team Section */}
//         <div className="bg-gray-800 py-16">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 className="text-3xl font-bold text-white text-center mb-12">Our Team</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {team.map((member, index) => (
//                 <div key={index} className="bg-gray-900 rounded-xl p-6 text-center">
//                   <img
//                     src={member.image}
//                     alt={member.name}
//                     className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
//                   />
//                   <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
//                   <p className="text-emerald-400 mb-4">{member.role}</p>
//                   <p className="text-gray-400">{member.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Timeline Section */}
//         <div className="py-16">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 className="text-3xl font-bold text-white text-center mb-12">Our Journey</h2>
//             <div className="space-y-8">
//               <div className="flex">
//                 <div className="flex-shrink-0 w-24 text-emerald-400 font-bold">2008</div>
//                 <div className="flex-grow">
//                   <h3 className="text-xl font-bold text-white mb-2">Founded</h3>
//                   <p className="text-gray-400">Started with our first clinic location</p>
//                 </div>
//               </div>
//               {/* Add more timeline items */}
//             </div>
//           </div>
//         </div>

//         {/* Contact Section */}
//         <div className="bg-gray-800 py-16">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 className="text-3xl font-bold text-white text-center mb-12">Get in Touch</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div className="text-center">
//                 <div className="text-2xl text-emerald-400 mb-2">📍</div>
//                 <h3 className="text-lg font-semibold text-white mb-2">Location</h3>
//                 <p className="text-gray-400">123 Medical Center Dr.<br />New York, NY 10001</p>
//               </div>
//               {/* Add more contact info */}
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default About; 