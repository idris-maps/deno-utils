import { LayoutConfig, getLayoutConfig, parseYaml } from '../deps.ts'

const checkFileExists = async (filename: string) => {
  try {
    const fileInfo = await Deno.stat(filename);
    if (fileInfo.isFile) { return true }
    throw new Error(`[layout config] ${filename} is not a file`)
  } catch (err) {
    throw new Error(`[layout config] could not read ${filename}: ${err.message}`)
  }
}

const parseAsJson = (file: string) => {
  try {
    return JSON.parse(file)
  } catch (err) {
    throw new Error(`[layout config] could not read file as json: ${err.message}`)
  }
}

const parseAsYaml = (file: string) => {
  try {
    return parseYaml(file)
  } catch (err) {
    throw new Error(`[layout config] could not read file as yaml: ${err.message}`)
  }
}

export const readLayoutConfig = async (filename?: string): Promise<Partial<LayoutConfig>> => {
  if (!filename) { return {} }
  await checkFileExists(filename)
  const file = await Deno.readTextFile(filename)
  const content = filename.endsWith('.json') ? parseAsJson(file) : parseAsYaml(file)
  return getLayoutConfig(content, {}, [], [])
}
