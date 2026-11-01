---
name: 3d-studio
description: One command for the whole 3D website toolkit. Combines taste-skill, apple-design, animate, anatomy, the threejs-* skills, r3f-*, blender-mcp, threejs-debug-profiler and Remotion, loading what the job needs and checking the result in a real browser. Use when the user types /3d-studio or $3d-studio, or asks to use their full 3D toolkit or all their 3D skills together. Add --all to load everything, or --plan to see the selection without building.
argument-hint: "[--plan | --all] what to build"
---

# 3D Studio

Runs a set of 3D web skills as one workflow. The request is in `$ARGUMENTS`. If your agent left that placeholder unfilled, the request is what the user wrote alongside this skill.

## 1. Choose the skills

Each of these is a separate skill. Load it the way your agent loads skills, under exactly the name shown: the Skill tool in Claude Code, or by reading its `SKILL.md` in Codex and Antigravity. Its instructions then apply alongside this workflow. Section 4 lists where to find the folders.

**Always load these three:** `taste-skill` (art direction; it may be installed as `design-taste-frontend`), `apple-design` (fluid physical motion, materials and depth), `threejs-fundamentals` (scene, camera, renderer, loop).

**Add a row when the request needs it:**

| The request involves | Load |
|---|---|
| Anything that moves | `animate`, `threejs-animation` |
| Shapes built in code, instancing, many objects | `threejs-geometry` |
| Surfaces, wood, metal, gloss | `threejs-materials`, `threejs-textures` |
| Lighting, shadows, reflections | `threejs-lighting` |
| Clicking, dragging, orbiting, picking parts | `threejs-interaction` |
| Custom visual effects | `threejs-shaders`, `threejs-postprocessing` |
| Loading or compressing 3D model files | `threejs-loaders`, `threejs-asset-pipeline` |
| Modelling or exporting from Blender | `blender-mcp` (first check that Blender is installed) |
| A React project | `threejs-react-three-fiber`, `r3f-fundamentals` |
| Slowness, stutter, a blank canvas, memory | `threejs-performance`, `threejs-debug-profiler` |
| Isometric figures, diagrams or explainers showing how something works, or a printed A4 poster of one | `anatomy` |
| A rendered film or video | Remotion, see section 3 |

Together these skills run to thousands of lines, and loading them all uses up working memory that the build needs. That is why the table is the default.

- With `--all`, load every skill in the table regardless of the request.
- With `--plan`, list the skills you would load and why, load nothing further, and stop.

Say in one line which skills you are loading. If a skill won't load, name it and carry on with the others rather than stopping.

Load each skill at the point this workflow needs it. If a skill opens with a set-up step, or asks for a greeting that would interrupt the work, skip that part.

## 2. Work in this order

1. **Decide the idea.** Follow `taste-skill` for the art direction: read the brief, draw a direction, write the copy. The idea should come from the subject.
2. **Keep the logic out of the 3D.** Anything with real rules (arithmetic, a simulation, pricing) goes in plain modules with no Three.js, covered by tests, so it can be trusted without rendering anything.
3. **Build the 3D as a function of state.** Geometry code places parts from a pose and knows nothing of the rules. A motion should be a pure function of its progress, so it can run backwards, be reversed halfway, or jump to the end for reduced motion.
4. **Render on demand.** Draw only when something moved, and not at all off screen, so an idle page costs nothing and a phone stays cool.
5. **Make it fully usable.** It needs real buttons beside the canvas, keyboard use, reduced motion, a fallback with no WebGL, and a layout that works at phone width.

## 3. Remotion

No Remotion skill is part of this set, so use the `remotion` package directly in the project.

- Render by importing the same scene-building code the site uses, so film and site can't drift apart.
- Each frame must be a pure function of the frame number. Don't use timers or springs that depend on earlier frames.
- Render with `remotion render <entry> <composition> <out.mp4> --gl=angle --codec=h264 --crf=24`.
- A changed scene doesn't change a film that's already rendered. Re-render it, or tell the user it's out of date.

## 4. Check it before calling it done

The checks use scripts inside two of the skills. Find each skill's folder by looking for its name, in this order, in `.claude/skills/` and `.agents/skills/` in the project, then `~/.claude/skills/`, `~/.agents/skills/` and `~/.gemini/config/skills/`. Below, `<anatomy>` and `<taste>` stand for those folders. `<taste>` is named either `taste-skill` or `design-taste-frontend`.

Use `node <anatomy>/scripts/drive.mjs <url> --actions steps.json` to drive a real browser with real clicks and drags. Both scripts need Node 22 or later and an installed Chrome, Edge or Chromium.

- **Stills and flows are separate runs.** A `shot` action can freeze animation until the next capture. Take stills with `--reduced`, which jumps to the final state, and test animated flows with `eval` checks and no screenshots in the middle of the run. If a frame comes out blank or stale, take it again before treating it as a bug.
- **Test the real controls.** Prefer clicking the actual buttons over setting state directly, and include reversing and interrupting mid-animation.
- **Check the design.** Run `node <taste>/scripts/inspect.mjs <url> --widths 1440,390`, then look at the screenshots yourself. Passing the inspector is the minimum, not the grade.
- **Run the tests and read the console.** Then repeat the main flow on the production build, not just the dev server.

Report what was verified and, plainly, what wasn't: real devices, sound, and motion seen at full speed are usually out of reach here.

## 5. Installing anything new

If a skill in the table is missing, the user can install the whole set with `npx github:mithulpranav24012008/3d-studio`. For any other skill or tool the task needs, give the user the command and let them run it, so they see its security summary. Don't use `-y` to skip confirmation.
