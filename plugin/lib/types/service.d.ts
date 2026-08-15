/**
 * Clippy host service. Maps core rc.6 session events (turn/step/tool
 * boundaries and the session lifecycle) onto the assistant's phases and
 * serves the snapshot to the browser half.
 * @module dsh-clippy/service
 */
import { Context, Service } from '@deepseek-ai/cordis';
import { type ClippySnapshot, type ClippyStateConfig } from './state.ts';
/** Plugin configuration. */
export interface ClippyConfig {
    state?: Partial<ClippyStateConfig>;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        clippy: ClippyService;
    }
}
export declare class ClippyService extends Service {
    static readonly inject: string[];
    private machine;
    constructor(ctx: Context, config?: ClippyConfig);
    state(): Promise<ClippySnapshot>;
}
//# sourceMappingURL=service.d.ts.map