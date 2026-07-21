import type { DocNode } from '../../shared/doc-node.model';

export interface ComponentsContent {
  title: string;
  description: string;
  cards: DocNode[];
}
