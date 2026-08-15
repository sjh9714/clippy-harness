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
