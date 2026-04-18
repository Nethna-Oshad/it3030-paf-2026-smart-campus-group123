import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; 


const StudentNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #cfe2ff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                <h2 onClick={() => navigate('/')} style={{ margin: 0, color: '#084298', cursor: 'pointer', fontWeight: 'bold' }}>Campus Nexus</h2>
                
                <div style={{ display: 'flex', gap: '20px' }}>
                    <span onClick={() => navigate('/')} style={{ cursor: 'pointer', fontWeight: 'bold', color: '#495057' }}>Home</span>
                    <span onClick={() => navigate('/facilities')} style={{ cursor: 'pointer', fontWeight: 'bold', color: '#495057' }}>Facilities</span>
                    
                    {/* --- SHOW "MY BOOKINGS" ONLY IF LOGGED IN --- */}
                    {user && (
                        <span onClick={() => navigate('/my-bookings')} style={{ cursor: 'pointer', fontWeight: 'bold', color: '#495057' }}>My Bookings</span>
                    )}
                    {/* Added Incidents Link Here */}
                    <span onClick={() => navigate('/incidents')} style={{ cursor: 'pointer', fontWeight: 'bold', color: '#495057' }}>Incidents</span>
                </div>
            </div>

            {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontWeight: 'bold', color: '#084298' }}>Hi, {user.name}</span>
                    <button onClick={() => { logout(); navigate('/'); }} style={{ backgroundColor: '#f8f9fa', color: '#dc3545', border: '1px solid #dc3545', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => navigate('/login')} 
                        style={{ backgroundColor: 'white', color: '#0d6efd', border: '1px solid #0d6efd', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Login
                    </button>
                    <button 
                        onClick={() => navigate('/register')} 
                        style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        Register
                    </button>
                </div>
            )}
        </nav>
    );
};

export default StudentNavbar;