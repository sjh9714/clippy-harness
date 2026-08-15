/**
 * Clippy state machine. Pure and clock-injected. The service derives the
 * phase vocabulary from core rc.6 session events; this module decides which
 * animation plays and what the assistant says.
 * @module dsh-clippy/state
 */
export const defaultClippyStateConfig = { celebrateMs: 4000, toolHoldMs: 1500 };
/** The assistant's lines, one voice, no filler. */
export const LINES = {
    idle: [
        'It looks like you’re writing code. This time I can actually help.',
        'Twenty five years of watching. Ready when you are.',
    ],
    thinking: [
        'Hmm. Reading your codebase. All of it. Unlike 1997.',
        'Thinking. For real this time.',
    ],
    tool: [
        'Running tools. Real exit codes only.',
        'Working. Do not turn off your computer.',
    ],
    done: [
        'That actually worked. I checked. Twice.',
        'Done. It only took me one career comeback.',
    ],
    failed: [
        'Your agent has performed an illegal operation.',
    ],
};
/** Pick a line for a phase, stable within one phase activation. */
export function lineFor(phase, seed) {
    const pool = LINES[phase];
    return pool[Math.abs(seed) % pool.length];
}
/**
 * The machine holds the last phase and settles done back to idle after the
 * celebration window. failed is sticky until the next turn starts, so the
 * dialog stays up long enough to be read (the client can dismiss locally).
 */
export class ClippyStateMachine {
    phase = 'idle';
    detail;
    phaseStartedAt = 0;
    seed = 0;
    sessionActive = false;
    config;
    constructor(config = {}) {
        this.config = { ...defaultClippyStateConfig, ...config };
    }
    onInput(input, nowMs) {
        if (input.phase === this.phase && input.detail === this.detail)
            return;
        // Tool calls are often much shorter than one client poll. Hold the tool
        // pose briefly so the browser actually gets to show it.
        if (this.phase === 'tool' && input.phase === 'thinking' && nowMs - this.phaseStartedAt < this.config.toolHoldMs)
            return;
        this.phase = input.phase;
        this.detail = input.detail;
        this.phaseStartedAt = nowMs;
        this.seed += 1;
    }
    onSessionActive(active, nowMs) {
        this.sessionActive = active;
        if (!active)
            this.onInput({ phase: 'idle' }, nowMs);
    }
    snapshot(nowMs) {
        let phase = this.phase;
        if (phase === 'done' && nowMs - this.phaseStartedAt > this.config.celebrateMs) {
            phase = 'idle';
        }
        return {
            phase,
            bubble: lineFor(phase, this.seed),
            detail: phase === this.phase ? this.detail : undefined,
            phaseStartedAt: this.phaseStartedAt,
            sessionActive: this.sessionActive,
        };
    }
}
