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
    steps: ['First step.', 'Second step.', 'Third step.'],
    example: 'const x = 1;',
    exampleLang: 'typescript',
    notes: [
      { type: 'tip', text: 'A helpful tip.' },
      { type: 'warning', text: 'A cautionary warning.' },
      { type: 'note', text: 'A plain note.' }
    ],
    properties: [
      {
        name: 'size',
        type: 'string',
        default: '"medium"',
        description: 'Controls the rendered size.'
      },
      { name: 'disabled', type: 'boolean', description: 'Disables the control.' }
    ],
    related: [{ label: 'Beta', path: 'test/alpha/beta' }],
    children: [{ id: 'beta', title: 'Beta', description: 'Beta description' }]
  },
  {
    id: 'gamma',
    title: 'Gamma',
    description: 'Gamma description',
    example: 'print("hi")',
    exampleLang: 'python'
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

  it('renders node title and code example', async () => {
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

  it('renders breadcrumb trail', async () => {
    const fixture = TestBed.createComponent(TestHost);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/test/alpha/beta');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const crumbs = Array.from(
      compiled.querySelectorAll('.breadcrumbs a, .breadcrumbs [aria-current]')
    ).map(el => el.textContent?.trim());
    expect(crumbs).toEqual(['Test', 'Alpha', 'Beta']);
  });

  it('renders child tiles', async () => {
    const fixture = TestBed.createComponent(TestHost);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/test/alpha');
    fixture.detectChanges();
    await fixture.whenStable();

    const tileLink = (fixture.nativeElement as HTMLElement).querySelector(
      '.node-tile'
    ) as HTMLAnchorElement;
    expect(tileLink.textContent).toContain('Beta');
    expect(tileLink.getAttribute('href')).toBe('/test/alpha/beta');
  });

  it('shows not-found for an unknown path', async () => {
    const fixture = TestBed.createComponent(TestHost);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/test/does-not-exist');
    fixture.detectChanges();
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Content not found.');
  });

  it('renders steps, notes, properties, related links and TOC', async () => {
    const fixture = TestBed.createComponent(TestHost);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/test/alpha');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    const stepItems = Array.from(compiled.querySelectorAll('.steps-list li')).map(el =>
      el.textContent?.trim()
    );
    expect(stepItems).toEqual(['First step.', 'Second step.', 'Third step.']);
    expect(compiled.querySelector('.steps-list')?.tagName).toBe('OL');

    expect(compiled.querySelector('.callout-tip .callout-label')?.textContent).toBe('İpucu');
    expect(compiled.querySelector('.callout-tip')?.textContent).toContain('A helpful tip.');
    expect(compiled.querySelector('.callout-warning .callout-label')?.textContent).toBe('Uyarı');
    expect(compiled.querySelector('.callout-warning')?.textContent).toContain(
      'A cautionary warning.'
    );
    expect(compiled.querySelector('.callout-note .callout-label')?.textContent).toBe('Not');
    expect(compiled.querySelector('.callout-note')?.textContent).toContain('A plain note.');

    const propertyRows = Array.from(compiled.querySelectorAll('.properties-table tbody tr'));
    expect(propertyRows.length).toBe(2);
    expect(propertyRows[0].textContent).toContain('size');
    expect(propertyRows[0].textContent).toContain('"medium"');
    expect(propertyRows[1].textContent).toContain('disabled');

    const relatedLink = compiled.querySelector('.related-list a') as HTMLAnchorElement;
    expect(relatedLink.textContent).toContain('Beta');
    expect(relatedLink.getAttribute('href')).toBe('/test/alpha/beta');

    const tocLabels = Array.from(compiled.querySelectorAll('.page-toc ul a')).map(el =>
      el.textContent?.trim()
    );
    expect(tocLabels).toEqual([
      'Adımlar',
      'Example',
      'Properties',
      'In this section',
      'Related topics'
    ]);
  });

  it('renders an example with an unrecognized exampleLang as plain text, without throwing', async () => {
    const fixture = TestBed.createComponent(TestHost);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/test/gamma');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const code = compiled.querySelector('code');
    expect(code?.textContent).toContain('print("hi")');
    expect(code?.className).not.toContain('language-python');
  });

  it('copies example to clipboard', async () => {
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
