export function Card({ children, className = '' }) {
  return (
    <div className={`
      relative
      w-full
      p-6
      bg-white
      rounded-lg
      border border-gray-200
      shadow-xs
      transition-all duration-150 ease-out
      hover:shadow-sm
      group
      before:absolute before:inset-0 before:bg-gradient-to-br before:from-white before:to-gray-50 before:opacity-0 before:transition-opacity before:duration-200 before:hover:opacity-100
      ${className}
    `}>
      <div className="relative z-10">
        {children}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}