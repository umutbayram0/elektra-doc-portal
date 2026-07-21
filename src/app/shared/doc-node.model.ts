export interface DocNode {
  id: string;
  title: string;
  description: string;
  example?: string;
  exampleLang?: string;
  exampleFilename?: string;
  children?: DocNode[];
}
