import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import notificationService from '../../services/notificationService';

const StudentNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        if (user && user.id) {
            try {
                const data = await notificationService.getUserNotifications(user.id);
                setNotifications(data);
            } catch (error) {
                console.error("Failed to load notifications", error);
            }
        }
    };

    useEffect(() => {
        fetchNotifications();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [user]);

    const handleNotificationClick = async (notif) => {
        if (!notif.read) {
            await notificationService.markAsRead(notif.id);
            fetchNotifications();
        }
        
        setShowDropdown(false);

        switch (notif.category) {
            case 'BOOKING':
                navigate('/my-bookings', { state: { highlightId: notif.referenceId } });
                break;
            case 'TICKET':
                // --- FIXED: ROUTE DIRECTLY TO TICKET DETAILS ---
                if (notif.referenceId) {
                    navigate(`/incidents/${notif.referenceId}`);
                } else {
                    navigate('/incidents');
                }
                break;
            case 'FACILITY':
                if (notif.referenceId) navigate(`/facilities/${notif.referenceId}`);
                else navigate('/facilities');
                break;
            default:
                console.log("General notification clicked");
                break;
        }
    };

    const handleDeleteNotification = async (e, id) => {
        e.stopPropagation(); 
        try {
            await notificationService.deleteNotification(id);
            fetchNotifications();
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    };

    const handleMarkAllRead = async () => {
        await notificationService.markAllAsRead(user.id);
        fetchNotifications();
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #cfe2ff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'relative', fontFamily: 'sans-serif', zIndex: 1000 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                
                <h2 onClick={() => navigate('/')} style={{ margin: 0, color: '#084298', cursor: 'pointer', fontWeight: 'bold' }}>
                    Campus Nexus
                </h2>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <span onClick={() => navigate('/')} style={{ cursor: 'pointer', fontWeight: 'bold', color: '#495057' }}>
                        Home
                    </span>
                    <span onClick={() => navigate('/facilities')} style={{ cursor: 'pointer', fontWeight: 'bold', color: '#495057' }}>
                        Facilities
                    </span>
                    
                    {user && (
                        <span onClick={() => navigate('/my-bookings')} style={{ cursor: 'pointer', fontWeight: 'bold', color: '#495057' }}>
                            My Bookings
                        </span>
                    )}

                    {/* DULNARA'S NEW INCIDENTS LINK */}
                    <span onClick={() => navigate('/incidents')} style={{ cursor: 'pointer', fontWeight: 'bold', color: '#495057' }}>
                        Incidents
                    </span>
                </div>
            </div>

            {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <div 
                            onClick={() => {
                                setShowDropdown(!showDropdown);
                                fetchNotifications(); 
                            }} 
                            style={{ cursor: 'pointer', fontSize: '22px', position: 'relative', padding: '5px' }}
                        >
                            🔔
                            {unreadCount > 0 && (
                                <span style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#dc3545', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '50%', border: '2px solid white' }}>
                                    {unreadCount}
                                </span>
                            )}
                        </div>

                        {showDropdown && (
                            <div style={{ position: 'absolute', top: '45px', right: '-50px', width: '350px', backgroundColor: 'white', border: '1px solid #cfe2ff', borderRadius: '8px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', zIndex: 1001, overflow: 'hidden' }}>
                                
                                <div style={{ padding: '12px 15px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #cfe2ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0, color: '#084298', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        Notifications
                                        <span 
                                            style={{ fontSize: '14px', cursor: 'pointer' }} 
                                            title="Notification Preferences"
                                            onClick={(e) => { e.stopPropagation(); alert("Notification Preferences coming soon in Module D settings!"); }}
                                        >⚙️</span>
                                    </h4>
                                    {unreadCount > 0 && (
                                        <span onClick={handleMarkAllRead} style={{ fontSize: '12px', color: '#0d6efd', cursor: 'pointer', fontWeight: 'bold' }}>Mark all read</span>
                                    )}
                                </div>
                                
                                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: '30px', textAlign: 'center', color: '#6c757d', fontSize: '14px' }}>
                                            No new notifications
                                        </div>
                                    ) : (
                                        notifications.map(notif => (
                                            <div 
                                                key={notif.id} 
                                                onClick={() => handleNotificationClick(notif)}
                                                style={{ padding: '15px', borderBottom: '1px solid #e9ecef', backgroundColor: notif.read ? 'white' : '#f0f4fb', cursor: 'pointer', transition: 'background-color 0.2s', position: 'relative' }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                                                    <div style={{ fontWeight: 'bold', color: '#212529', fontSize: '14px', flex: 1, paddingRight: '10px' }}>
                                                        {notif.title}
                                                    </div>
                                                    
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        {!notif.read && <div style={{ width: '8px', height: '8px', backgroundColor: '#0d6efd', borderRadius: '50%' }}></div>}
                                                        
                                                        <button 
                                                            onClick={(e) => handleDeleteNotification(e, notif.id)}
                                                            style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '14px', padding: '2px' }}
                                                            title="Delete Notification"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <div style={{ color: '#495057', fontSize: '13px', lineHeight: '1.4', marginBottom: '8px' }}>
                                                    {notif.message}
                                                </div>
                                                <div style={{ color: '#adb5bd', fontSize: '11px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>{new Date(notif.createdAt).toLocaleString()}</span>
                                                    {notif.category && (
                                                        <span style={{ color: '#0d6efd', fontSize: '10px', textTransform: 'uppercase' }}>
                                                            {notif.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <span style={{ fontWeight: 'bold', color: '#084298' }}>Hi, {user.name}</span>
                    <button onClick={() => { logout(); navigate('/'); }} style={{ backgroundColor: '#f8f9fa', color: '#dc3545', border: '1px solid #dc3545', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => navigate('/login')} style={{ backgroundColor: 'white', color: '#0d6efd', border: '1px solid #0d6efd', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Login</button>
                    <button onClick={() => navigate('/register')} style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Register</button>
                </div>
            )}
        </nav>
    );
};

export default StudentNavbar;