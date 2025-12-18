import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin.js';
import { LoginForm } from '../components/auth/loginForm.jsx';
import { setUser } from '../redux/authSlice.js';

// LoginPage - handles login logic using useLogin hook
export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Use your login hook to handle API call
  const [error, isLoading, login] = useLogin();

  // Handle form submit from LoginForm component
  const handleLogin = async (credentials) => {
    try {
      // Call login hook with email and password
      const response = await login(credentials);

      // Store user in Redux
      if (response.data?.user) {
        dispatch(setUser(response.data.user));
        // Navigate to dashboard after successful login
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
      // Error is handled by useLogin hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-gray-50">
      {/* Geometric background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 rounded-full bg-cerulean/5"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 rounded-full bg-sage/5"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}></div>
        </div>
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Welcome section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-sm mb-5">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your fleet management dashboard</p>
        </div>

        {/* Login form card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Sign in to your account</h2>
          </div>

          <div className="p-8">
            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-terracotta/10 border border-terracotta/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-terracotta/20 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-4 h-4 text-terracotta" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">{error}</span>
                    <span className="text-xs text-gray-600 mt-1">Please check your credentials and try again</span>
                  </div>
                </div>
              </div>
            )}

            {/* Login form */}
            <LoginForm 
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>

        {/* Support links */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</a>{' '}
            and{' '}
            <a href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
          </p>
        </div>

        {/* System status */}
        <div className="mt-8 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-sage"></div>
            <span className="text-sm text-gray-600">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Brand footer */}
      <div className="fixed bottom-0 left-0 right-0 py-4 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-md bg-gray-900 mr-2"></div>
              <span className="text-sm font-medium text-gray-900">Truck Management System</span>
            </div>
            <div className="mt-2 md:mt-0">
              <span className="text-xs text-gray-500">© {new Date().getFullYear()} • Enterprise Edition</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}