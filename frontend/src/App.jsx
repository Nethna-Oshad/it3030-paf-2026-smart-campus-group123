import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Import our page components
import FacilitiesCatalogue from './pages/facilities/FacilitiesCatalogue';
import FacilityDetails from './pages/facilities/FacilityDetails';
import BookingForm from './pages/bookings/BookingForm'; // IMPORT THE NEW BOOKING FORM
import BookingDashboard from './pages/bookings/BookingDashboard'; 

// ==========================================
// APP ROUTES COMPONENT (Handles the logic)
// ==========================================
const AppRoutes = () => {
  const { user, loading, login, logout } = useContext(AuthContext);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#0d6efd' }}>Loading Campus Nexus...</div>;
  }

  // 1. NOT LOGGED IN LAYOUT
  if (!user) {
    return (
      <div style={{ maxWidth: '800px', margin: '100px auto', padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#084298' }}>Campus Nexus Hub</h1>
        <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>You are currently logged out. Sign in to manage campus resources.</p>
          <button 
            onClick={login} 
            style={{ padding: '12px 24px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // 2. LOGGED IN LAYOUT (Handles both ADMIN and USER)
  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
      
      {/* Dynamic Top Navigation Bar */}
      <nav style={{ backgroundColor: user.role === 'ADMIN' ? '#0c4128' : '#084298', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <h2 style={{ margin: 0 }}>Campus Nexus {user.role === 'ADMIN' && '(Admin)'}</h2>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>Facilities</Link>
            <Link to="/bookings" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>Bookings</Link>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontWeight: 'bold' }}>{user.name}</span>
          {user.pictureUrl && (
            <img src={user.pictureUrl} alt="Profile" style={{ borderRadius: '50%', width: '35px', height: '35px', border: '2px solid white' }} />
          )}
          <button 
            onClick={logout} 
            style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <Routes>
          {/* Main pages for both Users and Admins */}
          <Route path="/" element={<FacilitiesCatalogue />} />
          <Route path="/facilities/:id" element={<FacilityDetails />} />
          
          {/* THE NEW SEPARATED BOOKING FORM ROUTE */}
          <Route path="/facilities/:id/book" element={<BookingForm />} />
          
          <Route path="/bookings" element={<BookingDashboard />} />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
    </div>
  );
};

// ==========================================
// MAIN APP WRAPPER (Must be ONLY ONE App function)
// ==========================================
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;