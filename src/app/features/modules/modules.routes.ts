import { Routes } from '@angular/router';
import { FeatureIndex } from '../../shared/feature-index';
import { NodeDetail } from '../../shared/node-detail';
import { nodeDetailTitle, pageTitle } from '../../shared/route-title';
import modulesContent from './modules-content.json';

export const MODULES_ROUTES: Routes = [
  {
    path: '',
    component: FeatureIndex,
    data: { content: modulesContent, basePath: 'modules' },
    title: pageTitle('Modules')
  },
  {
    path: '**',
    component: NodeDetail,
    data: { content: modulesContent, basePath: 'modules', sectionLabel: 'Modules' },
    title: nodeDetailTitle
  }
];
