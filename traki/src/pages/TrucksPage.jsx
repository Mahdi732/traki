import { useState } from 'react';
import { useTrucks } from '../hooks/useTrucks.js';
import { TruckForm } from '../components/trucks/TruckForm.jsx';
import { TrucksList } from '../components/trucks/TrucksList.jsx';

// TrucksPage - manage all trucks (admin only)
export function TrucksPage() {
  // Use trucks hook to manage truck data
  const { trucks, loading, error, createTruck, updateTruck, deleteTruck } = useTrucks();
  
  // State to show/hide form
  const [showForm, setShowForm] = useState(false);
  // State to track which truck is being edited (null if creating new)
  const [editingTruck, setEditingTruck] = useState(null);
  // Form error/success messages
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle create or update truck
  const handleSubmit = async (truckData) => {
    try {
      setFormError('');
      setIsSubmitting(true);
      
      if (editingTruck) {
        // Update existing truck
        await updateTruck(editingTruck._id, truckData);
        setSuccessMessage(`${truckData.make} ${truckData.model} has been updated`);
      } else {
        // Create new truck
        await createTruck(truckData);
        setSuccessMessage(`${truckData.make} ${truckData.model} has been added to your fleet`);
      }
      
      // Close form and clear success message after 3 seconds
      setShowForm(false);
      setEditingTruck(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err.message || 'An error occurred while saving the truck');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit truck
  const handleEdit = (truck) => {
    setEditingTruck(truck);
    setShowForm(true);
    setFormError('');
  };

  // Handle delete truck
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this truck? This action cannot be undone.')) {
      try {
        await deleteTruck(id);
        setSuccessMessage('Truck has been deleted from your fleet');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setFormError(err.message || 'Failed to delete truck');
      }
    }
  };

  // Handle set truck to maintenance (quick admin action)
  const handleSetMaintenance = async (id) => {
    try {
      await updateTruck(id, { status: 'MAINTENANCE' });
      setSuccessMessage('Truck set to maintenance status');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err.message || 'Failed to update truck status');
    }
  };

  // Handle cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingTruck(null);
    setFormError('');
  };

  // Filter trucks by status
  const getStatusCount = (status) => {
    return trucks.filter(truck => truck.status === status).length;
  };

  const getFilteredTrucks = () => {
    if (activeFilter === 'all') return trucks;
    return trucks.filter(truck => truck.status === activeFilter);
  };

  const filteredTrucks = getFilteredTrucks();

  // Calculate fleet stats
  const activeTrucks = trucks.filter(t => t.status === 'ACTIVE').length;
  const maintenanceTrucks = trucks.filter(t => t.status === 'MAINTENANCE').length;
  const availableTrucks = trucks.filter(t => t.status === 'AVAILABLE').length;

  return (
    <div className="min-h-screen bg-custom-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Truck Fleet</h1>
              <p className="text-gray-600 mt-1">Manage your entire truck fleet in one place</p>
            </div>
            
            {/* Add Truck button - only show when form is hidden */}
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-cerulean to-cerulean/90 text-white font-medium rounded-lg hover:from-cerulean/90 hover:to-cerulean transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Truck
              </button>
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

          {/* Form error message */}
          {formError && (
            <div className="mb-6 p-4 bg-terracotta/10 border border-terracotta/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-terracotta/20 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-terracotta" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-900 font-medium">{formError}</span>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          {trucks.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div 
                className={`bg-white border border-gray-200 rounded-xl shadow-sm p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${activeFilter === 'all' ? 'ring-2 ring-gray-900/20' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Trucks</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{trucks.length}</p>
                  </div>
                  <div className="p-3 bg-gray-900/5 rounded-lg">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div 
                className={`bg-white border border-gray-200 rounded-xl shadow-sm p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${activeFilter === 'ACTIVE' ? 'ring-2 ring-sage/30' : ''}`}
                onClick={() => setActiveFilter('ACTIVE')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Active</p>
                    <p className="text-2xl font-bold text-sage mt-1">{activeTrucks}</p>
                  </div>
                  <div className="p-3 bg-sage/10 rounded-lg">
                    <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div 
                className={`bg-white border border-gray-200 rounded-xl shadow-sm p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${activeFilter === 'AVAILABLE' ? 'ring-2 ring-cerulean/30' : ''}`}
                onClick={() => setActiveFilter('AVAILABLE')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Available</p>
                    <p className="text-2xl font-bold text-cerulean mt-1">{availableTrucks}</p>
                  </div>
                  <div className="p-3 bg-cerulean/10 rounded-lg">
                    <svg className="w-6 h-6 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div 
                className={`bg-white border border-gray-200 rounded-xl shadow-sm p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${activeFilter === 'MAINTENANCE' ? 'ring-2 ring-amber/30' : ''}`}
                onClick={() => setActiveFilter('MAINTENANCE')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Maintenance</p>
                    <p className="text-2xl font-bold text-amber mt-1">{maintenanceTrucks}</p>
                  </div>
                  <div className="p-3 bg-amber/10 rounded-lg">
                    <svg className="w-6 h-6 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form section */}
        {showForm && (
          <div className="mb-8 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingTruck ? 'Edit Truck' : 'Add New Truck'}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {editingTruck ? 'Update truck details' : 'Register a new truck to your fleet'}
                  </p>
                </div>
                {editingTruck && (
                  <span className="px-3 py-1 bg-cerulean/10 text-cerulean text-xs font-semibold rounded-full">
                    Editing
                  </span>
                )}
              </div>
            </div>
            <div className="p-6">
              <TruckForm 
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
                error={formError}
                truck={editingTruck}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        {/* Trucks list */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Truck Inventory</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {filteredTrucks.length} truck{filteredTrucks.length !== 1 ? 's' : ''} in your fleet
                  {activeFilter !== 'all' && ` • ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1).toLowerCase()}`}
                </p>
              </div>
              
              {trucks.length > 0 && (
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search trucks..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean outline-none"
                    />
                    <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {loading && !editingTruck ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-cerulean mb-5"></div>
                <p className="text-gray-500 text-lg">Loading truck fleet...</p>
                <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your trucks</p>
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
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Error loading trucks</h3>
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
            ) : filteredTrucks.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No trucks found</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {activeFilter === 'all' 
                    ? "You haven't added any trucks to your fleet yet."
                    : `No ${activeFilter.toLowerCase()} trucks in your fleet.`
                  }
                </p>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-cerulean to-cerulean/90 text-white font-medium rounded-lg hover:from-cerulean/90 hover:to-cerulean transition-all duration-200"
                  >
                    Add Your First Truck
                  </button>
                )}
              </div>
            ) : (
              <TrucksList 
                trucks={filteredTrucks}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetMaintenance={handleSetMaintenance}
                loading={loading}
              />
            )}
          </div>
        </div>

        {/* Fleet Overview */}
        {trucks.length > 0 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-medium text-gray-900 mb-4">Fleet Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Active Trucks</span>
                    <span className="font-medium text-gray-900">{activeTrucks} trucks</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-sage h-2 rounded-full" 
                      style={{ width: `${(activeTrucks / trucks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Available for Assignment</span>
                    <span className="font-medium text-gray-900">{availableTrucks} trucks</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-cerulean h-2 rounded-full" 
                      style={{ width: `${(availableTrucks / trucks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">In Maintenance</span>
                    <span className="font-medium text-gray-900">{maintenanceTrucks} trucks</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber h-2 rounded-full" 
                      style={{ width: `${(maintenanceTrucks / trucks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Schedule Maintenance</div>
                  <div className="text-sm text-gray-500">Plan upcoming service</div>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Generate Report</div>
                  <div className="text-sm text-gray-500">Export fleet data</div>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Assign to Trip</div>
                  <div className="text-sm text-gray-500">Link truck to shipment</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}