import { useState } from 'react';
import { useTires } from '../hooks/useTires.js';

export function TiresPage() {
  const { tires, loading, createTire, deleteTire } = useTires();
  const [form, setForm] = useState({ serialNumber: '', position: '', installedAtKm: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // adapt frontend form keys to backend Tire model
      await createTire({
        serialNumber: form.serialNumber,
        position: form.position,
        installedAtKm: form.installedAtKm ? Number(form.installedAtKm) : undefined
      });
      setForm({ serialNumber: '', position: '', installedAtKm: '' });
    } catch(err){
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setForm({...form, [field]: e.target.value});
  };

  const getPositionColor = (position) => {
    const colors = {
      'front-left': 'bg-cerulean/10 text-cerulean border-cerulean/20',
      'front-right': 'bg-sage/10 text-sage border-sage/20',
      'rear-left': 'bg-amber/10 text-amber border-amber/20',
      'rear-right': 'bg-terracotta/10 text-terracotta border-terracotta/20',
      'spare': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[position] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getPositionIcon = (position) => {
    switch(position) {
      case 'front-left': return '↖';
      case 'front-right': return '↗';
      case 'rear-left': return '↙';
      case 'rear-right': return '↘';
      case 'spare': return '📦';
      default: return '⚫';
    }
  };

  const calculateTireHealth = (tire) => {
    // Mock health calculation based on installation date
    const installDate = tire.installDate ? new Date(tire.installDate) : (tire.createdAt ? new Date(tire.createdAt) : new Date());
    const monthsInstalled = (new Date() - installDate) / (1000 * 60 * 60 * 24 * 30);
    const baseHealth = 100;
    const health = Math.max(0, baseHealth - (monthsInstalled * 2)); // 2% degradation per month
    return Math.round(health);
  };

  return (
    <div className="min-h-screen bg-custom-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tire Management</h1>
              <p className="text-gray-600 mt-2">Track and manage your fleet's tire inventory</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-500">Total Tires</div>
                <div className="text-2xl font-bold text-gray-900">{tires.length}</div>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="mt-6 flex space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-cerulean text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Tires ({tires.length})
            </button>
            <button
              onClick={() => setSelectedStatus('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'active'
                  ? 'bg-sage text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Active ({tires.filter(t => t.status !== 'retired').length})
            </button>
            <button
              onClick={() => setSelectedStatus('needs-replacement')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'needs-replacement'
                  ? 'bg-amber text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Needs Replacement ({tires.filter(t => calculateTireHealth(t) < 30).length})
            </button>
            <button
              onClick={() => setSelectedStatus('spare')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'spare'
                  ? 'bg-terracotta text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Spare Tires ({tires.filter(t => t.position === 'spare').length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Tire Form */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm sticky top-8">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Add New Tire</h2>
                <p className="text-sm text-gray-500 mt-1">Register a new tire to your inventory</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label htmlFor="serial" className="block text-sm font-medium text-gray-700 mb-2">
                    Serial Number
                  </label>
                  <input 
                    id="serial"
                    type="text"
                    value={form.serialNumber}
                    onChange={handleInputChange('serialNumber')}
                    placeholder="e.g., TIR-2024-001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean outline-none transition-colors"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">Unique identifier for the tire</p>
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['front-left', 'front-right', 'rear-left', 'rear-right', 'spare'].map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setForm({...form, position: pos})}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                          form.position === pos
                            ? 'bg-cerulean text-white border-cerulean'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pos.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="installedAtKm" className="block text-sm font-medium text-gray-700 mb-2">
                    Installed At (km)
                  </label>
                  <input
                    id="installedAtKm"
                    type="number"
                    value={form.installedAtKm}
                    onChange={handleInputChange('installedAtKm')}
                    placeholder="e.g., 120000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean outline-none transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-2">Optional: odometer when the tire was installed</p>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 bg-gradient-to-r from-cerulean to-cerulean/90 text-white font-medium rounded-lg transition-all duration-200 ${
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
                        Adding...
                      </div>
                    ) : (
                      'Add Tire to Inventory'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Stats */}
            {tires.length > 0 && (
              <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-4">Tire Health Overview</h3>
                <div className="space-y-4">
                  {tires.slice(0, 3).map(tire => {
                    const health = calculateTireHealth(tire);
                    const healthColor = health > 70 ? 'bg-sage' : health > 30 ? 'bg-amber' : 'bg-terracotta';
                    
                    return (
                      <div key={tire._id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-cerulean/10 flex items-center justify-center mr-3">
                            <span className="text-sm">{getPositionIcon(tire.position)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{tire.serialNumber || tire.serial}</div>
                            <div className="text-xs text-gray-500">{tire.position}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${healthColor}`}
                              style={{ width: `${health}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{health}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Tires List */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Tire Inventory</h2>
                    <p className="text-sm text-gray-500 mt-1">All registered tires in your fleet</p>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search tires..."
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
                    <p className="text-gray-500">Loading tire inventory...</p>
                  </div>
                ) : tires.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tires in inventory</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Start by adding your first tire using the form on the left.
                    </p>
                  </div>
                ) : (
                  tires.map((tire) => {
                    const health = calculateTireHealth(tire);
                    const healthColor = health > 70 ? 'bg-sage' : health > 30 ? 'bg-amber' : 'bg-terracotta';
                    const status = health > 70 ? 'Good' : health > 30 ? 'Fair' : 'Poor';
                    
                    return (
                      <div key={tire._id} className="group p-6 hover:bg-gray-50/50 transition-colors duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-4">
                              <div className={`w-12 h-12 rounded-lg ${getPositionColor(tire.position)} flex items-center justify-center mr-4`}>
                                <span className="text-lg">{getPositionIcon(tire.position)}</span>
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold text-gray-900">{tire.serialNumber || tire.serial}</span>
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${healthColor} text-white`}>
                                    {status}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  Position: <span className="font-medium capitalize">{tire.position.replace('-', ' ')}</span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-sm text-gray-500 mb-1">Health</div>
                                <div className="flex items-center">
                                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                    <div 
                                      className={`h-2 rounded-full ${healthColor}`}
                                      style={{ width: `${health}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-lg font-semibold text-gray-900">{health}%</span>
                                </div>
                              </div>
                              
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-sm text-gray-500 mb-1">Install Date</div>
                                <div className="text-lg font-semibold text-gray-900">
                                  {tire.createdAt ? new Date(tire.createdAt).toLocaleDateString() : (tire.installDate ? new Date(tire.installDate).toLocaleDateString() : 'N/A')}
                                </div>
                              </div>
                              
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-sm text-gray-500 mb-1">Mileage</div>
                                <div className="flex items-center">
                                  <span className="text-lg font-semibold text-gray-900">
                                    {tire.installedAtKm ?? tire.mileage ?? '0'}
                                  </span>
                                  <span className="text-gray-500 ml-1">km</span>
                                </div>
                              </div>
                              
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-sm text-gray-500 mb-1">Status</div>
                                <div className="flex items-center">
                                  <span className="text-lg font-semibold text-gray-900 capitalize">
                                    {tire.status || 'Active'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center space-x-4">
                              <button className="text-sm text-cerulean hover:text-cerulean/80 font-medium">
                                View History
                              </button>
                              <button className="text-sm text-sage hover:text-sage/80 font-medium">
                                Schedule Maintenance
                              </button>
                            </div>
                          </div>

                          <div className="ml-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => deleteTire(tire._id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete tire"
                            >
                              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {tires.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div>
                      Showing {tires.length} tire{tires.length !== 1 ? 's' : ''} in inventory
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
          </div>
        </div>

        {/* Summary Stats */}
        {tires.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-500">Active Tires</div>
                <div className="w-10 h-10 rounded-full bg-cerulean/10 flex items-center justify-center">
                  <span className="text-cerulean font-bold">{tires.filter(t => t.status !== 'retired').length}</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {tires.filter(t => t.status !== 'retired').length}
                <span className="text-sm font-normal text-gray-500 ml-1">tires</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-500">Avg. Health</div>
                <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {tires.length > 0 
                  ? Math.round(tires.reduce((sum, tire) => sum + calculateTireHealth(tire), 0) / tires.length)
                  : 0}%
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-500">Need Replacement</div>
                <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {tires.filter(t => calculateTireHealth(t) < 30).length}
                <span className="text-sm font-normal text-gray-500 ml-1">tires</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-500">Spare Tires</div>
                <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {tires.filter(t => t.position === 'spare').length}
                <span className="text-sm font-normal text-gray-500 ml-1">available</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TiresPage;