import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ThemeToggle, Input, Button } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { getAuthErrorMessage } from '../../services/auth';
import type { AuthError } from 'firebase/auth';
import backgroundImage from '../../assets/background.jpg';

/**
 * Login page component.
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Sign up validation
    if (isSignUp) {
      if (!confirmPassword.trim()) {
        setError('Please confirm your password.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(email.trim(), password);
        setSuccessMessage('Account created successfully! Redirecting...');
      } else {
        await signIn(email.trim(), password);
        setSuccessMessage('Sign in successful! Redirecting...');
      }
      // Navigation will happen via useEffect when user state updates
    } catch (err) {
      const authError = err as AuthError;
      setError(getAuthErrorMessage(authError));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setError(null);
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
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
            <h2 className="text-center text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </h2>
            <p className="mt-4 text-center text-base text-slate-600 dark:text-slate-300">
              {isSignUp
                ? 'Already have an account? '
                : "Don't have an account? "}
              <button
                type="button"
                onClick={handleToggleMode}
                className="font-medium text-slate-700 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-200 transition-colors underline"
              >
                {isSignUp ? 'Sign in' : 'Create a new account'}
              </button>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div
                className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4"
                role="alert"
              >
                <p className="text-base text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            )}

            {successMessage && (
              <div
                className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4"
                role="alert"
              >
                <p className="text-base text-green-800 dark:text-green-200">
                  {successMessage}
                </p>
              </div>
            )}

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
                error={error && error.includes('email') ? error : undefined}
                className="rounded-md bg-white dark:bg-slate-800 text-base py-3"
              />
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                error={error && error.includes('password') ? error : undefined}
                className="rounded-md bg-white dark:bg-slate-800 text-base py-3"
              />
              {isSignUp && (
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm Password"
                  error={error && error.includes('match') ? error : undefined}
                  className="rounded-md bg-white dark:bg-slate-800 text-base py-3"
                />
              )}
            </div>

            {!isSignUp && (
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
            )}

            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 text-white"
              >
                {isSignUp ? 'Create Account' : 'Sign in'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
