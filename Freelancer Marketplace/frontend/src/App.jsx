import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Layout/ProtectedRoute';

// Pages (to be implemented)
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProjectListing from './pages/Projects/ProjectListing';
import ProjectDetails from './pages/Projects/ProjectDetails';
import FreelancerProfile from './pages/Profile/FreelancerProfile';
import ClientDashboard from './pages/Dashboards/ClientDashboard';
import FreelancerDashboard from './pages/Dashboards/FreelancerDashboard';
import AdminDashboard from './pages/Dashboards/AdminDashboard';
import ChatUI from './components/Chat/ChatUI';
import PaymentHistory from './components/Payments/PaymentHistory';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/projects" element={<ProjectListing />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<FreelancerProfile />} />
            <Route path="/messages" element={<ChatUI />} />
            <Route path="/payments" element={<PaymentHistory />} />
          </Route>

          {/* Role Specific Dashboards */}
          <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
            <Route path="/dashboard/client" element={<ClientDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['FREELANCER']} />}>
            <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Route>

        </Routes>
      </main>
    </div>
  );
}

export default App;
