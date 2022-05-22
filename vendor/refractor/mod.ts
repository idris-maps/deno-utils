import * as refractor from './refractor.js'

export const highlight = (content: string, lang: string): string =>
    refractor.highlight(content, lang)

export const getLangs = (): string[] => refractor.getLangs() 
