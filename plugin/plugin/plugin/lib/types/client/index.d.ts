/**
 * dsh-clippy browser half. Mounts the paperclip assistant as a global
 * floating surface on document.body and drives it by polling the host's
 * same-origin /api/clippy/state endpoint, the same pattern as dsh-pet.
 * @module dsh-clippy/client
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
/** Client plugin body: mount the assistant and the poll loop. */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map