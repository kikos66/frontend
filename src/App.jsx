import { Route, Routes, Navigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CartPage from './pages/CartPage'
import AboutUs from './pages/AboutUs'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import AddListing from './pages/AddListing'
import useAuth from './hooks/useAuth'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-surface">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-6">
              <Routes>
                <Route path="*" element={<NotFound/>} />
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/about" element={<AboutUs/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/profile/:id" element={<Profile/>} />
                <Route path="/cart" element={<CartPage/>} />

                <Route path="/add-listing"
                  element={
                    <ProtectedRoute>
                      <AddListing />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
  )
}

export default App
