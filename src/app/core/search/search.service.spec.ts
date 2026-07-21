import { SearchService } from './search.service';

describe('SearchService', () => {
  it('returns no results for an empty query', () => {
    const service = new SearchService();
    expect(service.results()).toEqual([]);
  });

  it('matches items by title, case-insensitively', () => {
    const service = new SearchService();
    service.query.set('route guard');

    const results = service.results();
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(result => result.title === 'Route Guards')).toBe(true);
  });

  it('returns an empty array for a query with no matches', () => {
    const service = new SearchService();
    service.query.set('zzzznonexistent');
    expect(service.results()).toEqual([]);
  });
});
