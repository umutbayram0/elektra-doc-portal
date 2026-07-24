import { Routes } from '@angular/router';
import { FeatureIndex } from '../../shared/feature-index';
import { NodeDetail } from '../../shared/node-detail';
import { nodeDetailTitle, pageTitle } from '../../shared/route-title';
import gettingStartedContent from './getting-started-content.json';

export const GETTING_STARTED_ROUTES: Routes = [
  {
    path: '',
    component: FeatureIndex,
    data: { content: gettingStartedContent, basePath: 'getting-started', lang: 'tr' },
    title: pageTitle('Getting Started')
  },
  {
    path: '**',
    component: NodeDetail,
    data: { content: gettingStartedContent, basePath: 'getting-started', sectionLabel: 'Getting Started', lang: 'tr' },
    title: nodeDetailTitle
  }
];
