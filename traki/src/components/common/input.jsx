export function Input({ 
  type = 'text', 
  placeholder = '', 
  value = '', 
  onChange, 
  disabled = false,
  className = '',
  label = '',
  error = '',
  icon: Icon,
  iconPosition = 'left'
}) {
  const baseStyles = `
    w-full px-4 py-2.5
    rounded-md
    border
    bg-white
    text-gray-900
    placeholder:text-gray-400
    transition-all duration-150 ease-out
    focus:outline-none focus:ring-1 focus:ring-offset-0
    disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
    disabled:border-gray-200
    appearance-none
  `;
  
  const borderColor = error 
    ? 'border-terracotta/60 focus:border-terracotta focus:ring-terracotta/10' 
    : 'border-gray-200 hover:border-gray-300 focus:border-cerulean focus:ring-cerulean/10';

  const iconPadding = Icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
          <span>{label}</span>
          {error && (
            <span className="text-xs text-terracotta font-normal">{error}</span>
          )}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
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
            ${iconPadding}
            ${className}
            ${error && !label ? 'pr-10' : ''}
          `}
        />
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        {error && !label && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-4 h-4 text-terracotta" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}