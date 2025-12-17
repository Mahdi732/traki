import { Button } from '../common/button.jsx';

// Simple AdminNavigation - quick navigation buttons for admin
export function AdminNavigation({ onTrucks, onTrips, onCreateDriver, showDriverForm, onTrailers, onTires, onFuelLogs }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Manage your fleet operations and team</p>
      </div>

      {/* Navigation buttons grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manage Trucks Card */}
        <div 
          onClick={onTrucks}
          className="group relative bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:scale-[1.02]"
        >
          <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-300 rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          
          <div className="pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Trucks</h3>
            <p className="text-gray-600 text-sm mb-4">View, add, edit, or remove trucks from your fleet</p>
            <div className="flex items-center text-blue-600 font-medium text-sm">
              <span>Go to Trucks</span>
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Manage Trips Card */}
        <div 
          onClick={onTrips}
          className="group relative bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-purple-400 hover:shadow-xl hover:scale-[1.02]"
        >
          <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-purple-200 to-purple-300 rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          
          <div className="pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Trips</h3>
            <p className="text-gray-600 text-sm mb-4">Schedule, track, and manage all trips and deliveries</p>
            <div className="flex items-center text-purple-600 font-medium text-sm">
              <span>Go to Trips</span>
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* More resources row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div onClick={onTrailers} className="group relative bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-indigo-400 hover:shadow-xl hover:scale-[1.02]">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Trailers</h3>
          <p className="text-sm text-gray-600">Manage trailers</p>
        </div>

        <div onClick={onTires} className="group relative bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-amber-400 hover:shadow-xl hover:scale-[1.02]">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Tires</h3>
          <p className="text-sm text-gray-600">Track tires and maintenance</p>
        </div>

        <div onClick={onFuelLogs} className="group relative bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-green-400 hover:shadow-xl hover:scale-[1.02]">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Fuel Logs</h3>
          <p className="text-sm text-gray-600">Record fuel consumption</p>
        </div>
      </div>

      {/* Create Driver Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-7 h-7 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Drivers</h3>
              <p className="text-gray-600 text-sm">Add new drivers to your team and manage existing ones</p>
            </div>
          </div>
          
          <Button 
            onClick={onCreateDriver}
            variant={showDriverForm ? "secondary" : "success"}
            className="px-8 py-3 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            {showDriverForm ? (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Close Driver Form</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create New Driver</span>
              </div>
            )}
          </Button>
        </div>
        
        {/* Status indicator */}
        <div className="mt-6 flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${showDriverForm ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></div>
          <span className="text-gray-500">
            {showDriverForm ? 'Driver creation form is open' : 'Click to create a new driver'}
          </span>
        </div>
      </div>
    </div>
  );
}