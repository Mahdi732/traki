import { useState } from 'react';
import { validators } from '../../helpers/validator/validator.js';
import { Button } from '../common/button.jsx';
import { Input } from '../common/input.jsx';

// Simple TruckForm - for creating and editing trucks
// Can be used in modal or dedicated page
export function TruckForm({ onSubmit, isLoading, error, truck = null, onCancel }) {
  // Form input state (pre-fill if editing)
  const [plateNumber, setPlateNumber] = useState(truck?.plateNumber || '');
  const [vin, setVin] = useState(truck?.vin || '');
  const [make, setMake] = useState(truck?.make || '');
  const [model, setModel] = useState(truck?.model || '');
  const [year, setYear] = useState(truck?.year || '');
  const [capacity, setCapacity] = useState(truck?.capacity || '');
  const [status, setStatus] = useState(truck?.status || 'ACTIVE');
  // Form validation errors
  const [errors, setErrors] = useState({});

  // Simple validation using validator helper
  const validateForm = () => {
    const newErrors = {};

    // Use validator helper functions
    const plateValidation = validators.plateNumber(plateNumber);
    if (!plateValidation.isValid) {
      newErrors.plateNumber = plateValidation.message;
    }

    const makeValidation = validators.make(make);
    if (!makeValidation.isValid) {
      newErrors.make = makeValidation.message;
    }

    const modelValidation = validators.model(model);
    if (!modelValidation.isValid) {
      newErrors.model = modelValidation.message;
    }

    const yearValidation = validators.year(year);
    if (!yearValidation.isValid) {
      newErrors.year = yearValidation.message;
    }

    const capacityValidation = validators.capacity(capacity);
    if (!capacityValidation.isValid) {
      newErrors.capacity = capacityValidation.message;
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
      plateNumber,
      vin,
      make,
      model,
      year: parseInt(year),
      capacity: parseInt(capacity),
      status,
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    return status === 'ACTIVE' 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-sm mb-4">
          <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {truck ? 'Edit Truck Details' : 'Add New Truck'}
        </h2>
        <p className="text-gray-600">
          {truck ? 'Update truck information and status' : 'Register a new truck to your fleet'}
        </p>
        {truck && (
          <div className="inline-flex items-center mt-3 px-4 py-2 rounded-full text-sm font-semibold">
            <div className={`px-3 py-1 rounded-full ${getStatusColor(status)}`}>
              {status === 'ACTIVE' ? 'Active' : 'Inactive'}
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
        {/* Identification Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            Identification
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Plate Number */}
            <Input
              label="License Plate *"
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder="e.g., ABC-1234"
              error={errors.plateNumber}
              className="focus:shadow-lg focus:shadow-blue-500/10"
            />

            {/* VIN */}
            <Input
              label="Vehicle Identification Number (VIN)"
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              placeholder="1HGCM82633A123456"
              error={errors.vin}
              className="focus:shadow-lg focus:shadow-blue-500/10"
            />
          </div>
        </div>

        {/* Vehicle Details Section */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Vehicle Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Make */}
            <Input
              label="Make *"
              type="text"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="e.g., Volvo, Mercedes, Ford"
              error={errors.make}
              className="focus:shadow-lg focus:shadow-blue-500/10"
            />

            {/* Model */}
            <Input
              label="Model *"
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g., FH16, Actros, F-150"
              error={errors.model}
              className="focus:shadow-lg focus:shadow-blue-500/10"
            />

            {/* Year */}
            <Input
              label="Year *"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g., 2020"
              error={errors.year}
              className="focus:shadow-lg focus:shadow-blue-500/10"
              min="2000"
              max={new Date().getFullYear() + 1}
            />

            {/* Capacity */}
            <Input
              label="Capacity (kg) *"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g., 12000"
              error={errors.capacity}
              className="focus:shadow-lg focus:shadow-blue-500/10"
              min="1000"
              step="100"
            />
          </div>
        </div>

        {/* Status Section */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Status & Availability
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Truck Status</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white/95 text-gray-900 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:ring-offset-2 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/10"
                >
                  <option value="ACTIVE">Active - Available for trips</option>
                  <option value="MAINTENANCE">Maintenance - In workshop / Repair</option>
                  <option value="INACTIVE">Inactive - Retired / Decommissioned</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-4 pt-4 border-t border-emerald-200/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Active - Ready for service</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Maintenance - In workshop / Repair</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Inactive - Retired / Decommissioned</span>
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
                <span>Saving Truck...</span>
              </div>
            ) : truck ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Update Truck</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Truck to Fleet</span>
              </div>
            )}
          </Button>
        </div>

        {/* Form note */}
        <div className="text-center pt-4">
          <p className="text-xs text-gray-500">
            * Required fields. All information will be verified with DMV records.
          </p>
        </div>
      </form>
    </div>
  );
}