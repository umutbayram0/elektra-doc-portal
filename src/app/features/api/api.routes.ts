import { Routes } from '@angular/router';
import { ApiDoc } from './api';
import { NodeDetail } from '../../shared/node-detail';
import apiContent from './api-content.json';

export const API_ROUTES: Routes = [
  { path: '', component: ApiDoc },
  {
    path: '**',
    component: NodeDetail,
    data: { content: apiContent, basePath: 'api', sectionLabel: 'API' }
  }
];
