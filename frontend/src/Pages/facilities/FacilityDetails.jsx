import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import facilityService from '../../services/facilityService';
import bookingService from '../../services/bookingService';
import { AuthContext } from '../../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

const FacilityDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [facility, setFacility] = useState(null);
    const [loading, setLoading] = useState(true);

    const [approvedBookings, setApprovedBookings] = useState([]);

    const [showBookingForm, setShowBookingForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });
    const [bookingData, setBookingData] = useState({
        purpose: '',
        attendees: '',
        startTime: '',
        endTime: ''
    });

    const currentDateTime = new Date().toISOString().slice(0, 16);

    useEffect(() => {
        const loadFacilityData = async () => {
            try {
                const facilities = await facilityService.getAllFacilities();
                const selected = facilities.find((item) => String(item.id) === String(id));
                setFacility(selected || null);

                if (selected) {
                    const allBookings = await bookingService.getFacilityBookings(selected.id);
                    const now = new Date();

                    const activeSchedule = allBookings.filter(b => {
                        const isApproved = b.status === 'APPROVED';
                        const isFuture = new Date(b.endTime) > now;
                        return isApproved && isFuture;
                    });

                    activeSchedule.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
                    setApprovedBookings(activeSchedule);
                }

            } catch (error) {
                console.error('Error loading data:', error);
                setFacility(null);
            } finally {
                setLoading(false);
            }
        };

        loadFacilityData();
    }, [id]);

    const handleFormChange = (e) => {
        setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingMessage({ type: '', text: '' });

        if (!user) {
            setBookingMessage({ type: 'error', text: 'You must be logged in to book a facility.' });
            return;
        }

        if (new Date(bookingData.startTime) >= new Date(bookingData.endTime)) {
            setBookingMessage({ type: 'error', text: 'End time must be after start time.' });
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                facilityId: facility.id,
                facilityName: facility.name,
                userId: user.id,
                userName: user.name,
                purpose: bookingData.purpose,
                attendees: parseInt(bookingData.attendees),
                startTime: bookingData.startTime,
                endTime: bookingData.endTime
            };

            await bookingService.createBooking(payload);

            setBookingMessage({
                type: 'success',
                text: 'Booking request submitted successfully! An Admin will review it shortly.'
            });

            setShowBookingForm(false);
            setBookingData({ purpose: '', attendees: '', startTime: '', endTime: '' });

        } catch (error) {
            console.error(error);
            setBookingMessage({
                type: 'error',
                text: error.response?.data || 'Failed to submit booking. This time slot might already be taken.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px', color: '#0d6efd' }}>Loading facility details...</div>;
    }

    if (!facility) {
        return (
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
                <button onClick={() => navigate('/facilities')} style={{ marginBottom: '16px' }}>
                    Back to Facilities
                </button>
                <div>Facility not found.</div>
            </div>
        );
    }

    const inputStyle = {
        width: '100%',
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '6px',
        border: '1px solid #ccc'
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <button onClick={() => navigate('/facilities')} style={{ marginBottom: '16px' }}>
                ← Back to Facilities
            </button>

            <div style={{ border: '1px solid #cfe2ff', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'white' }}>

                {facility.imageUrl ? (
                    <img src={facility.imageUrl} alt={facility.name} style={{ width: '100%', maxHeight: '350px', objectFit: 'cover' }} />
                ) : (
                    <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {facility.type}
                    </div>
                )}

                <div style={{ padding: '30px' }}>

                    {/* HEADER WITH QR */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                            <h2>{facility.name}</h2>
                            <span>{facility.status}</span>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <QRCodeSVG
                                value={`${window.location.origin}/incidents/new?resourceId=${facility.id}`}
                                size={80}
                            />
                            <p style={{ fontSize: '10px' }}>
                                Scan to report incident
                            </p>
                        </div>
                    </div>

                    <p>📍 {facility.location}</p>

                    {/* DETAILS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                        <div>Type: {facility.type || 'N/A'}</div>
                        <div>Capacity: {facility.capacity || 'N/A'}</div>
                        <div>Open: {facility.openTime || 'N/A'}</div>
                        <div>Close: {facility.closeTime || 'N/A'}</div>
                    </div>

                    {/* SCHEDULE */}
                    <div style={{ marginTop: '30px' }}>
                        <h3>Upcoming Schedule</h3>

                        {approvedBookings.length === 0 ? (
                            <p>No bookings yet.</p>
                        ) : (
                            approvedBookings.map(b => (
                                <div key={b.id}>
                                    {new Date(b.startTime).toLocaleString()} - {new Date(b.endTime).toLocaleString()}
                                </div>
                            ))
                        )}
                    </div>

                    {/* BOOKING */}
                    <div style={{ marginTop: '30px' }}>

                        {bookingMessage.text && <div>{bookingMessage.text}</div>}

                        {!user ? (
                            <div onClick={() => navigate('/login')}>
                                Login to book
                            </div>
                        ) : !showBookingForm ? (
                            <button onClick={() => setShowBookingForm(true)}>
                                Book Now
                            </button>
                        ) : (
                            <form onSubmit={handleBookingSubmit}>
                                <input name="purpose" placeholder="Purpose" value={bookingData.purpose} onChange={handleFormChange} required />
                                <input name="attendees" type="number" value={bookingData.attendees} onChange={handleFormChange} required />
                                <input type="datetime-local" name="startTime" value={bookingData.startTime} onChange={handleFormChange} required />
                                <input type="datetime-local" name="endTime" value={bookingData.endTime} onChange={handleFormChange} required />

                                <button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>

                                <button type="button" onClick={() => setShowBookingForm(false)}>
                                    Cancel
                                </button>
                            </form>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
};

export default FacilityDetails;