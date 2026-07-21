import { Component, computed, effect, ElementRef, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';
import json from 'highlight.js/lib/languages/json';
import http from 'highlight.js/lib/languages/http';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('json', json);
hljs.registerLanguage('http', http);
import { Breadcrumbs } from './breadcrumbs';
import type { BreadcrumbItem } from './breadcrumb.model';
import { NodeTile } from './node-tile';
import type { DocNode } from './doc-node.model';

function findNodePath(nodes: DocNode[], segments: string[]): DocNode[] | undefined {
  const [id, ...rest] = segments;
  const match = nodes.find(node => node.id === id);
  if (!match) {
    return undefined;
  }
  if (!rest.length) {
    return [match];
  }
  const childPath = findNodePath(match.children ?? [], rest);
  return childPath ? [match, ...childPath] : undefined;
}

@Component({
  selector: 'app-node-detail',
  imports: [NodeTile, Breadcrumbs],
  template: `
    @if (node(); as current) {
      <app-breadcrumbs [items]="breadcrumbItems()" />

      <h1>{{ current.title }}</h1>

      <p class="page-description">
        {{ current.description }}
      </p>

      @if (current.example) {
        <div class="code-block">
          @if (current.exampleFilename) {
            <div class="code-block-header">{{ current.exampleFilename }}</div>
          }
          <pre class="code-block-pre"><code #codeEl class="code-block-code"></code></pre>
        </div>
      }

      @if (current.children && current.children.length > 0) {
        <section class="card-grid">
          @for (child of current.children; track child.id) {
            <app-node-tile [title]="child.title" [description]="child.description" [path]="childPath(child)" />
          }
        </section>
      }
    } @else {
      <p class="page-description">Content not found.</p>
    }
  `,
  styleUrls: ['./content-page.css', './node-detail.css']
})
export class NodeDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly basePath = this.route.snapshot.data['basePath'] as string;
  private readonly sectionLabel = this.route.snapshot.data['sectionLabel'] as string;
  private readonly cards = (this.route.snapshot.data['content'] as { cards: DocNode[] }).cards;

  private readonly segments = toSignal(
    this.route.url.pipe(map(urlSegments => urlSegments.map(segment => segment.path))),
    { initialValue: this.route.snapshot.url.map(segment => segment.path) }
  );

  private readonly nodePath = computed(() => findNodePath(this.cards, this.segments()));
  readonly node = computed(() => this.nodePath()?.at(-1));

  readonly breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const ancestors = this.nodePath() ?? [];
    const items: BreadcrumbItem[] = [{ label: this.sectionLabel, path: this.basePath }];
    let path = this.basePath;
    for (const ancestor of ancestors) {
      path = `${path}/${ancestor.id}`;
      items.push({ label: ancestor.title, path });
    }
    return items;
  });

  private readonly codeEl = viewChild<ElementRef<HTMLElement>>('codeEl');

  private readonly highlightCode = effect(() => {
    const element = this.codeEl();
    const current = this.node();
    if (!element || !current?.example) {
      return;
    }
    const code = element.nativeElement;
    code.className = `code-block-code language-${current.exampleLang ?? 'plaintext'}`;
    code.textContent = current.example;
    delete code.dataset['highlighted'];
    hljs.highlightElement(code);
  });

  childPath(child: DocNode): string {
    return [this.basePath, ...this.segments(), child.id].join('/');
  }
}
