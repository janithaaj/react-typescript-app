import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import Sidebar from './Sidebar';
import ThemeToggle from '../common/theme-toggle';
import { useAuth } from '../../hooks/useAuth';
import { useDiagrams } from '../../context/DiagramsContext';

interface SidebarItem {
  path: string;
  label: string;
  icon?: ReactNode;
}

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarItems: SidebarItem[];
}

const DashboardLayout = ({ children, sidebarItems }: DashboardLayoutProps) => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const { diagrams } = useDiagrams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-slate-700 dark:text-slate-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div className="flex">
        <Sidebar
          items={sidebarItems}
          userEmail={user?.email || null}
          userRole={userRole}
          onSignOut={handleSignOut}
          diagrams={diagrams}
          isMobileOpen={isSidebarOpen}
          onMobileClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 xl:p-10 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen">
          <div className="relative h-full">
            <div className="relative flex justify-end mb-4">
              <ThemeToggle />
            </div>
            <div className="h-full">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
