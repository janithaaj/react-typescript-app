import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  type DocumentData,
} from 'firebase/firestore';
import { getDb } from './firestore';
import type { Diagram } from '../types/diagram';

const DIAGRAMS_COLLECTION = 'diagrams';

export const createDiagram = async (diagram: Diagram): Promise<void> => {
  try {
    const db = getDb();
    const diagramRef = doc(db, DIAGRAMS_COLLECTION, diagram.id);

    const diagramDoc: Record<string, unknown> = {
      id: diagram.id,
      title: diagram.title,
      nodes: diagram.nodes,
      edges: diagram.edges,
      createdBy: diagram.createdBy,
      createdAt: Timestamp.fromDate(
        diagram.createdAt instanceof Date
          ? diagram.createdAt
          : new Date(diagram.createdAt)
      ),
      updatedAt: Timestamp.fromDate(
        diagram.updatedAt instanceof Date
          ? diagram.updatedAt
          : new Date(diagram.updatedAt)
      ),
      updatedBy: diagram.updatedBy,
    };

    await setDoc(diagramRef, diagramDoc);
  } catch (error) {
    console.error('Error creating diagram:', error);
    throw error;
  }
};

export const getDiagram = async (
  diagramId: string
): Promise<Diagram | null> => {
  try {
    const db = getDb();
    const diagramRef = doc(db, DIAGRAMS_COLLECTION, diagramId);
    const diagramSnap = await getDoc(diagramRef);

    if (diagramSnap.exists()) {
      const data = diagramSnap.data() as DocumentData;
      return {
        id: data.id,
        title: data.title,
        nodes: data.nodes || [],
        edges: data.edges || [],
        createdBy: data.createdBy,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        updatedBy: data.updatedBy,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting diagram:', error);
    throw error;
  }
};

export const updateDiagram = async (
  diagramId: string,
  updates: Partial<Diagram>
): Promise<void> => {
  try {
    const db = getDb();
    const diagramRef = doc(db, DIAGRAMS_COLLECTION, diagramId);

    const updateData: Record<string, unknown> = { ...updates };

    if (updateData.createdAt) {
      const createdAt = updateData.createdAt;
      updateData.createdAt = Timestamp.fromDate(
        createdAt instanceof Date
          ? createdAt
          : new Date(createdAt as string | number | Date)
      );
    }

    if (updateData.updatedAt) {
      const updatedAt = updateData.updatedAt;
      updateData.updatedAt = Timestamp.fromDate(
        updatedAt instanceof Date
          ? updatedAt
          : new Date(updatedAt as string | number | Date)
      );
    } else {
      updateData.updatedAt = Timestamp.now();
    }

    delete updateData.id;

    await updateDoc(diagramRef, updateData);
  } catch (error) {
    console.error('Error updating diagram:', error);
    throw error;
  }
};

export const deleteDiagram = async (diagramId: string): Promise<void> => {
  try {
    const db = getDb();
    const diagramRef = doc(db, DIAGRAMS_COLLECTION, diagramId);
    await deleteDoc(diagramRef);
  } catch (error) {
    console.error('Error deleting diagram:', error);
    throw error;
  }
};

export const getUserDiagrams = async (userId: string): Promise<Diagram[]> => {
  try {
    const db = getDb();
    const diagramsRef = collection(db, DIAGRAMS_COLLECTION);

    try {
      const q = query(
        diagramsRef,
        where('createdBy', '==', userId),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const diagrams: Diagram[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as DocumentData;
        diagrams.push({
          id: data.id || docSnap.id,
          title: data.title,
          nodes: data.nodes || [],
          edges: data.edges || [],
          createdBy: data.createdBy,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          updatedBy: data.updatedBy,
        });
      });

      return diagrams;
    } catch (indexError: unknown) {
      const error = indexError as { code?: string; message?: string };
      if (
        error?.code === 'failed-precondition' ||
        error?.message?.includes('index')
      ) {
        console.warn(
          'Composite index not found. Using fallback query with in-memory sorting.'
        );
        const q = query(diagramsRef, where('createdBy', '==', userId));

        const querySnapshot = await getDocs(q);
        const diagrams: Diagram[] = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data() as DocumentData;
          diagrams.push({
            id: data.id || docSnap.id,
            title: data.title,
            nodes: data.nodes || [],
            edges: data.edges || [],
            createdBy: data.createdBy,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            updatedBy: data.updatedBy,
          });
        });

        diagrams.sort((a, b) => {
          const aTime = a.updatedAt.getTime();
          const bTime = b.updatedAt.getTime();
          return bTime - aTime;
        });

        return diagrams;
      }
      throw indexError;
    }
  } catch (error) {
    console.error('Error getting user diagrams:', error);
    throw error;
  }
};

export const getAllDiagrams = async (): Promise<Diagram[]> => {
  try {
    const db = getDb();
    const diagramsRef = collection(db, DIAGRAMS_COLLECTION);
    const q = query(diagramsRef, orderBy('updatedAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const diagrams: Diagram[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as DocumentData;
      diagrams.push({
        id: data.id || docSnap.id,
        title: data.title,
        nodes: data.nodes || [],
        edges: data.edges || [],
        createdBy: data.createdBy,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        updatedBy: data.updatedBy,
      });
    });

    return diagrams;
  } catch (error) {
    console.error('Error getting all diagrams:', error);
    throw error;
  }
};
