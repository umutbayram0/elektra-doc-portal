import { Routes } from '@angular/router';
import { ApiDoc } from './api';
import { NodeDetail } from '../../shared/node-detail';
import { nodeDetailTitle, pageTitle } from '../../shared/route-title';
import apiContent from './api-content.json';

export const API_ROUTES: Routes = [
  { path: '', component: ApiDoc, title: pageTitle('API') },
  {
    path: '**',
    component: NodeDetail,
    data: { content: apiContent, basePath: 'api', sectionLabel: 'API' },
    title: nodeDetailTitle
  }
];
