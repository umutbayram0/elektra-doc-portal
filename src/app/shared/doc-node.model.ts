export interface DocNote {
  type: 'tip' | 'warning' | 'note';
  text: string;
}

export interface DocProperty {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface DocRelatedLink {
  label: string;
  path: string;
}

export interface DocNode {
  id: string;
  title: string;
  description: string;
  steps?: string[];
  example?: string;
  exampleLang?: string;
  exampleFilename?: string;
  notes?: DocNote[];
  properties?: DocProperty[];
  related?: DocRelatedLink[];
  children?: DocNode[];
}
