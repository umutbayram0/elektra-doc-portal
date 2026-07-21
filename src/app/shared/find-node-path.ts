import type { DocNode } from './doc-node.model';

export function findNodePath(nodes: DocNode[], segments: string[]): DocNode[] | undefined {
  const [id, ...rest] = segments;
  const match = nodes.find(node => node.id === id);
  if (!match) {
    return undefined;
  }
  if (!rest.length) {
    return [match];
  }
  const childPath = findNodePath(match.children ?? [], rest);
  return childPath ? [match, ...childPath] : undefined;
}
