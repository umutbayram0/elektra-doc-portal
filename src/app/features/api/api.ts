import { Component } from '@angular/core';
import { NodeTile } from '../../shared/node-tile';
import apiContent from './api-content.json';
import type { ApiContent } from './api-content.model';

@Component({
  selector: 'app-api-doc',
  imports: [NodeTile],
  template: `
    <h1>{{ content.title }}</h1>

    <p class="page-description">
      {{ content.description }}
    </p>

    <section class="card-grid">
      @for (card of content.cards; track card.id) {
        <app-node-tile [title]="card.title" [description]="card.description" [path]="'api/' + card.id" />
      }
    </section>
  `,
  styleUrl: '../../shared/content-page.css'
})
export class ApiDoc {
  readonly content: ApiContent = apiContent;
}
