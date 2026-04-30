import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import facilityService from '../../services/facilityService';
import bookingService from '../../services/bookingService';
import { AuthContext } from '../../context/AuthContext';

const formatScheduleDate = (value) =>
    new Date(value).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

const formatScheduleTime = (value) =>
    new Date(value).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

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
    const [bookingData, setBookingData] = useState({ purpose: '', attendees: '', startTime: '', endTime: '' });

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
<<<<<<< HEAD

                    const activeSchedule = allBookings.filter((booking) => {
                        const isApproved = booking.status === 'APPROVED';
                        const isFuture = new Date(booking.endTime) > now;
                        return isApproved && isFuture;
                    });

=======
                    const activeSchedule = allBookings.filter(b => b.status === 'APPROVED' && new Date(b.endTime) > now);
>>>>>>> 96439003954e2b9b579f2f78fc1a2198bdfaec45
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

    const handleFormChange = (e) => setBookingData({ ...bookingData, [e.target.name]: e.target.value });

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingMessage({ type: '', text: '' });

        if (!user) return setBookingMessage({ type: 'error', text: 'You must be logged in to book.' });
        if (new Date(bookingData.startTime) >= new Date(bookingData.endTime)) return setBookingMessage({ type: 'error', text: 'End time must be after start time.' });

        setIsSubmitting(true);
        try {
            const payload = {
                facilityId: facility.id, facilityName: facility.name,
                userId: user.id, userName: user.name,
                purpose: bookingData.purpose, attendees: parseInt(bookingData.attendees),
                startTime: bookingData.startTime, endTime: bookingData.endTime
            };
            await bookingService.createBooking(payload);
<<<<<<< HEAD

            setBookingMessage({
                type: 'success',
                text: 'Booking request submitted successfully! An admin will review it shortly.'
            });
            setShowBookingForm(false);
            setBookingData({ purpose: '', attendees: '', startTime: '', endTime: '' });
        } catch (error) {
            console.error(error);
            setBookingMessage({
                type: 'error',
                text: error.response?.data || 'Failed to submit booking. This time slot might already be taken.'
            });
=======
            setBookingMessage({ type: 'success', text: 'Booking request submitted! Admin review pending.' });
            setShowBookingForm(false); 
            setBookingData({ purpose: '', attendees: '', startTime: '', endTime: '' }); 
        } catch (error) {
            setBookingMessage({ type: 'error', text: error.response?.data || 'Failed to submit booking. Slot may be taken.' });
>>>>>>> 96439003954e2b9b579f2f78fc1a2198bdfaec45
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!facility) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100">
                <svg className="w-20 h-20 text-slate-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Facility Not Found</h2>
                <p className="text-slate-500 mb-8">The resource you are looking for might have been removed or is currently unavailable.</p>
                <button onClick={() => navigate('/facilities')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors">Return to Directory</button>
            </div>
        </div>
    );

