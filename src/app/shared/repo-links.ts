// /edit/main/, not /blob/main/, so this opens GitHub's editor. Leave empty to hide the link.
export const REPO_EDIT_BASE_URL =
  'https://github.com/umutbayram0/elektra-doc-portal/edit/main/src/app/features';

export function editUrl(basePath: string): string | undefined {
  if (!REPO_EDIT_BASE_URL) {
    return undefined;
  }
  return `${REPO_EDIT_BASE_URL}/${basePath}/${basePath}-content.json`;
}
