import { useNavigate } from 'react-router';
import { Button } from '../../components';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-slate-200 dark:text-slate-800 mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Page Not Found
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
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

export default NotFound;
