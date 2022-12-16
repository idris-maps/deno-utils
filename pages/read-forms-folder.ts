import { parseYaml, isRecord, FormsDb, initFormHandlers, listDirFiles, isString } from './deps.ts'

const getDefinition = async (
  folder: string,
  filename: string,
): Promise<{name:string,[key:string]:unknown}|undefined> => {
  try {
    const content = await Deno.readTextFile(`${folder}/${filename}`)
    const name = filename.split('.')[0]
    const json = parseYaml(content)
    return { name, ...(isRecord(json) ? json : {}) }
  } catch {
    return undefined
  }
}

const handleFile = async (
  formsDb: FormsDb,
  folder: string,
  filename: string,
  existingForms: string[]
) => {
  const path = `${folder}/${filename}`
  try {
    const data = await getDefinition(folder, filename)
    if (!data) {
      console.log(`- ignoring "${path}": could not read form definition`)
      return
    }
    if (existingForms.includes(data.name)) {
      console.log(`- ignoring "${path}": form "${data.name}" already exists`)
      return
    }
    const handlers = initFormHandlers(formsDb)
    const { status, body } = await handlers.forms.post({ data, params: {}, query: {} })
    if (status === 200) {
      console.log(`- created form "${data.name}" from "${path}"`)
      return
    }
    const error = isString(body.message) ? body.message : JSON.stringify(body)
    console.log(`- could not create form from "${path}": ${error}`)
    return
  } catch (err) {
    console.log(`- could not create form from "${path}": ${err.message}`)
    return
  }
}

interface Props {
  formsDb: FormsDb
  folder: string
}

export const readFormsFolder = async ({ formsDb, folder }: Props) => {
  const existingForms = (await formsDb.forms.list()).map(d => d.name)
  const files = await listDirFiles(folder)
  
  const loop = async (filenames: string[]): Promise<void> => {
    const [filename, ...rest] = filenames
    if (!filename) { return }
    await handleFile(formsDb, folder, filename, existingForms)
    return loop(rest)
  }

  await loop(files)
  return
}
