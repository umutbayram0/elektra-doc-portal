import { Routes } from '@angular/router';
import { FeatureIndex } from '../../shared/feature-index';
import { NodeDetail } from '../../shared/node-detail';
import { nodeDetailTitle, pageTitle } from '../../shared/route-title';
import librariesContent from './libraries-content.json';

export const LIBRARIES_ROUTES: Routes = [
  {
    path: '',
    component: FeatureIndex,
    data: { content: librariesContent, basePath: 'libraries' },
    title: pageTitle('Libraries')
  },
  {
    path: '**',
    component: NodeDetail,
    data: { content: librariesContent, basePath: 'libraries', sectionLabel: 'Libraries' },
    title: nodeDetailTitle
  }
];
