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
      'TO_DO': 'border-l-4 border-l-gray-400',
      'IN_PROGRESS': 'border-l-4 border-l-blue-500',
      'DONE': 'border-l-4 border-l-emerald-500',
      'CANCELLED': 'border-l-4 border-l-red-500'
    };
    return colors[status] || colors['TO_DO'];
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with subtle gradient */}
      <div className="mb-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {trip ? 'Edit Trip' : 'New Trip'}
              </h1>
            </div>
            <p className="text-gray-600 text-sm">
              {trip ? 'Update trip details below' : 'Fill in the details to schedule a new trip'}
            </p>
          </div>
          
          {trip && (
            <div className={`px-4 py-2.5 bg-white rounded-lg border border-gray-200 shadow-xs ${getStatusColor(status)}`}>
              <span className="text-sm font-medium text-gray-900">
                {status === 'TO_DO' ? 'To Do' : 
                 status === 'IN_PROGRESS' ? 'In Progress' : 
                 status === 'DONE' ? 'Completed' : 
                 'Cancelled'}
              </span>
            </div>
          )}
        </div>
        
        {/* Progress indicator */}
        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-black rounded-full" style={{ width: '33%' }}></div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Trip Details Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 bg-gray-900 rounded-full"></div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Trip Details</h2>
              <p className="text-sm text-gray-500">Basic information about the trip</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">Trip Title</label>
                <span className="text-xs text-gray-400">Required</span>
              </div>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., New York Warehouse Delivery"
                error={errors.title}
                className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 focus:border-black focus:ring-0 transition-all duration-300"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Description</label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide additional details about the trip, special instructions, or notes..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:border-black"
                  rows="4"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {description.length}/500
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Assignment</h2>
              <p className="text-sm text-gray-500">Assign truck and driver for this trip</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Truck dropdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">Truck</label>
                <span className="text-xs text-gray-400">Required</span>
              </div>
              <div className="relative">
                <select
                  value={truck}
                  onChange={(e) => setTruck(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border bg-white text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:border-black appearance-none ${
                    errors.truck ? 'border-red-300' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select a truck</option>
                  {trucks.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.plateNumber} • {t.make} {t.model}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.truck && (
                <p className="text-sm text-red-500 mt-1">{errors.truck}</p>
              )}
            </div>

            {/* Driver dropdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">Driver</label>
                <span className="text-xs text-gray-400">Required</span>
              </div>
              <div className="relative">
                <select
                  value={driver}
                  onChange={(e) => setDriver(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border bg-white text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:border-black appearance-none ${
                    errors.driver ? 'border-red-300' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select a driver</option>
                  {drivers.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} • {d.email}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.driver && (
                <p className="text-sm text-red-500 mt-1">{errors.driver}</p>
              )}
            </div>
          </div>
        </div>

        {/* Route & Schedule Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Route & Schedule</h2>
              <p className="text-sm text-gray-500">Set the route and timing for this trip</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Origin */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">Origin</label>
                <span className="text-xs text-gray-400">Required</span>
              </div>
              <Input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g., Warehouse #123, 456 Main St"
                error={errors.origin}
                className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 focus:border-black focus:ring-0 transition-all duration-300"
              />
              {errors.origin && (
                <p className="text-sm text-red-500 mt-1">{errors.origin}</p>
              )}
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">Destination</label>
                <span className="text-xs text-gray-400">Required</span>
              </div>
              <Input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Retail Store, 789 Oak Ave"
                error={errors.destination}
                className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 focus:border-black focus:ring-0 transition-all duration-300"
              />
              {errors.destination && (
                <p className="text-sm text-red-500 mt-1">{errors.destination}</p>
              )}
            </div>

            {/* Planned start date */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">Planned Start Date</label>
                <span className="text-xs text-gray-400">Required</span>
              </div>
              <div className="relative">
                <Input
                  type="date"
                  value={plannedStart}
                  onChange={(e) => setPlannedStart(e.target.value)}
                  error={errors.plannedStart}
                  className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 focus:border-black focus:ring-0 transition-all duration-300"
                />
                <div className="absolute right-0 top-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              {errors.plannedStart && (
                <p className="text-sm text-red-500 mt-1">{errors.plannedStart}</p>
              )}
            </div>

            {/* Status dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Status</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:border-black appearance-none"
                >
                  <option value="TO_DO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Completed</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-6 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            {onCancel && (
              <Button 
                type="button"
                onClick={onCancel}
                variant="secondary"
                className="flex-1 py-3 border-2 border-gray-300 hover:border-gray-400 bg-transparent hover:bg-gray-50 text-gray-900"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Cancel</span>
                </div>
              </Button>
            )}
            
            <Button 
              type="submit" 
              disabled={isLoading}
              variant="primary"
              className="flex-1 py-3 bg-black hover:bg-gray-900 text-white border-2 border-black hover:border-gray-900"
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
        </div>
      </form>
    </div>
  );
}