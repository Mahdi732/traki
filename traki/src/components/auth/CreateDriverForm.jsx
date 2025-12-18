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
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-lg mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Create New Driver</h3>
        <p className="text-gray-600 text-sm">Add a new driver to your fleet management system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name input field */}
        <div className="space-y-5">
          <Input
            label="Driver Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter driver's full name"
            error={errors.name}
          />

          {/* Email input field */}
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="driver@example.com"
            error={errors.email}
          />

          {/* Password input field */}
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a secure password"
            error={errors.password}
          />
        </div>

        {/* Password requirements hint */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Password Requirements</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-sage/20 flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-sage" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs text-gray-600">8+ characters</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-sage/20 flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-sage" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs text-gray-600">Uppercase letter</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-sage/20 flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-sage" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs text-gray-600">At least one number</span>
            </div>
          </div>
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

        {/* Action buttons */}
        <div className="space-y-4 pt-2">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 text-sm font-medium"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating Driver...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Driver Account</span>
              </div>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center pt-1">
            The driver will receive login credentials via email
          </p>
        </div>
      </form>
    </div>
  );
}