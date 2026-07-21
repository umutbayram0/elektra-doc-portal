import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SearchBox } from './search-box';

describe('SearchBox', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('shows matching results while typing and clears them on Escape', async () => {
    const fixture = TestBed.createComponent(SearchBox);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input') as HTMLInputElement;

    input.value = 'route guard';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.querySelector('.search-results')).toBeTruthy();
    expect(compiled.textContent).toContain('Route Guards');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.querySelector('.search-results')).toBeFalsy();
    expect(input.value).toBe('');
  });

  it('shows a "no results" message for an unmatched query', async () => {
    const fixture = TestBed.createComponent(SearchBox);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input') as HTMLInputElement;

    input.value = 'zzzznonexistent';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.querySelector('.no-results')?.textContent).toContain('zzzznonexistent');
  });
});
