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
});
