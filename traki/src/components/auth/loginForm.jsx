import { useState } from 'react';
import { validators } from '../../helpers/validator/validator.js';
import { Button } from '../common/button.jsx';
import { Input } from '../common/input.jsx';

// Simple LoginForm - only handles input and validation
// Parent component handles Redux dispatch and navigation
export function LoginForm({ onSubmit, isLoading, error }) {
  // Form input state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Validation errors from validator helper
  const [errors, setErrors] = useState({});

  // Validate form using validator helper functions
  const validateForm = () => {
    const newErrors = {};

    // Use validator helper to check email
    const emailValidation = validators.email(email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    }

    // Use validator helper to check password
    const passwordValidation = validators.password(password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate before sending to parent
    if (!validateForm()) {
      return;
    }

    // Call parent onSubmit with credentials
    onSubmit({ email, password });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-lg mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Welcome Back</h3>
        <p className="text-gray-600 text-sm">Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          {/* Email input field */}
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            error={errors.email}
            autoComplete="email"
          />

          {/* Password input field */}
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            error={errors.password}
            autoComplete="current-password"
          />
        </div>

        {/* Remember me and forgot password */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-cerulean focus:ring-cerulean/30 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <a href="/forgot-password" className="text-sm text-cerulean hover:text-cerulean/80 font-medium transition-colors">
            Forgot password?
          </a>
        </div>

        {/* Server error message */}
        {error && (
          <div className="p-4 bg-terracotta/10 border border-terracotta/20 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-terracotta/20 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-terracotta" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-900 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="pt-2">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-2.5 text-sm font-medium"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Sign in to your account</span>
              </div>
            )}
          </Button>
        </div>

        {/* Divider */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
          </div>
        </div>
      </form>
    </div>
  );
}