import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Reusable Input component.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const baseClasses =
      'appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200';
    const errorClasses = error
      ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 dark:border-gray-600';
    const roundedClasses = props.type === 'checkbox' ? 'rounded' : 'rounded-md';

    const inputClasses = `${baseClasses} ${errorClasses} ${roundedClasses} ${className}`;

    if (props.type === 'checkbox') {
      return (
        <div className="flex items-center">
          <input
            ref={ref}
            {...props}
            className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded ${className}`}
          />
          {label && (
            <label
              htmlFor={props.id}
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              {label}
            </label>
          )}
        </div>
      );
    }

    return (
      <div>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <input ref={ref} {...props} className={inputClasses} />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
