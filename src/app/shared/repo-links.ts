/**
 * Base "blob" URL of the GitHub repo's features folder.
 * Leave empty to hide every "Edit this page" link.
 */
export const REPO_EDIT_BASE_URL = 'https://github.com/umutbayram0/elektra-doc-portal/blob/main/src/app/features';

export function editUrl(basePath: string): string | undefined {
  if (!REPO_EDIT_BASE_URL) {
    return undefined;
  }
  return `${REPO_EDIT_BASE_URL}/${basePath}/${basePath}-content.json`;
}
