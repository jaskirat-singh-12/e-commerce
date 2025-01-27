import React, { useState, useEffect } from 'react';
import image1 from '../assets/banner.jpg';
import image2 from '../assets/banner2.jpg';
import image3 from '../assets/banner3.jpg';

const slides = [
  { id: 1, text: "Welcome to our store!", image: image1 },
  { id: 2, text: "Check out our latest collection!", image: image2 },
  { id: 3, text: "Don't miss our special offers!", image: image3 },
];

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideDirection('next');
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="relative overflow-hidden w-full h-72 my-5 py-3">
      <div className={`absolute w-full h-full transition-transform duration-[3000ms]  ${slideDirection === 'next' ? 'translate-x-0' : '-translate-x-full'}`}>
        <img 
          src={slides[currentSlide].image} 
          alt={`Slide ${currentSlide + 1}`} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="absolute bottom-5 left-5 text-white bg-black bg-opacity-50 p-2 rounded">
        {slides[currentSlide].text}
      </div>
    </div>
  );
};

export default Banner;
