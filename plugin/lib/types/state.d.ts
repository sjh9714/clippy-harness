/**
 * Clippy state machine. Pure and clock-injected. The service derives the
 * phase vocabulary from core rc.6 session events; this module decides which
 * animation plays and what the assistant says.
 * @module dsh-clippy/state
 */
/** Working phases derived from core session events. */
export type ClippyPhase = 'idle' | 'thinking' | 'tool' | 'done' | 'failed';
/** One input snapshot consumed by the machine. */
export interface ClippyInput {
    phase: ClippyPhase;
    /** Extra detail line, e.g. the tool name or the failure reason kind. */
    detail?: string;
}
/** Snapshot served to the browser half. */
export interface ClippySnapshot {
    phase: ClippyPhase;
    /** Speech bubble copy for the current phase. */
    bubble: string;
    /** Extra detail line (tool name, failure reason). */
    detail?: string;
    /** Wall-clock ms the current phase started. */
    phaseStartedAt: number;
    /** True when there is an active session. */
    sessionActive: boolean;
}
/** Machine configuration. */
export interface ClippyStateConfig {
    /** Celebration window after done before settling to idle, ms. */
    celebrateMs: number;
    /** Minimum time the tool pose stays visible before thinking may replace it, ms. */
    toolHoldMs: number;
}
export declare const defaultClippyStateConfig: ClippyStateConfig;
/** The assistant's lines, one voice, no filler. */
export declare const LINES: Record<ClippyPhase, readonly string[]>;
/** Pick a line for a phase, stable within one phase activation. */
export declare function lineFor(phase: ClippyPhase, seed: number): string;
/**
 * The machine holds the last phase and settles done back to idle after the
 * celebration window. failed is sticky until the next turn starts, so the
 * dialog stays up long enough to be read (the client can dismiss locally).
 */
export declare class ClippyStateMachine {
    private phase;
    private detail;
    private phaseStartedAt;
    private seed;
    private sessionActive;
    private config;
    constructor(config?: Partial<ClippyStateConfig>);
    onInput(input: ClippyInput, nowMs: number): void;
    onSessionActive(active: boolean, nowMs: number): void;
    snapshot(nowMs: number): ClippySnapshot;
}
//# sourceMappingURL=state.d.ts.map