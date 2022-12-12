// deno-fmt-ignore-file
// deno-lint-ignore-file

const iconAttrs = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 2,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  style: 'width:1em;position:relative;top:0.05em',
}

const downloadIcon = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>'
const fullscreenIcon = '<polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line>'
const closeIcon = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'

/** @type {(parent: HTMLElement, inner: string, label: string, onClick: () => void) => HTMLElement} */
const appendButton = (parent, inner, label, onClick) => {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  Object.entries(iconAttrs).forEach(([k, v]) => { icon.setAttribute(k, String(v)) })
  icon.innerHTML = inner;
  const button = document.createElement('button')
  button.setAttribute('title', label)
  button.addEventListener('click', onClick)
  button.appendChild(icon)
  parent.appendChild(button)
  return button
}

/** @type {(tag: string, className: string) => HTMLElement} */
const createElementWithClass = (tag, className) => {
  const el = document.createElement(tag)
  el.classList.add(className)
  return el
}

/** @type {(parent: HTMLElement, children: HTMLElement[]) => void} */
const append = (parent, children) => {
  children.forEach(child => { parent.appendChild(child) })
}

/** @type {(parent: HTMLElement, svg: SVGElement) => void} */
const goFullscreen = svg => {
  const fullscreenSvg = createElementWithClass('div', 'fullscreen-svg')
  const fullscreenSvgBtns = createElementWithClass('div', 'fullscreen-svg-btns')
  appendButton(fullscreenSvgBtns, closeIcon, 'Close', () => { document.body.removeChild(fullscreenSvg) })
  const fullscreenSvgContainer = createElementWithClass('div', 'fullscreen-svg-container')
  const image = document.createElement('div')
  image.innerHTML = svg.outerHTML
  append(fullscreenSvgContainer, [fullscreenSvgBtns, image])
  append(fullscreenSvg, [fullscreenSvgContainer])
  append(document.body, [fullscreenSvg])
}

/** @type {(svg: SVGElement, lang: string = 'image') => void} */
const downloadSvg = (svg, lang) => {
  const a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(svg.outerHTML))
  a.setAttribute('download', lang + '.svg')
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/** @type {([parent: HTMLElement, svg: SVGElement]) => void} */
const onSvg = ([parent, svg]) => {
  const lang = Array.from(parent.classList).filter(d => d !== 'code')[0]
  const btns = createElementWithClass('div', 'svg-btns')
  appendButton(btns, downloadIcon, 'Download image', () => downloadSvg(svg, lang))
  appendButton(btns, fullscreenIcon, 'View fullscreen', () => goFullscreen(svg))
  parent.insertBefore(btns, svg)
}

/** @type {() => [parent: HTMLElement, svg: SVGElement][]} */
const getSvgs = () => Array.from(document.getElementsByClassName('code'))
  .reduce((r, el) => {
    const svg = el.getElementsByTagName('svg')[0]
    if (svg) { r.push([el, svg]) }
    return r
  }, [])

window.onload = () => { getSvgs().forEach(onSvg) }
