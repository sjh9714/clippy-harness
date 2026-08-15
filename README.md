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

## He interrupts you again

The classic. He reads your message on its way to the agent, and when it looks
risky he has opinions. Say "deploy" and you get options. Each line fires once
per session, then he lets it go.

![interject](assets/state-interject.gif)

## He follows real agent state

He subscribes to core session events. Every reaction is the agent's actual
state, not a decoration.

| Thinking | Running a tool |
| --- | --- |
| ![thinking](assets/state-thinking.gif) | ![tool](assets/state-tool.gif) |

| Turn completed | Turn failed |
| --- | --- |
| ![done](assets/state-done.gif) | ![failed](assets/state-failed.gif) |

- **Thinking** gets a head tilt. He reads your codebase now. All of it. Unlike 1997.
- **Tool calls** get a busy bounce.
- **A completed turn** gets a jump. He checked. Twice.
- **A failed turn** gets angry eyebrows and the classic dialog. *"Your agent has performed an illegal operation."* The buttons are Close and It wasn't me.

## He has a personality now

- Blinks, glances around, and wiggles while idle.
- Click him for a reaction. Drag him anywhere.
- Right click for the menu. Hide, sound toggle, About Clippy, and Fire him. Again.
- Optional synthesized retro sounds (default off, no audio files shipped).

## Custom lines

Every line he says can be replaced through the plugin config.

```yaml
- id: clippy
  name: 'dsh-clippy'
  config:
    state:
      lines:
        done:
          - 'Ship it.'
```

## Pairs well with

The `xp` skin from [dsh-skins](https://github.com/zhu1090093659/dsh-web-ui) turns the whole Web UI into a retro desktop. Clippy fits right in. He works on the default theme too.

## From a checkout

```sh
npx @deepseek-ai/dsh plugin --profile web add link:/path/to/clippy-harness/plugin
```

## Why

Every AI assistant today is trying to look like the future.
The first one of them all deserves to come back and see how it turned out.

## Credits

Character rig adapted from [ManzDev/twitch-clippy](https://github.com/ManzDev/twitch-clippy) (ISC). Demo scenes are rendered with the seek(t) harness in `demo/`.

## License

MIT. Not affiliated with Microsoft. Clippit, we miss you.
