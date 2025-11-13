type SpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  message?: string;
  fullScreen?: boolean;
  className?: string;
  spinnerClassName?: string;
}

const LoadingSpinner = ({
  size = 'md',
  message = 'Loading...',
  fullScreen = false,
  className = '',
  spinnerClassName = '',
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-10 w-10 border-3',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const getSpinnerClasses = () => {
    const baseClasses = `inline-block animate-spin rounded-full ${sizeClasses[size]}`;
    if (spinnerClassName) {
      return `${baseClasses} ${spinnerClassName}`;
    }
    if (size === 'lg') {
      return `${baseClasses} border-blue-600 border-t-transparent dark:border-blue-400`;
    }
    return `${baseClasses} border-slate-700 dark:border-slate-300`;
  };

  const spinner = <div className={getSpinnerClasses()} />;

  const content = (
    <div className={`text-center ${className}`}>
      {spinner}
      {message && (
        <p
          className={`mt-4 text-slate-600 dark:text-slate-400 ${textSizeClasses[size]}`}
        >
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