<<<<<<< HEAD
    const inputStyle = {
        width: '100%',
        padding: '12px 14px',
        marginBottom: '16px',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        boxSizing: 'border-box',
        fontFamily: 'sans-serif',
        backgroundColor: '#ffffff',
        color: '#0f172a'
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #eef6ff 0%, #ffffff 42%, #f8fbff 100%)',
                padding: '22px 18px 48px',
                fontFamily: 'sans-serif'
            }}
        >
            <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/facilities')}
                    style={{ marginBottom: '16px', backgroundColor: '#ffffff', border: '1px solid #dbeafe', padding: '10px 14px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: '#1e3a8a', boxShadow: '0 12px 28px rgba(8, 66, 152, 0.08)' }}
                >
                    &larr; Back to Facilities
                </button>

                <div style={{ border: '1px solid #dbeafe', borderRadius: '28px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 24px 60px rgba(15, 23, 42, 0.09)' }}>
                    {facility.imageUrl ? (
                        <img src={facility.imageUrl} alt={facility.name} style={{ width: '100%', maxHeight: '360px', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', color: '#1e3a8a', fontSize: '24px', fontWeight: 'bold' }}>
                            {facility.type}
                        </div>
                    )}

                    <div style={{ padding: '30px' }}>
                        <div style={{ marginBottom: '26px' }}>
                            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#64748b', marginBottom: '10px' }}>
                                Facility Booking Hub
                            </div>
                            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '34px', lineHeight: 1.15 }}>{facility.name}</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '14px', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', padding: '7px 14px', borderRadius: '999px', backgroundColor: facility.status === 'ACTIVE' ? '#d1fae5' : '#fee2e2', color: facility.status === 'ACTIVE' ? '#065f46' : '#991b1b', fontWeight: 'bold', border: '1px solid rgba(0,0,0,0.05)' }}>
                                    {facility.status}
                                </span>
                                <span style={{ color: '#475569', fontSize: '15px' }}>Location: {facility.location}</span>
                            </div>
                            <p style={{ margin: '16px 0 0', color: '#475569', lineHeight: 1.7, maxWidth: '640px' }}>
                                Review availability, check the upcoming schedule, and send a booking request from one clear workspace.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '28px' }}>
                            <div style={{ backgroundColor: '#f8fbff', borderRadius: '18px', padding: '18px', border: '1px solid #dbeafe' }}>
                                <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.06em' }}>Type</div>
                                <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#0f172a', marginTop: '8px' }}>{facility.type || 'N/A'}</div>
                            </div>
                            <div style={{ backgroundColor: '#f8fbff', borderRadius: '18px', padding: '18px', border: '1px solid #dbeafe' }}>
                                <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.06em' }}>Capacity</div>
                                <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#0f172a', marginTop: '8px' }}>{facility.capacity > 0 ? facility.capacity : 'N/A'}</div>
                            </div>
                            <div style={{ backgroundColor: '#f8fbff', borderRadius: '18px', padding: '18px', border: '1px solid #dbeafe' }}>
                                <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.06em' }}>Open Time</div>
                                <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#0f172a', marginTop: '8px' }}>{facility.openTime || 'N/A'}</div>
                            </div>
                            <div style={{ backgroundColor: '#f8fbff', borderRadius: '18px', padding: '18px', border: '1px solid #dbeafe' }}>
                                <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.06em' }}>Close Time</div>
                                <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#0f172a', marginTop: '8px' }}>{facility.closeTime || 'N/A'}</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: '20px' }}>
                            <section style={{ backgroundColor: '#f8fbff', padding: '22px', borderRadius: '24px', border: '1px solid #dbeafe' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
                                    <div>
                                        <h3 style={{ margin: 0, color: '#0f172a', fontSize: '22px' }}>Upcoming Schedule</h3>
                                        <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '14px' }}>
                                            Approved reservations that are still upcoming.
                                        </p>
                                    </div>
                                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #dbeafe', borderRadius: '999px', padding: '8px 14px', color: '#1e3a8a', fontWeight: 'bold', fontSize: '13px' }}>
                                        {approvedBookings.length} reserved slots
                                    </div>
                                </div>

                                {approvedBookings.length === 0 ? (
                                    <div style={{ backgroundColor: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '18px', padding: '24px', textAlign: 'center', color: '#64748b', lineHeight: 1.7 }}>
                                        No upcoming bookings. This space is currently open for new requests.
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {approvedBookings.map((booking) => (
                                            <div key={booking.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '14px', alignItems: 'center', backgroundColor: '#ffffff', padding: '14px', borderRadius: '16px', border: '1px solid #dbeafe' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8', fontWeight: 'bold' }}>
                                                    {new Date(booking.startTime).getDate()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{formatScheduleDate(booking.startTime)}</div>
                                                    <div style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
                                                        {formatScheduleTime(booking.startTime)} - {formatScheduleTime(booking.endTime)}
                                                    </div>
                                                </div>
                                                <div style={{ backgroundColor: '#e0f2fe', color: '#075985', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' }}>
                                                    Reserved
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f9fbff 100%)', borderRadius: '24px', border: '1px solid #dbeafe', padding: '22px' }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '8px' }}>
                                        Booking Request
                                    </div>
                                    <h3 style={{ margin: 0, color: '#0f172a', fontSize: '22px' }}>Reserve This Space</h3>
                                    <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px', lineHeight: 1.7 }}>
                                        Fill in your purpose, attendees, and preferred times to send a request for admin approval.
                                    </p>
                                </div>

                                {bookingMessage.text && (
                                    <div style={{ padding: '14px 16px', borderRadius: '14px', marginBottom: '18px', backgroundColor: bookingMessage.type === 'success' ? '#d1fae5' : '#fee2e2', color: bookingMessage.type === 'success' ? '#065f46' : '#991b1b', border: `1px solid ${bookingMessage.type === 'success' ? '#a7f3d0' : '#fecaca'}`, lineHeight: 1.6 }}>
                                        {bookingMessage.text}
                                    </div>
                                )}

                                {facility.status === 'OUT_OF_SERVICE' ? (
                                    <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '18px', borderRadius: '16px', textAlign: 'center', fontWeight: 'bold', lineHeight: 1.7 }}>
                                        This facility is currently down for maintenance and cannot be booked.
                                    </div>
                                ) : !user ? (
                                    <div style={{ backgroundColor: '#eff6ff', color: '#1e3a8a', padding: '18px', borderRadius: '16px', textAlign: 'center', lineHeight: 1.7 }}>
                                        Please <strong style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/login')}>log in</strong> to request a booking for this facility.
                                    </div>
                                ) : !showBookingForm ? (
                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        <div style={{ backgroundColor: '#f8fbff', border: '1px solid #dbeafe', borderRadius: '18px', padding: '18px', color: '#475569', lineHeight: 1.7 }}>
                                            Booking requests are reviewed by admins before confirmation. Once approved, the reservation will show up in your bookings with a downloadable QR pass.
                                        </div>
                                        <button
                                            onClick={() => setShowBookingForm(true)}
                                            style={{ width: '100%', background: 'linear-gradient(135deg, #0b4aa6 0%, #0d6efd 100%)', color: '#ffffff', border: 'none', padding: '15px', borderRadius: '14px', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 14px 26px rgba(13, 110, 253, 0.22)' }}
                                        >
                                            Request to Book Space
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ backgroundColor: '#f8fbff', padding: '22px', borderRadius: '20px', border: '1px solid #dbeafe' }}>
                                        <h4 style={{ marginTop: 0, color: '#0f172a', marginBottom: '18px', fontSize: '18px' }}>Booking Request Form</h4>
                                        <form onSubmit={handleBookingSubmit}>
                                            <label style={{ display: 'block', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>Purpose of Booking</label>
                                            <input type="text" name="purpose" required value={bookingData.purpose} onChange={handleFormChange} placeholder="e.g. Group Study, Club Meeting" style={inputStyle} />

                                            <label style={{ display: 'block', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>Expected Attendees</label>
                                            <input type="number" name="attendees" required min="1" max={facility.capacity || 999} value={bookingData.attendees} onChange={handleFormChange} placeholder={`Max: ${facility.capacity || 'Any'}`} style={inputStyle} />

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                                                <div>
                                                    <label style={{ display: 'block', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>Start Date & Time</label>
                                                    <input
                                                        type="datetime-local"
                                                        name="startTime"
                                                        required
                                                        min={currentDateTime}
                                                        value={bookingData.startTime}
                                                        onChange={handleFormChange}
                                                        style={inputStyle}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>End Date & Time</label>
                                                    <input
                                                        type="datetime-local"
                                                        name="endTime"
                                                        required
                                                        min={bookingData.startTime || currentDateTime}
                                                        value={bookingData.endTime}
                                                        onChange={handleFormChange}
                                                        style={inputStyle}
                                                    />
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                                                <button type="submit" disabled={isSubmitting} style={{ flex: 2, minWidth: '180px', backgroundColor: '#0d6efd', color: '#ffffff', border: 'none', padding: '13px', borderRadius: '12px', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                                                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                                </button>
                                                <button type="button" onClick={() => setShowBookingForm(false)} style={{ flex: 1, minWidth: '140px', backgroundColor: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', padding: '13px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </section>
=======
    const inputClasses = "w-full px-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium";
    const labelClasses = "block text-[13px] font-bold text-slate-600 mb-2 uppercase tracking-wide";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 pb-20 font-sans">
            
            {/* HERO BANNER WITH IMAGE */}
            <div className="relative h-[450px] overflow-hidden bg-slate-900">
                {facility.imageUrl ? (
                    <img src={facility.imageUrl} alt={facility.name} className="w-full h-full object-cover opacity-60" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                    </div>
                )}
                
                {/* Gradient Overlay for Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="container mx-auto max-w-5xl flex flex-col gap-6">
                        <button 
                            onClick={() => navigate('/facilities')} 
                            className="w-fit bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg> 
                            Back to Directory
                        </button>
                        
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="bg-blue-500/20 backdrop-blur-sm text-blue-300 border border-blue-400/30 px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider shadow-sm">
                                    {facility.type}
                                </span>
                                <span className={`${facility.status === 'ACTIVE' ? 'bg-green-500/20 text-green-300 border-green-400/30' : 'bg-red-500/20 text-red-300 border-red-400/30'} backdrop-blur-sm border px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider shadow-sm`}>
                                    {facility.status}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg">{facility.name}</h1>
                            <p className="text-slate-300 text-lg md:text-xl font-medium flex items-center gap-2">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                {facility.location}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className="container mx-auto max-w-5xl -mt-8 px-4 relative z-20">
                
                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-5 transform transition-transform hover:-translate-y-1 duration-300">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <div>
                            <div className="text-slate-500 text-xs font-extrabold uppercase tracking-wider mb-1">Max Capacity</div>
                            <div className="text-slate-900 text-2xl font-black">{facility.capacity > 0 ? `${facility.capacity} Persons` : 'N/A'}</div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-5 transform transition-transform hover:-translate-y-1 duration-300">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center text-green-600 shadow-inner">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div>
                            <div className="text-slate-500 text-xs font-extrabold uppercase tracking-wider mb-1">Operating Hours</div>
                            <div className="text-slate-900 text-xl font-black">{facility.openTime || '--'} to {facility.closeTime || '--'}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    
                    {/* LEFT COL: Schedule */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">📅</div>
                                Upcoming Reservations
                            </h3>
                            
                            {approvedBookings.length === 0 ? (
                                <div className="p-10 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                    <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <p className="text-slate-500 font-bold text-lg mb-1">No upcoming bookings</p>
                                    <p className="text-slate-400 font-medium">This space is wide open for reservations.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {approvedBookings.map(booking => (
                                        <div key={booking.id} className="flex items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 group">
                                            <div className="w-16 h-16 rounded-xl bg-white shadow-sm border border-slate-100 text-blue-600 flex flex-col items-center justify-center mr-5 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                                <span className="text-[10px] font-black uppercase tracking-widest">{new Date(booking.startTime).toLocaleDateString('en-US', { month: 'short' })}</span>
                                                <span className="text-xl font-black leading-none">{new Date(booking.startTime).getDate()}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-slate-900 font-extrabold text-lg mb-1">{booking.purpose}</div>
                                                <div className="text-slate-500 text-sm font-semibold flex items-center gap-1.5">
                                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &mdash; {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <div className="hidden sm:block bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ml-4 border border-green-200 shadow-sm">
                                                Confirmed
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* System Message Box */}
                        {bookingMessage.text && (
                            <div className={`p-5 rounded-2xl border-l-4 flex items-center gap-4 shadow-sm ${bookingMessage.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bookingMessage.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {bookingMessage.type === 'success' ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    )}
                                </div>
                                <div className="font-bold text-[15px]">{bookingMessage.text}</div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COL: Booking Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 sticky top-8">
                            
                            {facility.status === 'OUT_OF_SERVICE' ? (
                                <div className="text-center py-6">
                                    <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5 border-4 border-red-100">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Maintenance Mode</h3>
                                    <p className="text-slate-500 font-medium mb-8">This resource is currently unavailable for booking. Please check back later.</p>
                                    <button onClick={() => navigate('/incidents')} className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">View Active Incidents</button>
                                </div>
                            
                            ) : !user ? (
                                <div className="text-center py-6">
                                    <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-5 border-4 border-indigo-100 shadow-inner">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Login Required</h3>
                                    <p className="text-slate-500 font-medium mb-8">You need to be logged into a student or staff account to request access to this facility.</p>
                                    <button onClick={() => navigate('/login')} className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">Sign In to Continue</button>
                                </div>
                            
                            ) : !showBookingForm ? (
                                <div className="text-center py-6">
                                    <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-5 border-4 border-emerald-100 shadow-inner">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Ready to Book?</h3>
                                    <p className="text-slate-500 font-medium mb-8">Secure this space for your next lecture, meeting, or study session.</p>
                                    <button onClick={() => setShowBookingForm(true)} className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 text-lg">Create Booking Request</button>
                                </div>
                            
                            ) : (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-extrabold text-slate-900">New Request</h3>
                                        <button onClick={() => setShowBookingForm(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                    
                                    <form onSubmit={handleBookingSubmit} className="space-y-5">
                                        <div>
                                            <label className={labelClasses}>Purpose of Booking <span className="text-red-500">*</span></label>
                                            <input type="text" name="purpose" required value={bookingData.purpose} onChange={handleFormChange} placeholder="e.g. Group Study" className={inputClasses} />
                                        </div>

                                        <div>
                                            <label className={labelClasses}>Expected Attendees <span className="text-red-500">*</span></label>
                                            <input type="number" name="attendees" required min="1" max={facility.capacity || 999} value={bookingData.attendees} onChange={handleFormChange} placeholder={`Max: ${facility.capacity || 'Any'}`} className={inputClasses} />
                                        </div>

                                        <div>
                                            <label className={labelClasses}>Start Time <span className="text-red-500">*</span></label>
                                            <input type="datetime-local" name="startTime" required min={currentDateTime} value={bookingData.startTime} onChange={handleFormChange} className={inputClasses} />
                                        </div>

                                        <div>
                                            <label className={labelClasses}>End Time <span className="text-red-500">*</span></label>
                                            <input type="datetime-local" name="endTime" required min={bookingData.startTime || currentDateTime} value={bookingData.endTime} onChange={handleFormChange} className={inputClasses} />
                                        </div>

                                        <div className="pt-4">
                                            <button 
                                                type="submit" 
                                                disabled={isSubmitting} 
                                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-lg flex justify-center items-center gap-2"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Submitting...
                                                    </>
                                                ) : 'Submit Request'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
>>>>>>> 96439003954e2b9b579f2f78fc1a2198bdfaec45
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacilityDetails;