
// Simple TrucksList - displays trucks in a table
export function TrucksList({ trucks, onEdit, onDelete, onSetMaintenance, loading }) {
  // If no trucks, show empty message
  if (!trucks || trucks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No trucks in your fleet</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Get started by adding your first truck to manage deliveries and trips.
        </p>
      </div>
    );
  }

  // Get status color and icon
  const getStatusInfo = (status) => {
    if (status === 'ACTIVE') {
      return {
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        label: 'Active'
      };
    } else {
      return {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        label: 'Inactive'
      };
    }
  };

  // Format capacity with commas
  const formatCapacity = (capacity) => {
    return capacity?.toLocaleString() || '0';
  };

  return (
    <div className="space-y-6">
      {/* Mobile/Grid view for smaller screens */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        {trucks.map((truck) => {
          const statusInfo = getStatusInfo(truck.status);
          return (
            <div key={truck._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">{truck.plateNumber}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{truck.make} {truck.model}</div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit(truck)}
                    disabled={loading}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label="Edit truck"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete truck ${truck.plateNumber}?`)) {
                        onDelete(truck._id);
                      }
                    }}
                    disabled={loading}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete truck"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 text-xs mb-1">Year</div>
                  <div className="font-medium">{truck.year}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 text-xs mb-1">Capacity</div>
                  <div className="font-medium">{formatCapacity(truck.capacity)} kg</div>
                </div>
              </div>

              {/* VIN if available */}
              {truck.vin && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-gray-500 text-xs mb-1">VIN</div>
                  <div className="font-mono text-sm font-medium truncate">{truck.vin}</div>
                </div>
              )}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    License Plate
                  </div>
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Make & Model
                  </div>
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Year
                  </div>
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Capacity
                  </div>
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trucks.map((truck, index) => {
                const statusInfo = getStatusInfo(truck.status);
                return (
                  <tr 
                    key={truck._id} 
                    className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{truck.plateNumber}</div>
                          {truck.vin && (
                            <div className="text-gray-500 text-xs font-mono truncate max-w-[120px]">{truck.vin}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{truck.make} {truck.model}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{truck.year}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{formatCapacity(truck.capacity)} kg</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(truck)}
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
                            if (window.confirm(`Are you sure you want to delete ${truck.plateNumber}? This action cannot be undone.`)) {
                              onDelete(truck._id);
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
                          {onSetMaintenance && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Set truck ${truck.plateNumber} status to Maintenance?`)) {
                                  onSetMaintenance(truck._id);
                                }
                              }}
                              disabled={loading}
                              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 text-amber-700 hover:bg-amber-200 hover:border-amber-300 rounded-lg transition-all duration-200 text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Maintenance
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
        <div className="mb-2 sm:mb-0">
          Showing <span className="font-semibold text-gray-700">{trucks.length}</span> truck{trucks.length !== 1 ? 's' : ''}
          <span className="ml-4">
            Active: <span className="font-semibold text-emerald-700">{trucks.filter(t => t.status === 'ACTIVE').length}</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded-full"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded-full"></div>
            <span>Inactive</span>
          </div>
        </div>
      </div>
    </div>
  );
}