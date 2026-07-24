import type { Routes } from '@angular/router';
import type { SectionContent } from '../../shared/section-content.model';

import gettingStartedContent from '../../features/getting-started/getting-started-content.json';
import guidesContent from '../../features/guides/guides-content.json';
import projectsContent from '../../features/projects/projects-content.json';
import modulesContent from '../../features/modules/modules-content.json';
import componentsContent from '../../features/components/components-content.json';
import apiContent from '../../features/api/api-content.json';
import librariesContent from '../../features/libraries/libraries-content.json';

export interface DocumentationSection {
  readonly label: string;
  readonly basePath: string;
  readonly content: SectionContent;
  readonly lang?: string;
  readonly loadRoutes: () => Promise<Routes>;
}

/**
 * Single source of truth for every top-level documentation section.
 * app.routes.ts, the sidebar (app.ts), search.service.ts and the Overview
 * page all read from this list — add a section here once and it shows up
 * everywhere.
 */
export const DOCUMENTATION_SECTIONS: readonly DocumentationSection[] = [
  {
    label: 'Getting Started',
    basePath: 'getting-started',
    content: gettingStartedContent as SectionContent,
    lang: 'tr',
    loadRoutes: () =>
      import('../../features/getting-started/getting-started.routes').then(
        m => m.GETTING_STARTED_ROUTES
      )
  },
  {
    label: 'Guides',
    basePath: 'guides',
    content: guidesContent as SectionContent,
    lang: 'tr',
    loadRoutes: () => import('../../features/guides/guides.routes').then(m => m.GUIDES_ROUTES)
  },
  {
    label: 'Projects',
    basePath: 'projects',
    content: projectsContent as SectionContent,
    loadRoutes: () => import('../../features/projects/projects.routes').then(m => m.PROJECTS_ROUTES)
  },
  {
    label: 'Modules',
    basePath: 'modules',
    content: modulesContent as SectionContent,
    loadRoutes: () => import('../../features/modules/modules.routes').then(m => m.MODULES_ROUTES)
  },
  {
    label: 'Components',
    basePath: 'components',
    content: componentsContent as SectionContent,
    loadRoutes: () =>
      import('../../features/components/components.routes').then(m => m.COMPONENTS_ROUTES)
  },
  {
    label: 'API',
    basePath: 'api',
    content: apiContent as SectionContent,
    loadRoutes: () => import('../../features/api/api.routes').then(m => m.API_ROUTES)
  },
  {
    label: 'Libraries',
    basePath: 'libraries',
    content: librariesContent as SectionContent,
    loadRoutes: () =>
      import('../../features/libraries/libraries.routes').then(m => m.LIBRARIES_ROUTES)
  }
];
