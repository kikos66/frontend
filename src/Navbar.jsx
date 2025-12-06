import React, { useState } from 'react';
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        {/* Main Navbar */}
        <div className="flex items-center justify-between">
          
          {/* Left: About Us & Menu (Mobile) */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Home - Desktop */}
            <div className="hidden md:block">
              <button className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">
                <a href='/'>Home</a>
              </button>
            </div>

            {/* About Us - Desktop */}
            <div className="hidden md:block">
              <button className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">
                <a href='/AboutUs'>About us</a>
              </button>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full px-4 py-2 pl-10 pr-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Right: Login & Cart */}
          <div className="flex items-center space-x-6">
            {/* Login Button */}
            <button className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">
              
              <a href='/Login'><User size={20} /></a>
              <a href='/Login'>Login</a>
              
            </button>

            {/* Cart */}
            <button className="relative text-gray-700 hover:text-blue-600 transition-colors duration-200">
              <ShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-4">
              <button className="text-left font-medium text-gray-700 hover:text-blue-600 py-2">
                <a href='/'>Home</a>
              </button>
              <button className="text-left font-medium text-gray-700 hover:text-blue-600 py-2">
                <a href='/AboutUs'>About us</a>
              </button>
              <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 py-2">
                <a href='/Login'><User size={20} /></a>
                <a href='/Login'>Login</a>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;