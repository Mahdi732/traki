import { useState, useEffect } from 'react';
import { Button } from '../common/button.jsx';
import { Input } from '../common/input.jsx';

// Simple TripForm - for creating and editing trips (admin only)
export function TripForm({ onSubmit, isLoading, error, trip = null, trucks = [], drivers = [], onCancel }) {
  // Form input state (pre-fill if editing)
  const [title, setTitle] = useState(trip?.title || '');
  const [description, setDescription] = useState(trip?.description || '');
  const [truck, setTruck] = useState(trip?.truck?._id || '');
  const [driver, setDriver] = useState(trip?.driver?._id || '');
  const [origin, setOrigin] = useState(trip?.origin || '');
  const [destination, setDestination] = useState(trip?.destination || '');
  const [plannedStart, setPlannedStart] = useState(trip?.plannedStart?.split('T')[0] || '');
  const [status, setStatus] = useState(trip?.status || 'TO_DO');
  // Form validation errors
  const [errors, setErrors] = useState({});

  // Simple validation
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!truck) {
      newErrors.truck = 'Truck is required';
    }
    if (!driver) {
      newErrors.driver = 'Driver is required';
    }
    if (!origin.trim()) {
      newErrors.origin = 'Origin is required';
    }
    if (!destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    if (!plannedStart) {
      newErrors.plannedStart = 'Planned start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      title,
      description,
      truck,
      driver,
      origin,
      destination,
      plannedStart,
      status,
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'TO_DO': 'bg-gray-100 text-gray-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'DONE': 'bg-emerald-100 text-emerald-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || colors['TO_DO'];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-sm mb-4">
          <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {trip ? 'Edit Trip' : 'Plan New Trip'}
        </h2>
        <p className="text-gray-600">
          {trip ? 'Update trip details and status' : 'Schedule a new trip for your fleet'}
        </p>
        {trip && (
          <div className="inline-flex items-center mt-3 px-4 py-2 rounded-full text-sm font-semibold">
            <div className={`px-3 py-1 rounded-full ${getStatusColor(status)}`}>
              {status === 'TO_DO' ? 'To Do' : status === 'IN_PROGRESS' ? 'In Progress' : 'Done'}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Trip Details Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Trip Details
          </h3>
          
          <div className="space-y-5">
            {/* Title */}
            <Input
              label="Trip Title *"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., New York Warehouse Delivery"
              error={errors.title}
              className="focus:shadow-lg focus:shadow-blue-500/10"
            />

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Description
                <span className="text-gray-400 font-normal text-xs">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide additional details about the trip, special instructions, or notes..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white/95 text-gray-900 placeholder:text-gray-400 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-blue-100 focus:ring-offset-2 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10"
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Assignment Section */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-4.201a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
            Assignment
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Truck dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Truck *
                {errors.truck && (
                  <span className="text-red-500 text-sm font-normal">- {errors.truck}</span>
                )}
              </label>
              <div className="relative">
                <select
                  value={truck}
                  onChange={(e) => setTruck(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-white/95 text-gray-900 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-blue-100 focus:ring-offset-2 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 ${
                    errors.truck ? 'border-red-400 hover:border-red-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <option value="">Select a truck</option>
                  {trucks.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.plateNumber} • {t.make} {t.model}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Driver dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Driver *
                {errors.driver && (
                  <span className="text-red-500 text-sm font-normal">- {errors.driver}</span>
                )}
              </label>
              <div className="relative">
                <select
                  value={driver}
                  onChange={(e) => setDriver(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-white/95 text-gray-900 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-blue-100 focus:ring-offset-2 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 ${
                    errors.driver ? 'border-red-400 hover:border-red-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <option value="">Select a driver</option>
                  {drivers.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} • {d.email}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Route & Schedule Section */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Route & Schedule
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Origin */}
            <Input
              label="Origin *"
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g., Warehouse #123, 456 Main St"
              error={errors.origin}
              className="focus:shadow-lg focus:shadow-emerald-500/10"
            />

            {/* Destination */}
            <Input
              label="Destination *"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Retail Store, 789 Oak Ave"
              error={errors.destination}
              className="focus:shadow-lg focus:shadow-emerald-500/10"
            />

            {/* Planned start date */}
            <Input
              label="Planned Start Date *"
              type="date"
              value={plannedStart}
              onChange={(e) => setPlannedStart(e.target.value)}
              error={errors.plannedStart}
              className="focus:shadow-lg focus:shadow-emerald-500/10"
            />

            {/* Status dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Status</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white/95 text-gray-900 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:ring-offset-2 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/10"
                >
                  <option value="TO_DO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Completed</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-gray-200">
          {onCancel && (
            <Button 
              type="button"
              onClick={onCancel}
              variant="secondary"
              className="flex-1 py-3.5"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancel</span>
              </div>
            </Button>
          )}
          
          <Button 
            type="submit" 
            disabled={isLoading}
            variant="primary"
            className="flex-1 py-3.5"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Saving Trip...</span>
              </div>
            ) : trip ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Update Trip</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Trip</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}