import { Component } from '@angular/core';
import { NodeTile } from '../../shared/node-tile';
import modulesContent from './modules-content.json';
import type { ModulesContent } from './modules-content.model';

@Component({
  selector: 'app-modules',
  imports: [NodeTile],
  template: `
    <h1>{{ content.title }}</h1>

    <p class="page-description">
      {{ content.description }}
    </p>

    <section class="card-grid">
      @for (card of content.cards; track card.id) {
        <app-node-tile [title]="card.title" [description]="card.description" [path]="'modules/' + card.id" />
      }
    </section>
  `,
  styleUrl: '../../shared/content-page.css'
})
export class Modules {
  readonly content: ModulesContent = modulesContent;
}
