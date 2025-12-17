import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../redux/authSlice.js';
import { WelcomeCard } from '../components/dashboard/WelcomeCard.jsx';
import { AdminNavigation } from '../components/dashboard/AdminNavigation.jsx';
import { DriverCreationSection } from '../components/dashboard/DriverCreationSection.jsx';
import { useCreateDriver } from '../hooks/useCreateDriver.js';
import { loginRequestHandler } from '../services/api/login.js';
import { useTrucks } from '../hooks/useTrucks.js';
import { useTrips } from '../hooks/useTrips.js';
import { getDriversRequestHandler } from '../services/api/drivers.js';

// DashboardPage - main dashboard page
export function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);
  // State to show/hide driver creation form
  const [showCreateDriver, setShowCreateDriver] = useState(false);
  // Success message state
  const [successMessage, setSuccessMessage] = useState('');
  // Use createDriver hook to handle API call
  const [createError, isCreatingDriver, createDriver] = useCreateDriver();

  // Handle driver creation
  const handleCreateDriver = async (credentials) => {
    try {
      const response = await createDriver(credentials);
      
      if (response.data?.id) {
        setSuccessMessage(`Driver account for ${credentials.name} has been created successfully!`);
        setShowCreateDriver(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Driver creation failed:', err);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await loginRequestHandler.logout?.();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      dispatch(clearUser());
      navigate('/login');
    }
  };

  // Stats for the dashboard (mock data - you can replace with real data)
  // Use hooks to get live data for stats
  const { trucks = [] } = useTrucks();
  const { trips = [] } = useTrips(user?.role);
  const [driversCount, setDriversCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const loadDrivers = async () => {
      try {
        const res = await getDriversRequestHandler();
        if (mounted && Array.isArray(res.data)) setDriversCount(res.data.length);
      } catch (err) {
        // ignore; dashboard can still render
      }
    };
    loadDrivers();
    return () => { mounted = false; };
  }, []);

  // Helpers to normalize statuses coming from backend variations
  const isCompleted = (s) => !s ? false : /done|completed/i.test(s);
  const isInProgress = (s) => /in_progress|in-progress|inprogress/i.test(s) || /in_progress/i.test(s) || s === 'IN_PROGRESS';
  const isScheduled = (s) => /to_do|scheduled|to-do/i.test(s) || s === 'TO_DO' || s === 'SCHEDULED';

  const totalTrucks = trucks.length;
  const totalTrips = trips.length;
  const activeTrips = trips.filter(t => isInProgress(t.status)).length;
  const completedTrips = trips.filter(t => isCompleted(t.status)).length;
  const upcomingTrips = trips.filter(t => isScheduled(t.status) || (t.plannedStart && new Date(t.plannedStart) > new Date())).length;
  const completionRate = totalTrips > 0 ? Math.round((completedTrips / totalTrips) * 100) : 0;

  const dashboardStats = user?.role === 'ADMIN'
    ? [
        { label: 'Total Trucks', value: String(totalTrucks), icon: '🚚', color: 'from-blue-500 to-blue-600', link: '/trucks' },
        { label: 'Active Trips', value: String(activeTrips), icon: '🛣️', color: 'from-green-500 to-green-600', link: '/trips' },
        { label: 'Available Drivers', value: String(driversCount), icon: '👤', color: 'from-purple-500 to-purple-600', link: '/drivers' },
        { label: 'Completion Rate', value: `${completionRate}%`, icon: '📊', color: 'from-amber-500 to-amber-600', link: '/analytics' },
      ]
    : [
        { label: 'Assigned Trips', value: String(totalTrips), icon: '🛣️', color: 'from-blue-500 to-blue-600', link: '/trips' },
        { label: 'Completed', value: String(completedTrips), icon: '✅', color: 'from-green-500 to-green-600', link: '/trips' },
        { label: 'Upcoming', value: String(upcomingTrips), icon: '📅', color: 'from-purple-500 to-purple-600', link: '/trips' },
        { label: 'On-time Rate', value: 'N/A', icon: '⏱️', color: 'from-amber-500 to-amber-600', link: '/performance' },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Success message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-700 font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {createError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700 font-medium">{createError}</span>
            </div>
          </div>
        )}

        {/* Welcome section */}
        <div className="mb-8">
          <WelcomeCard user={user} onLogout={handleLogout} />
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div 
              key={index}
              onClick={() => stat.link && navigate(stat.link)}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl shadow-lg p-6 text-white cursor-pointer transform transition-transform hover:scale-[1.02] hover:shadow-xl`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{stat.icon}</div>
                <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Admin section - only for ADMIN role */}
        {user?.role === 'ADMIN' && (
          <div className="space-y-8">
            {/* Main navigation card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                <p className="text-gray-600 text-sm mt-1">Manage your fleet operations</p>
              </div>
              <div className="p-8">
                <AdminNavigation 
                  onTrucks={() => navigate('/trucks')}
                  onTrips={() => navigate('/trips')}
                  onCreateDriver={() => setShowCreateDriver(!showCreateDriver)}
                  showDriverForm={showCreateDriver}
                  onTrailers={() => navigate('/trailers')}
                  onTires={() => navigate('/tires')}
                  onFuelLogs={() => navigate('/fuellogs')}
                />
              </div>
            </div>

            {/* Driver creation section */}
            {showCreateDriver && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Create New Driver Account</h2>
                    <p className="text-gray-600 text-sm mt-1">Add a new driver to your fleet</p>
                  </div>
                  <button
                    onClick={() => setShowCreateDriver(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <DriverCreationSection 
                  isOpen={showCreateDriver}
                  onClose={() => setShowCreateDriver(false)}
                  onSubmit={handleCreateDriver}
                  isLoading={isCreatingDriver}
                  error={createError}
                  successMessage={successMessage}
                />
              </div>
            )}

            {/* Recent Activity / Quick Links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Trips */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Trips</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">New York to Boston</div>
                        <div className="text-sm text-gray-500">In Progress • Today</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/trips')}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Chicago to Detroit</div>
                        <div className="text-sm text-gray-500">Completed • Yesterday</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/trips')}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/trips')}
                  className="w-full mt-6 py-3 text-center border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  View All Trips
                </button>
              </div>

              {/* System Status */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">All Systems Operational</span>
                    </div>
                    <span className="text-sm text-gray-500">Just now</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">API Connectivity</span>
                    </div>
                    <span className="text-sm text-gray-500">Stable</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">Database</span>
                    </div>
                    <span className="text-sm text-gray-500">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-amber-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">Driver Notifications</span>
                    </div>
                    <span className="text-sm text-gray-500">1 Pending</span>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Driver section - only for DRIVER role */}
        {user?.role === 'DRIVER' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Schedule</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Morning Delivery</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">10:00 AM</span>
                    </div>
                    <p className="text-sm text-gray-600">Warehouse to Downtown Store</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Afternoon Route</span>
                      <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full">2:30 PM</span>
                    </div>
                    <p className="text-sm text-gray-600">Multiple store deliveries</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/trips')}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <span className="font-medium text-blue-800">View My Trips</span>
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => navigate('/performance')}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <span className="font-medium text-green-800">Performance Report</span>
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Truck Management System v2.0
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Last login: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Add animation keyframes to global styles or your CSS file */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}