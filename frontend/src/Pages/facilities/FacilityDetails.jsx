import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import facilityService from '../../services/facilityService';
import { QRCodeSVG } from 'qrcode.react';

const FacilityDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [facility, setFacility] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFacility = async () => {
            try {
                const facilities = await facilityService.getAllFacilities();
                const selected = facilities.find((item) => String(item.id) === String(id));
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

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px', color: '#0d6efd' }}>Loading facility details...</div>;
    }

    if (!facility) {
        return (
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
                <button
                    onClick={() => navigate('/facilities')}
                    style={{ marginBottom: '16px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>
                    Back to Facilities
                </button>
                <div style={{ backgroundColor: '#fff3cd', color: '#664d03', border: '1px solid #ffecb5', borderRadius: '8px', padding: '16px' }}>
                    Facility not found.
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <button
                onClick={() => navigate('/facilities')}
                style={{ marginBottom: '16px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>
                Back to Facilities
            </button>

            <div style={{ border: '1px solid #cfe2ff', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
                {facility.imageUrl ? (
                    <img
                        src={facility.imageUrl}
                        alt={facility.name}
                        style={{ width: '100%', maxHeight: '320px', objectFit: 'cover', borderBottom: '1px solid #cfe2ff' }}
                    />
                ) : (
                    <div style={{ height: '240px', backgroundColor: '#e7f1ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#084298', fontWeight: 'bold', fontSize: '22px' }}>
                        {facility.type}
                    </div>
                )}

                <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                            <h2 style={{ margin: 0, color: '#084298' }}>{facility.name}</h2>
                            <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '12px', padding: '4px 10px', borderRadius: '12px', backgroundColor: facility.status === 'ACTIVE' ? '#d1e7dd' : '#f8d7da', color: facility.status === 'ACTIVE' ? '#0f5132' : '#842029', fontWeight: 'bold' }}>
                                {facility.status}
                            </span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <QRCodeSVG value={`http://localhost:5173/incidents/new?resourceId=${facility.id}`} size={80} />
                            <p style={{ fontSize: '10px', color: '#6c757d', marginTop: '4px', margin: 0 }}>Scan to report incident</p>
                        </div>
                    </div>

                    <p style={{ marginTop: 0, color: '#6c757d' }}>{facility.location}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '16px' }}>
                        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '6px', padding: '12px' }}>
                            <div style={{ color: '#6c757d', fontSize: '12px' }}>Type</div>
                            <div style={{ fontWeight: 'bold' }}>{facility.type || 'N/A'}</div>
                        </div>
                        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '6px', padding: '12px' }}>
                            <div style={{ color: '#6c757d', fontSize: '12px' }}>Capacity</div>
                            <div style={{ fontWeight: 'bold' }}>{facility.capacity > 0 ? facility.capacity : 'N/A'}</div>
                        </div>
                        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '6px', padding: '12px' }}>
                            <div style={{ color: '#6c757d', fontSize: '12px' }}>Open Time</div>
                            <div style={{ fontWeight: 'bold' }}>{facility.openTime || 'N/A'}</div>
                        </div>
                        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '6px', padding: '12px' }}>
                            <div style={{ color: '#6c757d', fontSize: '12px' }}>Close Time</div>
                            <div style={{ fontWeight: 'bold' }}>{facility.closeTime || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacilityDetails;
