import { Component, computed, effect, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { NavList } from './shared/nav-list';
import { SearchBox } from './shared/search-box';
import type { NavItem } from './shared/nav-item.model';
import type { DocNode } from './shared/doc-node.model';

import projectsContent from './features/projects/projects-content.json';
import modulesContent from './features/modules/modules-content.json';
import componentsContent from './features/components/components-content.json';
import apiContent from './features/api/api-content.json';
import librariesContent from './features/libraries/libraries-content.json';

function mapNode(node: DocNode, parentPath: string): NavItem {
  const path = `${parentPath}/${node.id}`;
  return { label: node.title, path, children: node.children?.map(child => mapNode(child, path)) };
}

function section(label: string, path: string, cards: DocNode[]): NavItem {
  return { label, path, children: cards.map(card => mapNode(card, path)) };
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NgOptimizedImage, NavList, SearchBox],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly router = inject(Router);

  readonly navSections: NavItem[] = [
    section('Projects', 'projects', projectsContent.cards),
    section('Modules', 'modules', modulesContent.cards),
    section('Components', 'components', componentsContent.cards),
    section('API', 'api', apiContent.cards),
    section('Libraries', 'libraries', librariesContent.cards)
  ];

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  private readonly activeAncestorKeys = computed(() => {
    const segments = this.currentUrl()
      .split(/[?#]/)[0]
      .split('/')
      .filter(Boolean);
    const keys = new Set<string>();
    const walk = (items: NavItem[]) => {
      for (const item of items) {
        const itemSegments = item.path.split('/');
        const isAncestor =
          itemSegments.length < segments.length && itemSegments.every((segment, i) => segment === segments[i]);
        if (isAncestor) {
          keys.add(item.path);
        }
        if (item.children) {
          walk(item.children);
        }
      }
    };
    walk(this.navSections);
    return keys;
  });

  private readonly toggledKeys = signal<ReadonlySet<string>>(new Set());
  readonly expanded = computed(() => new Set([...this.toggledKeys(), ...this.activeAncestorKeys()]));

  readonly mobileNavOpen = signal(false);

  private readonly closeMobileNavOnNavigation = effect(() => {
    this.currentUrl();
    this.mobileNavOpen.set(false);
  });

  toggle(item: NavItem): void {
    this.toggledKeys.update(current => {
      const next = new Set(current);
      if (next.has(item.path)) {
        next.delete(item.path);
      } else {
        next.add(item.path);
      }
      return next;
    });
  }

  toggleMobileNav(): void {
    this.mobileNavOpen.update(open => !open);
  }
}
