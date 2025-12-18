import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getTripByIdRequestHandler, downloadTripRequestHandler, updateTripRequestHandler } from '../services/api/trips.js';
import { createFuelLogRequestHandler } from '../services/api/fuellogs.js';
import { TripDetail } from '../components/trips/TripDetail.jsx';

export function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getTripByIdRequestHandler(id);
        if (mounted) setTrip(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load trip');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await downloadTripRequestHandler(id);
      // create blob and trigger download
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trip-${id}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      setError('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setLoading(true);
      await updateTripRequestHandler(id, { status: newStatus });
      const res = await getTripByIdRequestHandler(id);
      setTrip(res.data);
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFuelLog = async (payload) => {
    try {
      setLoading(true);
      await createFuelLogRequestHandler(payload);
      const res = await getTripByIdRequestHandler(id);
      setTrip(res.data);
    } catch (err) {
      setError(err.message || 'Failed to add fuel log');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async (payload) => {
    try {
      setLoading(true);
      await updateTripRequestHandler(id, payload);
      const res = await getTripByIdRequestHandler(id);
      setTrip(res.data);
    } catch (err) {
      setError(err.message || 'Failed to save trip details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-custom-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-cerulean mb-4"></div>
        <h2 className="text-lg font-medium text-gray-900">Loading trip details...</h2>
        <p className="text-gray-500 mt-1">Please wait while we fetch the trip information</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-custom-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => navigate('/trips')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Trips
        </button>
        
        <div className="bg-white border border-terracotta/20 rounded-xl p-8">
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Trip</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-x-4">
                <button 
                  onClick={() => navigate('/trips')}
                  className="px-4 py-2 bg-gradient-to-r from-cerulean to-cerulean/90 text-white font-medium rounded-lg hover:from-cerulean/90 hover:to-cerulean transition-all duration-200"
                >
                  View All Trips
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-custom-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with navigation */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 group"
          >
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Trips
          </button>

          {/* Trip Header Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Trip Details</h1>
                  <p className="text-gray-600 mt-1">Trip ID: {id}</p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export PDF
                      </>
                    )}
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cerulean to-cerulean/90 text-white text-sm font-medium rounded-lg hover:from-cerulean/90 hover:to-cerulean transition-all duration-200">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Trip
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            {trip && (
              <div className="px-6 py-4 bg-gray-50/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Status</div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      trip.status === 'completed' 
                        ? 'bg-sage/10 text-sage'
                        : trip.status === 'in_progress'
                        ? 'bg-cerulean/10 text-cerulean'
                        : trip.status === 'scheduled'
                        ? 'bg-amber/10 text-amber'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        trip.status === 'completed' 
                          ? 'bg-sage'
                          : trip.status === 'in_progress'
                          ? 'bg-cerulean'
                          : trip.status === 'scheduled'
                          ? 'bg-amber'
                          : 'bg-gray-500'
                      }`}></div>
                      {trip.status?.replace('_', ' ') || 'Unknown'}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Distance</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {trip.distance ? `${trip.distance} km` : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Estimated Time</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {trip.estimatedDuration || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Driver</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {trip.driver?.name || 'Unassigned'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trip Details */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <TripDetail
                trip={trip}
                onDownload={handleDownload}
                downloading={downloading}
                currentUser={user}
                onUpdateStatus={handleUpdateStatus}
                onAddFuelLog={handleAddFuelLog}
                onSaveTrip={handleSaveTrip}
              />
            </div>

            {/* Additional Information */}
            {trip && (
              <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Cargo Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Type</span>
                          <span className="text-sm font-medium text-gray-900">{trip.cargoType || 'General'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Weight</span>
                          <span className="text-sm font-medium text-gray-900">{trip.cargoWeight || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Value</span>
                          <span className="text-sm font-medium text-gray-900">{trip.cargoValue || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Documentation</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Bill of Lading</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            trip.billOfLading 
                              ? 'bg-sage/10 text-sage'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {trip.billOfLading ? 'Available' : 'Pending'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Customs Clearance</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            trip.customsClearance 
                              ? 'bg-sage/10 text-sage'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {trip.customsClearance ? 'Cleared' : 'Required'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Insurance</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            trip.insurance 
                              ? 'bg-sage/10 text-sage'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {trip.insurance ? 'Active' : 'Needed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            {/* Timeline */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Trip Timeline</h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-8 h-8 rounded-full bg-cerulean/10 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-cerulean"></div>
                      </div>
                      <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Trip Created</div>
                      <div className="text-sm text-gray-500">Initial setup and assignment</div>
                      <div className="text-xs text-gray-400 mt-1">2 days ago</div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-8 h-8 rounded-full bg-sage/10 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-sage"></div>
                      </div>
                      <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Driver Assigned</div>
                      <div className="text-sm text-gray-500">John Doe assigned to trip</div>
                      <div className="text-xs text-gray-400 mt-1">Yesterday</div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-8 h-8 rounded-full bg-amber/10 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-amber"></div>
                      </div>
                      <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Departed Origin</div>
                      <div className="text-sm text-gray-500">Vehicle left starting location</div>
                      <div className="text-xs text-gray-400 mt-1">Today, 08:30 AM</div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Estimated Arrival</div>
                      <div className="text-sm text-gray-500">Expected at destination</div>
                      <div className="text-xs text-gray-400 mt-1">Tomorrow, 03:00 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">Update Status</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">Contact Driver</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">View Documents</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">Generate Report</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              Trip last updated: {trip?.updatedAt ? new Date(trip.updatedAt).toLocaleString() : 'N/A'}
            </div>
            <div>
              <button 
                onClick={() => navigate('/trips')}
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Trips List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripDetailPage;