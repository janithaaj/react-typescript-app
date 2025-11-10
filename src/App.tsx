import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { ThemeToggle } from './components';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="flex gap-8 mb-8">
          <a
            href="https://vite.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a
            href="https://react.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1 className="text-5xl font-bold mb-8 text-center">Vite + React</h1>
        <div className="card bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            count is {count}
          </button>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Edit{' '}
            <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
              src/App.tsx
            </code>{' '}
            and save to test HMR
          </p>
        </div>
        <p className="read-the-docs mt-8 text-gray-600 dark:text-gray-400 text-center">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  );
};

export default App;
