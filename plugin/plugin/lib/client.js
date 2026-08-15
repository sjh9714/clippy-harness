window.__ModuleLoader__.load({
	id: "dsh-clippy",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_dom_client = require("react-dom/client");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/sounds.ts
		/**
		* Synthesized classic sounds. Generated with Web Audio at play time, so no
		* audio files ship and nothing Microsoft owns is redistributed.
		* @module dsh-clippy/client/sounds
		*/
		let context;
		function ctx() {
			if (context === void 0) context = new AudioContext();
			return context;
		}
		function tone(freq, startMs, durMs, type, gainPeak) {
			const audio = ctx();
			const osc = audio.createOscillator();
			const gain = audio.createGain();
			const t0 = audio.currentTime + startMs / 1e3;
			const t1 = t0 + durMs / 1e3;
			osc.type = type;
			osc.frequency.setValueAtTime(freq, t0);
			gain.gain.setValueAtTime(0, t0);
			gain.gain.linearRampToValueAtTime(gainPeak, t0 + .01);
			gain.gain.exponentialRampToValueAtTime(1e-4, t1);
			osc.connect(gain).connect(audio.destination);
			osc.start(t0);
			osc.stop(t1);
		}
		/** The error ding. Two-note chord in the spirit of the classic chord.wav. */
		function playError() {
			tone(523.25, 0, 380, "triangle", .12);
			tone(415.3, 0, 380, "triangle", .1);
			tone(311.13, 0, 420, "triangle", .08);
		}
		/** The arrival chime. Rising two notes. */
		function playChime() {
			tone(659.25, 0, 140, "sine", .09);
			tone(987.77, 130, 220, "sine", .09);
		}
		/** The celebration blip. */
		function playTada() {
			tone(523.25, 0, 110, "square", .05);
			tone(659.25, 100, 110, "square", .05);
			tone(783.99, 200, 240, "square", .06);
		}
		//#endregion
		//#region \0dsh-css:packages/dsh-clippy/src/client/clippy.module.css.mjs
		const css = ".A387nG_root{z-index:2147482000;-webkit-user-select:none;user-select:none;touch-action:none;flex-direction:column;align-items:flex-end;gap:12px;font-family:Tahoma,MS Sans Serif,Geneva,Verdana,sans-serif;display:flex;position:fixed}.A387nG_bubble{color:#1a1a1a;text-align:left;background:#ffc;border:1px solid #000;border-radius:8px;max-width:250px;margin-right:8px;padding:10px 12px;font-size:13px;line-height:1.45;position:relative;box-shadow:2px 2px 4px #00000040}.A387nG_bubble:after{content:\"\";border-top:15px solid #000;border-bottom:0 solid #0000;border-left:12px solid #0000;border-right:4px solid #0000;position:absolute;bottom:-14px;right:34px}.A387nG_bubble:before{content:\"\";z-index:1;border-top:13px solid #ffc;border-bottom:0 solid #0000;border-left:10px solid #0000;border-right:3px solid #0000;position:absolute;bottom:-11px;right:35px}.A387nG_options{flex-direction:column;gap:4px;margin-top:8px;display:flex}.A387nG_option{color:#1a1a1a;cursor:pointer;text-align:left;background:0 0;border:none;align-items:center;gap:6px;padding:0;font-family:inherit;font-size:13px;display:flex}.A387nG_option:before{content:\"\";background:radial-gradient(circle at 35% 30%,#9fd4ff 0 20%,#1f6fd0 60%,#0b3f8a 100%);border:1px solid #0a3a7e;border-radius:50%;flex:none;width:11px;height:11px}.A387nG_option:hover{text-decoration:underline}.A387nG_character{cursor:grab;filter:drop-shadow(2px 3px 3px #0000004d);width:118px;height:196px;position:relative}.A387nG_character:active{cursor:grabbing}.A387nG_head{z-index:5;justify-content:space-between;display:flex;position:absolute;top:0;left:0;right:0;transform:rotate(7deg)}.A387nG_body{width:102px;height:170px;position:absolute;top:26px;left:8px}.A387nG_wireShape{stroke:#5a6072;stroke-width:3.5px;stroke-linecap:round;fill:none;filter:url(#clippyBlur)}.A387nG_wireShadow{stroke:#b9c1d4;stroke-width:3.5px;stroke-linecap:round;fill:none}.A387nG_ocular{flex-direction:column;align-items:center;gap:1px;display:flex}.A387nG_brow{width:52px;height:15px;clip-path:path(\"M 0 15 C 5.2 10.5 14.5 6.7 26 7.1 C 36.4 8.2 40.8 13.4 44.5 13.8 C 52 14.5 50.9 7.4 43.8 3.7 C 37.1 1.1 18.6 -4.8 0 15\");background:#141412;transition:transform .5s}.A387nG_ocularRight .A387nG_brow{transform:scaleX(-1)}.A387nG_eye{background:#fff;border:1px solid #222;border-radius:50%;justify-content:center;align-items:center;width:48px;height:36px;display:flex;position:relative;overflow:hidden;box-shadow:inset -5px -3px 4px #8f8c9e,inset -1px -1px 2px #252525}.A387nG_eye:before{content:\"\";z-index:5;background:radial-gradient(15px at 50% 75%,#b9c1d4,#8f96a8);border-radius:10%;width:100%;height:0%;transition:height .3s;position:absolute;top:0}.A387nG_eye:after{content:\"\";z-index:3;background:radial-gradient(15px at 50% 75%,#c8cfe0,#9aa1b3);border-radius:5%;width:100%;height:0%;transition:height .3s;position:absolute;bottom:0}.A387nG_pupil{background-color:#0f0f0f;background-image:radial-gradient(at 55% 55%,#0000 0 55%,#333 65% 100%),radial-gradient(circle at 25% 25%,#59564f 0 5%,#0f0f0f 40% 100%);background-position:0 0;background-repeat:repeat;background-size:auto;background-attachment:scroll;background-origin:padding-box;background-clip:border-box;border:2px solid #222;border-radius:50%;width:50%;height:45%;transition:translate .4s;translate:0}.A387nG_blink .A387nG_eye:before{height:85%}.A387nG_blink .A387nG_eye:after{height:25%}.A387nG_doze .A387nG_eye:before{height:55%}.A387nG_doze .A387nG_eye:after{height:15%}.A387nG_glanceLeft .A387nG_pupil{translate:-9px}.A387nG_glanceRight .A387nG_pupil{translate:9px}.A387nG_thinking .A387nG_pupil{translate:-6px -5px}.A387nG_thinking .A387nG_character{animation:1.6s ease-in-out infinite A387nG_tilt}.A387nG_tool .A387nG_pupil{translate:0 6px}.A387nG_tool .A387nG_character{animation:.5s ease-in-out infinite A387nG_bop}.A387nG_done .A387nG_character{animation:1s ease-in-out infinite A387nG_spinjump}.A387nG_done .A387nG_ocularLeft .A387nG_brow{transform:rotate(-10deg)translateY(-2px)}.A387nG_done .A387nG_ocularRight .A387nG_brow{transform:rotate(10deg)translateY(-2px)scaleX(-1)}.A387nG_failed .A387nG_ocularLeft .A387nG_brow{transform:rotate(18deg)translateY(4px)}.A387nG_failed .A387nG_ocularRight .A387nG_brow{transform:rotate(-18deg)translateY(4px)scaleX(-1)}.A387nG_failed .A387nG_character{animation:.5s ease-in-out 2 A387nG_shake}.A387nG_wiggle .A387nG_character{animation:.8s ease-in-out A387nG_wiggleKf}.A387nG_idle .A387nG_character{animation:3.4s ease-in-out infinite A387nG_breathe}@keyframes A387nG_breathe{0%,to{transform:translateY(0)}50%{transform:translateY(-5px)}}@keyframes A387nG_tilt{0%,to{transform:rotate(-3deg)}50%{transform:rotate(4deg)}}@keyframes A387nG_bop{0%,to{transform:translateY(0)scaleY(1)}50%{transform:translateY(3px)scaleY(.97)}}@keyframes A387nG_spinjump{0%,to{transform:translateY(0)rotate(0)}30%{transform:translateY(-22px)rotate(-9deg)}60%{transform:translateY(-13px)rotate(8deg)}}@keyframes A387nG_shake{0%,to{transform:translate(0)}25%{transform:translate(-6px)rotate(-3deg)}75%{transform:translate(6px)rotate(3deg)}}@keyframes A387nG_wiggleKf{0%,to{transform:rotate(0)}25%{transform:rotate(-8deg)}50%{transform:rotate(7deg)}75%{transform:rotate(-4deg)}}@media (prefers-reduced-motion:reduce){.A387nG_idle .A387nG_character,.A387nG_thinking .A387nG_character,.A387nG_tool .A387nG_character,.A387nG_done .A387nG_character,.A387nG_failed .A387nG_character,.A387nG_wiggle .A387nG_character{animation:none}}.A387nG_summon{z-index:2147482000;color:#333;cursor:pointer;background:#f4f4f4;border:1px solid #888;border-radius:14px;padding:4px 10px;font-family:inherit;font-size:12px;position:fixed;bottom:16px;right:16px;box-shadow:1px 1px #0003}.A387nG_dialogOverlay{z-index:2147482100;background:#0003;place-items:center;display:grid;position:fixed;inset:0}.A387nG_dialog{color:#000;background:silver;border:1px solid #404040;border-color:#fff #404040 #404040 #fff;width:380px;max-width:calc(100vw - 40px);font-size:12px;box-shadow:inset 1px 1px silver,inset -1px -1px gray,3px 3px #00000059}.A387nG_dialogTitle{color:#fff;background:linear-gradient(90deg,navy,#1084d0);justify-content:space-between;align-items:center;padding:3px 6px;font-weight:700;display:flex}.A387nG_dialogBody{align-items:flex-start;gap:12px;padding:14px 14px 8px;display:flex}.A387nG_dialogIcon{flex:none;width:32px;height:32px}.A387nG_dialogText{line-height:1.5}.A387nG_dialogDetail{color:#444;margin-top:6px;font-family:Courier New,monospace;font-size:11px}.A387nG_dialogButtons{justify-content:center;gap:8px;padding:10px 14px 14px;display:flex}.A387nG_dialogButton{cursor:pointer;background:silver;border:1px solid #404040;border-color:#fff #404040 #404040 #fff;min-width:84px;padding:4px 12px;font-family:inherit;font-size:12px;box-shadow:inset 1px 1px silver,inset -1px -1px gray}.A387nG_dialogButton:focus-visible{outline-offset:-4px;outline:1px dotted #000}.A387nG_menu{z-index:2147482200;color:#000;background:silver;border:1px solid #404040;border-color:#fff #404040 #404040 #fff;min-width:150px;padding:2px;font-size:12px;position:fixed;box-shadow:inset 1px 1px silver,inset -1px -1px gray,2px 2px #0000004d}.A387nG_menuItem{text-align:left;cursor:pointer;color:#000;background:0 0;border:none;width:100%;padding:4px 18px 4px 10px;font-family:inherit;font-size:12px;display:block}.A387nG_menuItem:hover{color:#fff;background:navy}.A387nG_menuSep{border:none;border-top:1px solid gray;border-bottom:1px solid #fff;margin:2px 1px}";
		const tagId = "dsh-clippy/clippy.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-clippy";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var clippy_module_css_default = {
			"blink": "A387nG_blink",
			"body": "A387nG_body",
			"bop": "A387nG_bop",
			"breathe": "A387nG_breathe",
			"brow": "A387nG_brow",
			"bubble": "A387nG_bubble",
			"character": "A387nG_character",
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
			"doze": "A387nG_doze",
			"eye": "A387nG_eye",
			"failed": "A387nG_failed",
			"glanceLeft": "A387nG_glanceLeft",
			"glanceRight": "A387nG_glanceRight",
			"head": "A387nG_head",
			"idle": "A387nG_idle",
			"menu": "A387nG_menu",
			"menuItem": "A387nG_menuItem",
			"menuSep": "A387nG_menuSep",
			"ocular": "A387nG_ocular",
			"ocularLeft": "A387nG_ocularLeft",
			"ocularRight": "A387nG_ocularRight",
			"option": "A387nG_option",
			"options": "A387nG_options",
			"pupil": "A387nG_pupil",
			"root": "A387nG_root",
			"shake": "A387nG_shake",
			"spinjump": "A387nG_spinjump",
			"summon": "A387nG_summon",
			"thinking": "A387nG_thinking",
			"tilt": "A387nG_tilt",
			"tool": "A387nG_tool",
			"wiggle": "A387nG_wiggle",
			"wiggleKf": "A387nG_wiggleKf",
			"wireShadow": "A387nG_wireShadow",
			"wireShape": "A387nG_wireShape"
		};
		//#endregion
		//#region src/client/Clippy.tsx
		/**
		* The paperclip assistant. Character rig adapted from ManzDev/twitch-clippy
		* (ISC). Driven by the host snapshot, with idle micro animations, click and
		* context menu interactions, optional synthesized sounds, and the classic
		* error dialog on failed turns.
		* @module dsh-clippy/client/Clippy
		*/
		const POSITION_KEY = "dsh-clippy.position";
		const HIDDEN_KEY = "dsh-clippy.hidden";
		const SOUND_KEY = "dsh-clippy.sound";
		const CLICK_LINES = [
			"Careful. I am load bearing.",
			"Yes?",
			"I am concentrating. Loosely.",
			"That tickles. Please file a ticket."
		];
		const WIRE_D = "m 13.6 44.2 c 0 0 -1 11.4 0 18.7 c 0.5 4 1.8 9.2 7.2 9.8 c 2.7 0.2 5.5 -1.8 6.7 -4.4 c 2.3 -4.8 0 -20.6 2 -33.4 c 1.2 -8.2 3 -17.5 3.6 -24.2 C 33.4 7.4 30.2 4.5 26.8 3.3 C 24.2 2.4 20.2 1.9 18 3.5 C 13.2 6.8 9.7 15.9 8.5 25.9 A 213.3 213.3 0 0 0 9 69.8 c 1.1 8.4 2.6 21.2 14.9 20.9 c 5.4 0 9.8 -2.3 11.4 -11 c 1.4 -7.9 -0.8 -15.9 0 -23.4 C 36 52 39 45 39 45";
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
			const [soundOn, setSoundOn] = (0, react.useState)(() => localStorage.getItem(SOUND_KEY) === "1");
			const [dismissedAt, setDismissedAt] = (0, react.useState)(0);
			const [menu, setMenu] = (0, react.useState)(null);
			const [aboutOpen, setAboutOpen] = (0, react.useState)(false);
			const [micro, setMicro] = (0, react.useState)("");
			const [clickLine, setClickLine] = (0, react.useState)(null);
			const [interjectionAnswered, setInterjectionAnswered] = (0, react.useState)("");
			const [interjectionReply, setInterjectionReply] = (0, react.useState)(null);
			const dragging = (0, react.useRef)(null);
			const clickSeed = (0, react.useRef)(0);
			const prevPhase = (0, react.useRef)(snapshot.phase);
			(0, react.useEffect)(() => {
				localStorage.setItem(POSITION_KEY, JSON.stringify(position));
			}, [position]);
			(0, react.useEffect)(() => {
				localStorage.setItem(HIDDEN_KEY, hidden ? "1" : "0");
			}, [hidden]);
			(0, react.useEffect)(() => {
				localStorage.setItem(SOUND_KEY, soundOn ? "1" : "0");
			}, [soundOn]);
			(0, react.useEffect)(() => {
				if (snapshot.phase !== prevPhase.current) {
					if (soundOn && snapshot.phase === "failed") playError();
					if (soundOn && snapshot.phase === "done") playTada();
					prevPhase.current = snapshot.phase;
				}
			}, [snapshot.phase, soundOn]);
			(0, react.useEffect)(() => {
				if (hidden) return;
				let alive = true;
				let timer;
				const schedule = () => {
					timer = setTimeout(() => {
						if (!alive) return;
						const roll = Math.random();
						const pick = roll < .55 ? "blink" : roll < .72 ? "glanceLeft" : roll < .89 ? "glanceRight" : "wiggle";
						const hold = pick === "blink" ? 320 : pick === "wiggle" ? 850 : 1200;
						setMicro(pick);
						setTimeout(() => {
							if (alive) setMicro("");
						}, hold);
						schedule();
					}, 2800 + Math.random() * 3800);
				};
				schedule();
				return () => {
					alive = false;
					clearTimeout(timer);
				};
			}, [hidden]);
			(0, react.useEffect)(() => {
				if (clickLine === null) return;
				const timer = setTimeout(() => setClickLine(null), 3500);
				return () => clearTimeout(timer);
			}, [clickLine]);
			const onPointerDown = (event) => {
				if (event.button !== 0) return;
				dragging.current = {
					startX: event.clientX,
					startY: event.clientY,
					base: position,
					moved: false
				};
				event.currentTarget.setPointerCapture(event.pointerId);
			};
			const onPointerMove = (event) => {
				const drag = dragging.current;
				if (drag === null) return;
				const dx = event.clientX - drag.startX;
				const dy = event.clientY - drag.startY;
				if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
				if (drag.moved) setPosition({
					right: Math.max(0, drag.base.right - dx),
					bottom: Math.max(0, drag.base.bottom - dy)
				});
			};
			const onPointerUp = () => {
				const drag = dragging.current;
				dragging.current = null;
				if (drag !== null && !drag.moved) {
					clickSeed.current += 1;
					setClickLine(CLICK_LINES[clickSeed.current % CLICK_LINES.length]);
					setMicro("wiggle");
					setTimeout(() => setMicro(""), 850);
					if (soundOn) playChime();
				}
			};
			const onContextMenu = (event) => {
				event.preventDefault();
				setMenu({
					x: event.clientX,
					y: event.clientY
				});
			};
			if (hidden) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				className: clippy_module_css_default.summon,
				onClick: () => {
					setHidden(false);
					if (soundOn) playChime();
				},
				children: "📎 Summon"
			});
			const interjection = snapshot.interjection !== void 0 && snapshot.interjection.id !== interjectionAnswered ? snapshot.interjection : void 0;
			const bubbleText = clickLine ?? interjectionReply ?? interjection?.line ?? snapshot.bubble;
			const showOptions = clickLine === null && interjectionReply === null && interjection !== void 0;
			const showDialog = snapshot.phase === "failed" && snapshot.phaseStartedAt > dismissedAt;
			const phaseClass = clippy_module_css_default[snapshot.phase] ?? "";
			const microClass = micro !== "" ? clippy_module_css_default[micro] ?? "" : "";
			const answer = (reply) => {
				if (interjection !== void 0) setInterjectionAnswered(interjection.id);
				setInterjectionReply(reply);
				if (reply !== null) setTimeout(() => setInterjectionReply(null), 4e3);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: `${clippy_module_css_default.root} ${phaseClass} ${microClass}`,
					style: {
						right: position.right,
						bottom: position.bottom
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: clippy_module_css_default.bubble,
						children: [bubbleText, showOptions && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: clippy_module_css_default.options,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: clippy_module_css_default.option,
								onClick: () => answer("I cannot actually type for you. Yet."),
								children: "Get help"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: clippy_module_css_default.option,
								onClick: () => answer(null),
								children: "Just watching"
							})]
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: clippy_module_css_default.character,
						onPointerDown,
						onPointerMove,
						onPointerUp,
						onContextMenu,
						role: "img",
						"aria-label": "Clippy, the office assistant",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: clippy_module_css_default.head,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: `${clippy_module_css_default.ocular} ${clippy_module_css_default.ocularLeft}`,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: clippy_module_css_default.brow }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: clippy_module_css_default.eye,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: clippy_module_css_default.pupil })
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: `${clippy_module_css_default.ocular} ${clippy_module_css_default.ocularRight}`,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: clippy_module_css_default.brow }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: clippy_module_css_default.eye,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: clippy_module_css_default.pupil })
								})]
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
							className: clippy_module_css_default.body,
							viewBox: "0 0 45 125",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("filter", {
									id: "clippyBlur",
									colorInterpolationFilters: "sRGB",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("feGaussianBlur", { stdDeviation: "0 1.5" })
								}) }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									className: clippy_module_css_default.wireShadow,
									d: WIRE_D
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									className: clippy_module_css_default.wireShape,
									d: WIRE_D
								})
							]
						})]
					})]
				}),
				menu !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						position: "fixed",
						inset: 0,
						zIndex: 2147482150
					},
					onClick: () => setMenu(null),
					onContextMenu: (e) => {
						e.preventDefault();
						setMenu(null);
					}
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: clippy_module_css_default.menu,
					style: {
						left: Math.min(menu.x, window.innerWidth - 170),
						top: Math.min(menu.y, window.innerHeight - 140)
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: clippy_module_css_default.menuItem,
							onClick: () => {
								setMenu(null);
								setHidden(true);
							},
							children: "Hide Clippy"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: clippy_module_css_default.menuItem,
							onClick: () => {
								setSoundOn(!soundOn);
								setMenu(null);
								if (!soundOn) playChime();
							},
							children: ["Sound ", soundOn ? "off" : "on"]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("hr", { className: clippy_module_css_default.menuSep }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: clippy_module_css_default.menuItem,
							onClick: () => {
								setMenu(null);
								setAboutOpen(true);
							},
							children: "About Clippy…"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: clippy_module_css_default.menuItem,
							onClick: () => {
								setMenu(null);
								setClickLine("Not again.");
								setTimeout(() => setHidden(true), 1200);
							},
							children: "Fire him. Again."
						})
					]
				})] }),
				aboutOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: clippy_module_css_default.dialogOverlay,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: clippy_module_css_default.dialog,
						role: "dialog",
						"aria-label": "About Clippy",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: clippy_module_css_default.dialogTitle,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "About Clippy" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "✕" })]
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
										fill: "#1f6fd0"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M16 8v2M16 13v11",
										stroke: "#fff",
										strokeWidth: "3.5",
										strokeLinecap: "round"
									})]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: clippy_module_css_default.dialogText,
									children: ["Clippy Harness. He watched you write documents for 25 years and could do nothing. Now he has an agent runtime.", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: clippy_module_css_default.dialogDetail,
										children: "github.com/sjh9714/clippy-harness"
									})]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: clippy_module_css_default.dialogButtons,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: clippy_module_css_default.dialogButton,
									onClick: () => setAboutOpen(false),
									children: "Close"
								})
							})
						]
					})
				}),
				showDialog && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
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
				})
			] });
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