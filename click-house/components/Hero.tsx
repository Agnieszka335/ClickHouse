import React, { useEffect, useState } from 'react';
import { CMSData } from '../types';

interface HeroProps {
  data: CMSData;
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * 0.3);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      id="hero" 
      className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed overflow-hidden"
      style={{ backgroundImage: `url('${data.heroBgUrl}')` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-[2px] z-10" />
      
      <div 
        className="relative z-20 max-w-5xl mx-auto px-4 pt-24 pb-48 text-center animate-fade-in"
        style={{ transform: `translateY(${offset}px)` }}
      >
        <h2 className="text-5xl md:text-7xl font-heading text-ch-tertiary mb-4 leading-none tracking-tighter drop-shadow-lg">
          {data.heroTitle}
        </h2>
        <h1 className="text-3xl md:text-5xl font-heading text-ch-primary mb-8 leading-tight tracking-wide drop-shadow-md">
          {data.heroSubtitle}
        </h1>
        
        <p className="text-lg md:text-xl text-ch-gray max-w-3xl mx-auto mb-12 font-sans font-light">
          {data.heroDescription}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="#products" className="bg-ch-primary text-ch-bg-dark py-4 px-10 rounded-xl font-extrabold text-lg hover:bg-[#8d5ed8] transition duration-300 shadow-xl hover:scale-[1.03] active:scale-95">
                🚀 Sklep | Produkty
            </a>
            <a href="#custom" className="bg-transparent border-2 border-ch-secondary text-ch-secondary py-4 px-10 rounded-xl font-bold text-lg hover:bg-ch-secondary hover:text-ch-bg-dark transition duration-300 shadow-xl hover:scale-[1.03] active:scale-95">
                🔧 Customizacja
            </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;