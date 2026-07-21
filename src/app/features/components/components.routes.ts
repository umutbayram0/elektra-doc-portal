import { Routes } from '@angular/router';
import { ComponentsDoc } from './components';
import { NodeDetail } from '../../shared/node-detail';
import componentsContent from './components-content.json';

export const COMPONENTS_ROUTES: Routes = [
  { path: '', component: ComponentsDoc },
  {
    path: '**',
    component: NodeDetail,
    data: { content: componentsContent, basePath: 'components', sectionLabel: 'Components' }
  }
];
