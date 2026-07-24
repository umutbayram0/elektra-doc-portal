import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFound } from './not-found';

describe('NotFound', () => {
  it('renders heading and back link', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Page not found');
    expect(compiled.querySelector('a')?.getAttribute('href')).toBe('/overview');
  });
});
