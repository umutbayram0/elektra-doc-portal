import type { DocNode } from '../../shared/doc-node.model';

export interface ApiContent {
  title: string;
  description: string;
  cards: DocNode[];
}
