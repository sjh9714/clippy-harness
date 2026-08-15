/**
 * The paperclip assistant. Character rig adapted from ManzDev/twitch-clippy
 * (ISC). Driven by the host snapshot, with idle micro animations, click and
 * context menu interactions, optional synthesized sounds, and the classic
 * error dialog on failed turns.
 * @module dsh-clippy/client/Clippy
 */

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent, type ReactElement } from 'react'
import type { ClippySnapshot } from '../state.ts'
import { playChime, playError, playTada } from './sounds.ts'
import styles from './clippy.module.css'

const POSITION_KEY = 'dsh-clippy.position'
const HIDDEN_KEY = 'dsh-clippy.hidden'
const SOUND_KEY = 'dsh-clippy.sound'

const CLICK_LINES = [
  'Careful. I am load bearing.',
  'Yes?',
  'I am concentrating. Loosely.',
  'That tickles. Please file a ticket.',
]

const WIRE_D = 'm 13.6 44.2 c 0 0 -1 11.4 0 18.7 c 0.5 4 1.8 9.2 7.2 9.8 c 2.7 0.2 5.5 -1.8 6.7 -4.4 c 2.3 -4.8 0 -20.6 2 -33.4 c 1.2 -8.2 3 -17.5 3.6 -24.2 C 33.4 7.4 30.2 4.5 26.8 3.3 C 24.2 2.4 20.2 1.9 18 3.5 C 13.2 6.8 9.7 15.9 8.5 25.9 A 213.3 213.3 0 0 0 9 69.8 c 1.1 8.4 2.6 21.2 14.9 20.9 c 5.4 0 9.8 -2.3 11.4 -11 c 1.4 -7.9 -0.8 -15.9 0 -23.4 C 36 52 39 45 39 45'

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

type Micro = '' | 'blink' | 'glanceLeft' | 'glanceRight' | 'doze' | 'wiggle'

export interface ClippyProps {
  snapshot: ClippySnapshot
}

