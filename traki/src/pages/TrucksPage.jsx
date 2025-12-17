import { useState } from 'react';
import { useTrucks } from '../hooks/useTrucks.js';
import { TruckForm } from '../components/trucks/TruckForm.jsx';
import { TrucksList } from '../components/trucks/TrucksList.jsx';
import { Button } from '../components/common/button.jsx';

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

  // Handle create or update truck
  const handleSubmit = async (truckData) => {
    try {
      setFormError('');
      
      if (editingTruck) {
        // Update existing truck
        await updateTruck(editingTruck._id, truckData);
        setSuccessMessage(`${truckData.make} ${truckData.model} updated!`);
      } else {
        // Create new truck
        await createTruck(truckData);
        setSuccessMessage(`${truckData.make} ${truckData.model} created!`);
      }
      
      // Close form and clear success message after 3 seconds
      setShowForm(false);
      setEditingTruck(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err.message || 'An error occurred');
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
    try {
      await deleteTruck(id);
      setSuccessMessage('Truck deleted!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err.message || 'Failed to delete truck');
    }
  };

  // Handle set truck to maintenance (quick admin action)
  const handleSetMaintenance = async (id) => {
    try {
      await updateTruck(id, { status: 'MAINTENANCE' });
      setSuccessMessage('Truck set to Maintenance');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Truck Management</h1>
              <p className="text-gray-600 mt-1">Manage your fleet of trucks</p>
            </div>
            
            {/* Add Truck button - only show when form is hidden */}
            {!showForm && (
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700  text-white px-5 py-2.5 shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Truck
              </Button>
            )}
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-700 font-medium">{successMessage}</span>
              </div>
            </div>
          )}

          {/* Form error message */}
          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700 font-medium">{formError}</span>
              </div>
            </div>
          )}
        </div>

        {/* Form section */}
        {showForm && (
          <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingTruck ? 'Edit Truck' : 'Add New Truck'}
              </h2>
              {editingTruck && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  Editing
                </span>
              )}
            </div>
            <TruckForm 
              onSubmit={handleSubmit}
              isLoading={loading}
              error={formError}
              truck={editingTruck}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Trucks list */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Truck Fleet</h2>
            <p className="text-gray-600 text-sm mt-1">
              {trucks.length} truck{trucks.length !== 1 ? 's' : ''} in your fleet
            </p>
          </div>
          
          <div className="p-6">
            {loading && !editingTruck ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500">Loading trucks...</p>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              </div>
            ) : trucks.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trucks found</h3>
                <p className="text-gray-500 mb-6">Get started by adding your first truck to the fleet</p>
                {!showForm && (
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5"
                  >
                    Add Your First Truck
                  </Button>
                )}
              </div>
            ) : (
              <TrucksList 
                trucks={trucks}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetMaintenance={handleSetMaintenance}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}