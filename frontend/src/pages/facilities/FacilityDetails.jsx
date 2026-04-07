import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import facilityService from '../../services/facilityService';

const FacilityDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [facility, setFacility] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFacility = async () => {
            try {
                const selected = await facilityService.getFacilityById(id);
                setFacility(selected || null);
            } catch (error) {
                console.error('Error loading facility details:', error);
                setFacility(null);
            } finally {
                setLoading(false);
            }
        };
        loadFacility();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: '#0d6efd' }}>Loading facility details...</div>;

    if (!facility) return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <button onClick={() => navigate('/')} style={{ marginBottom: '16px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>
                &larr; Back to Catalogue
            </button>
            <div style={{ backgroundColor: '#fff3cd', color: '#664d03', border: '1px solid #ffecb5', borderRadius: '8px', padding: '16px' }}>Facility not found.</div>
        </div>
    );

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <button onClick={() => navigate('/')} style={{ marginBottom: '16px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                &larr; Back to Catalogue
            </button>

            <div style={{ border: '1px solid #cfe2ff', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
                {facility.imageUrl ? (
                    <img src={facility.imageUrl} alt={facility.name} style={{ width: '100%', maxHeight: '350px', objectFit: 'cover', borderBottom: '1px solid #cfe2ff' }} />
                ) : (
                    <div style={{ height: '250px', backgroundColor: '#e7f1ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#084298', fontWeight: 'bold', fontSize: '22px' }}>{facility.type}</div>
                )}

                <div style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h1 style={{ margin: 0, color: '#084298' }}>{facility.name}</h1>
                        <span style={{ fontSize: '14px', padding: '5px 12px', borderRadius: '15px', backgroundColor: facility.status === 'ACTIVE' ? '#d1e7dd' : '#f8d7da', color: facility.status === 'ACTIVE' ? '#0f5132' : '#842029', fontWeight: 'bold' }}>
                            {facility.status}
                        </span>
                    </div>

                    <p style={{ marginTop: 0, color: '#6c757d', fontSize: '16px', marginBottom: '25px' }}>📍 {facility.location}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '6px', padding: '15px', border: '1px solid #e9ecef' }}>
                            <div style={{ color: '#6c757d', fontSize: '13px' }}>Type</div>
                            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{facility.type || 'N/A'}</div>
                        </div>
                        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '6px', padding: '15px', border: '1px solid #e9ecef' }}>
                            <div style={{ color: '#6c757d', fontSize: '13px' }}>Capacity</div>
                            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{facility.capacity > 0 ? facility.capacity : 'N/A'}</div>
                        </div>
                        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '6px', padding: '15px', border: '1px solid #e9ecef' }}>
                            <div style={{ color: '#6c757d', fontSize: '13px' }}>Operating Hours</div>
                            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{facility.openTime || 'N/A'} - {facility.closeTime || 'N/A'}</div>
                        </div>
                    </div>

                    {/* ALUTH BOOKING BUTTON EKA */}
                    {facility.status === 'ACTIVE' ? (
                        <button 
                            onClick={() => navigate(`/facilities/${facility.id}/book`)}
                            style={{ width: '100%', padding: '15px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}>
                            Proceed to Book Resource
                        </button>
                    ) : (
                        <div style={{ padding: '15px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #ffe69c' }}>
                            This resource is OUT OF SERVICE and cannot be booked right now.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FacilityDetails;