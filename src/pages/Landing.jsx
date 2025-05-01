import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import AboutUs from '../components/landing/AboutUs';
import Pricing from '../components/landing/Pricing';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';
import Footer from '../components/landing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <Hero />
      <Features />
      <AboutUs />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
} 