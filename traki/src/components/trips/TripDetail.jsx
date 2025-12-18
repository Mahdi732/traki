import React, { useState } from 'react';

export function TripDetail({ trip, onDownload, downloading, currentUser, onUpdateStatus, onAddFuelLog, onSaveTrip }) {
  if (!trip) return null;

  const [fuel, setFuel] = useState({ liters: '', odometer: '', notes: '' });
  const [odometer, setOdometer] = useState({ startKm: trip.startKm || '', endKm: trip.endKm || '' });
  const [tripNotes, setTripNotes] = useState(trip.remarks || '');
  const [savedFuelVolume, setSavedFuelVolume] = useState(trip.fuelVolume || '');
  const formatDate = (d) => (d ? new Date(d).toLocaleString() : 'N/A');

  const isDriver = currentUser && currentUser.role === 'DRIVER' && trip.driver && (trip.driver._id === currentUser._id || trip.driver === currentUser._id);

  const submitFuel = async (e) => {
    e.preventDefault();
    if (!onAddFuelLog) return;
    await onAddFuelLog({ trip: trip._id, liters: fuel.liters, odometer: fuel.odometer, notes: fuel.notes });
    setFuel({ liters: '', odometer: '', notes: '' });
  };

  const saveTripDetails = async (e) => {
    e && e.preventDefault();
    if (!onSaveTrip) return;
    const payload = {
      startKm: odometer.startKm ? Number(odometer.startKm) : undefined,
      endKm: odometer.endKm ? Number(odometer.endKm) : undefined,
      fuelVolume: savedFuelVolume ? Number(savedFuelVolume) : undefined,
      remarks: tripNotes || undefined,
    };
    await onSaveTrip(payload);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'TO_DO': 'bg-amber/10 text-amber border-amber/20',
      'IN_PROGRESS': 'bg-cerulean/10 text-cerulean border-cerulean/20',
      'DONE': 'bg-sage/10 text-sage border-sage/20',
      'COMPLETED': 'bg-sage/10 text-sage border-sage/20',
      'SCHEDULED': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'TO_DO': 'To Do',
      'IN_PROGRESS': 'In Progress',
      'DONE': 'Done',
      'COMPLETED': 'Completed',
      'SCHEDULED': 'Scheduled'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{trip.title}</h2>
            <p className="text-gray-600 text-sm mt-1">{trip.description}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(trip.status)} border`}>
            {getStatusText(trip.status)}
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            {/* Origin & Destination */}
            <div className="flex items-start">
              <div className="w-10 h-10 bg-cerulean/10 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Route</div>
                <div className="font-medium text-gray-900">{trip.origin || 'N/A'}</div>
                <div className="text-sm text-gray-600 mt-1">to</div>
                <div className="font-medium text-gray-900">{trip.destination || 'N/A'}</div>
              </div>
            </div>

            {/* Schedule */}
            <div className="flex items-start">
              <div className="w-10 h-10 bg-amber/10 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Schedule</div>
                <div className="font-medium text-gray-900">{formatDate(trip.plannedStart)}</div>
                <div className="text-sm text-gray-600 mt-1">to</div>
                <div className="font-medium text-gray-900">{formatDate(trip.plannedEnd)}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Driver Info */}
            <div className="flex items-start">
              <div className="w-10 h-10 bg-sage/10 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Driver</div>
                <div className="font-medium text-gray-900">{trip.driver?.name || 'Not assigned'}</div>
                {trip.driver?.email && (
                  <div className="text-sm text-gray-600 mt-1">{trip.driver.email}</div>
                )}
              </div>
            </div>

            {/* Truck Info */}
            <div className="flex items-start">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Truck</div>
                <div className="font-medium text-gray-900">
                  {trip.truck?.plateNumber 
                    ? `${trip.truck.plateNumber} • ${trip.truck.make} ${trip.truck.model}`
                    : 'Not assigned'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
          <div>
            {isDriver && (
              <div className="text-sm text-gray-600">
                You are assigned to this trip — update status or add fuel logs below.
              </div>
            )}
          </div>
          <button
            onClick={onDownload}
            disabled={downloading}
            className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF Report
              </div>
            )}
          </button>
        </div>

        {/* Driver-specific actions */}
        {isDriver && (
          <div className="mt-8 space-y-6 pt-6 border-t border-gray-200">
            {/* Status Update */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Update Trip Status</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => onUpdateStatus('TO_DO')}
                  className="px-3 py-1.5 bg-amber/10 text-amber text-sm font-medium rounded-lg hover:bg-amber/20 transition-colors"
                >
                  Mark as To Do
                </button>
                <button 
                  onClick={() => onUpdateStatus('IN_PROGRESS')}
                  className="px-3 py-1.5 bg-cerulean/10 text-cerulean text-sm font-medium rounded-lg hover:bg-cerulean/20 transition-colors"
                >
                  Mark as In Progress
                </button>
                <button 
                  onClick={() => onUpdateStatus('DONE')}
                  className="px-3 py-1.5 bg-sage/10 text-sage text-sm font-medium rounded-lg hover:bg-sage/20 transition-colors"
                >
                  Mark as Done
                </button>
              </div>
            </div>

            {/* Add Fuel Log */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Add Fuel Log</h3>
              <form onSubmit={submitFuel} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Liters</label>
                    <input 
                      value={fuel.liters} 
                      onChange={e=>setFuel({...fuel,liters:e.target.value})} 
                      placeholder="Enter liters"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Odometer (km)</label>
                    <input 
                      value={fuel.odometer} 
                      onChange={e=>setFuel({...fuel,odometer:e.target.value})} 
                      placeholder="Current odometer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Notes</label>
                    <input 
                      value={fuel.notes} 
                      onChange={e=>setFuel({...fuel,notes:e.target.value})} 
                      placeholder="Optional notes"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-cerulean text-white text-sm font-medium rounded-lg hover:bg-cerulean/90 transition-colors"
                >
                  Add Fuel Log
                </button>
              </form>
            </div>

            {/* Save Trip Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Trip Details</h3>
              <form onSubmit={saveTripDetails} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Start KM</label>
                    <input 
                      value={odometer.startKm} 
                      onChange={e=>setOdometer({...odometer,startKm:e.target.value})} 
                      placeholder="Start odometer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">End KM</label>
                    <input 
                      value={odometer.endKm} 
                      onChange={e=>setOdometer({...odometer,endKm:e.target.value})} 
                      placeholder="End odometer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Fuel Used (L)</label>
                    <input 
                      value={savedFuelVolume} 
                      onChange={e=>setSavedFuelVolume(e.target.value)} 
                      placeholder="Total fuel used"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm text-gray-600 mb-1">Remarks</label>
                    <input 
                      value={tripNotes} 
                      onChange={e=>setTripNotes(e.target.value)} 
                      placeholder="Trip remarks"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Save Trip Details
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripDetail;