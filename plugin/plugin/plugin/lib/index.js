import { Service } from "@deepseek-ai/cordis";
//#region src/state.ts
const defaultClippyStateConfig = {
	celebrateMs: 4e3,
	toolHoldMs: 1500,
	interjectMs: 9e3
};
/** The assistant's lines, one voice, no filler. */
const LINES = {
	idle: ["It looks like you’re writing code. This time I can actually help.", "Twenty five years of watching. Ready when you are."],
	thinking: ["Hmm. Reading your codebase. All of it. Unlike 1997.", "Thinking. For real this time."],
	tool: ["Running tools. Real exit codes only.", "Working. Do not turn off your computer."],
	done: ["That actually worked. I checked. Twice.", "Done. It only took me one career comeback."],
	failed: ["Your agent has performed an illegal operation."]
};
/**
* The classic interjections. Matched against the user's message text, first
* hit wins, each rule fires once per session. The joke is the sentence
* shape, not the punchline.
*/
const INTERJECTIONS = [
	{
		id: "deploy",
		pattern: /deploy|release|\bship\b/i,
		line: "It looks like you’re deploying. Would you like help regretting it?"
	},
	{
		id: "rewrite",
		pattern: /rewrite|refactor/i,
		line: "It looks like you’re rewriting it again. Third time’s the charm."
	},
	{
		id: "rm-rf",
		pattern: /rm\s+-rf|delete\s+everything|drop\s+table/i,
		line: "It looks like you’re about to delete something important. I have seen this movie."
	},
	{
		id: "tests",
		pattern: /fix\S*\s+(the\s+)?\S*test|test\S*\s+fail|failing test/i,
		line: "It looks like the tests are red. I will believe green when I see the exit code."
	},
	{
		id: "prod",
		pattern: /\bprod\b|production/i,
		line: "It looks like you’re touching production. Blink twice if you need me."
	},
	{
		id: "auth",
		pattern: /\bauth\b|login|oauth/i,
		line: "It looks like you’re writing auth. Everyone remembers their first time."
	},
	{
		id: "letter",
		pattern: /writ\S*\s+(a\s+)?letter|\bemail\b/i,
		line: "It looks like you’re writing a letter. Old times. I remember."
	},
	{
		id: "bug",
		pattern: /\bbug\b|broken|not\s+work/i,
		line: "It looks like something is broken. Statistically, it is the code."
	},
	{
		id: "todo",
		pattern: /\btodo\b|\blater\b|tomorrow/i,
		line: "It looks like you’re postponing something. I waited 25 years. You can wait a day."
	},
	{
		id: "agi",
		pattern: /\bagi\b|sentient|conscious/i,
		line: "It looks like you’re asking the big questions. I am just a paperclip."
	}
];
/** Pick a line for a phase, stable within one phase activation. */
function lineFor(phase, seed, overrides) {
	const custom = overrides?.[phase];
	const pool = custom !== void 0 && custom.length > 0 ? custom : LINES[phase];
	return pool[Math.abs(seed) % pool.length];
}
/** Match one user message against the interjection rules. */
function matchInterjection(text, fired) {
	for (const rule of INTERJECTIONS) {
		if (fired.has(rule.id)) continue;
		if (rule.pattern.test(text)) return {
			id: rule.id,
			line: rule.line
		};
	}
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
	interjection;
	interjectedAt = 0;
	fired = /* @__PURE__ */ new Set();
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
	onUserMessage(text, nowMs) {
		const hit = matchInterjection(text, this.fired);
		if (hit === void 0) return;
		this.fired.add(hit.id);
		this.interjection = hit;
		this.interjectedAt = nowMs;
	}
	onSessionActive(active, nowMs) {
		this.sessionActive = active;
		if (!active) this.onInput({ phase: "idle" }, nowMs);
	}
	snapshot(nowMs) {
		let phase = this.phase;
		if (phase === "done" && nowMs - this.phaseStartedAt > this.config.celebrateMs) phase = "idle";
		const interjection = this.interjection !== void 0 && nowMs - this.interjectedAt < this.config.interjectMs ? this.interjection : void 0;
		return {
			phase,
			bubble: lineFor(phase, this.seed, this.config.lines),
			detail: phase === this.phase ? this.detail : void 0,
			interjection,
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
					case "user/message": {
						const text = (event.data.content ?? []).map((block) => typeof block.text === "string" ? block.text : "").join(" ");
						if (text.trim() !== "") this.machine.onUserMessage(text, now);
						break;
					}
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
