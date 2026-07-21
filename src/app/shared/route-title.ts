import type { ActivatedRouteSnapshot } from '@angular/router';
import { findNodePath } from './find-node-path';
import type { DocNode } from './doc-node.model';

const SITE_NAME = 'Elektraweb Docs';

export function pageTitle(label: string): string {
  return `${label} — ${SITE_NAME}`;
}

export function nodeDetailTitle(route: ActivatedRouteSnapshot): string {
  const { cards } = route.data['content'] as { cards: DocNode[] };
  const nodePath = findNodePath(cards, route.url.map(segment => segment.path));
  const node = nodePath?.at(-1);
  return node ? pageTitle(node.title) : SITE_NAME;
}
