import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * The paperclip assistant. Floating SVG character driven by the host
 * snapshot, with a speech bubble, drag to reposition, hide and summon, and
 * a classic error dialog on failed turns.
 * @module dsh-clippy/client/Clippy
 */
import { useEffect, useRef, useState } from 'react';
import styles from './clippy.module.css';
const POSITION_KEY = 'dsh-clippy.position';
const HIDDEN_KEY = 'dsh-clippy.hidden';
function loadPosition() {
    try {
        const raw = localStorage.getItem(POSITION_KEY);
        if (raw !== null) {
            const parsed = JSON.parse(raw);
            if (typeof parsed.right === 'number' && typeof parsed.bottom === 'number')
                return parsed;
        }
    }
    catch { /* fall through to default */ }
    return { right: 24, bottom: 24 };
}
export function Clippy({ snapshot }) {
    const [position, setPosition] = useState(loadPosition);
    const [hidden, setHidden] = useState(() => localStorage.getItem(HIDDEN_KEY) === '1');
    const [dismissedAt, setDismissedAt] = useState(0);
    const dragging = useRef(null);
    useEffect(() => {
        localStorage.setItem(POSITION_KEY, JSON.stringify(position));
    }, [position]);
    useEffect(() => {
        localStorage.setItem(HIDDEN_KEY, hidden ? '1' : '0');
    }, [hidden]);
    const onPointerDown = (event) => {
        dragging.current = { startX: event.clientX, startY: event.clientY, base: position };
        event.target.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event) => {
        const drag = dragging.current;
        if (drag === null)
            return;
        setPosition({
            right: Math.max(0, drag.base.right - (event.clientX - drag.startX)),
            bottom: Math.max(0, drag.base.bottom - (event.clientY - drag.startY)),
        });
    };
    const onPointerUp = () => { dragging.current = null; };
    if (hidden) {
        return (_jsx("button", { type: "button", className: styles.summon, onClick: () => setHidden(false), children: "\uD83D\uDCCE Summon" }));
    }
    const showDialog = snapshot.phase === 'failed' && snapshot.phaseStartedAt > dismissedAt;
    const phaseClass = styles[snapshot.phase] ?? '';
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: `${styles.root} ${phaseClass}`, style: { right: position.right, bottom: position.bottom }, children: [_jsx("div", { className: styles.bubble, children: snapshot.bubble }), _jsxs("svg", { className: styles.clip, viewBox: "0 0 120 150", onPointerDown: onPointerDown, onPointerMove: onPointerMove, onPointerUp: onPointerUp, role: "img", "aria-label": "Clippy, the office assistant", children: [_jsx("path", { className: styles.wire, d: "M38 118 V52 a22 22 0 0 1 44 0 v54 a14 14 0 0 1 -28 0 V56 a6 6 0 0 1 12 0 v46" }), _jsx("path", { className: styles.wireHighlight, d: "M38 118 V52 a22 22 0 0 1 44 0 v54 a14 14 0 0 1 -28 0 V56 a6 6 0 0 1 12 0 v46" }), _jsxs("g", { children: [_jsx("path", { className: styles.brow, d: "M40 22 q8 -7 16 -2" }), _jsx("path", { className: styles.brow, d: "M66 20 q8 -4 15 2" }), _jsx("ellipse", { cx: "49", cy: "36", rx: "11", ry: "14", fill: "#fff", stroke: "#333", strokeWidth: "2.5" }), _jsx("ellipse", { cx: "73", cy: "36", rx: "11", ry: "14", fill: "#fff", stroke: "#333", strokeWidth: "2.5" }), _jsx("circle", { className: styles.pupil, cx: "51", cy: "38", r: "4.5", fill: "#111" }), _jsx("circle", { className: styles.pupil, cx: "75", cy: "38", r: "4.5", fill: "#111" })] })] }), _jsx("button", { type: "button", className: styles.hideButton, "aria-label": "Hide Clippy", onClick: () => setHidden(true), children: "\u2715" })] }), showDialog && (_jsx("div", { className: styles.dialogOverlay, children: _jsxs("div", { className: styles.dialog, role: "alertdialog", "aria-label": "Agent error", children: [_jsxs("div", { className: styles.dialogTitle, children: [_jsx("span", { children: "Agent" }), _jsx("span", { children: "\u2715" })] }), _jsxs("div", { className: styles.dialogBody, children: [_jsxs("svg", { className: styles.dialogIcon, viewBox: "0 0 32 32", "aria-hidden": "true", children: [_jsx("circle", { cx: "16", cy: "16", r: "14", fill: "#d40000" }), _jsx("path", { d: "M10 10 L22 22 M22 10 L10 22", stroke: "#fff", strokeWidth: "3.5", strokeLinecap: "round" })] }), _jsxs("div", { className: styles.dialogText, children: ["Your agent has performed an illegal operation.", snapshot.detail !== undefined && (_jsxs("div", { className: styles.dialogDetail, children: ["reason ", snapshot.detail] }))] })] }), _jsxs("div", { className: styles.dialogButtons, children: [_jsx("button", { type: "button", className: styles.dialogButton, onClick: () => setDismissedAt(Date.now()), children: "Close" }), _jsx("button", { type: "button", className: styles.dialogButton, onClick: () => setDismissedAt(Date.now()), children: "It wasn\u2019t me" })] })] }) }))] }));
}
