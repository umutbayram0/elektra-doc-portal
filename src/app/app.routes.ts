import { Routes } from '@angular/router';
import { NotFound } from './shared/not-found';
import { pageTitle } from './shared/route-title';
import { DOCUMENTATION_SECTIONS } from './core/documentation/section-registry';

export const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: 'overview',
    loadChildren: () => import('./features/overview/overview.routes').then(m => m.OVERVIEW_ROUTES)
  },
  ...DOCUMENTATION_SECTIONS.map(section => ({
    path: section.basePath,
    loadChildren: section.loadRoutes
  })),
  { path: '**', component: NotFound, title: pageTitle('Page not found') }
];
