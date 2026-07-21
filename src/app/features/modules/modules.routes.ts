import { Routes } from '@angular/router';
import { Modules } from './modules';
import { NodeDetail } from '../../shared/node-detail';
import { nodeDetailTitle, pageTitle } from '../../shared/route-title';
import modulesContent from './modules-content.json';

export const MODULES_ROUTES: Routes = [
  { path: '', component: Modules, title: pageTitle('Modules') },
  {
    path: '**',
    component: NodeDetail,
    data: { content: modulesContent, basePath: 'modules', sectionLabel: 'Modules' },
    title: nodeDetailTitle
  }
];
