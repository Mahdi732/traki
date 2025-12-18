import { CreateDriverForm } from '../auth/CreateDriverForm.jsx';
import { Button } from '../common/button.jsx';

// Simple DriverCreationSection - handles driver creation UI
export function DriverCreationSection({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading, 
  error, 
  successMessage 
}) {
  if (!isOpen) return null;

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-6 mt-6">
      {/* Header with close button */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Create Driver Account</h2>
            <p className="text-gray-500 text-sm mt-1">Add a new driver to your fleet management system</p>
          </div>
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close form"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-sage/10 border border-sage/20 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-sage" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{successMessage}</p>
              <p className="text-xs text-gray-600 mt-1">The driver can now log in with their credentials</p>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && !successMessage && (
        <div className="mb-6 p-4 bg-terracotta/10 border border-terracotta/20 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-terracotta/20 flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-terracotta" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Driver creation form */}
      <div className="mb-6">
        <CreateDriverForm 
          onSubmit={onSubmit}
          isLoading={isLoading}
          error={error}
          onSuccess={() => {}}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-5 border-t border-gray-200">
        <Button 
          onClick={onClose}
          variant="secondary"
          className="flex-1 py-2.5 text-sm"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Cancel</span>
          </div>
        </Button>
        
        <Button 
          type="submit"
          form="create-driver-form"
          variant="primary"
          className="flex-1 py-2.5 text-sm"
          disabled={isLoading}
        >
          <div className="flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Driver</span>
              </>
            )}
          </div>
        </Button>
      </div>

      {/* Note */}
      <div className="mt-5 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          The driver will receive an email with their login credentials and setup instructions.
        </p>
      </div>
    </div>
  );
}