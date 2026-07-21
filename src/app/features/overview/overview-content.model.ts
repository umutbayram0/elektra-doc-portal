import type { DocNode } from '../../shared/doc-node.model';

export interface OverviewContent {
  title: string;
  description: string;
  purpose: string;
  cards: DocNode[];
}
