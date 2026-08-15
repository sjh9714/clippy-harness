/**
 * Clippy HTTP routes. The browser half polls one same-origin JSON endpoint,
 * the same pattern as dsh-pet's /api/pet family.
 * @module dsh-clippy/routes
 */

import type { IncomingMessage, ServerResponse } from 'node:http'
import type { WebRoute } from '@deepseek-ai/dsh-host-webserver'
import type { ClippyService } from './service.ts'

/** Browser-facing base path of the clippy API. */
export const CLIPPY_API_PREFIX = '/api/clippy'

function json(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

export function makeClippyRoutes(service: ClippyService): WebRoute[] {
  return [
    {
      kind: 'exact',
      path: `${CLIPPY_API_PREFIX}/state`,
      handler: (req: IncomingMessage, res: ServerResponse): void => {
        if (req.method !== 'GET') {
          json(res, 405, { ok: false, error: 'method-not-allowed' })
          return
        }
        service.state().then(
          (value) => json(res, 200, value),
          (error) => json(res, 500, { ok: false, error: error instanceof Error ? error.message : String(error) }),
        )
      },
    },
  ]
}
