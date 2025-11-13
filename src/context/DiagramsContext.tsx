import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import { getUserDiagrams, getAllDiagrams } from '../services/diagrams';
import { useAuth } from '../hooks/useAuth';
import { useIsEditor } from '../hooks/useRole';
import type { Diagram } from '../types/diagram';

interface DiagramsContextType {
  diagrams: Diagram[];
  refreshDiagrams: () => Promise<void>;
  isLoading: boolean;
}

const DiagramsContext = createContext<DiagramsContextType | undefined>(
  undefined
);

interface DiagramsProviderProps {
  children: ReactNode;
}

/**
 * DiagramsProvider component that provides diagram data and refresh function.
 */
export const DiagramsProvider = ({ children }: DiagramsProviderProps) => {
  const { user } = useAuth();
  const isEditor = useIsEditor();
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshDiagrams = useCallback(async () => {
    if (!user) {
      setDiagrams([]);
      return;
    }

    try {
      setIsLoading(true);
      // Editors see their own diagrams, viewers see all diagrams
      const loadedDiagrams = isEditor
        ? await getUserDiagrams(user.uid)
        : await getAllDiagrams();
      setDiagrams(loadedDiagrams);
    } catch (error) {
      console.error('Error loading diagrams:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isEditor]);

  // Load diagrams on mount and when user changes
  useEffect(() => {
    refreshDiagrams();
  }, [refreshDiagrams]);

  return (
    <DiagramsContext.Provider value={{ diagrams, refreshDiagrams, isLoading }}>
      {children}
    </DiagramsContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useDiagrams = (): DiagramsContextType => {
  const context = useContext(DiagramsContext);
  if (context === undefined) {
    throw new Error('useDiagrams must be used within a DiagramsProvider');
  }
  return context;
};
