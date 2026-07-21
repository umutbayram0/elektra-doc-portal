import { NgTemplateOutlet } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { NavItem } from './nav-item.model';

@Component({
  selector: 'app-nav-list',
  imports: [NgTemplateOutlet, RouterLink, RouterLinkActive],
  templateUrl: './nav-list.html',
  styleUrl: './nav-list.css'
})
export class NavList {
  readonly items = input.required<NavItem[]>();
  readonly expanded = input.required<ReadonlySet<string>>();
  readonly itemToggled = output<NavItem>();

  key(item: NavItem): string {
    return item.fragment ? `${item.path}#${item.fragment}` : item.path;
  }
}
