import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  className?: string;
  headerActions?: ReactNode;
  hoverable?: boolean;
  border?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  headerActions,
  hoverable = false,
  border = false,
}) => {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm overflow-hidden 
        ${hoverable ? 'hover:shadow-md transition-shadow duration-200' : ''} 
        ${border ? 'border border-gray-200' : ''} 
        ${className}
      `}
    >
      {(title || subtitle || headerActions) && (
        <div className="px-6 py-4 flex justify-between items-start border-b border-gray-100">
          <div>
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {headerActions && (
            <div className="ml-4">{headerActions}</div>
          )}
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;