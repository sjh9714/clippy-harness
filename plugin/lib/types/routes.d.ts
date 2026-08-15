/**
 * Clippy HTTP routes. The browser half polls one same-origin JSON endpoint,
 * the same pattern as dsh-pet's /api/pet family.
 * @module dsh-clippy/routes
 */
import type { WebRoute } from '@deepseek-ai/dsh-host-webserver';
import type { ClippyService } from './service.ts';
/** Browser-facing base path of the clippy API. */
export declare const CLIPPY_API_PREFIX = "/api/clippy";
export declare function makeClippyRoutes(service: ClippyService): WebRoute[];
//# sourceMappingURL=routes.d.ts.map