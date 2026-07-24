import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NodeTile } from '../../shared/node-tile';
import { DOCUMENTATION_SECTIONS } from '../../core/documentation/section-registry';
import overviewContent from './overview-content.json';
import type { OverviewContent } from './overview-content.model';

@Component({
  selector: 'app-overview',
  imports: [MatCardModule, NodeTile],
  template: `
    <h1>{{ content.title }}</h1>

    <p class="page-description">
      {{ content.description }}
    </p>

    <mat-card appearance="outlined">
      <mat-card-content>
        <p>{{ content.purpose }}</p>
      </mat-card-content>
    </mat-card>

    <h2>Documentation sections</h2>
    <section class="card-grid">
      @for (section of sections; track section.basePath) {
        <app-node-tile
          [title]="section.label"
          [description]="section.content.description"
          [path]="section.basePath"
        />
      }
    </section>
  `,
  styleUrl: '../../shared/content-page.css'
})
export class Overview {
  readonly content: OverviewContent = overviewContent;
  readonly sections = DOCUMENTATION_SECTIONS;
}
