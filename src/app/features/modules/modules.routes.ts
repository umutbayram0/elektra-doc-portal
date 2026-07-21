import { Routes } from '@angular/router';
import { Modules } from './modules';
import { NodeDetail } from '../../shared/node-detail';
import modulesContent from './modules-content.json';

export const MODULES_ROUTES: Routes = [
  { path: '', component: Modules },
  {
    path: '**',
    component: NodeDetail,
    data: { content: modulesContent, basePath: 'modules', sectionLabel: 'Modules' }
  }
];
