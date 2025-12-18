import { formatDate, formatTime } from '../../helpers/formatters.js';
import { getTripStatusInfo } from '../../helpers/status.jsx';

// Simple TripsList - displays trips in a table
// Different columns based on user role
import { useState } from 'react';

export function TripsList({ trips, userRole, onEdit, onDelete, onView, onDownload, onStatusChange, loading }) {
  const [updatingIds, setUpdatingIds] = useState([]);
  // If no trips, show empty message
  if (!trips || trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-200">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {userRole === 'ADMIN' ? 'No trips scheduled yet' : 'No trips assigned to you'}
        </h3>
        <p className="text-gray-500 max-w-sm">
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
    <div className="space-y-8">
      {/* Stats header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Total Trips</div>
          <div className="text-2xl font-bold text-gray-900">{trips.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Scheduled</div>
          <div className="text-2xl font-bold text-gray-900">
            {trips.filter(t => t.status === 'TO_DO').length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">In Progress</div>
          <div className="text-2xl font-bold text-blue-600">
            {trips.filter(t => t.status === 'IN_PROGRESS').length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Completed</div>
          <div className="text-2xl font-bold text-emerald-600">
            {trips.filter(t => t.status === 'DONE').length}
          </div>
        </div>
      </div>

      {/* Mobile/Grid view for smaller screens */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        {trips.map((trip) => {
          const statusInfo = getStatusInfo(trip.status);
          return (
            <div key={trip._id} className="bg-white rounded-xl border border-gray-200 p-5">
              {/* Status bar */}
              <div className={`h-1 w-full mb-4 ${trip.status === 'TO_DO' ? 'bg-gray-300' : trip.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-emerald-500'} rounded-full`}></div>
              
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg mb-1">
                    {trip.title}
                  </h4>
                  {trip.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">{trip.description}</p>
                  )}
                </div>
                {userRole === 'ADMIN' && (
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => onEdit(trip)}
                      disabled={loading}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Edit trip"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                )}
                {/* Driver actions: view/download */}
                {userRole === 'DRIVER' && (
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => onView && onView(trip._id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="View trip"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onDownload && onDownload(trip._id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Download trip PDF"
                    >
                      PDF
                    </button>
                  </div>
                )}
              </div>

              {/* Status badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  {statusInfo.icon}
                  {statusInfo.label}
                </span>
              </div>

              {/* Quick status actions for driver (mobile) */}
              {userRole === 'DRIVER' && onStatusChange && (
                  <div className="mt-3 flex items-center gap-2">
                  {['TO_DO','IN_PROGRESS','DONE'].map((s) => (
                    <button
                      key={s}
                      onClick={async () => {
                        if (!onStatusChange) return;
                        setUpdatingIds((ids) => [...ids, trip._id]);
                        try {
                          await onStatusChange(trip._id, s);
                        } catch (e) {
                          // swallow, parent will handle error
                        } finally {
                          setUpdatingIds((ids) => ids.filter(id => id !== trip._id));
                        }
                      }}
                      disabled={updatingIds.includes(trip._id)}
                      className="px-2 py-1 text-xs bg-amber/10 text-amber rounded-md"
                    >
                      {updatingIds.includes(trip._id) ? 'Updating...' : (s === 'TO_DO' ? 'To Do' : s === 'IN_PROGRESS' ? 'In Progress' : 'Done')}
                    </button>
                  ))}
                </div>
              )}

              {/* Route */}
              <div className="mb-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  <span className="font-medium text-sm text-gray-900">{trip.origin}</span>
                </div>
                <div className="h-4 border-l-2 border-dashed border-gray-300 ml-[7px]"></div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  <span className="font-medium text-sm text-gray-900">{trip.destination}</span>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</div>
                  <div className="font-semibold text-gray-900">{formatDate(trip.plannedStart)}</div>
                  <div className="text-xs text-gray-500">{formatTime(trip.plannedStart)}</div>
                </div>
                {userRole === 'ADMIN' && (
                  <>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Truck</div>
                      <div className="font-semibold text-gray-900 truncate">{getTruckInfo(trip.truck)}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Driver</div>
                      <div className="font-semibold text-gray-900">{getDriverInfo(trip.driver)}</div>
                    </div>
                  </>
                )}
              </div>

              {/* Delete button for admin */}
              {userRole === 'ADMIN' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${trip.title}"?`)) {
                        onDelete(trip._id);
                      }
                    }}
                    disabled={loading}
                    className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Trip
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trip Details</div>
                </th>
                <th className="text-left py-4 px-6">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</div>
                </th>
                {userRole === 'ADMIN' && (
                  <>
                    <th className="text-left py-4 px-6">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Truck</div>
                    </th>
                    <th className="text-left py-4 px-6">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Driver</div>
                    </th>
                  </>
                )}
                <th className="text-left py-4 px-6">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Schedule</div>
                </th>
                <th className="text-left py-4 px-6">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</div>
                </th>
                {userRole === 'ADMIN' && (
                  <th className="text-left py-4 px-6">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {trips.map((trip, index) => {
                const statusInfo = getStatusInfo(trip.status);
                return (
                  <tr 
                    key={trip._id} 
                    className={`hover:bg-gray-50/50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                  >
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">{trip.title}</div>
                        {trip.description && (
                          <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">{trip.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                            <span className="text-sm text-gray-900 font-medium">{trip.origin}</span>
                          </div>
                          <div className="h-4 border-l-2 border-dashed border-gray-300 ml-[5px] my-1"></div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                            <span className="text-sm text-gray-900 font-medium">{trip.destination}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    {userRole === 'ADMIN' && (
                      <>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      {/* Actions column for drivers: view + download */}
                      {userRole === 'DRIVER' && (
                        <td className="py-4 px-6">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            {onStatusChange && (
                              <div className="flex items-center gap-2">
                                {['TO_DO','IN_PROGRESS','DONE'].map((s) => (
                                  <button
                                    key={s}
                                    onClick={async () => {
                                      if (!onStatusChange) return;
                                      setUpdatingIds((ids) => [...ids, trip._id]);
                                      try {
                                        await onStatusChange(trip._id, s);
                                      } catch (e) {
                                      } finally {
                                        setUpdatingIds((ids) => ids.filter(id => id !== trip._id));
                                      }
                                    }}
                                    disabled={updatingIds.includes(trip._id)}
                                    className="px-2 py-1 text-xs bg-amber/10 text-amber rounded-md"
                                  >
                                    {updatingIds.includes(trip._id) ? 'Updating...' : (s === 'TO_DO' ? 'To Do' : s === 'IN_PROGRESS' ? 'In Progress' : 'Done')}
                                  </button>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onView && onView(trip._id)}
                                className="px-3 py-1.5 bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 rounded-lg transition-all duration-200 text-sm font-medium"
                              >
                                View
                              </button>
                              <button
                                onClick={() => onDownload && onDownload(trip._id)}
                                className="px-3 py-1.5 bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 rounded-lg transition-all duration-200 text-sm font-medium"
                              >
                                PDF
                              </button>
                            </div>
                          </div>
                        </td>
                      )}
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{formatDate(trip.plannedStart)}</div>
                        <div className="text-gray-500 text-xs">{formatTime(trip.plannedStart)}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          trip.status === 'TO_DO' ? 'bg-gray-400' : 
                          trip.status === 'IN_PROGRESS' ? 'bg-blue-500' : 
                          'bg-emerald-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-900">{statusInfo.label}</span>
                      </div>
                    </td>
                    {userRole === 'ADMIN' && (
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEdit(trip)}
                            disabled={loading}
                            className="px-3 py-1.5 bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 rounded-lg transition-all duration-200 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${trip.title}"? This action cannot be undone.`)) {
                                onDelete(trip._id);
                              }
                            }}
                            disabled={loading}
                            className="px-3 py-1.5 bg-white border border-gray-300 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg transition-all duration-200 text-sm font-medium"
                          >
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

        {/* Table footer */}
        <div className="border-t border-gray-200 bg-gray-50/50 px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-500">
              Showing <span className="font-semibold text-gray-900">{trips.length}</span> trip{trips.length !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-500 text-sm">Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-500 text-sm">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-500 text-sm">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}