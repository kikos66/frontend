import { useState, useEffect, useRef } from "react";
import useAuth from "./hooks/useAuth"; 
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from './context/CartContext'

const Navbar = () => {

  const { isAuthenticated, logout, currentUser } = useAuth(); 
  const { cart } = useCart()
  const navigate = useNavigate()

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault()
    // You can navigate to /products?q=searchQuery
    navigate(`/products?q=${encodeURIComponent(searchQuery)}`)
  }

  const handleLogout = (e) => {
    e.preventDefault();
    logout(); // This updates the isAuthenticated state to false
    navigate('/login'); 
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="container mx-auto px-4 py-3">
        {/* Main Navbar */}
        <div className="flex items-center justify-between">
          
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">MS</div>
              <div className="hidden sm:block font-semibold">Surplus Depot</div>
            </Link>


            <div className="hidden md:flex items-center space-x-3">
              <NavLink to="/" className="button-navbar" end>Home</NavLink>
            </div>
          </div>

          {/* Center */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full px-4 py-2 pl-10 pr-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">Search</button>
            </form>
          </div>

          {/* Right side*/}
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="flex items-center space-x-2">
              <ShoppingCart size={18} />
              <span className="text-sm">Cart ({cart.length})</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="hidden md:flex items-center space-x-2 button-navbar">
                  <User size={18} />
                  <span>{currentUser?.username || 'Profile'}</span>
                </Link>
                <button className="button-navbar" onClick={handleLogout}>Logout</button>
              </div>
              ) : (
              <div className="flex items-center space-x-3">
                <NavLink to="/login" className="button-navbar">Login</NavLink>
                <NavLink to="/register" className="btn-primary">Sign up</NavLink>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-3">
              <NavLink to="/" className="button-navbar-mobile">Home</NavLink>
              {isAuthenticated ? (
                <button className="button-navbar-mobile" onClick={handleLogout}>Logout</button>
                ) : (
                <NavLink to="/login" className="button-navbar-mobile">Login</NavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;