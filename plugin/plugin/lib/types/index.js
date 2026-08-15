/**
 * dsh-clippy host half. Mounts the clippy state service and its HTTP route.
 * The browser half (./client) renders the paperclip assistant and drives it
 * through the same-origin /api/clippy/state endpoint.
 * @module dsh-clippy
 */
import { ClippyService } from "./service.js";
import { makeClippyRoutes } from "./routes.js";
export { ClippyService } from "./service.js";
export { ClippyStateMachine, defaultClippyStateConfig, lineFor, LINES, } from "./state.js";
export { CLIPPY_API_PREFIX, makeClippyRoutes } from "./routes.js";
/** Stable cordis plugin name (matches cordis.patch.yml insert id). */
export const name = 'clippy';
/** Services required before clippy can mount its route. */
export const inject = ['webServer'];
/** Register the clippy service and its API route on the context. */
export function apply(ctx, config = {}) {
    const service = new ClippyService(ctx, config);
    ctx.effect(() => {
        const disposers = makeClippyRoutes(service).map((route) => ctx.webServer.register(route));
        return () => { for (const dispose of disposers)
            dispose(); };
    }, 'clippy: routes');
}
