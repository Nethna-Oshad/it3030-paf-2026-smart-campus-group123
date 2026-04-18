import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// --- SHARED ---
import Footer from './components/common/Footer';

// --- ADMIN ---
import AdminSidebar from './components/admin/AdminSidebar';
import AdminDashboard from './pages/admin/AdminDashboard'; // LOWERCASE pages
import AdminBookings from './pages/bookings/AdminBookings'; // LOWERCASE pages

// --- TECHNICIAN ---
import TechnicianSidebar from './components/technician/TechnicianSidebar';
import TechnicianDashboard from './pages/technician/TechnicianDashboard'; // LOWERCASE pages

// --- STUDENT ---
import StudentNavbar from './components/student/StudentNavbar';
import HomePage from './pages/student/HomePage'; // LOWERCASE pages
import StudentBookings from './pages/bookings/StudentBookings'; // LOWERCASE pages

// --- FACILITIES ---
import FacilitiesCatalogue from './pages/facilities/FacilitiesCatalogue'; // LOWERCASE pages
import FacilityDetails from './pages/facilities/FacilityDetails'; // LOWERCASE pages

// --- INCIDENTS ---
import IncidentList from './pages/incidents/IncidentList'; // LOWERCASE pages
import CreateIncident from './pages/incidents/CreateIncident'; // LOWERCASE pages
import TicketDetails from './pages/incidents/TicketDetails'; // LOWERCASE pages

// --- AUTH ---
import LoginPage from './pages/auth/LoginPage'; // LOWERCASE pages
import RegisterPage from './pages/auth/RegisterPage'; // LOWERCASE pages

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center', color: '#0d6efd', fontWeight: 'bold', fontFamily: 'sans-serif' }}>Loading Campus Nexus...</div>;
  }

  // ==========================================
  // 1. ADMIN LAYOUT (Sidebar + Dashboard)
  // ==========================================
  if (user && user.role === 'ADMIN') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
        <AdminSidebar />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <main style={{ flex: 1, padding: '20px' }}>
            <Routes>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              <Route path="/facilities" element={<FacilitiesCatalogue />} />
              <Route path="/facilities/:id" element={<FacilityDetails />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />

              <Route path="/incidents" element={<IncidentList />} />
              <Route path="/incidents/new" element={<CreateIncident />} />
              <Route path="/incidents/:id" element={<TicketDetails />} />

              <Route path="*" element={<Navigate to="/admin/dashboard" />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    );
  }

  // ==========================================
  // 1.5 TECHNICIAN LAYOUT (Sidebar + Dashboard)
  // ==========================================
  if (user && user.role === 'TECHNICIAN') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
        <TechnicianSidebar />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <main style={{ flex: 1, padding: '20px' }}>
            <Routes>
              <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
              <Route path="/incidents/:id" element={<TicketDetails />} />
              <Route path="*" element={<Navigate to="/technician/dashboard" />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. PUBLIC & STUDENT LAYOUT (Top Navbar + Home)
  // ==========================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      <StudentNavbar />

      <main style={{ flex: 1, padding: '30px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/facilities" element={<FacilitiesCatalogue />} />
          <Route path="/facilities/:id" element={<FacilityDetails />} />
          
          {/* Protected Route: Only logged-in students can see their bookings */}
          <Route path="/my-bookings" element={user ? <StudentBookings /> : <Navigate to="/login" />} />
          
          {/* Protected Incident Routes */}
          <Route path="/incidents" element={user ? <IncidentList /> : <Navigate to="/login" />} />
          <Route path="/incidents/new" element={user ? <CreateIncident /> : <Navigate to="/login" />} />
          <Route path="/incidents/:id" element={user ? <TicketDetails /> : <Navigate to="/login" />} />

          {/* Auth Routes */}
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

// ==========================================
// MAIN APP WRAPPER
// ==========================================
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;