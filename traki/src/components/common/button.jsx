export function Button({ 
  children, 
  onClick, 
  disabled = false, 
  className = '',
  type = 'button',
  variant = 'primary'
}) {
  const baseStyles = `
    w-1/2 px-6 py-3 
    rounded-xl 
    font-semibold 
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-4 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50
    active:scale-[0.98]
  `;
  
  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 
      text-white 
      hover:from-blue-700 hover:to-blue-800 
      hover:shadow-lg hover:shadow-blue-500/30
      focus:ring-blue-400/40 focus:ring-offset-white
      border border-blue-700/30
    `,
    secondary: `
      bg-gradient-to-r from-gray-100 to-gray-200 
      text-gray-800 
      hover:from-gray-200 hover:to-gray-300
      hover:shadow-lg hover:shadow-gray-400/20
      focus:ring-gray-300/40 focus:ring-offset-white
      border border-gray-300/50
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700 
      text-white 
      hover:from-red-700 hover:to-red-800 
      hover:shadow-lg hover:shadow-red-500/30
      focus:ring-red-400/40 focus:ring-offset-white
      border border-red-700/30
    `,
    success: `
      bg-gradient-to-r from-emerald-600 to-emerald-700 
      text-white 
      hover:from-emerald-700 hover:to-emerald-800 
      hover:shadow-lg hover:shadow-emerald-500/30
      focus:ring-emerald-400/40 focus:ring-offset-white
      border border-emerald-700/30
    `,
    outline: `
      bg-transparent
      text-blue-700
      border-2 border-blue-600/50
      hover:bg-blue-50 hover:border-blue-700
      hover:shadow-md hover:shadow-blue-500/10
      focus:ring-blue-400/30 focus:ring-offset-white
    `
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles} 
        ${variants[variant] || variants.primary} 
        ${className}
      `}
    >
      {children}
    </button>
  );
}