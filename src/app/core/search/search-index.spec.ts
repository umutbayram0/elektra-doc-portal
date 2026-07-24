import { buildSearchIndex } from './search-index';
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
      { title: 'Authentication', description: 'Auth description', path: 'modules/auth', section: 'Modules' },
      { title: 'Route Guards', description: 'Guards description', path: 'modules/auth/guards', section: 'Modules' }
    ]);
  });

  it('handles a section with no nodes', () => {
    expect(buildSearchIndex([{ label: 'Overview', basePath: 'overview', nodes: [] }])).toEqual([]);
  });
});
