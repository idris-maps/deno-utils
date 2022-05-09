export type HandleCodeBlock = (content: string) => Promise<string>;

export interface CodeBlockHandlers {
  [key: string]: HandleCodeBlock;
}
