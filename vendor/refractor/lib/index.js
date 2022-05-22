import refractor from 'refractor'
import { toHtml } from 'hast-util-to-html'

export const highlight = (content, lang) => {
  if (!refractor.registered(lang)) { throw new Error('Unknown language: ' + lang) }
  const tree = refractor.highlight(content, lang)
  return toHtml(tree)
}

export const getLangs = () => refractor.listLanguages()
