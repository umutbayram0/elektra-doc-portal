import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FeatureIndex } from '../shared/feature-index';
import { Overview } from './overview/overview';
import { DOCUMENTATION_SECTIONS } from '../core/documentation/section-registry';

import overviewContent from './overview/overview-content.json';

describe('Overview page', () => {
  it('renders title, description and purpose', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(Overview);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(overviewContent.title);
    expect(compiled.textContent).toContain(overviewContent.description);
    expect(compiled.textContent).toContain(overviewContent.purpose);
  });

  it('renders a nav card linking to every documentation section', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(Overview);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(compiled.querySelectorAll('.card-grid a')) as HTMLAnchorElement[];
    expect(links.length).toBe(DOCUMENTATION_SECTIONS.length);

    for (const section of DOCUMENTATION_SECTIONS) {
      const link = links.find(a => a.getAttribute('href') === `/${section.basePath}`);
      expect(link).toBeTruthy();
      expect(link?.textContent).toContain(section.label);
    }
  });
});

describe('FeatureIndex', () => {
  const sections = DOCUMENTATION_SECTIONS.map(s => ({
    name: s.label,
    basePath: s.basePath,
    content: s.content
  }));

  it.each(sections)('$name renders its title and description', async ({ basePath, content }) => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { content, basePath } } } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(FeatureIndex);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(content.title);
    expect(compiled.textContent).toContain(content.description);
  });

  it.each(sections)(
    '$name shows its cards when it has content, or an empty state when it does not',
    async ({ basePath, content }) => {
      await TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          { provide: ActivatedRoute, useValue: { snapshot: { data: { content, basePath } } } }
        ]
      }).compileComponents();

      const fixture = TestBed.createComponent(FeatureIndex);
      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;

      if (content.cards.length > 0) {
        for (const card of content.cards) {
          expect(compiled.textContent).toContain(card.title);
        }
        expect(compiled.querySelector('.empty-state')).toBeNull();
      } else {
        expect(compiled.querySelector('.card-grid')).toBeNull();
        const emptyState = compiled.querySelector('.empty-state');
        expect(emptyState).not.toBeNull();
        const guideLink = emptyState?.querySelector('a') as HTMLAnchorElement | null;
        expect(guideLink?.getAttribute('href')).toBe('/guides/yeni-sayfa-ekleme');
      }
    }
  );
});
