export interface NavItem {
  label: string;
  path: string;
  fragment?: string;
  children?: NavItem[];
}
