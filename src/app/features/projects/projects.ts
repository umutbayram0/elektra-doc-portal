import { Component } from '@angular/core';
import { NodeTile } from '../../shared/node-tile';
import projectsContent from './projects-content.json';
import type { ProjectsContent } from './projects-content.model';

@Component({
  selector: 'app-projects',
  imports: [NodeTile],
  template: `
    <h1>{{ content.title }}</h1>

    <p class="page-description">
      {{ content.description }}
    </p>

    <section class="card-grid">
      @for (card of content.cards; track card.id) {
        <app-node-tile [title]="card.title" [description]="card.description" [path]="'projects/' + card.id" />
      }
    </section>
  `,
  styleUrl: '../../shared/content-page.css'
})
export class Projects {
  readonly content: ProjectsContent = projectsContent;
}
