import { Component } from '@angular/core';
import { NodeTile } from '../../shared/node-tile';
import librariesContent from './libraries-content.json';
import type { LibrariesContent } from './libraries-content.model';

@Component({
  selector: 'app-libraries',
  imports: [NodeTile],
  template: `
    <h1>{{ content.title }}</h1>

    <p class="page-description">
      {{ content.description }}
    </p>

    <section class="card-grid">
      @for (card of content.cards; track card.id) {
        <app-node-tile [title]="card.title" [description]="card.description" [path]="'libraries/' + card.id" />
      }
    </section>
  `,
  styleUrl: '../../shared/content-page.css'
})
export class Libraries {
  readonly content: LibrariesContent = librariesContent;
}
