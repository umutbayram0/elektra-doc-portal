import { SearchService } from './search.service';

describe('SearchService', () => {
  it('returns no results for an empty query', () => {
    const service = new SearchService();
    expect(service.results()).toEqual([]);
  });

  it('matches items by title, case-insensitively', () => {
    const service = new SearchService();
    service.query.set('projects');

    const results = service.results();
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(result => result.title === 'Yeni Bir Doküman Sayfası Ekleme')).toBe(true);
  });

  it('returns nothing for an unmatched query', () => {
    const service = new SearchService();
    service.query.set('zzzznonexistent');
    expect(service.results()).toEqual([]);
  });
});
