import { useState, useEffect, useRef } from "react";
import useAuth from "./hooks/useAuth"; 
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X, Plus } from 'lucide-react';
import { useCart } from './context/CartContext';
import axios from "axios";

const Navbar = () => {
  const { isAuthenticated, logout, currentUser } = useAuth(); 
  const { cart } = useCart();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          `/api/products/suggest?q=${searchQuery}`
        )
        setSuggestions(res.data);
        setShowSuggestions(true);
        setActiveIndex(-1);
      } catch {}
    }, 250)
  }, [searchQuery]);
  
  const isAdmin =
    currentUser &&
    ["ADMIN", "ROLE_ADMIN"].includes(
      (currentUser.role || "").toUpperCase()
    );
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }

    if (e.key === "Enter" && showSuggestions && activeIndex >= 0) {
      e.preventDefault();

      if (activeIndex >= 0) {
        navigate(`/products/${suggestions[activeIndex].id}`);
        setShowSuggestions(false);
        setSearchQuery("");
      } else {
        handleSearch(e);
      }
    }

    if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const highlight = (text) => {
    const regex = new RegExp(`(${searchQuery})`, "ig");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={i} className="bg-yellow-200">{part}</span>
      ) : (
        part
      )
    );
  };

  const thumbnail = (p) =>
    p.images?.length
      ? `/images/products/${p.images[0].filename}`
      : "/placeholder_image.png";

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    navigate(`/?search=${encodeURIComponent(searchQuery)}`)
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
              {isAuthenticated && (
                <>
                  <NavLink to="/add-listing" className="button-navbar flex items-center gap-1">
                  <Plus size={16}/> Add Listing
                  </NavLink>
                  <NavLink to="/orders" className="button-navbar">My Orders</NavLink>
                  <NavLink to="/sales" className="button-navbar">My Sales</NavLink>
                </>
              )}
            </div>

            
          </div>

          {/* Center */}
          <div className="hidden md:block flex-1 max-w-2xl mx-4" ref={containerRef}>
            <form onSubmit={handleSearch} onKeyDown={handleKeyDown} className="relative overflow-visible">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 pr-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 top-full left-0 right-0 bg-white border rounded-lg shadow mt-1 overflow-auto max-h-80">
                  {suggestions.map((p, i) => (
                    <li
                      key={p.id}
                      className={`flex items-center gap-3 px-4 py-2 cursor-pointer ${
                        i === activeIndex ? "bg-gray-100" : ""
                      }`}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => {
                        navigate(`/products/${p.id}`)
                        setShowSuggestions(false)
                      }}
                    >
                      <img
                        src={thumbnail(p)}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{highlight(p.name)}</div>
                        <div className="text-xs text-gray-500">{p.category}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">Search</button>
            </form>
          </div>

          {/* Right side*/}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="flex items-center space-x-2">
              <ShoppingCart size={18} />
              <span className="text-sm">Cart ({cart.length})</span>
            </Link>

            {isAdmin && <NavLink to="/admin" className="button-navbar">Admin</NavLink>}

            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
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
          <div className="md:hidden border-t bg-white px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 border rounded-lg bg-gray-50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </form>

            {isAuthenticated && (
              <>
                <NavLink to="/add-listing" onClick={() => setIsMenuOpen(false)} className="button-navbar-mobile w-full flex items-center gap-3">
                  <Plus size={16}/> Add Listing
                </NavLink>
                <NavLink to="/orders" onClick={() => setIsMenuOpen(false)} className="button-navbar-mobile w-full flex items-center gap-3">
                  My Orders
                </NavLink>
                <NavLink to="/sales" onClick={() => setIsMenuOpen(false)} className="button-navbar-mobile w-full flex items-center gap-3">
                  My Sales
                </NavLink>
              </>
            )}

            <NavLink to="/cart" onClick={() => setIsMenuOpen(false)} className="button-navbar-mobile w-full flex items-center gap-3">
              <ShoppingCart size={18} /> Cart ({cart.length})
            </NavLink>

            {isAdmin && (
              <NavLink to="/admin" onClick={() => setIsMenuOpen(false)} className="button-navbar-mobile w-full flex items-center gap-3">
                Admin
              </NavLink>
            )}

            {isAuthenticated ? (
              <>
                <NavLink to="/profile" onClick={() => setIsMenuOpen(false)} className="button-navbar-mobile w-full flex items-center gap-3">
                  <User size={18} /> Profile
                </NavLink>
                <button onClick={handleLogout} className="button-navbar-mobile text-red-600 w-full flex items-center gap-3">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="button-navbar-mobile w-full flex items-center gap-3">Login</NavLink>
                <NavLink to="/register" className="btn-primary block text-center w-full flex items-center gap-3">
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;