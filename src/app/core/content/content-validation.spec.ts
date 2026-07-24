import { validateContent } from './validate-content';
import { findDuplicateSiblingIds, findBrokenRelatedLinks } from './semantic-validation';
import { DOCUMENTATION_SECTIONS } from '../documentation/section-registry';

import overviewSchema from '../../features/overview/overview-content.schema.json';
import overviewContent from '../../features/overview/overview-content.json';
import gettingStartedSchema from '../../features/getting-started/getting-started-content.schema.json';
import gettingStartedContent from '../../features/getting-started/getting-started-content.json';
import guidesSchema from '../../features/guides/guides-content.schema.json';
import guidesContent from '../../features/guides/guides-content.json';
import projectsSchema from '../../features/projects/projects-content.schema.json';
import projectsContent from '../../features/projects/projects-content.json';
import modulesSchema from '../../features/modules/modules-content.schema.json';
import modulesContent from '../../features/modules/modules-content.json';
import componentsSchema from '../../features/components/components-content.schema.json';
import componentsContent from '../../features/components/components-content.json';
import apiSchema from '../../features/api/api-content.schema.json';
import apiContent from '../../features/api/api-content.json';
import librariesSchema from '../../features/libraries/libraries-content.schema.json';
import librariesContent from '../../features/libraries/libraries-content.json';

describe('page content vs. JSON Schema', () => {
  const pages = [
    { name: 'overview', schema: overviewSchema, content: overviewContent },
    { name: 'getting-started', schema: gettingStartedSchema, content: gettingStartedContent },
    { name: 'guides', schema: guidesSchema, content: guidesContent },
    { name: 'projects', schema: projectsSchema, content: projectsContent },
    { name: 'modules', schema: modulesSchema, content: modulesContent },
    { name: 'components', schema: componentsSchema, content: componentsContent },
    { name: 'api', schema: apiSchema, content: apiContent },
    { name: 'libraries', schema: librariesSchema, content: librariesContent }
  ];

  it.each(pages)(
    '$name-content.json satisfies $name-content.schema.json',
    ({ schema, content }) => {
      const result = validateContent(schema, content);
      expect(result.errors).toEqual([]);
      expect(result.valid).toBe(true);
    }
  );

  it('rejects a card without an id', () => {
    const broken = {
      title: 'Projects',
      description: 'Projects',
      cards: [{ title: 'Web Apps', description: 'Missing its id.' }]
    };

    const result = validateContent(projectsSchema, broken);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects an unknown field', () => {
    const broken = {
      title: 'Projects',
      description: 'Projects',
      cards: [
        { id: 'web-apps', title: 'Web Apps', description: 'Has a typo field.', descriptoin: 'oops' }
      ]
    };

    const result = validateContent(projectsSchema, broken);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects a nested child without an id', () => {
    const broken = {
      title: 'Components',
      description: 'Frontend component usage, inputs, outputs and code examples.',
      cards: [
        {
          id: 'buttons',
          title: 'Buttons',
          description: 'Primary, secondary and icon button variants with usage guidelines.',
          children: [{ title: 'Icon Button', description: 'Missing its id.' }]
        }
      ]
    };

    const result = validateContent(componentsSchema, broken);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects an id that is not a lowercase, hyphen-separated slug', () => {
    const broken = {
      title: 'Projects',
      description: 'Projects',
      cards: [{ id: 'Not_A_Slug!', title: 'Bad', description: 'Bad id format.' }]
    };

    const result = validateContent(projectsSchema, broken);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('accepts a valid lowercase, hyphen-separated slug id', () => {
    const ok = {
      title: 'Projects',
      description: 'Projects',
      cards: [{ id: 'valid-slug-123', title: 'Good', description: 'Valid id format.' }]
    };

    const result = validateContent(projectsSchema, ok);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('accepts a card with a valid steps array', () => {
    const ok = {
      title: 'Projects',
      description: 'Projects',
      cards: [
        {
          id: 'has-steps',
          title: 'Has Steps',
          description: 'A card with steps.',
          steps: ['First step.', 'Second step.']
        }
      ]
    };

    const result = validateContent(projectsSchema, ok);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects an empty steps array', () => {
    const broken = {
      title: 'Projects',
      description: 'Projects',
      cards: [{ id: 'empty-steps', title: 'Empty Steps', description: 'No steps.', steps: [] }]
    };

    const result = validateContent(projectsSchema, broken);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects a steps array with a blank string', () => {
    const broken = {
      title: 'Projects',
      description: 'Projects',
      cards: [
        {
          id: 'blank-step',
          title: 'Blank Step',
          description: 'Has a blank step.',
          steps: ['Valid step.', '']
        }
      ]
    };

    const result = validateContent(projectsSchema, broken);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects a steps array with a non-string item', () => {
    const broken = {
      title: 'Projects',
      description: 'Projects',
      cards: [
        {
          id: 'non-string-step',
          title: 'Non-string Step',
          description: 'Has a non-string step.',
          steps: ['Valid step.', 42]
        }
      ]
    };

    const result = validateContent(projectsSchema, broken);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe('real content semantic rules', () => {
  it('has no duplicate sibling ids in any documentation section', () => {
    const errors = DOCUMENTATION_SECTIONS.flatMap(section =>
      findDuplicateSiblingIds(section.content.cards)
    );
    expect(errors).toEqual([]);
  });

  it('has no related links that point to a non-existent node', () => {
    const sections = DOCUMENTATION_SECTIONS.map(s => ({
      basePath: s.basePath,
      cards: s.content.cards
    }));
    const errors = findBrokenRelatedLinks(sections);
    expect(errors).toEqual([]);
  });
});
