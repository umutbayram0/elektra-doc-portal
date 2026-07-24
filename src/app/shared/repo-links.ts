/**
 * Base "edit" URL of the GitHub repo's features folder — uses /edit/main/
 * (not /blob/main/) so the link opens GitHub's editor directly.
 * Leave empty to hide every "Edit this page" link.
 */
export const REPO_EDIT_BASE_URL =
  'https://github.com/umutbayram0/elektra-doc-portal/edit/main/src/app/features';

export function editUrl(basePath: string): string | undefined {
  if (!REPO_EDIT_BASE_URL) {
    return undefined;
  }
  return `${REPO_EDIT_BASE_URL}/${basePath}/${basePath}-content.json`;
}
