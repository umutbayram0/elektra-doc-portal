/**
 * Base "blob" URL of the GitHub repo's features folder, e.g.
 * 'https://github.com/elektraweb/elektra-doc-portal/blob/main/src/app/features'.
 * Leave empty to hide every "Edit this page" link — there's no remote configured yet.
 */
export const REPO_EDIT_BASE_URL = '';

export function editUrl(basePath: string): string | undefined {
  if (!REPO_EDIT_BASE_URL) {
    return undefined;
  }
  return `${REPO_EDIT_BASE_URL}/${basePath}/${basePath}-content.json`;
}
