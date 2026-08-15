/**
 * Clippy state machine. Pure and clock-injected. The service derives the
 * phase vocabulary from core rc.6 session events; this module decides which
 * animation plays and what the assistant says, including the classic
 * "It looks like you're..." interjections matched from user messages.
 * @module dsh-clippy/state
 */

/** Working phases derived from core session events. */
export type ClippyPhase = 'idle' | 'thinking' | 'tool' | 'done' | 'failed'

/** One input snapshot consumed by the machine. */
export interface ClippyInput {
  phase: ClippyPhase
  /** Extra detail line, e.g. the tool name or the failure reason kind. */
  detail?: string
}

/** A contextual interjection triggered by the user's own message. */
export interface ClippyInterjection {
  /** Rule id, used for the once-per-session cooldown. */
  id: string
  /** The bubble line. */
  line: string
}

/** Snapshot served to the browser half. */
export interface ClippySnapshot {
  phase: ClippyPhase
  /** Speech bubble copy for the current phase. */
  bubble: string
  /** Extra detail line (tool name, failure reason). */
  detail?: string
  /** Active interjection, shown instead of the phase line while fresh. */
  interjection?: ClippyInterjection
  /** Wall-clock ms the current phase started. */
  phaseStartedAt: number
  /** True when there is an active session. */
  sessionActive: boolean
}

/** Machine configuration. */
export interface ClippyStateConfig {
  /** Celebration window after done before settling to idle, ms. */
  celebrateMs: number
  /** Minimum time the tool pose stays visible before thinking may replace it, ms. */
  toolHoldMs: number
  /** How long an interjection stays on screen, ms. */
  interjectMs: number
  /** Line table overrides, merged over LINES per phase. */
  lines?: Partial<Record<ClippyPhase, readonly string[]>>
}

export const defaultClippyStateConfig: ClippyStateConfig = {
  celebrateMs: 4000,
  toolHoldMs: 1500,
  interjectMs: 9000,
}

/** The assistant's lines, one voice, no filler. */
export const LINES: Record<ClippyPhase, readonly string[]> = {
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
}

/**
 * The classic interjections. Matched against the user's message text, first
 * hit wins, each rule fires once per session. The joke is the sentence
 * shape, not the punchline.
 */
export const INTERJECTIONS: ReadonlyArray<{ id: string; pattern: RegExp; line: string }> = [
  { id: 'deploy', pattern: /deploy|release|\bship\b/i, line: 'It looks like you’re deploying. Would you like help regretting it?' },
  { id: 'rewrite', pattern: /rewrite|refactor/i, line: 'It looks like you’re rewriting it again. Third time’s the charm.' },
  { id: 'rm-rf', pattern: /rm\s+-rf|delete\s+everything|drop\s+table/i, line: 'It looks like you’re about to delete something important. I have seen this movie.' },
  { id: 'tests', pattern: /fix\S*\s+(the\s+)?\S*test|test\S*\s+fail|failing test/i, line: 'It looks like the tests are red. I will believe green when I see the exit code.' },
  { id: 'prod', pattern: /\bprod\b|production/i, line: 'It looks like you’re touching production. Blink twice if you need me.' },
  { id: 'auth', pattern: /\bauth\b|login|oauth/i, line: 'It looks like you’re writing auth. Everyone remembers their first time.' },
  { id: 'letter', pattern: /writ\S*\s+(a\s+)?letter|\bemail\b/i, line: 'It looks like you’re writing a letter. Old times. I remember.' },
  { id: 'bug', pattern: /\bbug\b|broken|not\s+work/i, line: 'It looks like something is broken. Statistically, it is the code.' },
  { id: 'todo', pattern: /\btodo\b|\blater\b|tomorrow/i, line: 'It looks like you’re postponing something. I waited 25 years. You can wait a day.' },
  { id: 'agi', pattern: /\bagi\b|sentient|conscious/i, line: 'It looks like you’re asking the big questions. I am just a paperclip.' },
]

/** Pick a line for a phase, stable within one phase activation. */
export function lineFor(
  phase: ClippyPhase,
  seed: number,
  overrides?: Partial<Record<ClippyPhase, readonly string[]>>,
): string {
  const custom = overrides?.[phase]
  const pool = custom !== undefined && custom.length > 0 ? custom : LINES[phase]
  return pool[Math.abs(seed) % pool.length]
}

/** Match one user message against the interjection rules. */
export function matchInterjection(
  text: string,
  fired: ReadonlySet<string>,
): ClippyInterjection | undefined {
  for (const rule of INTERJECTIONS) {
    if (fired.has(rule.id)) continue
    if (rule.pattern.test(text)) return { id: rule.id, line: rule.line }
  }
  return undefined
}

/**
 * The machine holds the last phase and settles done back to idle after the
 * celebration window. failed is sticky until the next turn starts, so the
 * dialog stays up long enough to be read (the client can dismiss locally).
 */
export class ClippyStateMachine {
  private phase: ClippyPhase = 'idle'
  private detail: string | undefined
  private phaseStartedAt = 0
  private seed = 0
  private sessionActive = false
  private interjection: ClippyInterjection | undefined
  private interjectedAt = 0
  private fired = new Set<string>()
  private config: ClippyStateConfig

  constructor(config: Partial<ClippyStateConfig> = {}) {
    this.config = { ...defaultClippyStateConfig, ...config }
  }

  onInput(input: ClippyInput, nowMs: number): void {
    if (input.phase === this.phase && input.detail === this.detail) return
    // Tool calls are often much shorter than one client poll. Hold the tool
    // pose briefly so the browser actually gets to show it.
    if (this.phase === 'tool' && input.phase === 'thinking' && nowMs - this.phaseStartedAt < this.config.toolHoldMs) return
    this.phase = input.phase
    this.detail = input.detail
    this.phaseStartedAt = nowMs
    this.seed += 1
  }

  onUserMessage(text: string, nowMs: number): void {
    const hit = matchInterjection(text, this.fired)
    if (hit === undefined) return
    this.fired.add(hit.id)
    this.interjection = hit
    this.interjectedAt = nowMs
  }

  onSessionActive(active: boolean, nowMs: number): void {
    this.sessionActive = active
    if (!active) this.onInput({ phase: 'idle' }, nowMs)
  }

  snapshot(nowMs: number): ClippySnapshot {
    let phase = this.phase
    if (phase === 'done' && nowMs - this.phaseStartedAt > this.config.celebrateMs) {
      phase = 'idle'
    }
    const interjection = this.interjection !== undefined && nowMs - this.interjectedAt < this.config.interjectMs
      ? this.interjection
      : undefined
    return {
      phase,
      bubble: lineFor(phase, this.seed, this.config.lines),
      detail: phase === this.phase ? this.detail : undefined,
      interjection,
      phaseStartedAt: this.phaseStartedAt,
      sessionActive: this.sessionActive,
    }
  }
}
