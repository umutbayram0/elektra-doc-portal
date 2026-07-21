import { Routes } from '@angular/router';
import { Libraries } from './libraries';
import { NodeDetail } from '../../shared/node-detail';
import { nodeDetailTitle, pageTitle } from '../../shared/route-title';
import librariesContent from './libraries-content.json';

export const LIBRARIES_ROUTES: Routes = [
  { path: '', component: Libraries, title: pageTitle('Libraries') },
  {
    path: '**',
    component: NodeDetail,
    data: { content: librariesContent, basePath: 'libraries', sectionLabel: 'Libraries' },
    title: nodeDetailTitle
  }
];
