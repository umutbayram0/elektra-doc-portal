import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { NodeDetail } from './node-detail';
import type { DocNode } from './doc-node.model';

const testCards: DocNode[] = [
  {
    id: 'alpha',
    title: 'Alpha',
    description: 'Alpha description',
    example: 'const x = 1;',
    exampleLang: 'typescript',
    notes: [
      { type: 'tip', text: 'A helpful tip.' },
      { type: 'warning', text: 'A cautionary warning.' }
    ],
    properties: [
      { name: 'size', type: 'string', default: '"medium"', description: 'Controls the rendered size.' },
      { name: 'disabled', type: 'boolean', description: 'Disables the control.' }
    ],
    related: [{ label: 'Beta', path: 'test/alpha/beta' }],
    children: [{ id: 'beta', title: 'Beta', description: 'Beta description' }]
  }
];

@Component({ selector: 'app-test-host', imports: [RouterOutlet], template: '<router-outlet />' })
class TestHost {}

describe('NodeDetail', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'test',
            children: [
              {
                path: '**',
                component: NodeDetail,
                data: { content: { cards: testCards }, basePath: 'test', sectionLabel: 'Test' }
              }
            ]
          }
        ])
      ]
    }).compileComponents();
  });

  it('renders the matched node title, description and code example', async () => {
    const fixture = TestBed.createComponent(TestHost);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/test/alpha');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Alpha');
    expect(compiled.textContent).toContain('Alpha description');
    expect(compiled.querySelector('code')?.textContent).toContain('const x = 1;');
  });

  it('renders a breadcrumb trail for a nested node', async () => {
    const fixture = TestBed.createComponent(TestHost);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/test/alpha/beta');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const crumbs = Array.from(compiled.querySelectorAll('.breadcrumbs a, .breadcrumbs [aria-current]')).map(el =>
      el.textContent?.trim()
    );
    expect(crumbs).toEqual(['Test', 'Alpha', 'Beta']);
  });

  it('renders child nodes as tiles linking one level deeper', async () => {
    const fixture = TestBed.createComponent(TestHost);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/test/alpha');
    fixture.detectChanges();
    await fixture.whenStable();

    const tileLink = (fixture.nativeElement as HTMLElement).querySelector('.node-tile') as HTMLAnchorElement;
    expect(tileLink.textContent).toContain('Beta');
    expect(tileLink.getAttribute('href')).toBe('/test/alpha/beta');
  });

  it('shows "Content not found." for an unknown path', async () => {
    const fixture = TestBed.createComponent(TestHost);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/test/does-not-exist');
    fixture.detectChanges();
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Content not found.');
  });

  it('renders notes, a properties table, related links and a matching "on this page" TOC', async () => {
    const fixture = TestBed.createComponent(TestHost);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/test/alpha');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.callout-tip')?.textContent).toContain('A helpful tip.');
    expect(compiled.querySelector('.callout-warning')?.textContent).toContain('A cautionary warning.');

    const propertyRows = Array.from(compiled.querySelectorAll('.properties-table tbody tr'));
    expect(propertyRows.length).toBe(2);
    expect(propertyRows[0].textContent).toContain('size');
    expect(propertyRows[0].textContent).toContain('"medium"');
    expect(propertyRows[1].textContent).toContain('disabled');

    const relatedLink = compiled.querySelector('.related-list a') as HTMLAnchorElement;
    expect(relatedLink.textContent).toContain('Beta');
    expect(relatedLink.getAttribute('href')).toBe('/test/alpha/beta');

    const tocLabels = Array.from(compiled.querySelectorAll('.page-toc a')).map(el => el.textContent?.trim());
    expect(tocLabels).toEqual(['Example', 'Properties', 'In this section', 'Related topics']);
  });

  it('copies the code example to the clipboard and shows confirmation', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const fixture = TestBed.createComponent(TestHost);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/test/alpha');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('.copy-button') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(writeText).toHaveBeenCalledWith('const x = 1;');
    expect(compiled.querySelector('.copy-button')?.textContent).toContain('Copied');
  });
});
