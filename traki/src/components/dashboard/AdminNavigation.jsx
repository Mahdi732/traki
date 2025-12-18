import { Button } from '../common/button.jsx';

// Simple AdminNavigation - quick navigation buttons for admin
export function AdminNavigation({ onTrucks, onTrips, onCreateDriver, showDriverForm, onTrailers, onTires, onFuelLogs }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Quick Actions</h2>
        <p className="text-gray-600 text-sm">Manage your fleet operations and team</p>
      </div>

      {/* Navigation buttons grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Manage Trucks Card */}
        <div 
          onClick={onTrucks}
          className="group relative bg-white border border-gray-200 rounded-lg p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gray-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-cerulean/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-gray-400 group-hover:text-cerulean transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Trucks</h3>
            <p className="text-gray-600 text-sm mb-4">View, add, edit, or remove trucks from your fleet</p>
          </div>
        </div>

        {/* Manage Trips Card */}
        <div 
          onClick={onTrips}
          className="group relative bg-white border border-gray-200 rounded-lg p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gray-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-sage/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div className="text-gray-400 group-hover:text-sage transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Trips</h3>
            <p className="text-gray-600 text-sm mb-4">Schedule, track, and manage all trips and deliveries</p>
          </div>
        </div>
      </div>

      {/* More resources row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div onClick={onTrailers} className="group relative bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-sm hover:border-gray-300">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-amber/10 rounded flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">Trailers</h3>
          </div>
          <p className="text-xs text-gray-600">Manage trailers</p>
        </div>

        <div onClick={onTires} className="group relative bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-sm hover:border-gray-300">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-terracotta/10 rounded flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">Tires</h3>
          </div>
          <p className="text-xs text-gray-600">Track tires and maintenance</p>
        </div>

        <div onClick={onFuelLogs} className="group relative bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-sm hover:border-gray-300">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-cerulean/10 rounded flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">Fuel Logs</h3>
          </div>
          <p className="text-xs text-gray-600">Record fuel consumption</p>
        </div>
      </div>

      {/* Create Driver Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Manage Drivers</h3>
              <p className="text-gray-600 text-sm">Add new drivers to your team and manage existing ones</p>
            </div>
          </div>
          
          <Button 
            onClick={onCreateDriver}
            variant={showDriverForm ? "secondary" : "primary"}
            className="px-5 py-2.5 text-sm font-medium"
          >
            {showDriverForm ? (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Close Form</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Driver</span>
              </div>
            )}
          </Button>
        </div>
        
        {/* Status indicator */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${showDriverForm ? 'bg-sage' : 'bg-gray-300'}`}></div>
            <span className="text-gray-500">
              {showDriverForm ? 'Driver creation form is open' : 'Click to create a new driver'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}