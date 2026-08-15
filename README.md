# 📎 Clippy Harness

[![npm](https://img.shields.io/npm/v/dsh-clippy)](https://www.npmjs.com/package/dsh-clippy)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![dsh](https://img.shields.io/badge/DeepSeek_Harness-rc.6-4a7)](https://github.com/deepseek-ai/deepseek-harness)

English | [中文](README.zh.md)

> "It looks like you're writing code. **This time I can actually help.**"

An office assistant pet for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web UI.

He watched you write documents for 25 years and could do nothing.
Now he has an agent runtime.

![demo](assets/launch.gif)

## Install

```sh
npx @deepseek-ai/dsh plugin --profile web add dsh-clippy
```

Restart `dsh web` and he is in the corner.

## What he does

He subscribes to core session events, so every reaction is the agent's real state. Not a decoration.

| Thinking | Running a tool |
| --- | --- |
| ![thinking](assets/state-thinking.gif) | ![tool](assets/state-tool.gif) |

| Turn completed | Turn failed |
| --- | --- |
| ![done](assets/state-done.gif) | ![failed](assets/state-failed.gif) |

- **Thinking** gets a head tilt. He reads your codebase now. All of it. Unlike 1997.
- **Tool calls** get a busy bounce with the tool name in the bubble.
- **A completed turn** gets a jump. He checked. Twice.
- **A failed turn** opens the classic dialog. *"Your agent has performed an illegal operation."* The buttons are Close and It wasn't me.
- Drag him anywhere. Hide him and a summon button appears. He is good at waiting. 25 years of practice.

## Pairs well with

The `xp` skin from [dsh-skins](https://github.com/zhu1090093659/dsh-web-ui) turns the whole Web UI into a retro desktop. Clippy fits right in. He works on the default theme too.

## From a checkout

```sh
npx @deepseek-ai/dsh plugin --profile web add link:/path/to/clippy-harness/plugin
```

## Why

Every AI assistant today is trying to look like the future.
The first one of them all deserves to come back and see how it turned out.

## License

MIT. Not affiliated with Microsoft. The paperclip is an original drawing. Clippit, we miss you.
