import { describe, expect, it } from 'vitest'
import { ClippyStateMachine, lineFor } from './state.ts'

describe('ClippyStateMachine', () => {
  it('maps phases and settles done back to idle after the window', () => {
    const machine = new ClippyStateMachine({ celebrateMs: 1000 })
    machine.onSessionActive(true, 0)
    machine.onInput({ phase: 'thinking' }, 0)
    expect(machine.snapshot(10).phase).toBe('thinking')
    machine.onInput({ phase: 'tool', detail: 'bash' }, 20)
    expect(machine.snapshot(30).detail).toBe('bash')
    machine.onInput({ phase: 'done' }, 100)
    expect(machine.snapshot(500).phase).toBe('done')
    expect(machine.snapshot(1200).phase).toBe('idle')
  })

  it('keeps failed sticky until the next input', () => {
    const machine = new ClippyStateMachine({ celebrateMs: 1000 })
    machine.onSessionActive(true, 0)
    machine.onInput({ phase: 'failed', detail: 'error' }, 0)
    expect(machine.snapshot(60_000).phase).toBe('failed')
    machine.onInput({ phase: 'thinking' }, 60_001)
    expect(machine.snapshot(60_002).phase).toBe('thinking')
  })

  it('clears to idle when the session goes away', () => {
    const machine = new ClippyStateMachine()
    machine.onSessionActive(true, 0)
    machine.onInput({ phase: 'tool' }, 0)
    machine.onSessionActive(false, 10)
    expect(machine.snapshot(20).phase).toBe('idle')
    expect(machine.snapshot(20).sessionActive).toBe(false)
  })

  it('always has a line for every phase', () => {
    for (const phase of ['idle', 'thinking', 'tool', 'done', 'failed'] as const) {
      expect(lineFor(phase, 7).length).toBeGreaterThan(0)
    }
  })
})

describe('interjections', () => {
  it('matches rules once per session', () => {
    const machine = new ClippyStateMachine()
    machine.onUserMessage('please deploy this to prod', 0)
    const first = machine.snapshot(10)
    expect(first.interjection?.id).toBe('deploy')
    machine.onUserMessage('deploy again', 20_000)
    expect(machine.snapshot(20_010).interjection).toBeUndefined()
    machine.onUserMessage('now touch prod', 21_000)
    expect(machine.snapshot(21_010).interjection?.id).toBe('prod')
  })

  it('expires after the window', () => {
    const machine = new ClippyStateMachine({ interjectMs: 1000 })
    machine.onUserMessage('fix the failing test', 0)
    expect(machine.snapshot(500).interjection).toBeDefined()
    expect(machine.snapshot(1500).interjection).toBeUndefined()
  })

  it('applies line overrides', () => {
    const machine = new ClippyStateMachine({ lines: { idle: ['custom line'] } })
    expect(machine.snapshot(0).bubble).toBe('custom line')
  })
})
