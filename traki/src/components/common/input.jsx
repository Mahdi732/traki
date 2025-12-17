export function Input({ 
  type = 'text', 
  placeholder = '', 
  value = '', 
  onChange, 
  disabled = false,
  className = '',
  label = '',
  error = ''
}) {
  const baseStyles = `
    w-full px-4 py-3
    rounded-xl
    border-2
    bg-white/95
    text-gray-900
    placeholder:text-gray-400
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-4 focus:ring-offset-2
    disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
  `;
  
  const borderColor = error 
    ? 'border-red-400 hover:border-red-500 focus:border-red-500 focus:ring-red-200' 
    : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-100';

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold text-gray-700 tracking-tight flex items-center gap-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          ${baseStyles} 
          ${borderColor} 
          ${className}
          ${error ? 'pr-10' : ''}
          shadow-sm
        `}
      />
      {error && (
        <div className="flex items-center gap-1 mt-1">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-red-600 font-medium">{error}</span>
        </div>
      )}
    </div>
  );
}