import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import { QRCodeSVG } from 'qrcode.react';

const StudentBookings = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation(); 
    const navigate = useNavigate();
    
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedQrBooking, setSelectedQrBooking] = useState(null);
    const [checkInLoading, setCheckInLoading] = useState(false);
    
    const [highlightedBookingId, setHighlightedBookingId] = useState(null);
    const bookingRefs = useRef({}); 

    useEffect(() => {
        if (user && user.id) {
            loadMyBookings();
        }
    }, [user]);

    useEffect(() => {
        if (!loading && location.state?.highlightId && bookingRefs.current[location.state.highlightId]) {
            const id = location.state.highlightId;
            setHighlightedBookingId(id);
            
            bookingRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                setHighlightedBookingId(null);
            }, 3000);
        }
    }, [loading, location.state, bookings]);

    const loadMyBookings = async () => {
        try {
            const data = await bookingService.getUserBookings(user.id);
            data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
            setBookings(data);
        } catch (error) {
            console.error("Failed to fetch my bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this request?")) {
            try {
                await bookingService.updateBookingStatus(id, 'CANCELLED');
                loadMyBookings(); 
            } catch (error) {
                alert("Failed to cancel booking.");
            }
        }
    };

    const handleCheckIn = async (bookingId) => {
        setCheckInLoading(true);
        try {
            await bookingService.checkInBooking(bookingId);
            alert("Check-in Successful!");
            setSelectedQrBooking(null);
            loadMyBookings();
        } catch (error) {
            alert(error.response?.data || "Check-in failed");
        } finally {
            setCheckInLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#084298', fontFamily: 'sans-serif' }}>Loading Your Bookings...</div>;

    return (
        <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h1 style={{ color: '#084298', marginBottom: '20px' }}>My Bookings</h1>
            <p style={{ color: '#6c757d', marginBottom: '30px' }}>Track the status of your resource requests here.</p>

            {bookings.length === 0 ? (
                <div style={{ backgroundColor: 'white', padding: '40px', textAlign: 'center', borderRadius: '10px', border: '1px solid #cfe2ff' }}>
                    You have not made any booking requests yet.
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {bookings.map(booking => {
                        const isHighlighted = highlightedBookingId === booking.id;
                        
                        return (
                            <div 
                                key={booking.id} 
                                ref={(el) => (bookingRefs.current[booking.id] = el)}
                                style={{ 
                                    backgroundColor: 'white', 
                                    padding: '20px', 
                                    borderRadius: '10px', 
                                    boxShadow: isHighlighted ? '0 0 15px rgba(13, 110, 253, 0.5)' : '0 4px 6px rgba(0,0,0,0.05)', 
                                    border: isHighlighted ? '2px solid #0d6efd' : '1px solid #cfe2ff',
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    transition: 'all 0.5s ease-in-out' 
                                }}
                            >
                                
                                <div>
                                    <h3 style={{ margin: '0 0 10px 0', color: '#084298', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {booking.facilityName}
                                        
                                        {booking.checkedIn && (
                                            <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', backgroundColor: '#198754', color: 'white' }}>
                                                ✓ CHECKED IN
                                            </span>
                                        )}
                                    </h3>
                                    <p style={{ margin: '5px 0', color: '#495057', fontSize: '14px' }}><strong>Purpose:</strong> {booking.purpose}</p>
                                    <p style={{ margin: '5px 0', color: '#495057', fontSize: '14px' }}>
                                        <strong>Time:</strong> {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                    <div style={{ 
                                        padding: '8px 16px', 
                                        borderRadius: '20px', 
                                        fontWeight: 'bold', 
                                        fontSize: '14px',
                                        backgroundColor: booking.status === 'APPROVED' ? '#d1e7dd' : booking.status === 'REJECTED' || booking.status === 'CANCELLED' ? '#f8d7da' : '#fff3cd',
                                        color: booking.status === 'APPROVED' ? '#0f5132' : booking.status === 'REJECTED' || booking.status === 'CANCELLED' ? '#842029' : '#664d03'
                                    }}>
                                        {booking.status}
                                    </div>
                                    
                                    {booking.status === 'PENDING' && (
                                        <button 
                                            onClick={() => handleCancel(booking.id)}
                                            style={{ backgroundColor: 'transparent', color: '#dc3545', border: '1px solid #dc3545', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                                            Cancel Request
                                        </button>
                                    )}

                                    {booking.status === 'APPROVED' && (
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '5px', alignItems: 'center' }}>
                                            {!booking.checkedIn && (
                                                <button 
                                                    onClick={() => setSelectedQrBooking(booking)}
                                                    style={{ backgroundColor: '#084298', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}
                                                >
                                                    📱 Check-in Pass
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => navigate('/incidents/new?resourceId=' + booking.facilityId)}
                                                style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', transition: 'background-color 0.2s' }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#0b5ed7'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#0d6efd'}
                                            >
                                                Report Incident
                                            </button>
                                            <button 
                                                onClick={() => navigate('/incidents?resourceId=' + booking.facilityId)}
                                                style={{ backgroundColor: '#198754', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', transition: 'background-color 0.2s' }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#157347'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#198754'}
                                            >
                                                View Incidents
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- QR CODE MODAL --- */}
            {selectedQrBooking && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', maxWidth: '400px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#084298' }}>Check-in Pass</h3>
                        <p style={{ color: '#6c757d', marginBottom: '20px', fontSize: '14px' }}>{selectedQrBooking.facilityName}</p>
                        <div style={{ padding: '20px', backgroundColor: 'white', border: '2px solid #cfe2ff', borderRadius: '12px', display: 'inline-block', marginBottom: '30px' }}>
                            <QRCodeSVG value={`smartcampus://checkin/${selectedQrBooking.id}`} size={200} level={"H"} />
                        </div>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button onClick={() => setSelectedQrBooking(null)} style={{ backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #ced4da', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Close</button>
                            <button onClick={() => handleCheckIn(selectedQrBooking.id)} disabled={checkInLoading} style={{ backgroundColor: '#198754', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{checkInLoading ? 'Processing...' : 'Check IN Now'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentBookings;