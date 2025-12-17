import { Button } from '../common/button.jsx';

// Simple WelcomeCard - displays user info and logout button
export function WelcomeCard({ user, onLogout }) {
  // Format role for display
  const formatRole = (role) => {
    const roleMap = {
      'ADMIN': 'Administrator',
      'DRIVER': 'Driver',
      'MANAGER': 'Manager',
      'USER': 'User'
    };
    return roleMap[role] || role;
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get role color
  const getRoleColor = (role) => {
    const roleColors = {
      'ADMIN': 'from-purple-500 to-purple-600',
      'DRIVER': 'from-blue-500 to-blue-600',
      'MANAGER': 'from-emerald-500 to-emerald-600',
      'USER': 'from-gray-500 to-gray-600'
    };
    return roleColors[role] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${getRoleColor(user?.role)} px-8 py-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">
                {getUserInitials()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Welcome back, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-white/90">Good to see you again</p>
            </div>
          </div>
          
          {/* Role badge */}
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white font-semibold text-sm">
                {formatRole(user?.role)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* User info card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Account Information</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-blue-200/50">
                <span className="text-gray-600">Full Name</span>
                <span className="font-medium text-gray-900">{user?.name || 'Not provided'}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-blue-200/50">
                <span className="text-gray-600">Email Address</span>
                <span className="font-medium text-gray-900">{user?.email}</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Account Role</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${getRoleColor(user?.role)} text-white`}>
                  {formatRole(user?.role)}
                </span>
              </div>
            </div>
          </div>

          {/* Stats or quick info card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Quick Stats</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">
                    {user?.role === 'ADMIN' ? '24' : '3'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {user?.role === 'ADMIN' ? 'Total Trucks' : 'Active Trips'}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">
                    {user?.role === 'ADMIN' ? '8' : '12'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {user?.role === 'ADMIN' ? 'Active Trips' : 'Completed'}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Last login: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Need help? <a href="/support" className="text-blue-600 hover:text-blue-800 font-medium">Contact support</a>
          </div>
          
          <Button 
            onClick={onLogout}
            variant="danger"
            className="px-8 py-3 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}