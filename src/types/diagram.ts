import type { Node, Edge } from 'reactflow';
import type { Timestamp } from 'firebase/firestore';

export interface Diagram {
  id: string;
  title: string;
  nodes: Node[];
  edges: Edge[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
}

export interface DiagramDocument {
  id: string;
  title: string;
  nodes: Node[];
  edges: Edge[];
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  updatedBy: string;
}