export function Clippy({ snapshot }: ClippyProps): ReactElement {
  const [position, setPosition] = useState<Position>(loadPosition)
  const [hidden, setHidden] = useState<boolean>(() => localStorage.getItem(HIDDEN_KEY) === '1')
  const [soundOn, setSoundOn] = useState<boolean>(() => localStorage.getItem(SOUND_KEY) === '1')
  const [dismissedAt, setDismissedAt] = useState(0)
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [micro, setMicro] = useState<Micro>('')
  const [clickLine, setClickLine] = useState<string | null>(null)
  const [interjectionAnswered, setInterjectionAnswered] = useState<string>('')
  const [interjectionReply, setInterjectionReply] = useState<string | null>(null)
  const dragging = useRef<{ startX: number; startY: number; base: Position; moved: boolean } | null>(null)
  const clickSeed = useRef(0)
  const prevPhase = useRef(snapshot.phase)

  useEffect(() => { localStorage.setItem(POSITION_KEY, JSON.stringify(position)) }, [position])
  useEffect(() => { localStorage.setItem(HIDDEN_KEY, hidden ? '1' : '0') }, [hidden])
  useEffect(() => { localStorage.setItem(SOUND_KEY, soundOn ? '1' : '0') }, [soundOn])

  // Sound cues on phase edges.
  useEffect(() => {
    if (snapshot.phase !== prevPhase.current) {
      if (soundOn && snapshot.phase === 'failed') playError()
      if (soundOn && snapshot.phase === 'done') playTada()
      prevPhase.current = snapshot.phase
    }
  }, [snapshot.phase, soundOn])

  // Idle micro animations: blinks, glances, the occasional wiggle.
  useEffect(() => {
    if (hidden) return
    let alive = true
    let timer: ReturnType<typeof setTimeout>
    const schedule = (): void => {
      timer = setTimeout(() => {
        if (!alive) return
        const roll = Math.random()
        const pick: Micro = roll < 0.55 ? 'blink' : roll < 0.72 ? 'glanceLeft' : roll < 0.89 ? 'glanceRight' : 'wiggle'
        const hold = pick === 'blink' ? 320 : pick === 'wiggle' ? 850 : 1200
        setMicro(pick)
        setTimeout(() => { if (alive) setMicro('') }, hold)
        schedule()
      }, 2800 + Math.random() * 3800)
    }
    schedule()
    return () => { alive = false; clearTimeout(timer) }
  }, [hidden])

  // Clear the transient click line after a beat.
  useEffect(() => {
    if (clickLine === null) return
    const timer = setTimeout(() => setClickLine(null), 3500)
    return () => clearTimeout(timer)
  }, [clickLine])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (event.button !== 0) return
    dragging.current = { startX: event.clientX, startY: event.clientY, base: position, moved: false }
    ;(event.currentTarget as Element).setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    const drag = dragging.current
    if (drag === null) return
    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true
    if (drag.moved) {
      setPosition({
        right: Math.max(0, drag.base.right - dx),
        bottom: Math.max(0, drag.base.bottom - dy),
      })
    }
  }
  const onPointerUp = (): void => {
    const drag = dragging.current
    dragging.current = null
    if (drag !== null && !drag.moved) {
      clickSeed.current += 1
      setClickLine(CLICK_LINES[clickSeed.current % CLICK_LINES.length])
      setMicro('wiggle')
      setTimeout(() => setMicro(''), 850)
      if (soundOn) playChime()
    }
  }
  const onContextMenu = (event: ReactMouseEvent): void => {
    event.preventDefault()
    setMenu({ x: event.clientX, y: event.clientY })
  }

  if (hidden) {
    return (
      <button type="button" className={styles.summon} onClick={() => { setHidden(false); if (soundOn) playChime() }}>
        📎 Summon
      </button>
    )
  }

  const interjection = snapshot.interjection !== undefined && snapshot.interjection.id !== interjectionAnswered
    ? snapshot.interjection
    : undefined
  const bubbleText = clickLine
    ?? interjectionReply
    ?? interjection?.line
    ?? snapshot.bubble
  const showOptions = clickLine === null && interjectionReply === null && interjection !== undefined
  const showDialog = snapshot.phase === 'failed' && snapshot.phaseStartedAt > dismissedAt
  const phaseClass = styles[snapshot.phase] ?? ''
  const microClass = micro !== '' ? styles[micro] ?? '' : ''

  const answer = (reply: string | null): void => {
    if (interjection !== undefined) setInterjectionAnswered(interjection.id)
    setInterjectionReply(reply)
    if (reply !== null) setTimeout(() => setInterjectionReply(null), 4000)
  }

  return (
    <>
      <div
        className={`${styles.root} ${phaseClass} ${microClass}`}
        style={{ right: position.right, bottom: position.bottom }}
      >
        <div className={styles.bubble}>
          {bubbleText}
          {showOptions && (
            <div className={styles.options}>
              <button type="button" className={styles.option} onClick={() => answer('I cannot actually type for you. Yet.')}>
                Get help
              </button>
              <button type="button" className={styles.option} onClick={() => answer(null)}>
                Just watching
              </button>
            </div>
          )}
        </div>
        <div
          className={styles.character}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onContextMenu={onContextMenu}
          role="img"
          aria-label="Clippy, the office assistant"
        >
          <div className={styles.head}>
            <div className={`${styles.ocular} ${styles.ocularLeft}`}>
              <div className={styles.brow} />
              <div className={styles.eye}><div className={styles.pupil} /></div>
            </div>
            <div className={`${styles.ocular} ${styles.ocularRight}`}>
              <div className={styles.brow} />
              <div className={styles.eye}><div className={styles.pupil} /></div>
            </div>
          </div>
          <svg className={styles.body} viewBox="0 0 45 125">
            <defs>
              <filter id="clippyBlur" colorInterpolationFilters="sRGB">
                <feGaussianBlur stdDeviation="0 1.5" />
              </filter>
            </defs>
            <path className={styles.wireShadow} d={WIRE_D} />
            <path className={styles.wireShape} d={WIRE_D} />
          </svg>
        </div>
      </div>
      {menu !== null && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 2147482150 }} onClick={() => setMenu(null)} onContextMenu={(e) => { e.preventDefault(); setMenu(null) }} />
          <div className={styles.menu} style={{ left: Math.min(menu.x, window.innerWidth - 170), top: Math.min(menu.y, window.innerHeight - 140) }}>
            <button type="button" className={styles.menuItem} onClick={() => { setMenu(null); setHidden(true) }}>Hide Clippy</button>
            <button type="button" className={styles.menuItem} onClick={() => { setSoundOn(!soundOn); setMenu(null); if (!soundOn) playChime() }}>
              Sound {soundOn ? 'off' : 'on'}
            </button>
            <hr className={styles.menuSep} />
            <button type="button" className={styles.menuItem} onClick={() => { setMenu(null); setAboutOpen(true) }}>About Clippy…</button>
            <button type="button" className={styles.menuItem} onClick={() => { setMenu(null); setClickLine('Not again.'); setTimeout(() => setHidden(true), 1200) }}>
              Fire him. Again.
            </button>
          </div>
        </>
      )}
      {aboutOpen && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog} role="dialog" aria-label="About Clippy">
            <div className={styles.dialogTitle}><span>About Clippy</span><span>✕</span></div>
            <div className={styles.dialogBody}>
              <svg className={styles.dialogIcon} viewBox="0 0 32 32" aria-hidden="true">
                <circle cx="16" cy="16" r="14" fill="#1f6fd0" />
                <path d="M16 8v2M16 13v11" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
              <div className={styles.dialogText}>
                Clippy Harness. He watched you write documents for 25 years and could do nothing. Now he has an agent runtime.
                <div className={styles.dialogDetail}>github.com/sjh9714/clippy-harness</div>
              </div>
            </div>
            <div className={styles.dialogButtons}>
              <button type="button" className={styles.dialogButton} onClick={() => setAboutOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {showDialog && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog} role="alertdialog" aria-label="Agent error">
            <div className={styles.dialogTitle}><span>Agent</span><span>✕</span></div>
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
              <button type="button" className={styles.dialogButton} onClick={() => setDismissedAt(Date.now())}>Close</button>
              <button type="button" className={styles.dialogButton} onClick={() => setDismissedAt(Date.now())}>It wasn’t me</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
