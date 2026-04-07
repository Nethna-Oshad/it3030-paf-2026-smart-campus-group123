import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import facilityService from '../../services/facilityService';
import bookingService from '../../services/bookingService';
import { AuthContext } from '../../context/AuthContext';

const BookingForm = () => {
    const { id } = useParams(); // Facility ID
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [facility, setFacility] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        bookingDate: '', startTime: '', endTime: '', purpose: '', expectedAttendees: 0
    });
    const [submitStatus, setSubmitStatus] = useState({ loading: false, error: null, success: false });

    // Load facility name so the user knows what they are booking
    useEffect(() => {
        const loadFacility = async () => {
            try {
                const selected = await facilityService.getFacilityById(id);
                setFacility(selected);
            } catch (error) {
                console.error("Error loading facility", error);
            } finally {
                setLoading(false);
            }
        };
        loadFacility();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please log in to make a booking.");
            return;
        }

        setSubmitStatus({ loading: true, error: null, success: false });

        const bookingPayload = {
            facilityId: id,
            userEmail: user.email,
            bookingDate: formData.bookingDate,
            startTime: formData.startTime + ":00", 
            endTime: formData.endTime + ":00",
            purpose: formData.purpose,
            expectedAttendees: formData.expectedAttendees
        };

        try {
            await bookingService.createBooking(bookingPayload);
            setSubmitStatus({ loading: false, error: null, success: true });
            setFormData({ bookingDate: '', startTime: '', endTime: '', purpose: '', expectedAttendees: 0 });
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/bookings');
            }, 2000);

        } catch (error) {
            setSubmitStatus({ loading: false, error: error.message, success: false });
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: '#0d6efd' }}>Loading Booking Form...</div>;
    if (!facility) return <div style={{ textAlign: 'center', padding: '50px', color: '#dc3545' }}>Facility not found!</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <button onClick={() => navigate(`/facilities/${id}`)} style={{ marginBottom: '20px', backgroundColor: '#e7f1ff', color: '#084298', border: '1px solid #b6d4fe', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                &larr; Back to Details
            </button>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', border: '1px solid #cfe2ff', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h1 style={{ color: '#084298', margin: '0 0 5px 0' }}>Book Resource</h1>
                <p style={{ color: '#6c757d', marginBottom: '25px', fontSize: '18px' }}>You are requesting: <strong>{facility.name}</strong></p>
                
                {submitStatus.success && (
                    <div style={{ backgroundColor: '#d1e7dd', color: '#0f5132', padding: '15px', borderRadius: '5px', marginBottom: '20px', fontWeight: 'bold', border: '1px solid #badbcc' }}>
                        ✅ Booking requested successfully! Redirecting to dashboard...
                    </div>
                )}

                {submitStatus.error && (
                    <div style={{ backgroundColor: '#f8d7da', color: '#842029', padding: '15px', borderRadius: '5px', marginBottom: '20px', fontWeight: 'bold', border: '1px solid #f5c2c7' }}>
                        ❌ Conflict: {submitStatus.error}
                    </div>
                )}

                <form onSubmit={handleBookingSubmit}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>Select Date</label>
                    <input required type="date" name="bookingDate" value={formData.bookingDate} onChange={handleChange} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ced4da', boxSizing: 'border-box' }} />

                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>Start Time</label>
                            <input required type="time" name="startTime" value={formData.startTime} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ced4da', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>End Time</label>
                            <input required type="time" name="endTime" value={formData.endTime} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ced4da', boxSizing: 'border-box' }} />
                        </div>
                    </div>

                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>Purpose of Booking</label>
                    <input required type="text" name="purpose" placeholder="e.g., Study session, Society meeting" value={formData.purpose} onChange={handleChange} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ced4da', boxSizing: 'border-box' }} />

                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>Expected Attendees</label>
                    <input required type="number" min="1" name="expectedAttendees" value={formData.expectedAttendees} onChange={handleChange} style={{ width: '100%', padding: '12px', marginBottom: '30px', borderRadius: '5px', border: '1px solid #ced4da', boxSizing: 'border-box' }} />

                    <button type="submit" disabled={submitStatus.loading} style={{ width: '100%', padding: '15px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: submitStatus.loading ? 'not-allowed' : 'pointer', fontSize: '18px', transition: '0.3s' }}>
                        {submitStatus.loading ? 'Verifying Availability...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;