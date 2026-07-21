import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <h1>Page not found</h1>

    <p class="page-description">
      The page you're looking for doesn't exist or may have been moved.
    </p>

    <a routerLink="/overview">Back to Overview</a>
  `,
  styleUrl: './content-page.css'
})
export class NotFound {}
