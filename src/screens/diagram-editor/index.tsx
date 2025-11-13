import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import ReactFlow, {
  type Node,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  Background,
  Controls,
  MiniMap,
  type NodeTypes,
  Handle,
  Position,
  type ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useAuth } from '../../hooks/useAuth';
import { useIsEditor } from '../../hooks/useRole';
import {
  getDiagram,
  createDiagram,
  updateDiagram,
} from '../../services/diagrams';
import { Button, Input } from '../../components';
import { DashboardLayout } from '../../components/layout';
import Toast from '../../components/common/toast';
import { useDiagrams } from '../../context/DiagramsContext';
import type { Diagram } from '../../types/diagram';

interface EditableNodeProps {
  data: {
    label?: string;
    id?: string;
    onLabelChange?: (nodeId: string, newLabel: string) => void;
  };
  selected?: boolean;
}

/**
 * Custom node component with editable label.
 */
const EditableNode = ({ data, selected }: EditableNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'Node');
  const isEditor = useIsEditor();

  // Sync label when data changes
  useEffect(() => {
    if (data.label) {
      setLabel(data.label);
    }
  }, [data.label]);

  const handleLabelChange = (newLabel: string) => {
    setLabel(newLabel);
    if (data.onLabelChange && data.id) {
      data.onLabelChange(data.id, newLabel);
    }
  };

  const handleDoubleClick = () => {
    if (isEditor && selected) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg bg-white dark:bg-slate-800 border-2 min-w-[140px] relative transition-all duration-200 ${
        selected
          ? 'border-blue-500 dark:border-blue-400 shadow-blue-200 dark:shadow-blue-900/50'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
      onDoubleClick={handleDoubleClick}
    >
      {/* Input handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500 dark:!bg-blue-400 !border-2 !border-white dark:!border-slate-800 hover:!bg-blue-600 dark:hover:!bg-blue-300 transition-colors"
      />

      {/* Output handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-emerald-500 dark:!bg-emerald-400 !border-2 !border-white dark:!border-slate-800 hover:!bg-emerald-600 dark:hover:!bg-emerald-300 transition-colors"
      />

      {/* Left handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500 dark:!bg-blue-400 !border-2 !border-white dark:!border-slate-800 hover:!bg-blue-600 dark:hover:!bg-blue-300 transition-colors"
      />

      {/* Right handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-emerald-500 dark:!bg-emerald-400 !border-2 !border-white dark:!border-slate-800 hover:!bg-emerald-600 dark:hover:!bg-emerald-300 transition-colors"
      />

      {isEditing && isEditor ? (
        <input
          type="text"
          value={label}
          onChange={(e) => handleLabelChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 text-base border-2 border-blue-500 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          autoFocus
        />
      ) : (
        <div className="text-base font-medium text-slate-800 dark:text-slate-100 break-words">
          {label}
        </div>
      )}
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: EditableNode,
};

/**
 * Diagram Editor page component.
 */
const DiagramEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditor = useIsEditor();
  const isNewDiagram = id === 'new';
  const { refreshDiagrams } = useDiagrams();

  const [title, setTitle] = useState('Untitled Diagram');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!isNewDiagram);
  const [showToast, setShowToast] = useState(false);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const handleLabelChange = useCallback(
    (nodeId: string, newLabel: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );
    },
    [setNodes]
  );

  // Load diagram if editing existing one
  useEffect(() => {
    if (!isNewDiagram && id && user) {
      const loadDiagram = async () => {
        try {
          const diagram = await getDiagram(id);
          if (diagram) {
            setTitle(diagram.title);
            // Ensure nodes have proper data structure with label handler
            const nodesWithHandlers = (diagram.nodes || []).map((node) => ({
              ...node,
              data: {
                ...node.data,
                id: node.id,
                label: node.data?.label || 'Node',
                onLabelChange: handleLabelChange,
              },
            }));
            setNodes(nodesWithHandlers);
            setEdges(diagram.edges || []);
            // Set zoom after nodes are loaded
            setTimeout(() => {
              if (reactFlowInstance.current && nodesWithHandlers.length > 0) {
                reactFlowInstance.current.fitView({
                  padding: 0.4,
                  maxZoom: 0.8,
                });
              }
            }, 200);
          } else {
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Error loading diagram:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadDiagram();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNewDiagram, user, navigate]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (isEditor) {
        setEdges((eds) => addEdge(params, eds));
      }
    },
    [isEditor, setEdges]
  );

  const handleAddNode = useCallback(() => {
    if (!isEditor) return;

    // Calculate center position or offset from existing nodes
    let x = 300;
    let y = 200;

    if (nodes.length > 0) {
      // Position new node to the right of the rightmost node
      const rightmostNode = nodes.reduce((prev, current) =>
        current.position.x > prev.position.x ? current : prev
      );
      x = rightmostNode.position.x + 250;
      y = rightmostNode.position.y;
    }

    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { x, y },
      data: {
        id: `node-${Date.now()}`,
        label: 'New Node',
        onLabelChange: handleLabelChange,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [isEditor, setNodes, handleLabelChange, nodes]);

  const handleSave = useCallback(async () => {
    if (!user || !isEditor) return;

    setIsSaving(true);
    try {
      // Clean nodes before saving (remove onLabelChange handler - not serializable)
      const cleanNodes = nodes.map((node) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { onLabelChange, ...cleanData } = node.data as Record<
          string,
          unknown
        >;
        return {
          ...node,
          data: cleanData,
        };
      });

      if (isNewDiagram) {
        const diagramId = `diagram-${Date.now()}`;
        const diagram: Diagram = {
          id: diagramId,
          title,
          nodes: cleanNodes,
          edges,
          createdBy: user.uid,
          createdAt: new Date(),
          updatedAt: new Date(),
          updatedBy: user.uid,
        };
        await createDiagram(diagram);
        await refreshDiagrams(); // Refresh sidebar diagram list
        setShowToast(true);
        // Navigate after a short delay to show the toast
        setTimeout(() => {
          navigate(`/diagram/${diagramId}`);
        }, 500);
      } else if (id) {
        const existingDiagram = await getDiagram(id);
        await updateDiagram(id, {
          title,
          nodes: cleanNodes,
          edges,
          updatedAt: new Date(),
          updatedBy: user.uid,
          createdBy: existingDiagram?.createdBy || user.uid,
          createdAt: existingDiagram?.createdAt || new Date(),
        });
        await refreshDiagrams(); // Refresh sidebar diagram list
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error saving diagram:', error);
      alert('Failed to save diagram. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [
    id,
    isNewDiagram,
    title,
    nodes,
    edges,
    user,
    navigate,
    isEditor,
    refreshDiagrams,
  ]);

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

  if (isLoading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700 dark:border-slate-300"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Loading diagram...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      {showToast && (
        <Toast
          message="Successfully saved the diagram"
          type="success"
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="h-[calc(100vh-8rem)] sm:h-[calc(100vh-6rem)] flex flex-col">
        {/* Header */}
        <div className="mb-6 space-y-4">
          {/* Top line: Theme toggle */}

          {/* Second line: Title and action buttons */}
          <div className="flex flex-col gap-4">
            <div className="flex-1 w-full">
              {isEditor ? (
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter diagram title..."
                  className="text-base sm:text-xl font-semibold border-2 focus:border-blue-500 dark:focus:border-blue-400 w-full"
                />
              ) : (
                <h1 className="text-xl sm:!text-[32px] font-semibold text-slate-800 dark:text-slate-100 break-words">
                  {title}
                </h1>
              )}
            </div>
            <div className="flex flex-wrap gap-2 w-full">
              {isEditor && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleAddNode}
                    className="flex items-center gap-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                    title="Add a new node to the diagram"
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
                    Add Node
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    isLoading={isSaving}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-blue-500 dark:hover:bg-blue-600"
                    title="Save your diagram"
                  >
                    {!isSaving && (
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                title="Go back to dashboard"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back
              </Button>
            </div>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1 border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 shadow-inner min-h-[400px] sm:min-h-[500px]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={isEditor ? onNodesChange : undefined}
            onEdgesChange={isEditor ? onEdgesChange : undefined}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            nodesDraggable={isEditor}
            nodesConnectable={isEditor}
            elementsSelectable={isEditor}
            defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
            minZoom={0.1}
            maxZoom={2}
            onInit={(instance) => {
              reactFlowInstance.current = instance;
              // Set initial zoom to be more zoomed out
              instance.setViewport({ x: 0, y: 0, zoom: 0.5 });
              // If there are nodes, fit view with padding for more zoom out
              if (nodes.length > 0) {
                setTimeout(() => {
                  instance.fitView({ padding: 0.4, maxZoom: 0.8 });
                }, 100);
              }
            }}
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>

        {!isEditor && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-500 rounded-r-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-base font-medium text-amber-800 dark:text-amber-200">
                  View-only mode
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1.5">
                  You can view diagrams but cannot create or edit them. Contact
                  an administrator to upgrade to editor.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Helpful hints for editors */}
        {isEditor && nodes.length === 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 rounded-r-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-base font-medium text-blue-800 dark:text-blue-200">
                  Getting started
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1.5">
                  Click "Add Node" to create your first node. Drag nodes to
                  reposition them. Connect nodes by dragging from the green
                  handles to blue handles. Double-click a node to edit its
                  label.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DiagramEditor;
