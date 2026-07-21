import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavList } from './nav-list';
import type { NavItem } from './nav-item.model';

describe('NavList', () => {
  const items: NavItem[] = [
    {
      label: 'Modules',
      path: 'modules',
      children: [{ label: 'Authentication', path: 'modules/authentication' }]
    },
    { label: 'Overview', path: 'overview' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders top-level items and hides children until expanded', async () => {
    const fixture = TestBed.createComponent(NavList);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('expanded', new Set<string>());
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Modules');
    expect(compiled.textContent).toContain('Overview');
    expect(compiled.textContent).not.toContain('Authentication');
    expect(compiled.querySelector('.nav-toggle')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('shows children and flips aria-expanded when the section is expanded', async () => {
    const fixture = TestBed.createComponent(NavList);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('expanded', new Set(['modules']));
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Authentication');
    expect(compiled.querySelector('.nav-toggle')?.getAttribute('aria-expanded')).toBe('true');
  });

  it('emits itemToggled with the clicked item', async () => {
    const fixture = TestBed.createComponent(NavList);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('expanded', new Set<string>());
    fixture.detectChanges();
    await fixture.whenStable();

    let toggled: NavItem | undefined;
    fixture.componentInstance.itemToggled.subscribe((item: NavItem) => (toggled = item));
    (fixture.nativeElement.querySelector('.nav-toggle') as HTMLButtonElement).click();

    expect(toggled).toBe(items[0]);
  });
});
