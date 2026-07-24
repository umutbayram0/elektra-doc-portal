import { validateContent } from './validate-content';

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

  it.each(pages)('$name-content.json satisfies $name-content.schema.json', ({ schema, content }) => {
    const result = validateContent(schema, content);
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it('rejects a card without an id', () => {
    const broken = {
      title: 'Overview',
      description: 'General information about documentation portal.',
      cards: [{ title: 'Projects', description: 'Missing its id.' }]
    };

    const result = validateContent(overviewSchema, broken);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects an unknown field', () => {
    const broken = {
      title: 'Overview',
      description: 'General information about documentation portal.',
      cards: [{ id: 'projects', title: 'Projects', description: 'Has a typo field.', descriptoin: 'oops' }]
    };

    const result = validateContent(overviewSchema, broken);

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
});
