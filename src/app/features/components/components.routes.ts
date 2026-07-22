import { Routes } from '@angular/router';
import { FeatureIndex } from '../../shared/feature-index';
import { NodeDetail } from '../../shared/node-detail';
import { nodeDetailTitle, pageTitle } from '../../shared/route-title';
import componentsContent from './components-content.json';

export const COMPONENTS_ROUTES: Routes = [
  {
    path: '',
    component: FeatureIndex,
    data: { content: componentsContent, basePath: 'components' },
    title: pageTitle('Components')
  },
  {
    path: '**',
    component: NodeDetail,
    data: { content: componentsContent, basePath: 'components', sectionLabel: 'Components' },
    title: nodeDetailTitle
  }
];
