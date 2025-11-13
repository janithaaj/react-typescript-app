import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import type { ReactNode } from 'react';
import Button from '../common/button';
import { deleteDiagram } from '../../services/diagrams';
import { useDiagrams } from '../../context/DiagramsContext';
import { useIsEditor } from '../../hooks/useRole';
import type { Diagram } from '../../types/diagram';

interface SidebarItem {
  path: string;
  label: string;
  icon?: ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  userEmail?: string | null;
  userRole?: string | null;
  onSignOut?: () => void;
  diagrams?: Diagram[];
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

/**
 * Sidebar component for admin dashboard with collapse/expand.
 */
const Sidebar = ({
  items,
  userEmail,
  userRole,
  onSignOut,
  diagrams = [],
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(5);
  const itemsPerPage = 5;
  const { refreshDiagrams } = useDiagrams();
  const isEditor = useIsEditor();

  const handleToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Show first N items
  const displayedDiagrams = useMemo(() => {
    return diagrams.slice(0, displayedCount);
  }, [diagrams, displayedCount]);

  const hasMore = displayedCount < diagrams.length;

  // Reset displayed count when diagrams change
  useEffect(() => {
    setDisplayedCount(5);
  }, [diagrams.length]);

  // Handle load more button click
  const handleLoadMore = () => {
    setDisplayedCount((prev) => Math.min(prev + itemsPerPage, diagrams.length));
  };

  const handleDiagramClick = (diagramId: string) => {
    navigate(`/diagram/${diagramId}`);
    // Close mobile sidebar when navigating
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const handleDeleteDiagram = async (
    diagramId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (
      !isEditor ||
      !window.confirm('Are you sure you want to delete this diagram?')
    ) {
      return;
    }

    try {
      await deleteDiagram(diagramId);
      await refreshDiagrams();
      // If we're currently viewing the deleted diagram, navigate to dashboard
      if (location.pathname === `/diagram/${diagramId}`) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error deleting diagram:', error);
      alert('Failed to delete diagram. Please try again.');
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed lg:static bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-screen transition-all duration-300 flex flex-col shadow-sm z-50 ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full relative">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            {!isCollapsed && (
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Diagram Editor
              </h2>
            )}
            {/* Mobile close button */}
            {!isCollapsed && onMobileClose && (
              <button
                type="button"
                onClick={onMobileClose}
                className="lg:hidden p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="Close menu"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleToggle}
            className="hidden lg:flex absolute top-5 -right-3 bg-white dark:bg-slate-800 dark:border-slate-600 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all duration-200 !outline-none !hover:outline-none !focus:outline-none !active:outline-none items-center justify-center z-10 !w-[25px] !h-[25px] !rounded-full !p-[0px]"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            )}
          </button>

          <nav className="flex-1 p-3 overflow-y-auto">
            <ul className="space-y-1">
              {items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => {
                        // Close mobile sidebar when navigating
                        if (onMobileClose) {
                          onMobileClose();
                        }
                      }}
                      className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold border-l-4 border-blue-600 dark:border-blue-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
                      } ${isCollapsed ? 'justify-center px-2' : ''}`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      {item.icon && (
                        <span
                          className={`${isCollapsed ? '' : 'mr-3'} flex-shrink-0`}
                        >
                          {item.icon}
                        </span>
                      )}
                      {!isCollapsed && (
                        <span className="text-sm">{item.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Diagrams List */}
            {!isCollapsed && diagrams.length > 0 && (
              <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                <h3 className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Recent Diagrams
                </h3>
                <ul className="space-y-1">
                  {displayedDiagrams.map((diagram) => {
                    const isActive =
                      location.pathname === `/diagram/${diagram.id}`;
                    return (
                      <li key={diagram.id}>
                        <div
                          className={`group flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium border-l-4 border-blue-600 dark:border-blue-400'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleDiagramClick(diagram.id)}
                            className="flex-1 text-left flex items-center min-w-0 hover:outline-none focus:outline-none active:outline-none"
                            title={diagram.title}
                          >
                            <svg
                              className="w-4 h-4 mr-2.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="truncate text-sm">
                              {diagram.title}
                            </span>
                          </button>
                          {isEditor && (
                            <button
                              type="button"
                              onClick={(e) =>
                                handleDeleteDiagram(diagram.id, e)
                              }
                              className="ml-2 p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors hover:outline-none focus:outline-none active:outline-none"
                              aria-label={`Delete ${diagram.title}`}
                              title="Delete diagram"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Load More text - show if there are more items */}
                {hasMore && (
                  <div className="mt-3 text-center">
                    <a
                      onClick={handleLoadMore}
                      className="text-xs text-[#1a1a1a] dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer transition-colors hover:outline-none focus:outline-none active:outline-none bg-transparent border-none p-0"
                    >
                      Load More
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Collapsed view - show diagram count */}
            {isCollapsed && diagrams.length > 0 && (
              <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-center">
                <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    {diagrams.length}
                  </div>
                  <div className="text-[10px] mt-0.5">Diagrams</div>
                </div>
              </div>
            )}
          </nav>

          {/* User info and sign out at bottom */}
          {!isCollapsed && (userEmail || userRole || onSignOut) && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              {userEmail && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate mb-1">
                    {userEmail}
                  </div>
                  {userRole && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                        {userRole}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {onSignOut && (
                <Button
                  type="button"
                  // variant="outline"
                  size="sm"
                  onClick={onSignOut}
                  className="w-full text-sm border-none dark:border-slate-600"
                >
                  Sign Out
                </Button>
              )}
            </div>
          )}

          {/* Collapsed view - just sign out icon */}
          {isCollapsed && onSignOut && (
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex justify-center bg-slate-50 dark:bg-slate-800/50">
              <button
                type="button"
                onClick={onSignOut}
                className="p-2 rounded-lg !border-none hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors hover:outline-none focus:outline-none active:outline-none"
                aria-label="Sign out"
                title="Sign out"
              >
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
