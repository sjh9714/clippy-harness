/**
 * Clippy host service. Maps core rc.6 session events (turn/step/tool
 * boundaries and the session lifecycle) onto the assistant's phases and
 * serves the snapshot to the browser half.
 * @module dsh-clippy/service
 */

import { Context, Service } from '@deepseek-ai/cordis'
import type { Session, SessionEvent } from '@deepseek-ai/dsh-session'
import { ClippyStateMachine, defaultClippyStateConfig, type ClippySnapshot, type ClippyStateConfig } from './state.ts'

/** Plugin configuration. */
export interface ClippyConfig {
  state?: Partial<ClippyStateConfig>
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    clippy: ClippyService
  }
}

export class ClippyService extends Service {
  static readonly inject: string[] = []

  private machine: ClippyStateMachine

  constructor(ctx: Context, config: ClippyConfig = {}) {
    super(ctx, 'clippy')
    this.machine = new ClippyStateMachine({ ...defaultClippyStateConfig, ...config.state })

    ctx.effect(() => {
      const disposers = [
        ctx.on('session/event', (_session: Session, event: SessionEvent) => {
          const now = Date.now()
          this.machine.onSessionActive(true, now)
          switch (event.type) {
            case 'turn/start':
            case 'step/start':
            case 'assistant/chunk':
              this.machine.onInput({ phase: 'thinking' }, now)
              break
            case 'tool/call':
              this.machine.onInput({ phase: 'tool', detail: (event.data as { name?: string }).name }, now)
              break
            case 'turn/end': {
              const reason = (event.data as { reason?: { kind?: string } }).reason
              if (reason?.kind === 'completed') {
                this.machine.onInput({ phase: 'done' }, now)
              } else {
                this.machine.onInput({ phase: 'failed', detail: reason?.kind }, now)
              }
              break
            }
          }
        }),
        ctx.on('session/disposed', () => {
          this.machine.onSessionActive(false, Date.now())
        }),
      ]
      return () => { for (const dispose of disposers) dispose() }
    }, 'clippy: session events')
  }

  state(): Promise<ClippySnapshot> {
    return Promise.resolve(this.machine.snapshot(Date.now()))
  }
}
