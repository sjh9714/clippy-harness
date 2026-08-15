/**
 * dsh-clippy browser half. Mounts the paperclip assistant as a global
 * floating surface on document.body and drives it by polling the host's
 * same-origin /api/clippy/state endpoint, the same pattern as dsh-pet.
 * @module dsh-clippy/client
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import type { ClippySnapshot } from '../state.ts'
import { Clippy } from './Clippy.tsx'

/** Poll interval for the host snapshot. */
const POLL_MS = 800

const IDLE_SNAPSHOT: ClippySnapshot = {
  phase: 'idle',
  bubble: 'It looks like you’re writing code. This time I can actually help.',
  phaseStartedAt: 0,
  sessionActive: false,
}

/** Client plugin body: mount the assistant and the poll loop. */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => {
    const host = document.createElement('div')
    host.dataset.plugin = 'dsh-clippy'
    document.body.appendChild(host)
    const root = createRoot(host)

    let disposed = false
    let snapshot = IDLE_SNAPSHOT
    const render = (): void => {
      if (!disposed) root.render(createElement(Clippy, { snapshot }))
    }
    render()

    const poll = async (): Promise<void> => {
      try {
        const response = await fetch('/api/clippy/state')
        if (response.ok) {
          snapshot = (await response.json()) as ClippySnapshot
          render()
        }
      } catch { /* transient network errors keep the last snapshot */ }
    }
    void poll()
    const timer = setInterval(() => { void poll() }, POLL_MS)

    return () => {
      disposed = true
      clearInterval(timer)
      root.unmount()
      host.remove()
    }
  }, 'clippy: mount')
}
