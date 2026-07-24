import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NodeTile } from './node-tile';

describe('NodeTile', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders title, description and link', async () => {
    const fixture = TestBed.createComponent(NodeTile);
    fixture.componentRef.setInput('title', 'Route Guards');
    fixture.componentRef.setInput('description', 'Guards description');
    fixture.componentRef.setInput('path', 'modules/authentication/route-guards');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Route Guards');
    expect(compiled.textContent).toContain('Guards description');
    expect(compiled.querySelector('a')?.getAttribute('href')).toBe(
      '/modules/authentication/route-guards'
    );
  });
});
