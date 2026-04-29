import React, { useState, useEffect } from 'react';
import bookingService from '../../services/bookingService';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const getBookingTimestamp = (booking) => {
        const candidates = [booking.createdAt, booking.updatedAt, booking.startTime, booking.endTime];
        for (const value of candidates) {
            if (!value) continue;
            const time = new Date(value).getTime();
            if (!Number.isNaN(time)) return time;
        }
        return 0;
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const data = await bookingService.getAllBookings();
            data.sort((a, b) => getBookingTimestamp(b) - getBookingTimestamp(a));
            setBookings(data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, newStatus) => {
        try {
            await bookingService.updateBookingStatus(id, newStatus);
            alert(`Booking ${newStatus} successfully!`);
            loadBookings(); 
        } catch (error) {
            alert("Error updating booking status.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 pb-16 font-sans">
            
            {/* HERO HEADER */}
            <div className="relative overflow-hidden bg-white border-b border-slate-200 px-6 py-10 mb-10 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent pointer-events-none"></div>
                <div className="max-w-6xl mx-auto relative z-10 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Booking Management</h1>
                        <p className="text-slate-500 font-medium text-lg">Review and process student resource requests.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6">
                {bookings.length === 0 ? (
                    <div className="bg-white p-16 text-center rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No Pending Requests</h3>
                        <p className="text-slate-500">The booking queue is completely empty.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {bookings.map(booking => {
                            const isPending = booking.status === 'PENDING';
                            const isApproved = booking.status === 'APPROVED';
                            const isRejected = booking.status === 'REJECTED';
                            
                            const statusStyles = isApproved 
                                ? 'bg-green-100 text-green-700 border-green-200' 
                                : isRejected 
                                    ? 'bg-red-100 text-red-700 border-red-200' 
                                    : 'bg-amber-100 text-amber-700 border-amber-200';

                            return (
                                <div 
                                    key={booking.id} 
                                    className={`bg-white p-6 rounded-2xl border ${isPending ? 'border-amber-300 shadow-lg shadow-amber-500/10' : 'border-slate-200 shadow-sm hover:shadow-md'} transition-all duration-300 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center`}
                                >
                                    
                                    <div className="flex-1 w-full">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <h3 className="text-xl font-extrabold text-slate-900 m-0">{booking.facilityName}</h3>
                                            <span className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider border ${statusStyles}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                                </div>
                                                <div>
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Requested By</div>
                                                    <div className="text-sm font-bold text-slate-700">{booking.userName}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                </div>
                                                <div>
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Purpose</div>
                                                    <div className="text-sm font-bold text-slate-700">{booking.purpose} ({booking.attendees} ppl)</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 inline-flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-600 w-full sm:w-auto">
                                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            {new Date(booking.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} &mdash; {new Date(booking.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    {isPending && (
                                        <div className="flex flex-row md:flex-col gap-3 w-full md:w-40 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                            <button 
                                                onClick={() => handleAction(booking.id, 'APPROVED')} 
                                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-bold shadow-md shadow-green-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleAction(booking.id, 'REJECTED')} 
                                                className="flex-1 bg-white border-2 border-red-100 hover:bg-red-50 hover:border-red-200 text-red-600 py-3 px-4 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBookings;