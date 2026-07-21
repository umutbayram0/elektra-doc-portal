import { Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavList } from './shared/nav-list';
import { SearchBox } from './shared/search-box';
import type { NavItem } from './shared/nav-item.model';
import type { DocNode } from './shared/doc-node.model';

import overviewContent from './features/overview/overview-content.json';
import projectsContent from './features/projects/projects-content.json';
import modulesContent from './features/modules/modules-content.json';
import componentsContent from './features/components/components-content.json';
import apiContent from './features/api/api-content.json';
import librariesContent from './features/libraries/libraries-content.json';

function mapFragmentNode(node: DocNode, path: string): NavItem {
  return {
    label: node.title,
    path,
    fragment: node.id,
    children: node.children?.map(child => mapFragmentNode(child, path))
  };
}

function mapRouteNode(node: DocNode, parentPath: string): NavItem {
  const path = `${parentPath}/${node.id}`;
  return {
    label: node.title,
    path,
    children: node.children?.map(child => mapRouteNode(child, path))
  };
}

function fragmentSection(label: string, path: string, cards: DocNode[]): NavItem {
  return { label, path, children: cards.map(card => mapFragmentNode(card, path)) };
}

function routeSection(label: string, path: string, cards: DocNode[]): NavItem {
  return { label, path, children: cards.map(card => mapRouteNode(card, path)) };
}

function navKey(item: NavItem): string {
  return item.fragment ? `${item.path}#${item.fragment}` : item.path;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NgOptimizedImage, NavList, SearchBox],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly navSections: NavItem[] = [
    fragmentSection('Overview', 'overview', overviewContent.cards),
    routeSection('Projects', 'projects', projectsContent.cards),
    routeSection('Modules', 'modules', modulesContent.cards),
    routeSection('Components', 'components', componentsContent.cards),
    routeSection('API', 'api', apiContent.cards),
    routeSection('Libraries', 'libraries', librariesContent.cards)
  ];

  private readonly expandedKeys = signal<ReadonlySet<string>>(new Set(['overview']));
  readonly expanded = this.expandedKeys.asReadonly();

  toggle(item: NavItem): void {
    const key = navKey(item);
    this.expandedKeys.update(current => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }
}
