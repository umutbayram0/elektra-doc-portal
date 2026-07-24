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

  it('shows all sections at root', async () => {
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

  it('drills into a section in the sidebar', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/guides/yeni-sayfa-ekleme');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.sidebar-back')).not.toBeNull();
    expect(compiled.querySelector('.sidebar-section-link')?.textContent?.trim()).toBe('Guides');
    expect(compiled.querySelector('.sidebar-root-list')).toBeNull();
    expect(compiled.textContent).toContain('Yeni Bir Doküman Sayfası Ekleme');

    const sidebarText = compiled.querySelector('.sidebar')?.textContent;
    expect(sidebarText).not.toContain('Getting Started');
    expect(sidebarText).not.toContain('Modules');
  });

  it('toggles the mobile nav and keeps aria-expanded/aria-controls in sync', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/overview');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector('.nav-toggle-mobile') as HTMLButtonElement;
    const sidebar = compiled.querySelector('#sidebar-nav') as HTMLElement;

    expect(toggle.getAttribute('aria-controls')).toBe('sidebar-nav');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(sidebar.classList.contains('open')).toBe(false);

    toggle.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(sidebar.classList.contains('open')).toBe(true);
  });
});
