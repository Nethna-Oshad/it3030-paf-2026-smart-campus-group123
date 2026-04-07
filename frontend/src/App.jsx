import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// --- IMPORT SHARED COMPONENTS ---
import Footer from './components/common/Footer';

// --- IMPORT ADMIN COMPONENTS & PAGES ---
import AdminSidebar from './components/admin/AdminSidebar';
import AdminDashboard from './Pages/admin/AdminDashboard';

// --- IMPORT STUDENT COMPONENTS & PAGES ---
import StudentNavbar from './components/student/StudentNavbar';
import HomePage from './Pages/student/HomePage';

// --- IMPORT FACILITY PAGES ---
import FacilitiesCatalogue from './Pages/facilities/FacilitiesCatalogue';
import FacilityDetails from './Pages/facilities/FacilityDetails';

// --- IMPORT AUTH PAGE ---
import LoginPage from './Pages/auth/LoginPage';

// We create an internal component to handle routing logic cleanly
const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center', color: '#0d6efd', fontWeight: 'bold', fontFamily: 'sans-serif' }}>Loading Campus Nexus...</div>;
  }

  // ==========================================
  // 1. ADMIN LAYOUT (Sidebar + Dashboard)
  // ==========================================
  // If a user is logged in AND they are an Admin, show the Admin UI.
  if (user && user.role === 'ADMIN') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
        <AdminSidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: 'calc(100% - 250px)' }}>
          <main style={{ flex: 1, padding: '20px' }}>
            <Routes>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/facilities" element={<FacilitiesCatalogue />} />
              <Route path="/facilities/:id" element={<FacilityDetails />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" />} />
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
  // This layout is shown to EVERYONE ELSE (Not logged in, or logged in as a normal USER).
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
      <StudentNavbar />
      
      <main style={{ flex: 1, padding: '30px' }}>
        <Routes>
          {/* Publicly accessible routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/facilities" element={<FacilitiesCatalogue />} />
          <Route path="/facilities/:id" element={<FacilityDetails />} />
          
          {/* If they are NOT logged in, show the LoginPage. 
              If they ARE logged in but try to go to /login, redirect them safely to home.
          */}
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          
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
// We wrap everything in a SINGLE Router to prevent navigation crashes.
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;