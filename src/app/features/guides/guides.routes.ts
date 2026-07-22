import { Routes } from '@angular/router';
import { FeatureIndex } from '../../shared/feature-index';
import { NodeDetail } from '../../shared/node-detail';
import { nodeDetailTitle, pageTitle } from '../../shared/route-title';
import guidesContent from './guides-content.json';

export const GUIDES_ROUTES: Routes = [
  {
    path: '',
    component: FeatureIndex,
    data: { content: guidesContent, basePath: 'guides' },
    title: pageTitle('Guides')
  },
  {
    path: '**',
    component: NodeDetail,
    data: { content: guidesContent, basePath: 'guides', sectionLabel: 'Guides' },
    title: nodeDetailTitle
  }
];
