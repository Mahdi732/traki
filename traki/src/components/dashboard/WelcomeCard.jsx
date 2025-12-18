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
      'ADMIN': 'bg-cerulean text-white',
      'DRIVER': 'bg-sage text-white',
      'MANAGER': 'bg-gray-900 text-white',
      'USER': 'bg-gray-300 text-gray-900'
    };
    return roleColors[role] || 'bg-gray-300 text-gray-900';
  };

  // Get role text color
  const getRoleTextColor = (role) => {
    const textColors = {
      'ADMIN': 'text-cerulean',
      'DRIVER': 'text-sage',
      'MANAGER': 'text-gray-900',
      'USER': 'text-gray-600'
    };
    return textColors[role] || 'text-gray-600';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-white">
                {getUserInitials()}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Welcome back, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-gray-500 text-sm mt-1">Good to see you again</p>
            </div>
          </div>
          
          {/* Role badge */}
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${getRoleColor(user?.role)}`}>
              {formatRole(user?.role)}
            </div>
            <Button 
              onClick={onLogout}
              variant="secondary"
              className="px-4 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User info card */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-cerulean/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Full Name</span>
                <span className="text-sm font-medium text-gray-900">{user?.name || 'Not provided'}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Email Address</span>
                <span className="text-sm font-medium text-gray-900">{user?.email}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Account Role</span>
                <span className={`text-sm font-medium ${getRoleTextColor(user?.role)}`}>
                  {formatRole(user?.role)}
                </span>
              </div>
            </div>
          </div>

          {/* Stats or quick info card */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-900/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="text-lg font-bold text-gray-900">
                    {user?.role === 'ADMIN' ? '24' : '3'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {user?.role === 'ADMIN' ? 'Total Trucks' : 'Active Trips'}
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="text-lg font-bold text-gray-900">
                    {user?.role === 'ADMIN' ? '8' : '12'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {user?.role === 'ADMIN' ? 'Active Trips' : 'Completed'}
                  </div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Last login: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-gray-500">
              Need help? <a href="/support" className="text-cerulean hover:text-cerulean/80 font-medium">Contact support</a>
            </div>
            
            <div className="text-xs text-gray-400">
              Session ID: {user?._id?.slice(-8) || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}