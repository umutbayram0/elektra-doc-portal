import type { DocNode } from '../../shared/doc-node.model';

export interface ModulesContent {
  title: string;
  description: string;
  cards: DocNode[];
}
