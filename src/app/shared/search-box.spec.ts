import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SearchBox } from './search-box';

// jsdom doesn't implement the <dialog> element's imperative API yet.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}

describe('SearchBox', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('opens the search dialog when the trigger button is clicked', async () => {
    const fixture = TestBed.createComponent(SearchBox);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const dialog = compiled.querySelector('dialog') as HTMLDialogElement;
    expect(dialog.open).toBe(false);

    (compiled.querySelector('.search-trigger') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(dialog.open).toBe(true);
  });

  it('opens the dialog on Ctrl+K from anywhere in the document', async () => {
    const fixture = TestBed.createComponent(SearchBox);
    fixture.detectChanges();
    await fixture.whenStable();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    const dialog = (fixture.nativeElement as HTMLElement).querySelector('dialog') as HTMLDialogElement;
    expect(dialog.open).toBe(true);
  });

  it('shows matching results while typing and clears the query once the dialog closes', async () => {
    const fixture = TestBed.createComponent(SearchBox);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('.search-trigger') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();

    const input = compiled.querySelector('input') as HTMLInputElement;
    input.value = 'route guard';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('Route Guards');

    const dialog = compiled.querySelector('dialog') as HTMLDialogElement;
    dialog.close();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(input.value).toBe('');
  });

  it('shows a "no results" message for an unmatched query', async () => {
    const fixture = TestBed.createComponent(SearchBox);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('.search-trigger') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();

    const input = compiled.querySelector('input') as HTMLInputElement;
    input.value = 'zzzznonexistent';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.querySelector('.search-empty')?.textContent).toContain('zzzznonexistent');
  });
});
