import { buildSearchIndex, buildSectionRootItems } from './search-index';
import type { DocNode } from '../../shared/doc-node.model';

describe('buildSearchIndex', () => {
  it('flattens nested nodes into search items', () => {
    const nodes: DocNode[] = [
      {
        id: 'auth',
        title: 'Authentication',
        description: 'Auth description',
        children: [{ id: 'guards', title: 'Route Guards', description: 'Guards description' }]
      }
    ];

    const index = buildSearchIndex([{ label: 'Modules', basePath: 'modules', nodes }]);

    expect(index).toEqual([
      {
        title: 'Authentication',
        description: 'Auth description',
        path: 'modules/auth',
        section: 'Modules'
      },
      {
        title: 'Route Guards',
        description: 'Guards description',
        path: 'modules/auth/guards',
        section: 'Modules'
      }
    ]);
  });

  it('handles a section with no nodes', () => {
    expect(buildSearchIndex([{ label: 'Overview', basePath: 'overview', nodes: [] }])).toEqual([]);
  });
});

describe('buildSectionRootItems', () => {
  it('creates one search item per section pointing at its own index page', () => {
    const items = buildSectionRootItems([
      { label: 'API', basePath: 'api', description: 'No content added yet.' },
      { label: 'Modules', basePath: 'modules', description: 'No content added yet.' }
    ]);

    expect(items).toEqual([
      { title: 'API', description: 'No content added yet.', path: 'api', section: 'API' },
      {
        title: 'Modules',
        description: 'No content added yet.',
        path: 'modules',
        section: 'Modules'
      }
    ]);
  });

  it('returns an empty array for no sections', () => {
    expect(buildSectionRootItems([])).toEqual([]);
  });
});
