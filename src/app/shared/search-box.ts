import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SearchService } from '../core/search/search.service';

@Component({
  selector: 'app-search-box',
  imports: [RouterLink],
  host: {
    '(document:keydown)': 'onGlobalKeydown($event)'
  },
  template: `
    <button type="button" class="search-trigger" (click)="open()">
      <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z"
        />
      </svg>
      <span class="search-trigger-label">Search documentation…</span>
      <kbd class="search-shortcut">Ctrl K</kbd>
    </button>

    <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
    <dialog #dialog class="search-dialog" (click)="onBackdropClick($event)" (close)="onClose()">
      <div class="search-dialog-content">
        <div class="search-input-row">
          <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z"
            />
          </svg>
          <label class="visually-hidden" for="doc-search">Search documentation</label>
          <input
            #searchInput
            id="doc-search"
            type="search"
            placeholder="Search documentation…"
            autocomplete="off"
            [value]="search.query()"
            (input)="onInput($event)"
            (keydown.arrowdown)="moveSelection(1, $event)"
            (keydown.arrowup)="moveSelection(-1, $event)"
            (keydown.enter)="navigateSelected()"
          />
        </div>

        <div class="search-results" role="listbox" aria-label="Search results">
          @if (search.query().trim()) {
            @if (search.results().length > 0) {
              <ul>
                @for (result of search.results(); track result.path; let i = $index) {
                  <li>
                    <a
                      role="option"
                      [attr.aria-selected]="i === selectedIndex()"
                      class="search-result"
                      [class.selected]="i === selectedIndex()"
                      [routerLink]="'/' + result.path"
                      (click)="close()"
                      (mouseenter)="selectedIndex.set(i)"
                    >
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
              <p class="search-empty">No results for "{{ search.query() }}"</p>
            }
          } @else {
            <p class="search-empty">Type to search documentation.</p>
          }
        </div>

        <div class="search-footer">
          <span><kbd>↵</kbd> to select</span>
          <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
          <span><kbd>Esc</kbd> to close</span>
        </div>
      </div>
    </dialog>
  `,
  styleUrl: './search-box.css'
})
export class SearchBox {
  protected readonly search = inject(SearchService);
  protected readonly selectedIndex = signal(0);
  private readonly router = inject(Router);

  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly searchInputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  open(): void {
    this.selectedIndex.set(0);
    this.dialogRef().nativeElement.showModal();
    queueMicrotask(() => this.searchInputRef()?.nativeElement.focus());
  }

  close(): void {
    this.dialogRef().nativeElement.close();
  }

  onGlobalKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.open();
    }
  }

  onInput(event: Event): void {
    this.search.query.set((event.target as HTMLInputElement).value);
    this.selectedIndex.set(0);
  }

  onClose(): void {
    this.search.query.set('');
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialogRef().nativeElement) {
      this.close();
    }
  }

  moveSelection(delta: number, event: Event): void {
    event.preventDefault();
    const count = this.search.results().length;
    if (count === 0) {
      return;
    }
    this.selectedIndex.update(i => (i + delta + count) % count);
  }

  navigateSelected(): void {
    const result = this.search.results()[this.selectedIndex()];
    if (result) {
      this.router.navigateByUrl('/' + result.path);
      this.close();
    }
  }
}
