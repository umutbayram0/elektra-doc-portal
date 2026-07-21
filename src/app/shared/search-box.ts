import { Component, ElementRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchService } from '../core/search/search.service';

@Component({
  selector: 'app-search-box',
  imports: [RouterLink],
  host: {
    '(document:click)': 'onDocumentClick($event)'
  },
  template: `
    <div class="search-box" role="search">
      <label class="visually-hidden" for="doc-search">Search documentation</label>
      <input
        id="doc-search"
        type="search"
        class="search-input"
        placeholder="Search documentation…"
        autocomplete="off"
        [value]="search.query()"
        (input)="onInput($event)"
        (focus)="open.set(true)"
        (keydown.escape)="reset()"
      />

      @if (open() && search.query().trim()) {
        <div class="search-results" role="listbox" aria-label="Search results">
          @if (search.results().length > 0) {
            <ul>
              @for (result of search.results(); track result.path) {
                <li>
                  <a [routerLink]="'/' + result.path" (click)="reset()">
                    <span class="result-heading">
                      <span class="result-section">{{ result.section }}</span>
                      <span class="result-title">{{ result.title }}</span>
                    </span>
                    <span class="result-description">{{ result.description }}</span>
                  </a>
                </li>
              }
            </ul>
          } @else {
            <p class="no-results">No results for "{{ search.query() }}"</p>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './search-box.css'
})
export class SearchBox {
  protected readonly search = inject(SearchService);
  protected readonly open = signal(false);
  private readonly hostElement = inject(ElementRef<HTMLElement>);

  onInput(event: Event): void {
    this.search.query.set((event.target as HTMLInputElement).value);
    this.open.set(true);
  }

  reset(): void {
    this.search.query.set('');
    this.open.set(false);
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.hostElement.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
