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
import ProductPage from './pages/ProductPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageListings from './pages/admin/ManageListings'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? children : <Navigate to="/login" />
}

function RequireAdmin({ children }) {
  const { currentUser } = useAuth()

  const isAdmin = (() => {
    if (!currentUser) return false;
    const role = (currentUser.role || '').toString().toUpperCase();
    return role === 'ADMIN' || role === 'ROLE_ADMIN' || role.includes('ADMIN');
  })()

  return isAdmin ? children : <Navigate to="/" />;
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
                <Route path="/products/:id" element={<ProductPage/>} />

                <Route path="/add-listing"
                  element={
                    <ProtectedRoute>
                      <AddListing />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <RequireAdmin>
                      <AdminDashboard />
                    </RequireAdmin>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <RequireAdmin>
                      <ManageUsers />
                    </RequireAdmin>
                  }
                />
                <Route
                  path="/admin/listings"
                  element={
                    <RequireAdmin>
                      <ManageListings />
                    </RequireAdmin>
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
