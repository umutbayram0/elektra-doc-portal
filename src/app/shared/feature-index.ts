import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NodeTile } from './node-tile';
import type { SectionContent } from './section-content.model';

@Component({
  selector: 'app-feature-index',
  imports: [NodeTile],
  template: `
    <h1>{{ content.title }}</h1>

    <p class="page-description">
      {{ content.description }}
    </p>

    <section class="card-grid">
      @for (card of content.cards; track card.id) {
        <app-node-tile [title]="card.title" [description]="card.description" [path]="basePath + '/' + card.id" />
      }
    </section>
  `,
  styleUrl: './content-page.css'
})
export class FeatureIndex {
  private readonly route = inject(ActivatedRoute);
  readonly content = this.route.snapshot.data['content'] as SectionContent;
  readonly basePath = this.route.snapshot.data['basePath'] as string;
}
