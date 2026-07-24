import { findDuplicateSiblingIds, findBrokenRelatedLinks } from './semantic-validation';
import type { DocNode } from '../../shared/doc-node.model';

describe('findDuplicateSiblingIds', () => {
  it('returns no errors when all sibling ids are unique', () => {
    const nodes: DocNode[] = [
      { id: 'a', title: 'A', description: 'A' },
      {
        id: 'b',
        title: 'B',
        description: 'B',
        children: [{ id: 'c', title: 'C', description: 'C' }]
      }
    ];
    expect(findDuplicateSiblingIds(nodes)).toEqual([]);
  });

  it('reports a duplicate id at the top level', () => {
    const nodes: DocNode[] = [
      { id: 'a', title: 'A', description: 'A' },
      { id: 'a', title: 'A again', description: 'A again' }
    ];
    expect(findDuplicateSiblingIds(nodes).length).toBeGreaterThan(0);
  });

  it('reports a duplicate id among nested children', () => {
    const nodes: DocNode[] = [
      {
        id: 'parent',
        title: 'Parent',
        description: 'Parent',
        children: [
          { id: 'child', title: 'Child', description: 'Child' },
          { id: 'child', title: 'Child again', description: 'Child again' }
        ]
      }
    ];
    expect(findDuplicateSiblingIds(nodes).length).toBeGreaterThan(0);
  });

  it('allows the same id to repeat under different parents', () => {
    const nodes: DocNode[] = [
      {
        id: 'parent-a',
        title: 'A',
        description: 'A',
        children: [{ id: 'shared', title: 'X', description: 'X' }]
      },
      {
        id: 'parent-b',
        title: 'B',
        description: 'B',
        children: [{ id: 'shared', title: 'Y', description: 'Y' }]
      }
    ];
    expect(findDuplicateSiblingIds(nodes)).toEqual([]);
  });
});

describe('findBrokenRelatedLinks', () => {
  it('returns no errors when every related link resolves to a real node', () => {
    const sections = [
      {
        basePath: 'guides',
        cards: [
          { id: 'a', title: 'A', description: 'A', related: [{ label: 'B', path: 'guides/b' }] },
          { id: 'b', title: 'B', description: 'B' }
        ]
      }
    ];
    expect(findBrokenRelatedLinks(sections)).toEqual([]);
  });

  it('reports a related link pointing to a non-existent node', () => {
    const sections = [
      {
        basePath: 'guides',
        cards: [
          {
            id: 'a',
            title: 'A',
            description: 'A',
            related: [{ label: 'Missing', path: 'guides/does-not-exist' }]
          }
        ]
      }
    ];
    expect(findBrokenRelatedLinks(sections).length).toBeGreaterThan(0);
  });

  it('reports a related link pointing to an unknown section', () => {
    const sections = [
      {
        basePath: 'guides',
        cards: [
          {
            id: 'a',
            title: 'A',
            description: 'A',
            related: [{ label: 'X', path: 'unknown-section/x' }]
          }
        ]
      }
    ];
    expect(findBrokenRelatedLinks(sections).length).toBeGreaterThan(0);
  });

  it('resolves a related link into a nested child in another section', () => {
    const sections = [
      {
        basePath: 'modules',
        cards: [
          {
            id: 'auth',
            title: 'Auth',
            description: 'Auth',
            children: [{ id: 'guards', title: 'Guards', description: 'Guards' }]
          }
        ]
      },
      {
        basePath: 'guides',
        cards: [
          {
            id: 'x',
            title: 'X',
            description: 'X',
            related: [{ label: 'Guards', path: 'modules/auth/guards' }]
          }
        ]
      }
    ];
    expect(findBrokenRelatedLinks(sections)).toEqual([]);
  });
});
