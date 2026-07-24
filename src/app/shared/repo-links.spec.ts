import { editUrl, REPO_EDIT_BASE_URL } from './repo-links';

describe('editUrl', () => {
  it('builds a GitHub /edit/main/ URL (not /blob/main/) for the given section', () => {
    const url = editUrl('modules');
    expect(url).toContain('/edit/main/');
    expect(url).not.toContain('/blob/main/');
    expect(url).toBe(`${REPO_EDIT_BASE_URL}/modules/modules-content.json`);
  });
});
