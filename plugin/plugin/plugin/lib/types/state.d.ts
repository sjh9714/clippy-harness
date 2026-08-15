/**
 * Clippy state machine. Pure and clock-injected. The service derives the
 * phase vocabulary from core rc.6 session events; this module decides which
 * animation plays and what the assistant says, including the classic
 * "It looks like you're..." interjections matched from user messages.
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
/** A contextual interjection triggered by the user's own message. */
export interface ClippyInterjection {
    /** Rule id, used for the once-per-session cooldown. */
    id: string;
    /** The bubble line. */
    line: string;
}
/** Snapshot served to the browser half. */
export interface ClippySnapshot {
    phase: ClippyPhase;
    /** Speech bubble copy for the current phase. */
    bubble: string;
    /** Extra detail line (tool name, failure reason). */
    detail?: string;
    /** Active interjection, shown instead of the phase line while fresh. */
    interjection?: ClippyInterjection;
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
    /** How long an interjection stays on screen, ms. */
    interjectMs: number;
    /** Line table overrides, merged over LINES per phase. */
    lines?: Partial<Record<ClippyPhase, readonly string[]>>;
}
export declare const defaultClippyStateConfig: ClippyStateConfig;
/** The assistant's lines, one voice, no filler. */
export declare const LINES: Record<ClippyPhase, readonly string[]>;
/**
 * The classic interjections. Matched against the user's message text, first
 * hit wins, each rule fires once per session. The joke is the sentence
 * shape, not the punchline.
 */
export declare const INTERJECTIONS: ReadonlyArray<{
    id: string;
    pattern: RegExp;
    line: string;
}>;
/** Pick a line for a phase, stable within one phase activation. */
export declare function lineFor(phase: ClippyPhase, seed: number, overrides?: Partial<Record<ClippyPhase, readonly string[]>>): string;
/** Match one user message against the interjection rules. */
export declare function matchInterjection(text: string, fired: ReadonlySet<string>): ClippyInterjection | undefined;
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
    private interjection;
    private interjectedAt;
    private fired;
    private config;
    constructor(config?: Partial<ClippyStateConfig>);
    onInput(input: ClippyInput, nowMs: number): void;
    onUserMessage(text: string, nowMs: number): void;
    onSessionActive(active: boolean, nowMs: number): void;
    snapshot(nowMs: number): ClippySnapshot;
}
//# sourceMappingURL=state.d.ts.map