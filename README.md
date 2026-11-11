# 3D Studio

One command that turns your coding agent into a 3D web studio. Describe what you want, and 3D Studio picks the right skills for the job, builds in a set order, and checks the result in a real browser before calling it done.

It works with **Claude Code**, **Codex** and **Antigravity**.

## Install

```bash
npx github:mithulpranav24012008/3d-studio
```

That one command installs 3D Studio and the 25 skills it runs, for all three agents, into your user folder. You need [Node.js](https://nodejs.org) 18 or later. The installer lists every skill and where it comes from, then asks once before installing anything.

Then restart your agent.

| Option | What it does |
|---|---|
| `--yes` | Skips the confirmation, which is required when there's no terminal to ask in |
| `--agents claude-code,codex` | Installs for only the agents you list |
| `--only-skill` | Installs 3D Studio alone, without the 25 skills |
| `--project` | Installs into the current project instead of your user folder |
| `--from <source>` | Installs 3D Studio from a fork or a local folder |

Options go at the end of the command:

```bash
npx github:mithulpranav24012008/3d-studio --agents codex --yes
```

## Use

| Agent | Type |
|---|---|
| Claude Code | `/3d-studio a live satellite tracker with a 3D Earth` |
| Codex | `$3d-studio a live satellite tracker with a 3D Earth` |
| Antigravity | `/3d-studio a live satellite tracker with a 3D Earth` |

All three can also pick it up on their own when you ask them to use your 3D skills.

| Add | To |
|---|---|
| `--plan` | See which skills it would load and why, without building anything |
| `--all` | Load every skill, whatever the request |

```text
/3d-studio --plan a keyboard configurator with switch sounds
```

## What it does

### 1. Chooses the skills

Loading every skill at once would use up the working memory the build needs. So 3D Studio always loads three, then adds others only when the request calls for them.

**Always loaded:** `taste-skill` for art direction, `apple-design` for fluid motion and materials, and `threejs-fundamentals` for the scene, camera, renderer and loop.

| The request involves | Also loads |
|---|---|
| Anything that moves | `animate`, `threejs-animation` |
| Shapes built in code, instancing, many objects | `threejs-geometry` |
| Surfaces such as wood, metal or gloss | `threejs-materials`, `threejs-textures` |
| Lighting, shadows, reflections | `threejs-lighting` |
| Clicking, dragging, orbiting, picking parts | `threejs-interaction` |
| Custom visual effects | `threejs-shaders`, `threejs-postprocessing` |
| Loading or compressing 3D model files | `threejs-loaders`, `threejs-asset-pipeline` |
| Modelling or exporting from Blender | `blender-mcp` |
| A React project | `threejs-react-three-fiber`, `r3f-fundamentals` |
| Slowness, stutter, a blank canvas, memory | `threejs-performance`, `threejs-debug-profiler` |
| Isometric figures, diagrams, explainers, A4 posters | `anatomy` |
| A motion film: promo, explainer, brand film, a remake of a reference video, or one from a template | The OpenMotion skills: `motion-director`, `motion-recreate`, `motion-template-to-video`, `motion-video-to-template`, `motion-production` |
| A film rendered from the site's own 3D scene | The `remotion` package, used directly in the project |

### 2. Builds in a set order

1. **Decide the idea.** The art direction comes from the subject, not from a stock layout.
2. **Keep the logic out of the 3D.** Anything with real rules, such as arithmetic, a simulation or pricing, goes in plain modules with tests.
3. **Build the 3D as a function of state.** A motion is a pure function of its progress, so it can reverse halfway or jump to the end for reduced motion.
4. **Render on demand.** An idle page draws nothing, so a phone stays cool.
5. **Make it fully usable.** That means real buttons beside the canvas, keyboard use, reduced motion, a fallback without WebGL, and a layout that works at phone width.

### Images and footage

When a build needs a real photo or clip, 3D Studio takes it from [Pexels](https://www.pexels.com) (modern photos and video), [Archival Footage](https://archival-footage.com) (historical film and stills), or [Destockd](https://destockd.com) (ready-cut public-domain shots from U.S. government films). It downloads the file into the project and records its source, author and license in `ASSETS.md`. Set `PEXELS_API_KEY` to let it search Pexels through the [API](https://www.pexels.com/api/); without a key it searches the website. If a site blocks automated access, it asks you to download the file instead. Images fetched through the Pexels API need a visible "Photos provided by Pexels" credit, which it adds.

### 3. Checks the result

- Drives a real browser with real clicks and drags, including reversing and interrupting animations.
- Runs a design inspector at desktop and phone widths, then looks at the screenshots.
- Runs the tests, reads the console, and repeats the main flow on the production build.
- Reports what was verified and, plainly, what wasn't. Real devices, sound and motion at full speed are usually out of reach for an agent.

The browser checks need Node 22 or later and an installed Chrome, Edge or Chromium.

## The skills it installs

This repository contains only the 3D Studio skill and its installer. The installer fetches every other skill from its author's own repository, and each stays under its author's terms. Thanks to all of them.

| Skill | Author's repository |
|---|---|
| `design-taste-frontend` (also known as `taste-skill`) | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `animate`, `apple-design` | [emilkowalski/skills](https://github.com/emilkowalski/skills) |
| 13 `threejs-*` skills | [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills) |
| `threejs-debug-profiler` | [majidmanzarpour/threejs-game-skills](https://github.com/majidmanzarpour/threejs-game-skills) |
| `r3f-fundamentals` | [EnzeD/r3f-skills](https://github.com/EnzeD/r3f-skills) |
| `blender-mcp` | [vladmdgolam/agent-skills](https://github.com/vladmdgolam/agent-skills) |
| `anatomy` | [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy) |
| 5 `motion-*` skills (OpenMotion films) | [nexu-io/openmotion](https://github.com/nexu-io/openmotion) |

The OpenMotion skills drive the OpenMotion app, which this installer doesn't install. To make films with them, set up the app and connect it to your agent as its [README](https://github.com/nexu-io/openmotion#agent-setup) describes; until then 3D Studio renders films with Remotion.

Skills are instructions your agent follows, and some include scripts it can run. They run with your agent's permissions. These come from third parties and install at their latest version, so it's worth looking through their repositories first.

## Where the files go

| Agent | Folder |
|---|---|
| Codex | `~/.agents/skills/` |
| Claude Code | `~/.claude/skills/`, as links to the Codex folder |
| Antigravity | `~/.gemini/config/skills/`, as copies |

The installer doesn't replace a skill you already have in the Antigravity folder. For Claude Code and Codex, the [skills](https://github.com/vercel-labs/skills) tool it uses may replace a folder with the same name. Running the command again updates everything it installed.

If you already have `taste-skill` under that name, you'll also get `design-taste-frontend`. They're the same skill from different versions, so you can delete the older one.

To uninstall, delete the skill's folder from each location above.

## What has been tested

The installer has been run on macOS, for all three agents, using a throwaway home folder, and the files landed in the folders above. The skill itself has been used to build real projects in Claude Code.

It hasn't yet been run inside Codex or Antigravity, or installed on Windows or Linux. If something goes wrong there, please [open an issue](https://github.com/mithulpranav24012008/3d-studio/issues).

## License

[MIT](LICENSE), for the 3D Studio skill and installer in this repository only.
