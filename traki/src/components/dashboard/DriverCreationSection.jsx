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
    <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden p-8 mt-8 animate-fadeIn">
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -translate-x-12 -translate-y-12"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-emerald-500/5 to-transparent rounded-full translate-x-8 translate-y-8"></div>
      
      {/* Header with close button */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Driver Account</h2>
            <p className="text-gray-600 text-sm mt-1">Add a new driver to your fleet management system</p>
          </div>
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          aria-label="Close form"
        >
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="mb-8 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-emerald-800">{successMessage}</p>
              <p className="text-xs text-emerald-600 mt-1">The driver can now log in with their credentials.</p>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && !successMessage && (
        <div className="mb-8 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Driver creation form */}
      <div className="mb-8">
        <CreateDriverForm 
          onSubmit={onSubmit}
          isLoading={isLoading}
          error={error}
          onSuccess={() => {}}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-gray-200">
        <Button 
          onClick={onClose}
          variant="secondary"
          className="flex-1 py-3"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Cancel</span>
          </div>
        </Button>
        
        <Button 
          type="submit"
          form="create-driver-form"
          variant="success"
          className="flex-1 py-3"
          disabled={isLoading}
        >
          <div className="flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Driver</span>
              </>
            )}
          </div>
        </Button>
      </div>

      {/* Note */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          The driver will receive an email with their login credentials and setup instructions.
        </p>
      </div>

      {/* Add animation styles */}
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