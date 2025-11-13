import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DashboardLayout } from '../../components/layout';
import { useAuth } from '../../hooks/useAuth';
import { useIsEditor } from '../../hooks/useRole';
import { Button, LoadingSpinner } from '../../components';
import {
  getUserDiagrams,
  getAllDiagrams,
  deleteDiagram,
} from '../../services/diagrams';
import { useDiagrams } from '../../context/DiagramsContext';
import type { Diagram } from '../../types/diagram';

/**
 * Dashboard page component.
 */
const Dashboard = () => {
  const { user, userRole } = useAuth();
  const isEditor = useIsEditor();
  const navigate = useNavigate();
  const { refreshDiagrams } = useDiagrams();
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [isLoadingDiagrams, setIsLoadingDiagrams] = useState(true);

  const sidebarItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    const loadDiagrams = async () => {
      if (!user) return;

      try {
        setIsLoadingDiagrams(true);
        // Editors see their own diagrams, viewers see all diagrams
        const loadedDiagrams = isEditor
          ? await getUserDiagrams(user.uid)
          : await getAllDiagrams();
        setDiagrams(loadedDiagrams);
      } catch (error) {
        console.error('Error loading diagrams:', error);
      } finally {
        setIsLoadingDiagrams(false);
      }
    };

    loadDiagrams();
  }, [user, isEditor]);

  const handleCreateDiagram = () => {
    navigate('/diagram/new');
  };

  const handleViewDiagram = (diagramId: string) => {
    navigate(`/diagram/${diagramId}`);
  };

  const handleEditDiagram = (diagramId: string) => {
    if (isEditor) {
      navigate(`/diagram/${diagramId}`);
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
      setDiagrams((prev) => prev.filter((d) => d.id !== diagramId));
      await refreshDiagrams(); // Refresh sidebar diagram list
    } catch (error) {
      console.error('Error deleting diagram:', error);
      alert('Failed to delete diagram. Please try again.');
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="w-full max-w-9xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
              Dashboard
            </h1>
            {userRole && (
              <span className="px-3 py-1.5 text-sm font-semibold rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                {userRole.toUpperCase()}
              </span>
            )}
          </div>
          <p className="text-base text-slate-600 dark:text-slate-400">
            {isEditor
              ? 'Manage and create your diagrams'
              : 'Browse and view available diagrams'}
          </p>
        </div>

        {/* Diagrams Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              {isEditor ? 'My Diagrams' : 'All Diagrams'}
            </h2>
            {isEditor && diagrams.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateDiagram}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-blue-500 dark:hover:bg-blue-600"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Diagram
              </Button>
            )}
          </div>
          {isLoadingDiagrams ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <LoadingSpinner
                size="lg"
                message="Loading diagrams..."
                spinnerClassName="border-blue-600 border-t-transparent dark:border-blue-400"
              />
            </div>
          ) : diagrams.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-slate-400 dark:text-slate-500"
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
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  No diagrams yet
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-400 mb-6">
                  {isEditor
                    ? 'Get started by creating your first diagram. Click the button below to begin.'
                    : 'There are no diagrams available to view at the moment.'}
                </p>
                {isEditor && (
                  <Button
                    variant="primary"
                    onClick={handleCreateDiagram}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create Your First Diagram
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {diagrams.map((diagram) => (
                <div
                  key={diagram.id}
                  className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 cursor-pointer overflow-hidden"
                  onClick={() => handleViewDiagram(diagram.id)}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate mb-2">
                          {diagram.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Updated{' '}
                          {new Date(diagram.updatedAt).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                      {isEditor && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteDiagram(diagram.id, e)}
                          className="ml-2 p-1.5 rounded-md text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Delete diagram"
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

                    <div className="flex items-center gap-4 mb-4 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="font-medium">
                          {diagram.nodes.length}
                        </span>
                        <span>nodes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
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
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        <span className="font-medium">
                          {diagram.edges.length}
                        </span>
                        <span>edges</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDiagram(diagram.id);
                        }}
                      >
                        View
                      </Button>
                      {isEditor && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditDiagram(diagram.id);
                          }}
                          className="flex-1 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
