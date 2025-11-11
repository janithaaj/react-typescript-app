import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import Sidebar from '../../components/layout/Sidebar';
import ThemeToggle from '../../components/common/theme-toggle';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components';

interface SidebarItem {
  path: string;
  label: string;
  icon?: ReactNode;
}

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarItems: SidebarItem[];
}

/**
 * Dashboard layout component with sidebar and content area.
 */
const DashboardLayout = ({ children, sidebarItems }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {user && (
          <div className="text-sm text-slate-600 dark:text-slate-300 hidden sm:block">
            {user.email}
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="text-xs"
        >
          Sign Out
        </Button>
        <ThemeToggle />
      </div>

      <div className="flex">
        <Sidebar items={sidebarItems} />

        <main className="flex-1 p-6 lg:p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen">
          <div className="mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
