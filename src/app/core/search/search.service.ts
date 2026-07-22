import { Injectable, computed, signal } from '@angular/core';
import { buildSearchIndex } from './search-index';
import type { SearchItem } from './search-item.model';
import type { DocNode } from '../../shared/doc-node.model';

import gettingStartedContent from '../../features/getting-started/getting-started-content.json';
import guidesContent from '../../features/guides/guides-content.json';
import projectsContent from '../../features/projects/projects-content.json';
import modulesContent from '../../features/modules/modules-content.json';
import componentsContent from '../../features/components/components-content.json';
import apiContent from '../../features/api/api-content.json';
import librariesContent from '../../features/libraries/libraries-content.json';

const SEARCH_INDEX = buildSearchIndex([
  { label: 'Getting Started', basePath: 'getting-started', nodes: gettingStartedContent.cards as DocNode[] },
  { label: 'Guides', basePath: 'guides', nodes: guidesContent.cards as DocNode[] },
  { label: 'Projects', basePath: 'projects', nodes: projectsContent.cards as DocNode[] },
  { label: 'Modules', basePath: 'modules', nodes: modulesContent.cards as DocNode[] },
  { label: 'Components', basePath: 'components', nodes: componentsContent.cards as DocNode[] },
  { label: 'API', basePath: 'api', nodes: apiContent.cards as DocNode[] },
  { label: 'Libraries', basePath: 'libraries', nodes: librariesContent.cards as DocNode[] }
]);

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
      item => item.title.toLowerCase().includes(term) || item.description.toLowerCase().includes(term)
    ).slice(0, MAX_RESULTS);
  });
}
