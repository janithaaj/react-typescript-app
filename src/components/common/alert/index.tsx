import type { ReactNode } from 'react';

type AlertType = 'error' | 'success' | 'info' | 'warning';
type AlertVariant = 'default' | 'bordered';

interface AlertProps {
  type: AlertType;
  message: string;
  variant?: AlertVariant;
  onClose?: () => void;
  className?: string;
  icon?: ReactNode;
}

const Alert = ({
  type,
  message,
  variant = 'default',
  onClose,
  className = '',
  icon,
}: AlertProps) => {
  const typeStyles = {
    error: {
      default:
        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
      bordered:
        'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 text-red-800 dark:text-red-200',
    },
    success: {
      default:
        'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
      bordered:
        'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-500 text-green-800 dark:text-green-200',
    },
    info: {
      default:
        'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
      bordered:
        'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 text-blue-800 dark:text-blue-200',
    },
    warning: {
      default:
        'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
      bordered:
        'bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-500 text-amber-800 dark:text-amber-200',
    },
  };

  const defaultIcons = {
    error: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    success: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    info: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  };

  const styles = typeStyles[type][variant];
  const borderClass =
    variant === 'default' ? 'border rounded-md' : 'border-l-4 rounded-r-lg';
  const displayIcon = icon || defaultIcons[type];

  return (
    <div className={`${styles} ${borderClass} p-4 ${className}`} role="alert">
      <div className="flex items-start gap-3">
        {displayIcon && (
          <div className="flex-shrink-0 mt-0.5">{displayIcon}</div>
        )}
        <div className="flex-1">
          <p className="text-base">{message}</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Close alert"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
