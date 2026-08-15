/**
 * dsh-clippy host half. Mounts the clippy state service and its HTTP route.
 * The browser half (./client) renders the paperclip assistant and drives it
 * through the same-origin /api/clippy/state endpoint.
 * @module dsh-clippy
 */

import { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-host-webserver'
import { ClippyService, type ClippyConfig } from './service.ts'
import { makeClippyRoutes } from './routes.ts'

export { ClippyService } from './service.ts'
export type { ClippyConfig } from './service.ts'
export {
  ClippyStateMachine,
  defaultClippyStateConfig,
  lineFor,
  LINES,
} from './state.ts'
export type {
  ClippyInput,
  ClippyPhase,
  ClippySnapshot,
  ClippyStateConfig,
} from './state.ts'
export { CLIPPY_API_PREFIX, makeClippyRoutes } from './routes.ts'

/** Stable cordis plugin name (matches cordis.patch.yml insert id). */
export const name = 'clippy'

/** Services required before clippy can mount its route. */
export const inject = ['webServer']

/** Register the clippy service and its API route on the context. */
export function apply(ctx: Context, config: ClippyConfig = {}): void {
  const service = new ClippyService(ctx, config)
  ctx.effect(() => {
    const disposers = makeClippyRoutes(service).map((route) => ctx.webServer.register(route))
    return () => { for (const dispose of disposers) dispose() }
  }, 'clippy: routes')
}
