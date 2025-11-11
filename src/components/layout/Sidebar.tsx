import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import type { ReactNode } from 'react';

interface SidebarItem {
  path: string;
  label: string;
  icon?: ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
}

/**
 * Sidebar component for admin dashboard with collapse/expand.
 */
const Sidebar = ({ items }: SidebarProps) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <aside
      className={`bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 min-h-screen transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Admin Dashboard
            </h2>
          )}
          <button
            type="button"
            onClick={handleToggle}
            className="ml-auto p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            )}
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {item.icon && (
                      <span className={isCollapsed ? '' : 'mr-3'}>
                        {item.icon}
                      </span>
                    )}
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
