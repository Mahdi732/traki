export function Card({ children, className = '' }) {
  return (
    <div className={`
      w-full max-w-sm
      p-8
      bg-white
      rounded-3xl
      shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]
      border border-gray-100
      backdrop-blur-sm bg-white/95
      transition-all duration-500 ease-out
      hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.15)]
      hover:border-blue-100
      hover:scale-[1.01]
      hover:-translate-y-1
      ${className}
    `}>
      {children}
    </div>
  );
}