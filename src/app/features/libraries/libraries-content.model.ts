import type { DocNode } from '../../shared/doc-node.model';

export interface LibrariesContent {
  title: string;
  description: string;
  cards: DocNode[];
}
