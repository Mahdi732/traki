import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTrips } from '../hooks/useTrips.js';
import { useTrucks } from '../hooks/useTrucks.js';
import { TripForm } from '../components/trips/TripForm.jsx';
import { TripsList } from '../components/trips/TripsList.jsx';
import { Button } from '../components/common/button.jsx';
import TripDetail from '../components/trips/TripDetail.jsx';
import { getTripByIdRequestHandler, downloadTripRequestHandler } from '../services/api/trips.js';
import { useFuelLogs } from '../hooks/useFuelLogs.js';

// TripsPage - manage trips
// Admin: create and manage all trips
// Driver: view only their assigned trips
export function TripsPage() {
  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);
  
  // Use trips hook (passes user role for access control)
  const { trips, loading, error, createTrip, updateTrip, deleteTrip } = useTrips(user?.role);
  
  // Use trucks hook to get available trucks
  const { trucks, loading: trucksLoading } = useTrucks();
  
  // State to show/hide form (admin only)
  const [showForm, setShowForm] = useState(false);
  // State to track which trip is being edited (null if creating new)
  const [editingTrip, setEditingTrip] = useState(null);
  // Form error/success messages
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // Drivers list (will fetch all drivers)
  const [drivers, setDrivers] = useState([]);
  const [driversLoading, setDriversLoading] = useState(false);
  // Selected trip shown inline
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { createLog } = useFuelLogs();
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch drivers when form is shown (for admin to assign)
  useEffect(() => {
    if (showForm && user?.role === 'ADMIN') {
      fetchDrivers();
    }
  }, [showForm]);

  const fetchDrivers = async () => {
    try {
      setDriversLoading(true);
      // Use dedicated drivers endpoint instead of extracting from trips
      const { getDriversRequestHandler } = await import('../services/api/drivers.js');
      const response = await getDriversRequestHandler();
      if (response.data && Array.isArray(response.data)) {
        setDrivers(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch drivers:', err);
      setFormError('Failed to load drivers');
    } finally {
      setDriversLoading(false);
    }
  };

  // Show trip details inline
  const handleView = async (id) => {
    try {
      setSelectedLoading(true);
      const res = await getTripByIdRequestHandler(id);
      setSelectedTrip(res.data);
    } catch (err) {
      setFormError(err.message || 'Failed to load trip details');
    } finally {
      setSelectedLoading(false);
    }
  };

  // Download trip PDF (uses backend streaming)
  const handleDownload = async (id) => {
    try {
      setDownloading(true);
      const res = await downloadTripRequestHandler(id);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trip-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setFormError('Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedTrip) return;
    try {
      await updateTrip(selectedTrip._id, { status: newStatus });
      const res = await getTripByIdRequestHandler(selectedTrip._id);
      setSelectedTrip(res.data);
    } catch (err) {
      setFormError(err.message || 'Failed to update status');
    }
  };

  // Change status from list (driver quick action)
  const handleChangeStatus = async (tripId, newStatus) => {
    try {
      await updateTrip(tripId, { status: newStatus });
      // If currently viewing this trip, refresh it
      if (selectedTrip && selectedTrip._id === tripId) {
        const res = await getTripByIdRequestHandler(tripId);
        setSelectedTrip(res.data);
      }
      setSuccessMessage('Status updated');
      setTimeout(() => setSuccessMessage(''), 2500);
    } catch (err) {
      setFormError(err.message || 'Failed to change status');
    }
  };

  const handleAddFuelLog = async (payload) => {
    try {
      await createLog(payload);
      // optionally refresh trip
    } catch (err) {
      setFormError(err.message || 'Failed to add fuel log');
    }
  };

  // Save trip data (odometer/fuel/remarks) from driver
  const handleSaveTrip = async (payload) => {
    if (!selectedTrip) return;
    try {
      await updateTrip(selectedTrip._id, payload);
      const res = await getTripByIdRequestHandler(selectedTrip._id);
      setSelectedTrip(res.data);
      setSuccessMessage('Trip details saved');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err.message || 'Failed to save trip details');
    }
  };

  // Handle create or update trip
  const handleSubmit = async (tripData) => {
    try {
      setFormError('');
      
      if (editingTrip) {
        // Update existing trip
        await updateTrip(editingTrip._id, tripData);
        setSuccessMessage(`Trip "${tripData.title}" has been updated successfully`);
      } else {
        // Create new trip
        await createTrip(tripData);
        setSuccessMessage(`New trip "${tripData.title}" has been created`);
      }
      
      // Close form and clear success message after 3 seconds
      setShowForm(false);
      setEditingTrip(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err.message || 'An error occurred while saving the trip');
    }
  };

  // Handle edit trip (admin only)
  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setShowForm(true);
    setFormError('');
  };

  // Handle delete trip (admin only)
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      try {
        await deleteTrip(id);
        setSuccessMessage('Trip has been deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setFormError(err.message || 'Failed to delete trip');
      }
    }
  };

  // Handle cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingTrip(null);
    setFormError('');
  };

  // Filter trips by status
  const filterTrips = (trips, filter) => {
    switch(filter) {
      case 'upcoming':
        return trips.filter(trip =>
          new Date(trip.plannedStart || trip.startDate || 0) > new Date() && 
          (trip.status === 'TO_DO' || trip.status === 'SCHEDULED' || trip.status === 'scheduled')
        );
      case 'active':
        return trips.filter(trip => 
          trip.status === 'IN_PROGRESS' || trip.status === 'in_progress' || trip.status === 'active'
        );
      case 'completed':
        return trips.filter(trip =>
          /done|completed/i.test(String(trip.status)) || trip.status === 'DONE' || trip.status === 'COMPLETED'
        );
      default:
        return trips;
    }
  };

  const filteredTrips = filterTrips(trips, activeFilter);

  const upcomingTrips = filterTrips(trips, 'upcoming');
  const activeTrips = filterTrips(trips, 'active');
  const completedTrips = filterTrips(trips, 'completed');

  return (
    <div className="min-h-screen bg-custom-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.role === 'ADMIN' ? 'Trip Management' : 'My Trips'}
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role === 'ADMIN' ? 'Manage and track all trips in your fleet' : 'View and manage your assigned trips'}
              </p>
            </div>
            
            {/* Create trip button (admin only) */}
            {user?.role === 'ADMIN' && !showForm && (
              <Button 
                onClick={() => setShowForm(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-cerulean to-cerulean/90 text-white font-medium rounded-lg hover:from-cerulean/90 hover:to-cerulean transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Trip
              </Button>
            )}
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-sage/10 border border-sage/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-sage" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-900 font-medium">{successMessage}</span>
              </div>
            </div>
          )}

          {/* Stats cards */}
          {user?.role === 'ADMIN' && trips.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div 
                className={`bg-white border border-gray-200 rounded-xl shadow-sm p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${activeFilter === 'upcoming' ? 'ring-2 ring-cerulean/30' : ''}`}
                onClick={() => setActiveFilter(activeFilter === 'upcoming' ? 'all' : 'upcoming')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Upcoming Trips</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{upcomingTrips.length}</p>
                  </div>
                  <div className="p-3 bg-cerulean/10 rounded-lg">
                    <svg className="w-6 h-6 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div 
                className={`bg-white border border-gray-200 rounded-xl shadow-sm p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${activeFilter === 'active' ? 'ring-2 ring-sage/30' : ''}`}
                onClick={() => setActiveFilter(activeFilter === 'active' ? 'all' : 'active')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Active Trips</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{activeTrips.length}</p>
                  </div>
                  <div className="p-3 bg-sage/10 rounded-lg">
                    <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div 
                className={`bg-white border border-gray-200 rounded-xl shadow-sm p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${activeFilter === 'completed' ? 'ring-2 ring-amber/30' : ''}`}
                onClick={() => setActiveFilter(activeFilter === 'completed' ? 'all' : 'completed')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Completed</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{completedTrips.length}</p>
                  </div>
                  <div className="p-3 bg-amber/10 rounded-lg">
                    <svg className="w-6 h-6 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form section (admin only) */}
        {showForm && user?.role === 'ADMIN' && (
            <div className="mb-8 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingTrip ? 'Edit Trip' : 'Create New Trip'}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {editingTrip ? 'Update trip details' : 'Schedule a new trip for your fleet'}
                  </p>
                </div>
                {editingTrip && (
                  <span className="px-3 py-1 bg-cerulean/10 text-cerulean text-xs font-semibold rounded-full">
                    Editing Mode
                  </span>
                )}
              </div>
            </div>
            
            {/* Form error */}
            {formError && (
              <div className="mx-6 mt-6 p-4 bg-terracotta/10 border border-terracotta/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-terracotta/20 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-terracotta" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-900">{formError}</span>
                </div>
              </div>
            )}
            
            <div className="p-6">
              <TripForm 
                onSubmit={handleSubmit}
                isLoading={loading}
                error={formError}
                trip={editingTrip}
                trucks={trucks}
                trucksLoading={trucksLoading}
                drivers={drivers}
                driversLoading={driversLoading}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        {/* Inline trip detail */}
        {selectedTrip && (
          <div className="mb-8">
            <TripDetail
              trip={selectedTrip}
              onDownload={() => handleDownload(selectedTrip._id)}
              downloading={downloading}
              currentUser={user}
              onUpdateStatus={handleUpdateStatus}
              onAddFuelLog={handleAddFuelLog}
              onSaveTrip={handleSaveTrip}
            />
          </div>
        )}

        {/* Trips list */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Trips</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {filteredTrips.length} trip{filteredTrips.length !== 1 ? 's' : ''} found
                  {activeFilter !== 'all' && ` • ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}`}
                </p>
              </div>
              
              {/* Filter options */}
              {trips.length > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setActiveFilter('all')}
                      className={`px-3 py-1.5 text-sm transition-colors ${activeFilter === 'all' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setActiveFilter('upcoming')}
                      className={`px-3 py-1.5 text-sm transition-colors ${activeFilter === 'upcoming' ? 'bg-cerulean text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      Upcoming
                    </button>
                    <button 
                      onClick={() => setActiveFilter('active')}
                      className={`px-3 py-1.5 text-sm transition-colors ${activeFilter === 'active' ? 'bg-sage text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      Active
                    </button>
                    <button 
                      onClick={() => setActiveFilter('completed')}
                      className={`px-3 py-1.5 text-sm transition-colors ${activeFilter === 'completed' ? 'bg-amber text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {loading && !editingTrip ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-cerulean mb-5"></div>
                <p className="text-gray-500 text-lg">Loading trips...</p>
                <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your trips</p>
              </div>
            ) : error ? (
              <div className="p-6 bg-terracotta/10 border border-terracotta/20 rounded-lg">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-terracotta/20 flex items-center justify-center mr-4 mt-1">
                    <svg className="w-5 h-5 text-terracotta" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Error loading trips</h3>
                    <div className="text-gray-600 mb-4">{error}</div>
                    <button 
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            ) : filteredTrips.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {user?.role === 'ADMIN' ? 'No trips scheduled yet' : 'No trips assigned to you'}
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {user?.role === 'ADMIN' 
                    ? 'Start by creating your first trip to manage your fleet operations.'
                    : 'You currently don\'t have any assigned trips. Please check back later.'
                  }
                </p>
                {user?.role === 'ADMIN' && !showForm && (
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-cerulean to-cerulean/90 text-white font-medium rounded-lg hover:from-cerulean/90 hover:to-cerulean transition-all duration-200"
                  >
                    Create Your First Trip
                  </Button>
                )}
              </div>
              ) : (
              <TripsList 
                trips={filteredTrips}
                userRole={user?.role}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                onDownload={(tId) => handleDownload(tId)}
                onStatusChange={handleChangeStatus}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}