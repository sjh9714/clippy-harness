/**
 * The paperclip assistant. Floating SVG character driven by the host
 * snapshot, with a speech bubble, drag to reposition, hide and summon, and
 * a classic error dialog on failed turns.
 * @module dsh-clippy/client/Clippy
 */
import { type ReactElement } from 'react';
import type { ClippySnapshot } from '../state.ts';
export interface ClippyProps {
    snapshot: ClippySnapshot;
}
export declare function Clippy({ snapshot }: ClippyProps): ReactElement;
//# sourceMappingURL=Clippy.d.ts.map