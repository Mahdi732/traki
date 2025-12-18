import { useState } from 'react';
import { useFuelLogs } from '../hooks/useFuelLogs.js';

export function FuelLogsPage() {
  const { logs, loading, createLog, removeLog } = useFuelLogs();
  const [form, setForm] = useState({ trip: '', liters: '', odometer: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try { 
      await createLog(form); 
      setForm({ trip: '', liters: '', odometer: '', notes: '' }); 
    } catch(err) { 
      console.error(err); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setForm({...form, [field]: e.target.value});
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const calculateCost = (liters) => {
    // Assuming average fuel price of $3.50 per liter
    const pricePerLiter = 3.50;
    return (parseFloat(liters) * pricePerLiter).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-custom-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fuel Logs</h1>
              <p className="text-gray-600 mt-2">Track and manage fuel consumption across your fleet</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-gray-500">
                {logs.length} total entries
              </div>
              <div className="px-3 py-1.5 bg-cerulean/10 text-cerulean rounded-lg text-sm font-medium">
                Total Cost: ${logs.reduce((sum, log) => sum + parseFloat(calculateCost(log.liters)), 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Log Form */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm sticky top-8">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">New Fuel Entry</h2>
                <p className="text-sm text-gray-500 mt-1">Record a new fuel transaction</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label htmlFor="trip" className="block text-sm font-medium text-gray-700 mb-2">
                    Trip ID
                  </label>
                  <input 
                    id="trip"
                    type="text"
                    value={form.trip}
                    onChange={handleInputChange('trip')}
                    placeholder="e.g., TRIP-2024-001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean outline-none transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="liters" className="block text-sm font-medium text-gray-700 mb-2">
                      Liters
                    </label>
                    <div className="relative">
                      <input 
                        id="liters"
                        type="number"
                        step="0.01"
                        value={form.liters}
                        onChange={handleInputChange('liters')}
                        placeholder="0.00"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean outline-none transition-colors pr-10"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">L</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="odometer" className="block text-sm font-medium text-gray-700 mb-2">
                      Odometer
                    </label>
                    <div className="relative">
                      <input 
                        id="odometer"
                        type="number"
                        value={form.odometer}
                        onChange={handleInputChange('odometer')}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean outline-none transition-colors pr-12"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">km</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea 
                    id="notes"
                    value={form.notes}
                    onChange={handleInputChange('notes')}
                    placeholder="Add any relevant notes about this fuel transaction..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cerulean/30 focus:border-cerulean outline-none transition-colors resize-none"
                  />
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
                        Creating...
                      </div>
                    ) : (
                      'Create Fuel Log'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Logs List */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Recent Fuel Logs</h2>
                <p className="text-sm text-gray-500 mt-1">All recorded fuel transactions</p>
              </div>

              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="py-16 text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-cerulean mb-4"></div>
                    <p className="text-gray-500">Loading fuel logs...</p>
                  </div>
                ) : logs.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No fuel logs yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Start by creating your first fuel log entry using the form on the left.
                    </p>
                  </div>
                ) : (
                  logs.map((log) => (
                    <div key={log._id} className="group p-6 hover:bg-gray-50/50 transition-colors duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-lg bg-cerulean/10 flex items-center justify-center mr-4">
                              <svg className="w-5 h-5 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-900">{log.trip}</span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                  Fuel Entry
                                </span>
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                Logged on {formatDate(log.createdAt || new Date())}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-sm text-gray-500 mb-1">Fuel Amount</div>
                              <div className="flex items-center">
                                <span className="text-lg font-semibold text-gray-900">{log.liters}</span>
                                <span className="text-gray-500 ml-1">L</span>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-sm text-gray-500 mb-1">Odometer</div>
                              <div className="flex items-center">
                                <span className="text-lg font-semibold text-gray-900">{log.odometer.toLocaleString()}</span>
                                <span className="text-gray-500 ml-1">km</span>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-sm text-gray-500 mb-1">Cost</div>
                              <div className="flex items-center">
                                <span className="text-lg font-semibold text-gray-900">${calculateCost(log.liters)}</span>
                                <span className="text-gray-500 ml-1">USD</span>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-sm text-gray-500 mb-1">Efficiency</div>
                              <div className="flex items-center">
                                <span className="text-lg font-semibold text-gray-900">
                                  {(log.odometer / parseFloat(log.liters)).toFixed(1)}
                                </span>
                                <span className="text-gray-500 ml-1">km/L</span>
                              </div>
                            </div>
                          </div>

                          {log.notes && (
                            <div className="mt-4">
                              <div className="text-sm text-gray-500 mb-2">Notes</div>
                              <div className="bg-amber/5 border border-amber/20 rounded-lg p-3">
                                <p className="text-sm text-gray-700">{log.notes}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => removeLog(log._id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete log"
                          >
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {logs.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div>
                      Showing {logs.length} fuel log{logs.length !== 1 ? 's' : ''}
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

        {/* Summary Cards */}
        {logs.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-500">Total Fuel</div>
                <div className="w-10 h-10 rounded-full bg-cerulean/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {logs.reduce((sum, log) => sum + parseFloat(log.liters), 0).toFixed(1)} L
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-500">Avg. Efficiency</div>
                <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {(
                  logs.reduce((sum, log) => sum + (log.odometer / parseFloat(log.liters)), 0) / logs.length
                ).toFixed(1)} km/L
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-500">Total Cost</div>
                <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${logs.reduce((sum, log) => sum + parseFloat(calculateCost(log.liters)), 0).toFixed(2)}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-gray-500">Last 30 Days</div>
                <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {logs.length}
                <span className="text-sm font-normal text-gray-500 ml-1">entries</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FuelLogsPage;