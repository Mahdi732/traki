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

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{trip.title}</h2>
          <p className="text-sm text-gray-600 mt-1">{trip.description}</p>
        </div>
        <div className="text-sm text-gray-500">{trip.status}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-500">Origin</div>
          <div className="font-medium">{trip.origin || 'N/A'}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Destination</div>
          <div className="font-medium">{trip.destination || 'N/A'}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Planned Start</div>
          <div className="font-medium">{formatDate(trip.plannedStart)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Planned End</div>
          <div className="font-medium">{formatDate(trip.plannedEnd)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-xs text-gray-500">Driver</div>
          <div className="font-medium">{trip.driver?.name || 'Not assigned'}</div>
          {trip.driver?.email && <div className="text-xs text-gray-500">{trip.driver.email}</div>}
        </div>
        <div>
          <div className="text-xs text-gray-500">Truck</div>
          <div className="font-medium">{trip.truck?.plateNumber ? `${trip.truck.plateNumber} • ${trip.truck.make} ${trip.truck.model}` : 'Not assigned'}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onDownload}
          disabled={downloading}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow"
        >
          {downloading ? 'Downloading...' : 'Download PDF'}
        </button>
        {isDriver && (
          <div className="ml-4 text-sm text-gray-600">You are assigned to this trip — update status or add fuel logs below.</div>
        )}
      </div>

      {isDriver && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button onClick={() => onUpdateStatus('TO_DO')} className="px-3 py-1 bg-amber-100 rounded">Set To Do</button>
            <button onClick={() => onUpdateStatus('IN_PROGRESS')} className="px-3 py-1 bg-blue-100 rounded">Set In Progress</button>
            <button onClick={() => onUpdateStatus('DONE')} className="px-3 py-1 bg-emerald-100 rounded">Set Done</button>
          </div>

          <form onSubmit={submitFuel} className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input value={fuel.liters} onChange={e=>setFuel({...fuel,liters:e.target.value})} placeholder="Liters" className="p-2 border rounded" />
            <input value={fuel.odometer} onChange={e=>setFuel({...fuel,odometer:e.target.value})} placeholder="Odometer" className="p-2 border rounded" />
            <div className="flex gap-2">
              <input value={fuel.notes} onChange={e=>setFuel({...fuel,notes:e.target.value})} placeholder="Notes" className="p-2 border rounded flex-1" />
              <button className="px-3 py-2 bg-green-600 text-white rounded">Add</button>
            </div>
          </form>

          {/* Save trip details: odometer start/end, fuel volume, remarks */}
          <form onSubmit={saveTripDetails} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2">
            <input value={odometer.startKm} onChange={e=>setOdometer({...odometer,startKm:e.target.value})} placeholder="Start km" className="p-2 border rounded" />
            <input value={odometer.endKm} onChange={e=>setOdometer({...odometer,endKm:e.target.value})} placeholder="End km" className="p-2 border rounded" />
            <input value={savedFuelVolume} onChange={e=>setSavedFuelVolume(e.target.value)} placeholder="Fuel (L)" className="p-2 border rounded" />
            <div className="flex gap-2">
              <input value={tripNotes} onChange={e=>setTripNotes(e.target.value)} placeholder="Remarks" className="p-2 border rounded flex-1" />
              <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default TripDetail;
