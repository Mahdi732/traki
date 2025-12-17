import { useState } from 'react';
import { validators } from '../../helpers/validator/validator.js';
import { Button } from '../common/button.jsx';
import { Input } from '../common/input.jsx';

// Simple CreateDriverForm - only handles input and validation
// Parent component handles API call and success/error
export function CreateDriverForm({ onSubmit, isLoading, error, onSuccess }) {
  // Form input state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Validation errors from validator helper
  const [errors, setErrors] = useState({});

  // Validate form using validator helper functions
  const validateForm = () => {
    const newErrors = {};

    // Validate name
    const nameValidation = validators.name(name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.message;
    }

    // Validate email
    const emailValidation = validators.email(email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    }

    // Validate password
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
    onSubmit({ name, email, password });
  };

  // Handle success - clear form
  const handleSuccess = () => {
    setName('');
    setEmail('');
    setPassword('');
    setErrors({});
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-sm mb-3">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Create New Driver</h3>
        <p className="text-gray-600 text-sm">Add a new driver to your fleet management system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name input field */}
        <div className="space-y-4">
          <Input
            label="Driver Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter driver's full name"
            error={errors.name}
            className="focus:shadow-lg focus:shadow-blue-500/10"
          />

          {/* Email input field */}
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="driver@example.com"
            error={errors.email}
            className="focus:shadow-lg focus:shadow-blue-500/10"
          />

          {/* Password input field */}
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a secure password"
            error={errors.password}
            className="focus:shadow-lg focus:shadow-blue-500/10"
          />
        </div>

        {/* Password requirements hint */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Password Requirements:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Minimum 8 characters
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              At least one uppercase letter
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              At least one number
            </li>
          </ul>
        </div>

        {/* Server error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700 font-medium text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-4 pt-2">
          <Button 
            type="submit" 
            disabled={isLoading}
            variant="success"
            className="w-full py-3.5 text-base font-semibold shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating Driver...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Driver Account</span>
              </div>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center pt-2">
            The driver will receive login credentials via email
          </p>
        </div>
      </form>
    </div>
  );
}