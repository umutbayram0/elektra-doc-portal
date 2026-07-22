import type { DocNode } from './doc-node.model';

export interface SectionContent {
  title: string;
  description: string;
  cards: DocNode[];
}
