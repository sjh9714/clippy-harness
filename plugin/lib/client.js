window.__ModuleLoader__.load({
	id: "dsh-clippy",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_dom_client = require("react-dom/client");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region \0dsh-css:packages/dsh-clippy/src/client/clippy.module.css.mjs
		const css = ".A387nG_root{z-index:2147482000;-webkit-user-select:none;user-select:none;touch-action:none;flex-direction:column;align-items:center;gap:10px;display:flex;position:fixed}.A387nG_bubble{color:#1a1a1a;background:#fffbd6;border:1.5px solid #1a1a1a;border-radius:10px;max-width:240px;padding:9px 12px;font-size:12.5px;line-height:1.45;position:relative;box-shadow:2px 2px #0000004d}.A387nG_bubble:after{content:\"\";border:10px solid #0000;border-top-color:#1a1a1a;border-bottom:none;position:absolute;bottom:-10px;right:38px}.A387nG_bubble:before{content:\"\";z-index:1;border:8px solid #0000;border-top-color:#fffbd6;border-bottom:none;position:absolute;bottom:-7px;right:40px}.A387nG_clip{cursor:grab;filter:drop-shadow(2px 3px #00000040);width:96px;height:120px;animation:3s ease-in-out infinite A387nG_idle}.A387nG_clip:active{cursor:grabbing}.A387nG_wire{fill:none;stroke:#8f9bb3;stroke-width:7px;stroke-linecap:round}.A387nG_wireHighlight{fill:none;stroke:#c9d2e4;stroke-width:2.4px;stroke-linecap:round}.A387nG_brow{stroke:#333;stroke-width:3px;stroke-linecap:round;fill:none}.A387nG_pupil{transition:transform .3s}@keyframes A387nG_idle{0%,to{transform:translateY(0)}50%{transform:translateY(-6px)}}.A387nG_thinking .A387nG_clip{animation:1.2s ease-in-out infinite A387nG_tilt}.A387nG_thinking .A387nG_pupil{transform:translate(-2px,-3px)}@keyframes A387nG_tilt{0%,to{transform:rotate(-4deg)}50%{transform:rotate(5deg)}}.A387nG_tool .A387nG_clip{animation:.45s ease-in-out infinite A387nG_bop}.A387nG_tool .A387nG_pupil{transform:translateY(3px)}@keyframes A387nG_bop{0%,to{transform:translateY(0)scaleY(1)}50%{transform:translateY(3px)scaleY(.96)}}.A387nG_done .A387nG_clip{animation:.9s ease-in-out infinite A387nG_spinjump}@keyframes A387nG_spinjump{0%,to{transform:translateY(0)rotate(0)}30%{transform:translateY(-16px)rotate(-10deg)}60%{transform:translateY(-10px)rotate(9deg)}}.A387nG_failed .A387nG_clip{animation:.5s ease-in-out 2 A387nG_shake}@keyframes A387nG_shake{0%,to{transform:translate(0)}25%{transform:translate(-5px)rotate(-3deg)}75%{transform:translate(5px)rotate(3deg)}}@media (prefers-reduced-motion:reduce){.A387nG_clip,.A387nG_thinking .A387nG_clip,.A387nG_tool .A387nG_clip,.A387nG_done .A387nG_clip,.A387nG_failed .A387nG_clip{animation:none}}.A387nG_hideButton{color:#444;cursor:pointer;opacity:0;background:#eee;border:1px solid #888;border-radius:50%;width:18px;height:18px;font-size:10px;line-height:1;transition:opacity .15s;position:absolute;top:-6px;right:-6px}.A387nG_root:hover .A387nG_hideButton{opacity:1}.A387nG_summon{z-index:2147482000;color:#333;cursor:pointer;background:#f4f4f4;border:1px solid #888;border-radius:14px;padding:4px 10px;font-size:12px;position:fixed;bottom:16px;right:16px;box-shadow:1px 1px #0003}.A387nG_dialogOverlay{z-index:2147482100;background:#0003;place-items:center;display:grid;position:fixed;inset:0}.A387nG_dialog{color:#000;background:silver;border:1px solid #404040;border-color:#fff #404040 #404040 #fff;width:380px;max-width:calc(100vw - 40px);font-family:Tahoma,MS Sans Serif,Geneva,Verdana,sans-serif;font-size:12px;box-shadow:inset 1px 1px silver,inset -1px -1px gray,3px 3px #00000059}.A387nG_dialogTitle{color:#fff;background:linear-gradient(90deg,navy,#1084d0);justify-content:space-between;align-items:center;padding:3px 6px;font-weight:700;display:flex}.A387nG_dialogBody{align-items:flex-start;gap:12px;padding:14px 14px 8px;display:flex}.A387nG_dialogIcon{flex:none;width:32px;height:32px}.A387nG_dialogText{line-height:1.5}.A387nG_dialogDetail{color:#444;margin-top:6px;font-family:Courier New,monospace;font-size:11px}.A387nG_dialogButtons{justify-content:center;gap:8px;padding:10px 14px 14px;display:flex}.A387nG_dialogButton{cursor:pointer;background:silver;border:1px solid #404040;border-color:#fff #404040 #404040 #fff;min-width:84px;padding:4px 12px;font-family:inherit;font-size:12px;box-shadow:inset 1px 1px silver,inset -1px -1px gray}.A387nG_dialogButton:focus-visible{outline-offset:-4px;outline:1px dotted #000}";
		const tagId = "dsh-clippy/clippy.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-clippy";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var clippy_module_css_default = {
			"bop": "A387nG_bop",
			"brow": "A387nG_brow",
			"bubble": "A387nG_bubble",
			"clip": "A387nG_clip",
			"dialog": "A387nG_dialog",
			"dialogBody": "A387nG_dialogBody",
			"dialogButton": "A387nG_dialogButton",
			"dialogButtons": "A387nG_dialogButtons",
			"dialogDetail": "A387nG_dialogDetail",
			"dialogIcon": "A387nG_dialogIcon",
			"dialogOverlay": "A387nG_dialogOverlay",
			"dialogText": "A387nG_dialogText",
			"dialogTitle": "A387nG_dialogTitle",
			"done": "A387nG_done",
			"failed": "A387nG_failed",
			"hideButton": "A387nG_hideButton",
			"idle": "A387nG_idle",
			"pupil": "A387nG_pupil",
			"root": "A387nG_root",
			"shake": "A387nG_shake",
			"spinjump": "A387nG_spinjump",
			"summon": "A387nG_summon",
			"thinking": "A387nG_thinking",
			"tilt": "A387nG_tilt",
			"tool": "A387nG_tool",
			"wire": "A387nG_wire",
			"wireHighlight": "A387nG_wireHighlight"
		};
		//#endregion
		//#region src/client/Clippy.tsx
		/**
		* The paperclip assistant. Floating SVG character driven by the host
		* snapshot, with a speech bubble, drag to reposition, hide and summon, and
		* a classic error dialog on failed turns.
		* @module dsh-clippy/client/Clippy
		*/
		const POSITION_KEY = "dsh-clippy.position";
		const HIDDEN_KEY = "dsh-clippy.hidden";
		function loadPosition() {
			try {
				const raw = localStorage.getItem(POSITION_KEY);
				if (raw !== null) {
					const parsed = JSON.parse(raw);
					if (typeof parsed.right === "number" && typeof parsed.bottom === "number") return parsed;
				}
			} catch {}
			return {
				right: 24,
				bottom: 24
			};
		}
		function Clippy({ snapshot }) {
			const [position, setPosition] = (0, react.useState)(loadPosition);
			const [hidden, setHidden] = (0, react.useState)(() => localStorage.getItem(HIDDEN_KEY) === "1");
			const [dismissedAt, setDismissedAt] = (0, react.useState)(0);
			const dragging = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				localStorage.setItem(POSITION_KEY, JSON.stringify(position));
			}, [position]);
			(0, react.useEffect)(() => {
				localStorage.setItem(HIDDEN_KEY, hidden ? "1" : "0");
			}, [hidden]);
			const onPointerDown = (event) => {
				dragging.current = {
					startX: event.clientX,
					startY: event.clientY,
					base: position
				};
				event.target.setPointerCapture(event.pointerId);
			};
			const onPointerMove = (event) => {
				const drag = dragging.current;
				if (drag === null) return;
				setPosition({
					right: Math.max(0, drag.base.right - (event.clientX - drag.startX)),
					bottom: Math.max(0, drag.base.bottom - (event.clientY - drag.startY))
				});
			};
			const onPointerUp = () => {
				dragging.current = null;
			};
			if (hidden) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				className: clippy_module_css_default.summon,
				onClick: () => setHidden(false),
				children: "📎 Summon"
			});
			const showDialog = snapshot.phase === "failed" && snapshot.phaseStartedAt > dismissedAt;
			const phaseClass = clippy_module_css_default[snapshot.phase] ?? "";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: `${clippy_module_css_default.root} ${phaseClass}`,
				style: {
					right: position.right,
					bottom: position.bottom
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: clippy_module_css_default.bubble,
						children: snapshot.bubble
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
						className: clippy_module_css_default.clip,
						viewBox: "0 0 120 150",
						onPointerDown,
						onPointerMove,
						onPointerUp,
						role: "img",
						"aria-label": "Clippy, the office assistant",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
								className: clippy_module_css_default.wire,
								d: "M38 118 V52 a22 22 0 0 1 44 0 v54 a14 14 0 0 1 -28 0 V56 a6 6 0 0 1 12 0 v46"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
								className: clippy_module_css_default.wireHighlight,
								d: "M38 118 V52 a22 22 0 0 1 44 0 v54 a14 14 0 0 1 -28 0 V56 a6 6 0 0 1 12 0 v46"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									className: clippy_module_css_default.brow,
									d: "M40 22 q8 -7 16 -2"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									className: clippy_module_css_default.brow,
									d: "M66 20 q8 -4 15 2"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
									cx: "49",
									cy: "36",
									rx: "11",
									ry: "14",
									fill: "#fff",
									stroke: "#333",
									strokeWidth: "2.5"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
									cx: "73",
									cy: "36",
									rx: "11",
									ry: "14",
									fill: "#fff",
									stroke: "#333",
									strokeWidth: "2.5"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
									className: clippy_module_css_default.pupil,
									cx: "51",
									cy: "38",
									r: "4.5",
									fill: "#111"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
									className: clippy_module_css_default.pupil,
									cx: "75",
									cy: "38",
									r: "4.5",
									fill: "#111"
								})
							] })
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: clippy_module_css_default.hideButton,
						"aria-label": "Hide Clippy",
						onClick: () => setHidden(true),
						children: "✕"
					})
				]
			}), showDialog && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: clippy_module_css_default.dialogOverlay,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: clippy_module_css_default.dialog,
					role: "alertdialog",
					"aria-label": "Agent error",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: clippy_module_css_default.dialogTitle,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Agent" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "✕" })]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: clippy_module_css_default.dialogBody,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
								className: clippy_module_css_default.dialogIcon,
								viewBox: "0 0 32 32",
								"aria-hidden": "true",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
									cx: "16",
									cy: "16",
									r: "14",
									fill: "#d40000"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M10 10 L22 22 M22 10 L10 22",
									stroke: "#fff",
									strokeWidth: "3.5",
									strokeLinecap: "round"
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: clippy_module_css_default.dialogText,
								children: ["Your agent has performed an illegal operation.", snapshot.detail !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: clippy_module_css_default.dialogDetail,
									children: ["reason ", snapshot.detail]
								})]
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: clippy_module_css_default.dialogButtons,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: clippy_module_css_default.dialogButton,
								onClick: () => setDismissedAt(Date.now()),
								children: "Close"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: clippy_module_css_default.dialogButton,
								onClick: () => setDismissedAt(Date.now()),
								children: "It wasn’t me"
							})]
						})
					]
				})
			})] });
		}
		//#endregion
		//#region src/client/index.ts
		/** Poll interval for the host snapshot. */
		const POLL_MS = 800;
		const IDLE_SNAPSHOT = {
			phase: "idle",
			bubble: "It looks like you’re writing code. This time I can actually help.",
			phaseStartedAt: 0,
			sessionActive: false
		};
		/** Client plugin body: mount the assistant and the poll loop. */
		function apply(ctx) {
			ctx.effect(() => {
				const host = document.createElement("div");
				host.dataset.plugin = "dsh-clippy";
				document.body.appendChild(host);
				const root = (0, react_dom_client.createRoot)(host);
				let disposed = false;
				let snapshot = IDLE_SNAPSHOT;
				const render = () => {
					if (!disposed) root.render((0, react.createElement)(Clippy, { snapshot }));
				};
				render();
				const poll = async () => {
					try {
						const response = await fetch("/api/clippy/state");
						if (response.ok) {
							snapshot = await response.json();
							render();
						}
					} catch {}
				};
				poll();
				const timer = setInterval(() => {
					poll();
				}, POLL_MS);
				return () => {
					disposed = true;
					clearInterval(timer);
					root.unmount();
					host.remove();
				};
			}, "clippy: mount");
		}
		//#endregion
		exports.apply = apply;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map