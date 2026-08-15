/**
 * Clippy host service. Maps core rc.6 session events (turn/step/tool
 * boundaries and the session lifecycle) onto the assistant's phases and
 * serves the snapshot to the browser half.
 * @module dsh-clippy/service
 */
import { Service } from '@deepseek-ai/cordis';
import { ClippyStateMachine, defaultClippyStateConfig } from "./state.js";
export class ClippyService extends Service {
    static inject = [];
    machine;
    constructor(ctx, config = {}) {
        super(ctx, 'clippy');
        this.machine = new ClippyStateMachine({ ...defaultClippyStateConfig, ...config.state });
        ctx.effect(() => {
            const disposers = [
                ctx.on('session/event', (_session, event) => {
                    const now = Date.now();
                    this.machine.onSessionActive(true, now);
                    switch (event.type) {
                        case 'turn/start':
                        case 'step/start':
                        case 'assistant/chunk':
                            this.machine.onInput({ phase: 'thinking' }, now);
                            break;
                        case 'tool/call':
                            this.machine.onInput({ phase: 'tool', detail: event.data.name }, now);
                            break;
                        case 'turn/end': {
                            const reason = event.data.reason;
                            if (reason?.kind === 'completed') {
                                this.machine.onInput({ phase: 'done' }, now);
                            }
                            else {
                                this.machine.onInput({ phase: 'failed', detail: reason?.kind }, now);
                            }
                            break;
                        }
                    }
                }),
                ctx.on('session/disposed', () => {
                    this.machine.onSessionActive(false, Date.now());
                }),
            ];
            return () => { for (const dispose of disposers)
                dispose(); };
        }, 'clippy: session events');
    }
    state() {
        return Promise.resolve(this.machine.snapshot(Date.now()));
    }
}
