import type { DocNode } from '../../shared/doc-node.model';

export interface ProjectsContent {
  title: string;
  description: string;
  cards: DocNode[];
}
