import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FeatureIndex } from '../shared/feature-index';
import { Overview } from './overview/overview';

import overviewContent from './overview/overview-content.json';
import gettingStartedContent from './getting-started/getting-started-content.json';
import guidesContent from './guides/guides-content.json';
import projectsContent from './projects/projects-content.json';
import modulesContent from './modules/modules-content.json';
import componentsContent from './components/components-content.json';
import apiContent from './api/api-content.json';
import librariesContent from './libraries/libraries-content.json';

interface PageContent {
  title: string;
  description: string;
  cards: { title: string }[];
}

describe('Overview page', () => {
  it('renders its title, description and top-level cards', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(Overview);
    fixture.detectChanges();
    await fixture.whenStable();

    const content = overviewContent as PageContent;
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(content.title);
    expect(compiled.textContent).toContain(content.description);
    for (const card of content.cards) {
      expect(compiled.textContent).toContain(card.title);
    }
  });
});

describe('FeatureIndex', () => {
  const sections: { name: string; basePath: string; content: PageContent }[] = [
    { name: 'Getting Started', basePath: 'getting-started', content: gettingStartedContent },
    { name: 'Guides', basePath: 'guides', content: guidesContent },
    { name: 'Projects', basePath: 'projects', content: projectsContent },
    { name: 'Modules', basePath: 'modules', content: modulesContent },
    { name: 'Components', basePath: 'components', content: componentsContent },
    { name: 'API', basePath: 'api', content: apiContent },
    { name: 'Libraries', basePath: 'libraries', content: librariesContent }
  ];

  it.each(sections)('$name renders its title, description and top-level cards', async ({ basePath, content }) => {
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
    for (const card of content.cards) {
      expect(compiled.textContent).toContain(card.title);
    }
  });
});
