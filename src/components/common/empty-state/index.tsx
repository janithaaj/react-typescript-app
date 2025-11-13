import type { ReactNode } from 'react';
import Button from '../button';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: ReactNode;
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: EmptyStateAction;
  className?: string;
}

const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) => {
  const defaultIcon = (
    <svg
      className="w-8 h-8 text-slate-400 dark:text-slate-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center ${className}`}
    >
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
          {icon || defaultIcon}
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
          {title}
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-6">
          {description}
        </p>
        {action && (
          <Button
            variant={action.variant || 'primary'}
            onClick={action.onClick}
            className="inline-flex items-center gap-2"
          >
            {action.icon}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
