import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  headerActions,
  footer,
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 ${className}`}>
      {(title || headerActions) && (
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
              {title}
            </h3>
          )}
          {headerActions && (
            <div className="flex items-center space-x-4">
              {headerActions}
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">{children}</div>
      
      {footer && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;