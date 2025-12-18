import { useState } from 'react';
import { useTrailers } from '../hooks/useTrailers.js';

export function TrailersPage() {
  const { trailers, loading, error, createTrailer, deleteTrailer } = useTrailers();
  const [form, setForm] = useState({ plateNumber: '', make: '', model: '', status: 'active', capacity: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await createTrailer(form);
      setForm({ plateNumber: '', make: '', model: '', status: 'active', capacity: '' });
      setShowForm(false);
    } catch (err) { 
      console.error(err); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setForm({...form, [field]: e.target.value});
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-sage/10 text-sage border-sage/20',
      'maintenance': 'bg-amber/10 text-amber border-amber/20',
      'out_of_service': 'bg-terracotta/10 text-terracotta border-terracotta/20',
      'available': 'bg-cerulean/10 text-cerulean border-cerulean/20'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'active': 'Active',
      'maintenance': 'In Maintenance',
      'out_of_service': 'Out of Service',
      'available': 'Available'
    };
    return statusMap[status] || status;
  };

  const calculateUtilization = () => {
    const activeTrailers = trailers.filter(t => t.status === 'active' || t.status === 'available');
    return activeTrailers.length > 0 
      ? Math.round((activeTrailers.length / trailers.length) * 100)
      : 0;
  };

  const filteredTrailers = trailers.filter(trailer => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'active') return trailer.status === 'active' || trailer.status === 'available';
    if (selectedFilter === 'maintenance') return trailer.status === 'maintenance';
    if (selectedFilter === 'out_of_service') return trailer.status === 'out_of_service';
    return true;
  });

  return (
    <div className="min-h-screen bg-custom-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trailer Fleet</h1>
              <p className="text-gray-600 mt-2">Manage your trailer inventory and assignments</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block px-4 py-2 bg-white border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-500">Fleet Utilization</div>
                <div className="text-2xl font-bold text-gray-900">{calculateUtilization()}%</div>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-gradient-to-r from-cerulean to-cerulean/90 text-white font-medium rounded-lg hover:from-cerulean/90 hover:to-cerulean transition-all duration-200"
              >
                {showForm ? 'Cancel' : '+ Add Trailer'}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Total Trailers</div>
              <div className="text-2xl font-bold text-gray-900">{trailers.length}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Active</div>
              <div className="text-2xl font-bold text-sage">
                {trailers.filter(t => t.status === 'active' || t.status === 'available').length}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">In Maintenance</div>
              <div className="text-2xl font-bold text-amber">
                {trailers.filter(t => t.status === 'maintenance').length}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Available</div>
              <div className="text-2xl font-bold text-cerulean">
                {trailers.filter(t => t.status === 'available').length}
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mt-6 flex space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedFilter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Trailers ({trailers.length})
            </button>
            <button
              onClick={() => setSelectedFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedFilter === 'active'
                  ? 'bg-sage text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Active ({trailers.filter(t => t.status === 'active' || t.status === 'available').length})
            </button>
            <button
              onClick={() => setSelectedFilter('maintenance')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedFilter === 'maintenance'
                  ? 'bg-amber text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Maintenance ({trailers.filter(t => t.status === 'maintenance').length})
            </button>
            <button
              onClick={() => setSelectedFilter('out_of_service')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedFilter === 'out_of_service'
                  ? 'bg-terracotta text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Out of Service ({trailers.filter(t => t.status === 'out_of_service').length})
            </button>
          </div>
        </div>

        {/* Create Trailer Form */}
        {showForm && (
          <div className="mb-8 bg-white border border-gray-200 rounded-xl shadow-sm animate-fadeIn">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Add New Trailer</h2>
                  <p className="text-sm text-gray-500 mt-1">Register a new trailer to your fleet</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Plate Number
                  </label>
                  <input 
                    id="plateNumber"
                    type="text"
                    value={form.plateNumber}
                    onChange={handleInputChange('plateNumber')}
                    placeholder="e.g., ABC123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity (tons)
                  </label>
                  <div className="relative">
                    <input 
                      id="capacity"
                      type="number"
                      step="0.1"
                      value={form.capacity}
                      onChange={handleInputChange('capacity')}
                      placeholder="e.g., 20"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean outline-none transition-colors pr-10"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">t</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-2">
                    Make
                  </label>
                  <input 
                    id="make"
                    type="text"
                    value={form.make}
                    onChange={handleInputChange('make')}
                    placeholder="e.g., Great Dane"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <input 
                    id="model"
                    type="text"
                    value={form.model}
                    onChange={handleInputChange('model')}
                    placeholder="e.g., Refrigerated 53ft"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select 
                    id="status"
                    value={form.status}
                    onChange={handleInputChange('status')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean outline-none transition-colors bg-white"
                  >
                    <option value="INACTIVE">Inactive</option>
                    <option value="ACTIVE">Active</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-terracotta/10 border border-terracotta/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-terracotta/20 flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-terracotta" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-900">{error}</span>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-100">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto px-8 py-3 bg-gradient-to-r from-cerulean to-cerulean/90 text-white font-medium rounded-lg transition-all duration-200 ${
                    isSubmitting 
                      ? 'opacity-75 cursor-not-allowed' 
                      : 'hover:from-cerulean/90 hover:to-cerulean hover:shadow-md active:scale-[0.98]'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Trailer...
                    </div>
                  ) : (
                    'Add to Fleet'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Trailers List */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Trailer Inventory</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedFilter === 'all' 
                    ? `All trailers in your fleet (${filteredTrailers.length})`
                    : `${getStatusText(selectedFilter)} trailers (${filteredTrailers.length})`
                  }
                </p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search trailers..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean outline-none"
                />
                <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="py-16 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-cerulean mb-4"></div>
                <p className="text-gray-500">Loading trailer inventory...</p>
              </div>
            ) : filteredTrailers.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trailers found</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-4">
                  {selectedFilter === 'all' 
                    ? "You haven't added any trailers to your fleet yet."
                    : `No ${getStatusText(selectedFilter).toLowerCase()} trailers in your fleet.`
                  }
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="text-cerulean hover:text-cerulean/80 font-medium"
                >
                  Add your first trailer
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {filteredTrailers.map((trailer) => (
                  <div key={trailer._id} className="group border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(trailer.status)}`}>
                              {getStatusText(trailer.status)}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {trailer._id.slice(-6)}
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{trailer.plateNumber}</h3>
                          <p className="text-sm text-gray-600">{trailer.make} {trailer.model}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => deleteTrailer(trailer._id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete trailer"
                          >
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 mt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Capacity</span>
                          <span className="font-medium text-gray-900">
                            {trailer.capacity || 'N/A'} tons
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Last Inspection</span>
                          <span className="font-medium text-gray-900">
                            {trailer.lastInspection || 'Not set'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Current Assignment</span>
                          <span className="font-medium text-gray-900">
                            {trailer.currentTrip || 'Available'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            View Details
                          </button>
                          <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {filteredTrailers.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div>
                  Showing {filteredTrailers.length} trailer{filteredTrailers.length !== 1 ? 's' : ''}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white transition-colors">
                    Previous
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {trailers.length > 0 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {trailers.slice(0, 3).map(trailer => (
                  <div key={trailer._id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-cerulean/10 flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{trailer.plateNumber}</div>
                      <div className="text-sm text-gray-500">
                        Status updated to {getStatusText(trailer.status)} • Today
                      </div>
                    </div>
                    <button className="text-sm text-cerulean hover:text-cerulean/80">
                      View →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Schedule Maintenance</div>
                  <div className="text-sm text-gray-500">Plan upcoming inspections</div>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Generate Report</div>
                  <div className="text-sm text-gray-500">Export fleet data</div>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Assign to Trip</div>
                  <div className="text-sm text-gray-500">Link trailer to shipment</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}

export default TrailersPage;