export interface HeadTag {
  tag: string;
  props?: Record<string, string>;
  content?: string;
}

export interface LayoutConfig {
  css: string[];
  scripts: string[];
  title: string;
  lang: string;
  headTags: HeadTag[];
}
