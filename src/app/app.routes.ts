import { Routes } from '@angular/router';
import { NotFound } from './shared/not-found';
import { pageTitle } from './shared/route-title';

export const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: 'overview',
    loadChildren: () => import('./features/overview/overview.routes').then(m => m.OVERVIEW_ROUTES)
  },
  {
    path: 'projects',
    loadChildren: () => import('./features/projects/projects.routes').then(m => m.PROJECTS_ROUTES)
  },
  {
    path: 'modules',
    loadChildren: () => import('./features/modules/modules.routes').then(m => m.MODULES_ROUTES)
  },
  {
    path: 'components',
    loadChildren: () => import('./features/components/components.routes').then(m => m.COMPONENTS_ROUTES)
  },
  {
    path: 'api',
    loadChildren: () => import('./features/api/api.routes').then(m => m.API_ROUTES)
  },
  {
    path: 'libraries',
    loadChildren: () => import('./features/libraries/libraries.routes').then(m => m.LIBRARIES_ROUTES)
  },
  { path: '**', component: NotFound, title: pageTitle('Page not found') }
];
