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
        { label: 'Total Trucks', value: String(totalTrucks), icon: '🚚', color: 'border-l-cerulean', accent: 'text-cerulean', link: '/trucks' },
        { label: 'Active Trips', value: String(activeTrips), icon: '🛣️', color: 'border-l-sage', accent: 'text-sage', link: '/trips' },
        { label: 'Available Drivers', value: String(driversCount), icon: '👤', color: 'border-l-terracotta', accent: 'text-terracotta', link: '/drivers' },
        { label: 'Completion Rate', value: `${completionRate}%`, icon: '📊', color: 'border-l-amber', accent: 'text-amber', link: '/analytics' },
      ]
    : [
        { label: 'Assigned Trips', value: String(totalTrips), icon: '🛣️', color: 'border-l-cerulean', accent: 'text-cerulean', link: '/trips' },
        { label: 'Completed', value: String(completedTrips), icon: '✅', color: 'border-l-sage', accent: 'text-sage', link: '/trips' },
        { label: 'Upcoming', value: String(upcomingTrips), icon: '📅', color: 'border-l-terracotta', accent: 'text-terracotta', link: '/trips' },
        { label: 'On-time Rate', value: 'N/A', icon: '⏱️', color: 'border-l-amber', accent: 'text-amber', link: '/performance' },
      ];

  return (
    <div className="min-h-screen bg-custom-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success message */}
        {successMessage && (
          <div className="mb-8 p-4 bg-sage/10 border border-sage/20 rounded-lg backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-sage" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-900 font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {createError && (
          <div className="mb-8 p-4 bg-terracotta/10 border border-terracotta/20 rounded-lg backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-terracotta/20 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-terracotta" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-900 font-medium">{createError}</span>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 hidden md:block">
              Last login: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dashboardStats.map((stat, index) => (
            <div 
              key={index}
              onClick={() => stat.link && navigate(stat.link)}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`text-2xl ${stat.accent} opacity-90`}>{stat.icon}</div>
                  <div className={`w-10 h-10 rounded-full ${stat.accent.replace('text', 'bg')}/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className={`text-3xl font-bold text-gray-900 ${stat.accent}`}>{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
              <div className={`h-1 ${stat.color} transition-all duration-300 group-hover:h-2`}></div>
            </div>
          ))}
        </div>

        {/* Admin section - only for ADMIN role */}
        {user?.role === 'ADMIN' && (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your fleet operations efficiently</p>
              </div>
              <div className="p-6">
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
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm animate-fadeIn">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Create New Driver Account</h2>
                      <p className="text-sm text-gray-500 mt-1">Add a new driver to your fleet</p>
                    </div>
                    <button
                      onClick={() => setShowCreateDriver(false)}
                      className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <DriverCreationSection 
                    isOpen={showCreateDriver}
                    onClose={() => setShowCreateDriver(false)}
                    onSubmit={handleCreateDriver}
                    isLoading={isCreatingDriver}
                    error={createError}
                    successMessage={successMessage}
                  />
                </div>
              </div>
            )}

            {/* Recent Activity & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Trips */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Recent Trips</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-cerulean/10 flex items-center justify-center mr-4">
                          <svg className="w-5 h-5 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">New York to Boston</div>
                          <div className="text-sm text-gray-500">In Progress • 2 hours remaining</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate('/trips')}
                        className="text-sm text-gray-400 group-hover:text-gray-700 font-medium transition-colors"
                      >
                        View →
                      </button>
                    </div>
                    
                    <div className="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-sage/10 flex items-center justify-center mr-4">
                          <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Chicago to Detroit</div>
                          <div className="text-sm text-gray-500">Completed • Yesterday</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate('/trips')}
                        className="text-sm text-gray-400 group-hover:text-gray-700 font-medium transition-colors"
                      >
                        View →
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/trips')}
                    className="w-full mt-6 py-3 text-center border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200"
                  >
                    View All Trips
                  </button>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">System Status</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-3 h-3 rounded-full bg-sage"></div>
                          <div className="w-3 h-3 rounded-full bg-sage/20 animate-ping absolute inset-0"></div>
                        </div>
                        <span className="ml-3 text-gray-700">All Systems Operational</span>
                      </div>
                      <span className="text-sm text-gray-500">Live</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-sage"></div>
                        <span className="ml-3 text-gray-700">API Connectivity</span>
                      </div>
                      <span className="text-sm text-gray-500">Stable</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-sage"></div>
                        <span className="ml-3 text-gray-700">Database</span>
                      </div>
                      <span className="text-sm text-gray-500">Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber"></div>
                        <span className="ml-3 text-gray-700">Driver Notifications</span>
                      </div>
                      <span className="text-sm text-gray-500">1 Pending</span>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Driver section - only for DRIVER role */}
        {user?.role === 'DRIVER' && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Your Dashboard</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Today's Schedule</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-cerulean/20 rounded-lg bg-cerulean/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">Morning Delivery</span>
                        <span className="text-sm bg-cerulean/10 text-cerulean px-3 py-1 rounded-full">10:00 AM</span>
                      </div>
                      <p className="text-sm text-gray-600">Warehouse to Downtown Store • 120 miles</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">Afternoon Route</span>
                        <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">2:30 PM</span>
                      </div>
                      <p className="text-sm text-gray-600">Multiple store deliveries • 85 miles</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => navigate('/trips')}
                      className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-cerulean hover:bg-cerulean/5 transition-all duration-200 group"
                    >
                      <span className="font-medium text-gray-900 group-hover:text-cerulean">View My Trips</span>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => navigate('/performance')}
                      className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-sage hover:bg-sage/5 transition-all duration-200 group"
                    >
                      <span className="font-medium text-gray-900 group-hover:text-sage">Performance Report</span>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Truck Management System
            </p>
            <p className="text-xs text-gray-400 mt-2 md:mt-0">
              Version 2.0 • Built for efficiency
            </p>
          </div>
        </div>
      </div>

      {/* Add custom styles for animations */}
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