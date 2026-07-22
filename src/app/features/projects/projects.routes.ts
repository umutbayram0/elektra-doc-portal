import { Routes } from '@angular/router';
import { FeatureIndex } from '../../shared/feature-index';
import { NodeDetail } from '../../shared/node-detail';
import { nodeDetailTitle, pageTitle } from '../../shared/route-title';
import projectsContent from './projects-content.json';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    component: FeatureIndex,
    data: { content: projectsContent, basePath: 'projects' },
    title: pageTitle('Projects')
  },
  {
    path: '**',
    component: NodeDetail,
    data: { content: projectsContent, basePath: 'projects', sectionLabel: 'Projects' },
    title: nodeDetailTitle
  }
];
