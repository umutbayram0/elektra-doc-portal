import { Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';
import json from 'highlight.js/lib/languages/json';
import http from 'highlight.js/lib/languages/http';
import bash from 'highlight.js/lib/languages/bash';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('json', json);
hljs.registerLanguage('http', http);
hljs.registerLanguage('bash', bash);
import { Breadcrumbs } from './breadcrumbs';
import type { BreadcrumbItem } from './breadcrumb.model';
import { findNodePath } from './find-node-path';
import { NodeTile } from './node-tile';
import type { DocNode } from './doc-node.model';
import type { SectionContent } from './section-content.model';
import { editUrl } from './repo-links';

interface TocItem {
  id: string;
  label: string;
}

const NOTE_LABELS: Record<'tip' | 'warning' | 'note', string> = {
  tip: 'Tip',
  warning: 'Warning',
  note: 'Note'
};

@Component({
  selector: 'app-node-detail',
  imports: [NodeTile, Breadcrumbs, RouterLink],
  template: `
    @if (node(); as current) {
      <div class="detail-layout">
        <div class="detail-main">
          <app-breadcrumbs [items]="breadcrumbItems()" />

          <h1>{{ current.title }}</h1>

          <p class="page-description">
            {{ current.description }}
          </p>

          @if (editHref(); as href) {
            <a class="edit-link" [href]="href" target="_blank" rel="noopener">Edit this page on GitHub</a>
          }

          @if (current.notes && current.notes.length > 0) {
            <div class="callouts">
              @for (note of current.notes; track $index) {
                <div class="callout" [class]="'callout-' + note.type">
                  <span class="callout-label">{{ noteLabel(note.type) }}</span>
                  <p>{{ note.text }}</p>
                </div>
              }
            </div>
          }

          @if (current.example) {
            <h2 id="example">Example</h2>
            <div class="code-block">
              <div class="code-block-header">
                <span>{{ current.exampleFilename || 'Example' }}</span>
                <button type="button" class="copy-button" (click)="copyExample()">
                  {{ copied() ? 'Copied' : 'Copy' }}
                </button>
              </div>
              <pre class="code-block-pre"><code #codeEl class="code-block-code"></code></pre>
            </div>
          }

          @if (current.properties && current.properties.length > 0) {
            <h2 id="properties">Properties</h2>
            <div class="properties-table-wrap">
              <table class="properties-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  @for (prop of current.properties; track prop.name) {
                    <tr>
                      <td><code>{{ prop.name }}</code></td>
                      <td><code>{{ prop.type }}</code></td>
                      <td>
                        @if (prop.default) {
                          <code>{{ prop.default }}</code>
                        } @else {
                          <span class="prop-default-empty">&mdash;</span>
                        }
                      </td>
                      <td>{{ prop.description }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          @if (current.children && current.children.length > 0) {
            <h2 id="in-this-section">In this section</h2>
            <section class="card-grid">
              @for (child of current.children; track child.id) {
                <app-node-tile [title]="child.title" [description]="child.description" [path]="childPath(child)" />
              }
            </section>
          }

          @if (current.related && current.related.length > 0) {
            <h2 id="related">Related topics</h2>
            <ul class="related-list">
              @for (item of current.related; track item.path) {
                <li><a [routerLink]="'/' + item.path">{{ item.label }}</a></li>
              }
            </ul>
          }
        </div>

        @if (tocItems().length > 0) {
          <nav class="page-toc" aria-label="On this page">
            <p class="page-toc-title">On this page</p>
            <ul>
              @for (item of tocItems(); track item.id) {
                <li><a [href]="'#' + item.id">{{ item.label }}</a></li>
              }
            </ul>
          </nav>
        }
      </div>
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
  private readonly cards = (this.route.snapshot.data['content'] as SectionContent).cards;

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

  readonly editHref = computed(() => editUrl(this.basePath));

  readonly tocItems = computed<TocItem[]>(() => {
    const current = this.node();
    if (!current) {
      return [];
    }
    const items: TocItem[] = [];
    if (current.example) {
      items.push({ id: 'example', label: 'Example' });
    }
    if (current.properties?.length) {
      items.push({ id: 'properties', label: 'Properties' });
    }
    if (current.children?.length) {
      items.push({ id: 'in-this-section', label: 'In this section' });
    }
    if (current.related?.length) {
      items.push({ id: 'related', label: 'Related topics' });
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

  protected readonly copied = signal(false);
  private copiedTimeout?: ReturnType<typeof setTimeout>;

  copyExample(): void {
    const current = this.node();
    if (!current?.example) {
      return;
    }
    navigator.clipboard
      .writeText(current.example)
      .then(() => {
        this.copied.set(true);
        clearTimeout(this.copiedTimeout);
        this.copiedTimeout = setTimeout(() => this.copied.set(false), 2000);
      })
      .catch(() => {
        // Clipboard access can be denied by the browser; the button simply stays "Copy".
      });
  }

  noteLabel(type: 'tip' | 'warning' | 'note'): string {
    return NOTE_LABELS[type];
  }

  childPath(child: DocNode): string {
    return [this.basePath, ...this.segments(), child.id].join('/');
  }
}
