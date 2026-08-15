/**
 * The paperclip assistant. Character rig adapted from ManzDev/twitch-clippy
 * (ISC). Driven by the host snapshot, with idle micro animations, click and
 * context menu interactions, optional synthesized sounds, and the classic
 * error dialog on failed turns.
 * @module dsh-clippy/client/Clippy
 */
import { type ReactElement } from 'react';
import type { ClippySnapshot } from '../state.ts';
export interface ClippyProps {
    snapshot: ClippySnapshot;
}
export declare function Clippy({ snapshot }: ClippyProps): ReactElement;
//# sourceMappingURL=Clippy.d.ts.map