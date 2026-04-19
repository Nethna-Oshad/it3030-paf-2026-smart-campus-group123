import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import facilityService from '../../services/facilityService';
import { AuthContext } from '../../context/AuthContext';
import AddFacilityModal from './AddFacilityModal'; 
import EditFacilityModal from './EditFacilityModal';

const FacilitiesCatalogue = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [facilitiesLive, setFacilitiesLive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [facilityToEdit, setFacilityToEdit] = useState(null);

    useEffect(() => {
        fetchLiveFacilities();
    }, []);

    const fetchLiveFacilities = async () => {
        try {
            // --- NEW: Fetch the LIVE FUSION data instead of just standard facilities ---
            const data = await facilityService.getFacilitiesWithLiveStatus();
            setFacilitiesLive(data);
        } catch (error) {
            console.error("Error loading facilities:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to completely delete this resource?")) {
            try {
                await facilityService.deleteFacility(id);
                fetchLiveFacilities(); 
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Error deleting resource.");
            }
        }
    };

    const handleEditClick = (facility) => {
        setFacilityToEdit(facility);
        setIsEditModalOpen(true);
    };

    const filteredFacilities = facilitiesLive.filter(item => {
        const fac = item.facility;
        const matchSearch = fac.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            fac.location?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType === 'ALL' || fac.type === filterType;
        return matchSearch && matchType;
    });

    if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: '#0d6efd' }}>Loading Live Campus Nexus...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ color: '#084298', margin: '0 0 5px 0' }}>Facilities & Assets</h1>
                    <p style={{ color: '#0d6efd', margin: 0 }}>Live Campus Map & Resource Booking</p>
                </div>
                
                {user && user.role === 'ADMIN' && (
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        + Add Resource
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #cfe2ff' }}>
                <input 
                    type="text" placeholder="Search by name or location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: 'white' }}>
                    <option value="ALL">All Types</option>
                    <option value="Lecture Hall">Lecture Hall</option>
                    <option value="Lab">Lab</option>
                    <option value="Meeting Room">Meeting Room</option>
                    <option value="Equipment">Equipment</option>
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {filteredFacilities.length === 0 ? (
                    <p style={{ color: '#6c757d' }}>No resources found.</p>
                ) : (
                    filteredFacilities.map(item => {
                        const fac = item.facility;
                        const isAvailable = item.liveStatus === "AVAILABLE NOW";
                        
                        return (
                            <div key={fac.id} style={{ border: `1px solid ${item.statusColor}40`, borderRadius: '12px', overflow: 'hidden', backgroundColor: 'white', boxShadow: `0 4px 15px ${item.statusColor}20`, transition: 'transform 0.2s', position: 'relative' }}>
                                
                                {/* LIVE STATUS BADGE OVERLAY */}
                                <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', color: item.statusColor, border: `1px solid ${item.statusColor}`, display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', zIndex: 10 }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.statusColor, animation: isAvailable ? 'none' : 'pulse 2s infinite' }}></div>
                                    {item.liveStatus}
                                </div>

                                {fac.imageUrl ? (
                                    <img src={fac.imageUrl} alt={fac.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderBottom: '1px solid #eee' }} />
                                ) : (
                                    <div style={{ height: '160px', backgroundColor: '#cfe2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #cfe2ff' }}>
                                        <span style={{ color: '#084298', fontWeight: 'bold', fontSize: '18px' }}>{fac.type}</span>
                                    </div>
                                )}

                                <div style={{ padding: '20px' }}>
                                    <h3 style={{ margin: '0 0 5px 0', color: '#212529' }}>{fac.name}</h3>
                                    <p style={{ fontSize: '14px', color: '#6c757d', margin: '0 0 15px 0' }}>📍 {fac.location}</p>
                                    
                                    {/* ACTIVITY SUBTEXT */}
                                    <div style={{ backgroundColor: `${item.statusColor}10`, padding: '10px', borderRadius: '6px', fontSize: '13px', color: item.statusColor, marginBottom: '15px', fontWeight: '500', borderLeft: `3px solid ${item.statusColor}` }}>
                                        {item.currentActivity}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#495057', fontSize: '13px', marginBottom: '20px' }}>
                                        <span>👥 {fac.capacity > 0 ? fac.capacity : 'N/A'} Seats</span>
                                        <span>🕒 {fac.openTime || 'N/A'} - {fac.closeTime || 'N/A'}</span>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/facilities/${fac.id}`)}
                                        style={{ width: '100%', padding: '12px', backgroundColor: isAvailable ? '#0d6efd' : '#e9ecef', color: isAvailable ? 'white' : '#495057', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }}>
                                        View Details & Book
                                    </button>

                                    {/* ADMIN CONTROLS */}
                                    {user && user.role === 'ADMIN' && (
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <button onClick={() => handleEditClick(fac)} style={{ flex: 1, padding: '8px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(fac.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <AddFacilityModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onFacilityAdded={fetchLiveFacilities} 
            />

            {facilityToEdit && (
                <EditFacilityModal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onFacilityUpdated={fetchLiveFacilities} 
                    facility={facilityToEdit}
                />
            )}

        </div>
    );
};

export default FacilitiesCatalogue;