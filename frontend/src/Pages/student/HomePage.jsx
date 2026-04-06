import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            
            {/* Hero Section */}
            <div style={{ backgroundColor: '#084298', color: 'white', padding: '60px 40px', borderRadius: '12px', textAlign: 'center', marginBottom: '40px', boxShadow: '0 10px 20px rgba(8, 66, 152, 0.2)' }}>
                <h1 style={{ fontSize: '48px', margin: '0 0 15px 0', fontWeight: 'bold' }}>Welcome to Campus Nexus</h1>
                <p style={{ fontSize: '20px', color: '#cfe2ff', margin: '0 0 30px 0', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                    Your centralized hub for discovering, viewing, and booking university resources, labs, and equipment.
                </p>
                <button 
                    onClick={() => navigate('/facilities')}
                    style={{ backgroundColor: 'white', color: '#084298', border: 'none', padding: '15px 35px', fontSize: '18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    Browse All Facilities
                </button>
            </div>

            {/* Information Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', border: '1px solid #cfe2ff' }}>
                    <h3 style={{ color: '#0d6efd', marginTop: 0, fontSize: '22px' }}>🏢 Find a Space</h3>
                    <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
                        Need a quiet place to study or a large lecture hall for an event? Browse our real-time catalogue of campus spaces.
                    </p>
                </div>

                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', border: '1px solid #cfe2ff' }}>
                    <h3 style={{ color: '#0d6efd', marginTop: 0, fontSize: '22px' }}>💻 Borrow Equipment</h3>
                    <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
                        Check the availability of high-end projectors, cameras, and lab equipment. See what is active and what is out of service.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default HomePage;