import React, { useState } from 'react';
import { Menu, ShoppingCart, User, Wrench } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onCartClick: () => void;
  onAdminClick: () => void;
  onLoginClick: () => void;
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, cartTotal, onCartClick, onAdminClick, onLoginClick, isAdmin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ch-bg-medium bg-opacity-90 backdrop-blur-md shadow-2xl border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        
        {/* Logo */}
        <a href="#hero" className="flex items-center space-x-2 text-3xl font-heading text-ch-primary hover:text-ch-secondary transition-colors duration-300">
          <div className="border border-ch-primary p-1 rounded animate-pulse-glow">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9l2 2 2-2"></path>
            </svg>
          </div>
          <span className="hidden sm:inline">Click House</span>
          <span className="sm:hidden">CH</span>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-10">
          <a href="#hero" className="text-ch-text-light hover:text-ch-primary transition">Start</a>
          <a href="#products" className="text-ch-text-light hover:text-ch-primary transition">Produkty</a>
          <a href="#custom" className="text-ch-text-light hover:text-ch-primary transition">Customizacja</a>
          <a href="#about" className="text-ch-text-light hover:text-ch-primary transition">Przewaga</a>
          <a href="#contact" className="text-ch-text-light hover:text-ch-primary transition">Kontakt</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          
          {isAdmin ? (
            <button 
              onClick={onAdminClick}
              className="relative p-2 rounded-lg bg-ch-primary text-ch-bg-dark hover:bg-[#8d5ed8] transition duration-300 shadow-neon"
              title="Panel CMS"
            >
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              <Wrench size={24} />
            </button>
          ) : (
            <button 
              onClick={onLoginClick}
              className="p-2 rounded-lg bg-[#202020] text-ch-primary hover:bg-[#303030] transition duration-300 border border-ch-primary/50 text-sm px-4 flex items-center gap-2"
            >
               <User size={16} /> <span className="hidden lg:inline">Admin</span>
            </button>
          )}

          <button 
            onClick={onCartClick}
            className="relative p-2 rounded-lg bg-ch-secondary text-ch-bg-dark hover:bg-[#59b2cc] transition duration-300 shadow-cyan-glow flex items-center gap-2"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <>
                <span className="absolute -top-1 -right-1 bg-ch-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-ch-bg-medium animate-bounce">
                    {cartCount}
                </span>
                <span className="hidden sm:block font-bold ml-1">{cartTotal.toFixed(2)} zł</span>
              </>
            )}
          </button>

          <button 
            className="md:hidden text-ch-primary focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-ch-bg-medium border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <a href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-md text-base font-medium text-ch-text-light hover:bg-[#202020] hover:text-ch-primary">Start</a>
            <a href="#products" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-md text-base font-medium text-ch-text-light hover:bg-[#202020] hover:text-ch-primary">Produkty</a>
            <a href="#custom" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-md text-base font-medium text-ch-text-light hover:bg-[#202020] hover:text-ch-primary">Customizacja</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-md text-base font-medium text-ch-text-light hover:bg-[#202020] hover:text-ch-primary">Przewaga</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-md text-base font-medium text-ch-text-light hover:bg-[#202020] hover:text-ch-primary">Kontakt</a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;