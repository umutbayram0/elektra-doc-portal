import { Routes } from '@angular/router';
import { Libraries } from './libraries';
import { NodeDetail } from '../../shared/node-detail';
import librariesContent from './libraries-content.json';

export const LIBRARIES_ROUTES: Routes = [
  { path: '', component: Libraries },
  {
    path: '**',
    component: NodeDetail,
    data: { content: librariesContent, basePath: 'libraries', sectionLabel: 'Libraries' }
  }
];
