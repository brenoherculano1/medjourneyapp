import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses: Record<string, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  outline: 'bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-50',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  secondary: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  default: 'bg-gray-200 text-gray-800',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  default: 'px-4 py-2 text-base',
};

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  leftIcon,
  rightIcon,
  loading = false,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const variantClass = variantClasses[variant] || variantClasses.default;
  const sizeClass = sizeClasses[size] || sizeClasses.default;
  return (
    <button
      className={`rounded font-semibold transition ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {loading ? 'Carregando...' : children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;