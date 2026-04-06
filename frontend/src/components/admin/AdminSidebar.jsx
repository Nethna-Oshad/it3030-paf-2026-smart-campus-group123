import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminSidebar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const linkStyle = { display: 'block', padding: '12px 20px', color: '#cfe2ff', textDecoration: 'none', cursor: 'pointer', fontWeight: 'bold', marginBottom: '5px', borderRadius: '5px' };

    return (
        <div style={{ width: '250px', backgroundColor: '#084298', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '20px' }}>
            <h2 style={{ color: 'white', marginBottom: '40px', textAlign: 'center' }}>Nexus Admin</h2>
            
            <div style={{ flex: 1 }}>
                <div onClick={() => navigate('/admin/dashboard')} style={{ ...linkStyle, backgroundColor: 'rgba(255,255,255,0.1)' }}>Dashboard</div>
                <div onClick={() => navigate('/facilities')} style={{ ...linkStyle }}>Manage Facilities</div>
                <div style={{ ...linkStyle }}>All Bookings</div>
                <div style={{ ...linkStyle }}>Maintenance Tickets</div>
                <div style={{ ...linkStyle }}>User Management</div>
            </div>

            <button onClick={logout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
                Logout
            </button>
        </div>
    );
};

export default AdminSidebar;