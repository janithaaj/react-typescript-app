import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router';
import { Button } from '../../components';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = 'An unexpected error occurred';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-red-500 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {errorStatus === 404 ? '404' : 'Error'}
          </h1>
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            {errorStatus === 404 ? 'Page Not Found' : 'Something went wrong'}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mb-8">
            {errorMessage}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/dashboard')}
            className="bg-slate-900 hover:bg-slate-800 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-slate-300 dark:border-slate-600"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
