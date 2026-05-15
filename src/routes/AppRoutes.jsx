import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'
import AuthLayout from '../layouts/AuthLayout'
import ProtectedRoute from '../components/common/ProtectedRoute'

// Public pages
import Home from '../pages/Home'
import Services from '../pages/Services'
import Barbers from '../pages/Barbers'
import Login from '../pages/Login'
import Register from '../pages/Register'
import NotFound from '../pages/NotFound'

// Protected customer pages
import Booking from '../pages/Booking'
import Profile from '../pages/Profile'
import Rewards from '../pages/Rewards'
import AppointmentHistory from '../pages/AppointmentHistory'

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminAppointments from '../pages/admin/AdminAppointments'
import AdminServices from '../pages/admin/AdminServices'
import AdminBarbers from '../pages/admin/AdminBarbers'
import AdminRewards from '../pages/admin/AdminRewards'
import AdminUsers from '../pages/admin/AdminUsers'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes with main layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/barbers" element={<Barbers />} />
      </Route>

      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected customer routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/booking" element={<Booking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/appointments" element={<AppointmentHistory />} />
        </Route>
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/barbers" element={<AdminBarbers />} />
          <Route path="/admin/rewards" element={<AdminRewards />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
