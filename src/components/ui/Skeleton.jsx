// src/components/ui/Skeleton.jsx
const Skeleton = ({ 
    className = '',
    variant = 'rect',
    ...props 
  }) => {
    const baseClass = 'animate-pulse bg-gray-200';
    
    const variants = {
      rect: 'rounded-lg',
      circle: 'rounded-full',
      text: 'rounded h-4',
    };
  
    return (
      <div
        className={`${baseClass} ${variants[variant] || variants.rect} ${className}`}
        {...props}
      />
    );
  };
  
  export default Skeleton;