import { Component } from '@angular/core';
import { NodeTile } from '../../shared/node-tile';
import componentsContent from './components-content.json';
import type { ComponentsContent } from './components-content.model';

@Component({
  selector: 'app-components-doc',
  imports: [NodeTile],
  template: `
    <h1>{{ content.title }}</h1>

    <p class="page-description">
      {{ content.description }}
    </p>

    <section class="card-grid">
      @for (card of content.cards; track card.id) {
        <app-node-tile [title]="card.title" [description]="card.description" [path]="'components/' + card.id" />
      }
    </section>
  `,
  styleUrl: '../../shared/content-page.css'
})
export class ComponentsDoc {
  readonly content: ComponentsContent = componentsContent;
}
