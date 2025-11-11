import type { ReactNode } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import ThemeToggle from '../../components/common/theme-toggle';

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
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="fixed top-4 right-4 z-50">
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
