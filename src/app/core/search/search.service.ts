import { Injectable, computed, signal } from '@angular/core';
import { buildSearchIndex, buildSectionRootItems } from './search-index';
import type { SearchItem } from './search-item.model';
import { DOCUMENTATION_SECTIONS } from '../documentation/section-registry';

const SEARCH_INDEX: SearchItem[] = [
  ...buildSectionRootItems(
    DOCUMENTATION_SECTIONS.map(s => ({
      label: s.label,
      basePath: s.basePath,
      description: s.content.description
    }))
  ),
  ...buildSearchIndex(
    DOCUMENTATION_SECTIONS.map(s => ({
      label: s.label,
      basePath: s.basePath,
      nodes: s.content.cards
    }))
  )
];

const MAX_RESULTS = 8;

@Injectable({ providedIn: 'root' })
export class SearchService {
  readonly query = signal('');

  readonly results = computed<SearchItem[]>(() => {
    const term = this.query().trim().toLowerCase();
    if (!term) {
      return [];
    }
    return SEARCH_INDEX.filter(
      item =>
        item.title.toLowerCase().includes(term) || item.description.toLowerCase().includes(term)
    ).slice(0, MAX_RESULTS);
  });
}
