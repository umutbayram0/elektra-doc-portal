import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import overviewContent from './overview-content.json';
import type { OverviewContent } from './overview-content.model';

@Component({
  selector: 'app-overview',
  imports: [MatCardModule],
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
  `,
  styleUrl: '../../shared/content-page.css'
})
export class Overview {
  readonly content: OverviewContent = overviewContent;
}
