import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-node-tile',
  imports: [RouterLink, MatCardModule],
  template: `
    <a [routerLink]="'/' + path()" class="node-tile">
      <mat-card appearance="outlined" class="info-card">
        <mat-card-header>
          <mat-card-title>{{ title() }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>{{ description() }}</p>
        </mat-card-content>
      </mat-card>
    </a>
  `,
  styleUrl: './node-tile.css'
})
export class NodeTile {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly path = input.required<string>();
}
