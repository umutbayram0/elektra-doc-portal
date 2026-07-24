import { findNodePath } from '../../shared/find-node-path';
import type { DocNode } from '../../shared/doc-node.model';

// The id slug format is enforced by JSON Schema; this covers the cross-item rules schema can't.
export function findDuplicateSiblingIds(nodes: DocNode[], parentLabel = 'top level'): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const node of nodes) {
    if (seen.has(node.id)) {
      errors.push(`Duplicate id "${node.id}" under ${parentLabel}`);
    }
    seen.add(node.id);
  }
  for (const node of nodes) {
    if (node.children?.length) {
      errors.push(...findDuplicateSiblingIds(node.children, `"${node.id}"`));
    }
  }
  return errors;
}

export interface RelatedLinkSection {
  basePath: string;
  cards: DocNode[];
}

function collectRelatedLinks(nodes: DocNode[], fromPath: string): { path: string; from: string }[] {
  const links: { path: string; from: string }[] = [];
  for (const node of nodes) {
    const nodePath = `${fromPath}/${node.id}`;
    for (const related of node.related ?? []) {
      links.push({ path: related.path, from: nodePath });
    }
    if (node.children?.length) {
      links.push(...collectRelatedLinks(node.children, nodePath));
    }
  }
  return links;
}

export function findBrokenRelatedLinks(sections: RelatedLinkSection[]): string[] {
  const errors: string[] = [];
  for (const section of sections) {
    for (const link of collectRelatedLinks(section.cards, section.basePath)) {
      const [basePath, ...segments] = link.path.split('/');
      const target = sections.find(s => s.basePath === basePath);
      const resolved = target && segments.length ? findNodePath(target.cards, segments) : undefined;
      if (!resolved) {
        errors.push(`Broken related link "${link.path}" referenced from "${link.from}"`);
      }
    }
  }
  return errors;
}
