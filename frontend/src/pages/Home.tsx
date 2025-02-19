import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Stats from '../components/Stats';
import HowItWorks from '../components/HowItWorks';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import '../index.css';

const Home: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen flex flex-col">
      <Navbar />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {/* Hero Section with full height & centered */}
        <Hero />

          <Services />
          <Features />
          
          <Stats />
          <HowItWorks />
          <Testimonials />
          <CallToAction />
        </main>
      <Footer />
    </div>
  );
};

export default Home;
