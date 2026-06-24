// src/components/ui/Badge.jsx
const variants = {
    default: 'bg-gray-100 text-gray-700',
    gold: 'bg-brand-gold-50 text-brand-gold-600',
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700',
  };
  
  const Badge = ({ 
    children, 
    variant = 'default',
    className = '',
    ...props 
  }) => {
    return (
      <span
        className={`
          inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
          ${variants[variant] || variants.default}
          ${className}
        `}
        {...props}
      >
        {children}
      </span>
    );
  };
  
  export default Badge;