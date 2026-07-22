import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/overview');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Overview');
  });

  it('shows every top-level section and no back link at the root (e.g. Overview)', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/overview');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.sidebar-back')).toBeNull();
    const rootLabels = Array.from(compiled.querySelectorAll('.sidebar-root-link')).map(el =>
      el.firstChild?.textContent?.trim()
    );
    expect(rootLabels).toEqual([
      'Getting Started',
      'Guides',
      'Projects',
      'Modules',
      'Components',
      'API',
      'Libraries'
    ]);
  });

  it('drills into a section: sidebar shows only that section plus a back link', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/modules/authentication/route-guards');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.sidebar-back')).not.toBeNull();
    expect(compiled.querySelector('.sidebar-section-link')?.textContent?.trim()).toBe('Modules');
    expect(compiled.querySelector('.sidebar-root-list')).toBeNull();
    expect(compiled.textContent).toContain('Authentication');
    expect(compiled.textContent).not.toContain('Getting Started');
    expect(compiled.textContent).not.toContain('Libraries');
  });
});
