
import { formatDate, formatTime } from '../../helpers/formatters.js';
import { getTripStatusInfo } from '../../helpers/status.jsx';

// Simple TripsList - displays trips in a table
// Different columns based on user role
export function TripsList({ trips, userRole, onEdit, onDelete, onStatusChange, loading }) {
  // If no trips, show empty message
  if (!trips || trips.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {userRole === 'ADMIN' ? 'No trips scheduled yet' : 'No trips assigned to you'}
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          {userRole === 'ADMIN' 
            ? 'Get started by creating your first trip to manage your fleet operations.'
            : 'You currently don\'t have any assigned trips. Please check back later.'}
        </p>
      </div>
    );
  }

  // Get truck info safely
  const getTruckInfo = (truck) => {
    if (!truck) return 'Not assigned';
    return typeof truck === 'object' 
      ? `${truck.plateNumber} • ${truck.make} ${truck.model}` 
      : truck;
  };

  // Get driver info safely
  const getDriverInfo = (driver) => {
    if (!driver) return 'Not assigned';
    return typeof driver === 'object' 
      ? `${driver.name}` 
      : driver;
  };

  // use shared helpers from ../../helpers
  const getStatusInfo = getTripStatusInfo;

  return (
    <div className="space-y-6">
      {/* Mobile/Grid view for smaller screens */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        {trips.map((trip) => {
          const statusInfo = getStatusInfo(trip.status);
          return (
            <div key={trip._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                    <h4 className="font-bold text-gray-900 text-base">
                      <button onClick={() => onView && onView(trip._id)} className="hover:underline text-left text-blue-700">
                        {trip.title}
                      </button>
                    </h4>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                      {statusInfo.icon}
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
                {userRole === 'ADMIN' && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(trip)}
                      disabled={loading}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      aria-label="Edit trip"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${trip.title}"?`)) {
                          onDelete(trip._id);
                        }
                      }}
                      disabled={loading}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Delete trip"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Route */}
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Route
                </div>
                <div className="pl-6">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="font-medium">{trip.origin}</span>
                  </div>
                  <div className="h-4 border-l-2 border-dashed border-gray-300 ml-[7px] my-1"></div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="font-medium">{trip.destination}</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 mb-1">Date</div>
                  <div className="font-medium">{formatDate(trip.plannedStart)}</div>
                  <div className="text-gray-500 text-xs">{formatTime(trip.plannedStart)}</div>
                </div>
                {userRole === 'ADMIN' && (
                  <>
                    <div>
                      <div className="text-gray-500 mb-1">Truck</div>
                      <div className="font-medium truncate">{getTruckInfo(trip.truck)}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-gray-500 mb-1">Driver</div>
                      <div className="font-medium">{getDriverInfo(trip.driver)}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Trip Details
                  </div>
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Route
                  </div>
                </th>
                {userRole === 'ADMIN' && (
                  <>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        Truck
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-4.201a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                        </svg>
                        Driver
                      </div>
                    </th>
                  </>
                )}
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Schedule
                  </div>
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Status</th>
                {userRole === 'ADMIN' && (
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trips.map((trip, index) => {
                const statusInfo = getStatusInfo(trip.status);
                return (
                  <tr 
                    key={trip._id} 
                    className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                  >
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">{trip.title}</div>
                                              <div className="font-semibold text-gray-900">
                                                <button onClick={() => onView && onView(trip._id)} className="hover:underline text-left text-blue-700">{trip.title}</button>
                                              </div>
                        {trip.description && (
                          <div className="text-sm text-gray-500 mt-1 line-clamp-1">{trip.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            <span className="font-medium text-sm">{trip.origin}</span>
                          </div>
                          <div className="h-4 border-l-2 border-dashed border-gray-300 ml-[5px] my-1"></div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                            <span className="font-medium text-sm">{trip.destination}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    {userRole === 'ADMIN' && (
                      <>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {getTruckInfo(trip.truck)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {getDriverInfo(trip.driver)}
                              </div>
                              {trip.driver?.email && (
                                <div className="text-gray-500 text-xs">{trip.driver.email}</div>
                              )}
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">{formatDate(trip.plannedStart)}</div>
                        <div className="text-gray-500 text-sm">{formatTime(trip.plannedStart)}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                    </td>
                    {userRole === 'ADMIN' && (
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEdit(trip)}
                            disabled={loading}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 hover:bg-blue-200 hover:border-blue-300 rounded-lg transition-all duration-200 text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${trip.title}"? This action cannot be undone.`)) {
                                onDelete(trip._id);
                              }
                            }}
                            disabled={loading}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 hover:bg-red-200 hover:border-red-300 rounded-lg transition-all duration-200 text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer summary */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
        <div>
          Showing <span className="font-semibold text-gray-700">{trips.length}</span> trip{trips.length !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded-full"></div>
            <span>Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded-full"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded-full"></div>
            <span>Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}