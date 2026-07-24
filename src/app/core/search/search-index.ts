import type { DocNode } from '../../shared/doc-node.model';
import type { SearchItem } from './search-item.model';

export interface SearchSection {
  label: string;
  basePath: string;
  nodes: DocNode[];
}

function flattenNodes(nodes: DocNode[], section: string, ancestorPath: string): SearchItem[] {
  const items: SearchItem[] = [];
  for (const node of nodes) {
    const path = `${ancestorPath}/${node.id}`;
    items.push({ title: node.title, description: node.description, path, section });
    if (node.children?.length) {
      items.push(...flattenNodes(node.children, section, path));
    }
  }
  return items;
}

export function buildSearchIndex(sections: SearchSection[]): SearchItem[] {
  return sections.flatMap(section => flattenNodes(section.nodes, section.label, section.basePath));
}

export interface SearchRootSection {
  label: string;
  basePath: string;
  description: string;
}

/**
 * One search item per section's own index page, so searching "API" or
 * "Components" finds the section root even when it has no cards yet.
 */
export function buildSectionRootItems(sections: SearchRootSection[]): SearchItem[] {
  return sections.map(section => ({
    title: section.label,
    description: section.description,
    path: section.basePath,
    section: section.label
  }));
}
