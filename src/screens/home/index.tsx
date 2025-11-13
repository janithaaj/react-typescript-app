import { useNavigate } from 'react-router';
import { ThemeToggle, Button } from '../../components';

/**
 * Home page component - Single page web page.
 */
const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100">
            Diagram Editor
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Create, edit, and share beautiful diagrams with our powerful diagram
            editor
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Button
              variant="primary"
              size="lg"
              onClick={handleLoginClick}
              className="w-full sm:w-auto bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 text-white"
            >
              Login
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-slate-400 dark:border-slate-500 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Learn More
            </Button>
          </div>

          <div className="mt-12 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-100">
                Easy to Use
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Intuitive interface for creating professional diagrams quickly
              </p>
            </div>
            <div className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-100">
                Powerful Features
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Rich set of tools and shapes for all your diagramming needs
              </p>
            </div>
            <div className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-100">
                Collaborate
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Share and collaborate on diagrams with your team
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
