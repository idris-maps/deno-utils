export const listDirFiles = async (folder: string, throwOnError = false) => {
  try {
    const files = Deno.readDir(folder)
    const result: string[] = []
    for await (const file of files) {
      if (file.isFile && file.name.endsWith('.yaml')) {
        result.push(file.name)
      }
    }
    return result
  } catch (e) {
    if (throwOnError) { throw e }
    return []
  }
}
