/**
 * The paperclip assistant. Floating SVG character driven by the host
 * snapshot, with a speech bubble, drag to reposition, hide and summon, and
 * a classic error dialog on failed turns.
 * @module dsh-clippy/client/Clippy
 */

import { useEffect, useRef, useState, type ReactElement } from 'react'
import type { ClippySnapshot } from '../state.ts'
import styles from './clippy.module.css'

const POSITION_KEY = 'dsh-clippy.position'
const HIDDEN_KEY = 'dsh-clippy.hidden'

interface Position {
  right: number
  bottom: number
}

function loadPosition(): Position {
  try {
    const raw = localStorage.getItem(POSITION_KEY)
    if (raw !== null) {
      const parsed = JSON.parse(raw) as Position
      if (typeof parsed.right === 'number' && typeof parsed.bottom === 'number') return parsed
    }
  } catch { /* fall through to default */ }
  return { right: 24, bottom: 24 }
}

export interface ClippyProps {
  snapshot: ClippySnapshot
}

export function Clippy({ snapshot }: ClippyProps): ReactElement {
  const [position, setPosition] = useState<Position>(loadPosition)
  const [hidden, setHidden] = useState<boolean>(() => localStorage.getItem(HIDDEN_KEY) === '1')
  const [dismissedAt, setDismissedAt] = useState(0)
  const dragging = useRef<{ startX: number; startY: number; base: Position } | null>(null)

  useEffect(() => {
    localStorage.setItem(POSITION_KEY, JSON.stringify(position))
  }, [position])

  useEffect(() => {
    localStorage.setItem(HIDDEN_KEY, hidden ? '1' : '0')
  }, [hidden])

  const onPointerDown = (event: PointerEvent): void => {
    dragging.current = { startX: event.clientX, startY: event.clientY, base: position }
    ;(event.target as Element).setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event: PointerEvent): void => {
    const drag = dragging.current
    if (drag === null) return
    setPosition({
      right: Math.max(0, drag.base.right - (event.clientX - drag.startX)),
      bottom: Math.max(0, drag.base.bottom - (event.clientY - drag.startY)),
    })
  }
  const onPointerUp = (): void => { dragging.current = null }

  if (hidden) {
    return (
      <button type="button" className={styles.summon} onClick={() => setHidden(false)}>
        📎 Summon
      </button>
    )
  }

  const showDialog = snapshot.phase === 'failed' && snapshot.phaseStartedAt > dismissedAt
  const phaseClass = styles[snapshot.phase] ?? ''

  return (
    <>
      <div
        className={`${styles.root} ${phaseClass}`}
        style={{ right: position.right, bottom: position.bottom }}
      >
        <div className={styles.bubble}>{snapshot.bubble}</div>
        <svg
          className={styles.clip}
          viewBox="0 0 120 150"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          role="img"
          aria-label="Clippy, the office assistant"
        >
          <path className={styles.wire} d="M38 118 V52 a22 22 0 0 1 44 0 v54 a14 14 0 0 1 -28 0 V56 a6 6 0 0 1 12 0 v46" />
          <path className={styles.wireHighlight} d="M38 118 V52 a22 22 0 0 1 44 0 v54 a14 14 0 0 1 -28 0 V56 a6 6 0 0 1 12 0 v46" />
          <g>
            <path className={styles.brow} d="M40 22 q8 -7 16 -2" />
            <path className={styles.brow} d="M66 20 q8 -4 15 2" />
            <ellipse cx="49" cy="36" rx="11" ry="14" fill="#fff" stroke="#333" strokeWidth="2.5" />
            <ellipse cx="73" cy="36" rx="11" ry="14" fill="#fff" stroke="#333" strokeWidth="2.5" />
            <circle className={styles.pupil} cx="51" cy="38" r="4.5" fill="#111" />
            <circle className={styles.pupil} cx="75" cy="38" r="4.5" fill="#111" />
          </g>
        </svg>
        <button
          type="button"
          className={styles.hideButton}
          aria-label="Hide Clippy"
          onClick={() => setHidden(true)}
        >
          ✕
        </button>
      </div>
      {showDialog && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog} role="alertdialog" aria-label="Agent error">
            <div className={styles.dialogTitle}>
              <span>Agent</span>
              <span>✕</span>
            </div>
            <div className={styles.dialogBody}>
              <svg className={styles.dialogIcon} viewBox="0 0 32 32" aria-hidden="true">
                <circle cx="16" cy="16" r="14" fill="#d40000" />
                <path d="M10 10 L22 22 M22 10 L10 22" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
              <div className={styles.dialogText}>
                Your agent has performed an illegal operation.
                {snapshot.detail !== undefined && (
                  <div className={styles.dialogDetail}>reason {snapshot.detail}</div>
                )}
              </div>
            </div>
            <div className={styles.dialogButtons}>
              <button type="button" className={styles.dialogButton} onClick={() => setDismissedAt(Date.now())}>
                Close
              </button>
              <button type="button" className={styles.dialogButton} onClick={() => setDismissedAt(Date.now())}>
                It wasn’t me
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
