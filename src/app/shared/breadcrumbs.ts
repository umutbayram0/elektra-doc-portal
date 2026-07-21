import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { BreadcrumbItem } from './breadcrumb.model';

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink],
  template: `
    <nav aria-label="Breadcrumb" class="breadcrumbs">
      <ol>
        @for (item of items(); track item.path; let last = $last) {
          <li>
            @if (!last) {
              <a [routerLink]="'/' + item.path">{{ item.label }}</a>
              <span class="separator" aria-hidden="true">/</span>
            } @else {
              <span aria-current="page">{{ item.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styleUrl: './breadcrumbs.css'
})
export class Breadcrumbs {
  readonly items = input.required<BreadcrumbItem[]>();
}
