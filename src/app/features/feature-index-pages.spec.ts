import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { Type } from '@angular/core';

import { Overview } from './overview/overview';
import { Projects } from './projects/projects';
import { Modules } from './modules/modules';
import { ComponentsDoc } from './components/components';
import { ApiDoc } from './api/api';
import { Libraries } from './libraries/libraries';

import overviewContent from './overview/overview-content.json';
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

describe('feature index pages', () => {
  const pages: { name: string; component: Type<unknown>; content: PageContent }[] = [
    { name: 'Overview', component: Overview, content: overviewContent },
    { name: 'Projects', component: Projects, content: projectsContent },
    { name: 'Modules', component: Modules, content: modulesContent },
    { name: 'Components', component: ComponentsDoc, content: componentsContent },
    { name: 'API', component: ApiDoc, content: apiContent },
    { name: 'Libraries', component: Libraries, content: librariesContent }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it.each(pages)('$name renders its title, description and top-level cards', async ({ component, content }) => {
    const fixture = TestBed.createComponent(component);
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
