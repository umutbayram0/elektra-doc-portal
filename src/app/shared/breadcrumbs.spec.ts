import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Breadcrumbs } from './breadcrumbs';

describe('Breadcrumbs', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders links except the last item', async () => {
    const fixture = TestBed.createComponent(Breadcrumbs);
    fixture.componentRef.setInput('items', [
      { label: 'Modules', path: 'modules' },
      { label: 'Authentication', path: 'modules/authentication' },
      { label: 'Route Guards', path: 'modules/authentication/route-guards' }
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(compiled.querySelectorAll('a')).map(a => a.textContent?.trim());
    expect(links).toEqual(['Modules', 'Authentication']);

    const current = compiled.querySelector('[aria-current="page"]');
    expect(current?.textContent?.trim()).toBe('Route Guards');
  });
});
