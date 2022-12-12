import { serve } from '../deps.ts'
import { initAssetsHandler } from './assets-router.ts'
import { initPageHandler } from './page-router.ts'
import { Log } from './types.d.ts'
import { PageDb } from '../db/types.d.ts'

interface Props {
  assetsFolder?: string
  layoutConfig?: string
  log?: Log
  pageDb: PageDb
  port?: number
}

export const startServer = async ({ assetsFolder, layoutConfig, log, pageDb, port }: Props) => {
  const assetsHandler = initAssetsHandler(log)
  const pageHandler = initPageHandler(pageDb, await pageDb.getLayoutConfig(layoutConfig), log)

  const handler = (request: Request): Promise<Response> => {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith(`/${assetsFolder || 'assets'}`)) {
      return assetsHandler(request)
    }

    return pageHandler(request)
  }

  serve(handler, { port: port || 3333 })

  console.log(`Server started on port ${port || 3333}`)
}
