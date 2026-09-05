import { Routes, Route } from 'react-router-dom'
import Layout from '@/layouts/Layout'
import AdminLayout from '@/layouts/AdminLayout'
import Home from '@/pages/Home'
import Shop from '@/pages/Shop'
import ProductDetails from '@/pages/ProductDetails'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import AdminLogin from '@/pages/admin/AdminLogin'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminProducts from '@/pages/admin/AdminProducts'
import AdminAnalytics from '@/pages/admin/AdminAnalytics'
import AdminSettings from '@/pages/admin/AdminSettings'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  )
}
