import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ThemeToggle, Input, Button } from '../../components';
import backgroundImage from '../../assets/background.jpg';

/**
 * Login page component.
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to home after successful login
      navigate('/');
    }, 1000);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="min-h-screen flex transition-colors duration-300">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Background image section */}
      <div
        className="hidden lg:flex lg:w-2/3 bg-slate-200 dark:bg-slate-800 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      ></div>

      {/* Form section */}
      <div className="w-full lg:w-1/3 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-center text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
              Sign in to your account
            </h2>
            <p className="mt-4 text-center text-base text-slate-600 dark:text-slate-300">
              Or{' '}
              <a
                href="#"
                className="font-medium text-slate-700 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-200 transition-colors"
              >
                create a new account
              </a>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-lg shadow-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 md:p-8 border border-slate-200 dark:border-slate-700 space-y-4">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleEmailChange}
                placeholder="Email address"
                className="rounded-md bg-white dark:bg-slate-800 text-base py-3"
              />
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                className="rounded-md bg-white dark:bg-slate-800 text-base py-3"
              />
            </div>

            <div className="flex items-center justify-between">
              <Input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                label="Remember me"
              />

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-slate-700 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-200 transition-colors"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 text-white"
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
