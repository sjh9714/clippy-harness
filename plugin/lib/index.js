import { Service } from "@deepseek-ai/cordis";
//#region src/state.ts
const defaultClippyStateConfig = {
	celebrateMs: 4e3,
	toolHoldMs: 1500
};
/** The assistant's lines, one voice, no filler. */
const LINES = {
	idle: ["It looks like you’re writing code. This time I can actually help.", "Twenty five years of watching. Ready when you are."],
	thinking: ["Hmm. Reading your codebase. All of it. Unlike 1997.", "Thinking. For real this time."],
	tool: ["Running tools. Real exit codes only.", "Working. Do not turn off your computer."],
	done: ["That actually worked. I checked. Twice.", "Done. It only took me one career comeback."],
	failed: ["Your agent has performed an illegal operation."]
};
/** Pick a line for a phase, stable within one phase activation. */
function lineFor(phase, seed) {
	const pool = LINES[phase];
	return pool[Math.abs(seed) % pool.length];
}
/**
* The machine holds the last phase and settles done back to idle after the
* celebration window. failed is sticky until the next turn starts, so the
* dialog stays up long enough to be read (the client can dismiss locally).
*/
var ClippyStateMachine = class {
	phase = "idle";
	detail;
	phaseStartedAt = 0;
	seed = 0;
	sessionActive = false;
	config;
	constructor(config = {}) {
		this.config = {
			...defaultClippyStateConfig,
			...config
		};
	}
	onInput(input, nowMs) {
		if (input.phase === this.phase && input.detail === this.detail) return;
		if (this.phase === "tool" && input.phase === "thinking" && nowMs - this.phaseStartedAt < this.config.toolHoldMs) return;
		this.phase = input.phase;
		this.detail = input.detail;
		this.phaseStartedAt = nowMs;
		this.seed += 1;
	}
	onSessionActive(active, nowMs) {
		this.sessionActive = active;
		if (!active) this.onInput({ phase: "idle" }, nowMs);
	}
	snapshot(nowMs) {
		let phase = this.phase;
		if (phase === "done" && nowMs - this.phaseStartedAt > this.config.celebrateMs) phase = "idle";
		return {
			phase,
			bubble: lineFor(phase, this.seed),
			detail: phase === this.phase ? this.detail : void 0,
			phaseStartedAt: this.phaseStartedAt,
			sessionActive: this.sessionActive
		};
	}
};
//#endregion
//#region src/service.ts
/**
* Clippy host service. Maps core rc.6 session events (turn/step/tool
* boundaries and the session lifecycle) onto the assistant's phases and
* serves the snapshot to the browser half.
* @module dsh-clippy/service
*/
var ClippyService = class extends Service {
	static inject = [];
	machine;
	constructor(ctx, config = {}) {
		super(ctx, "clippy");
		this.machine = new ClippyStateMachine({
			...defaultClippyStateConfig,
			...config.state
		});
		ctx.effect(() => {
			const disposers = [ctx.on("session/event", (_session, event) => {
				const now = Date.now();
				this.machine.onSessionActive(true, now);
				switch (event.type) {
					case "turn/start":
					case "step/start":
					case "assistant/chunk":
						this.machine.onInput({ phase: "thinking" }, now);
						break;
					case "tool/call":
						this.machine.onInput({
							phase: "tool",
							detail: event.data.name
						}, now);
						break;
					case "turn/end": {
						const reason = event.data.reason;
						if (reason?.kind === "completed") this.machine.onInput({ phase: "done" }, now);
						else this.machine.onInput({
							phase: "failed",
							detail: reason?.kind
						}, now);
						break;
					}
				}
			}), ctx.on("session/disposed", () => {
				this.machine.onSessionActive(false, Date.now());
			})];
			return () => {
				for (const dispose of disposers) dispose();
			};
		}, "clippy: session events");
	}
	state() {
		return Promise.resolve(this.machine.snapshot(Date.now()));
	}
};
//#endregion
//#region src/routes.ts
/** Browser-facing base path of the clippy API. */
const CLIPPY_API_PREFIX = "/api/clippy";
function json(res, status, body) {
	res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
	res.end(JSON.stringify(body));
}
function makeClippyRoutes(service) {
	return [{
		kind: "exact",
		path: `${CLIPPY_API_PREFIX}/state`,
		handler: (req, res) => {
			if (req.method !== "GET") {
				json(res, 405, {
					ok: false,
					error: "method-not-allowed"
				});
				return;
			}
			service.state().then((value) => json(res, 200, value), (error) => json(res, 500, {
				ok: false,
				error: error instanceof Error ? error.message : String(error)
			}));
		}
	}];
}
//#endregion
//#region src/index.ts
/** Stable cordis plugin name (matches cordis.patch.yml insert id). */
const name = "clippy";
/** Services required before clippy can mount its route. */
const inject = ["webServer"];
/** Register the clippy service and its API route on the context. */
function apply(ctx, config = {}) {
	const service = new ClippyService(ctx, config);
	ctx.effect(() => {
		const disposers = makeClippyRoutes(service).map((route) => ctx.webServer.register(route));
		return () => {
			for (const dispose of disposers) dispose();
		};
	}, "clippy: routes");
}
//#endregion
export { CLIPPY_API_PREFIX, ClippyService, ClippyStateMachine, LINES, apply, defaultClippyStateConfig, inject, lineFor, makeClippyRoutes, name };
