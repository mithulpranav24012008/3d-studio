---
name: 3d-studio
description: One command for the whole 3D website toolkit. Combines taste-skill, apple-design, animate, anatomy, the threejs-* skills, r3f-*, blender-mcp, threejs-debug-profiler and Remotion, loading what the job needs and checking the result in a real browser. Use when the user types /3d-studio or $3d-studio, or asks to use their full 3D toolkit or all their 3D skills together. Add --all to load everything, or --plan to see the selection without building.
argument-hint: "[--plan | --all] what to build"
---

# 3D Studio

Runs a set of 3D web skills as one workflow. The request is in `$ARGUMENTS`. If your agent left that placeholder unfilled, the request is what the user wrote alongside this skill.

## 1. Choose the skills

Each of these is a separate skill. Load it the way your agent loads skills, under exactly the name shown: the Skill tool in Claude Code, or by reading its `SKILL.md` in Codex and Antigravity. Its instructions then apply alongside this workflow. Section 5 lists where to find the folders.

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
| A real photo, texture, backdrop or footage clip | No extra skill; follow section 4 |

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

## 4. Images and footage

When the work needs a real photograph or clip (a backdrop, a texture on a surface, an environment behind a product, a reference, a shot in a film), take it from these sites before anything else. Use them only when a real image is the better choice; geometry, shaders and gradients built in code stay the default.

| Site | Use it for | Terms |
|---|---|---|
| [Pexels](https://www.pexels.com) | Modern photos and video: people, places, nature, products, textures, backgrounds | [Pexels License](https://www.pexels.com/license/): free, commercial use and editing allowed, credit optional |
| [Archival Footage](https://archival-footage.com) | Historical and archival film and stills | Not stated site-wide. Read the license on each item's own page before using it |
| [Destockd](https://destockd.com) | Historical footage as short, ready-cut shots: 41,000+ clips from U.S. government films (FedFlix on archive.org). Best for B-roll, period texture and archival cutaways | [Legal](https://destockd.com/#/legal): believed public domain or unrestricted in the U.S., free, no account, no credit required. Not independently cleared per clip |

**Finding images.** Search with the subject and the use in mind: orientation, how large it will be on screen, and whether it has to tile.
- **Pexels with a key:** if `PEXELS_API_KEY` is set, use the API with the header `Authorization: $PEXELS_API_KEY`:
  - photos: `GET https://api.pexels.com/v1/search?query=...&orientation=landscape&per_page=15`
  - videos: `GET https://api.pexels.com/v1/videos/search?query=...`
  - `orientation` is `landscape`, `portrait` or `square`. Stay well under the rate limit (200 requests an hour).
  - Images fetched through the API must be credited: a visible "Photos provided by Pexels" link in the product, plus "Photo by <name> on Pexels" where possible.
- **Pexels without a key:** search on pexels.com and download from the photo's page.
- **Destockd:** search by describing what is on screen ("crowd running", "1950s kitchen") in the site's search box; it searches the pictures, not titles. Use "See similar shots" to widen the choice, then "Download clip". Searches don't produce a shareable URL, so record each shot's own page instead.
- **Keys:** never write the key into the project, a commit or a log.

**Downloading.**
- Download the file into the project, under `public/images/` or `public/footage/`, with a descriptive name. Don't hotlink.
- Take the smallest size that stays sharp where it's used.
- For textures, follow `threejs-textures` (colour space, compression, power-of-two sizes where it matters).

**Record every asset.** Add a line to `ASSETS.md` at the project root: the file, the site, the item's page URL, the author, the license, and the date. Keep it even where credit is optional. Show credits in the product when a license asks for them.

**Respect the terms.**
- **Pexels:** don't sell an unaltered copy, don't imply that a person or brand endorses anything, don't use an image as a logo or trademark, don't show identifiable people in an offensive light, and don't redistribute images through another stock or wallpaper site.
- **Archival Footage:** if an item's page doesn't clearly allow the intended use (commercial or not, credit, editing), don't use it. Tell the user what you found instead.
- **Destockd:** the site doesn't clear each clip, and grants no model, property or trademark releases. For commercial work, open the shot's linked Internet Archive and National Archives records. Then tell the user the clip still needs their rights check. Watch for music, logos and recognisable people inside old films. Some footage shows war and atrocities; don't use it casually.
- **Logos, products and people:** avoid recognisable brands and logos in any image, and identifiable people unless the use is plainly fine.

**When a site blocks automated access** (a CAPTCHA, a bot check, a sign-in), don't try to get past it. Give the user the search or the item's link and ask them to download the file into the project, then carry on.

## 5. Check it before calling it done

The checks use scripts inside two of the skills. Find each skill's folder by looking for its name, in this order, in `.claude/skills/` and `.agents/skills/` in the project, then `~/.claude/skills/`, `~/.agents/skills/` and `~/.gemini/config/skills/`. Below, `<anatomy>` and `<taste>` stand for those folders. `<taste>` is named either `taste-skill` or `design-taste-frontend`.

Use `node <anatomy>/scripts/drive.mjs <url> --actions steps.json` to drive a real browser with real clicks and drags. Both scripts need Node 22 or later and an installed Chrome, Edge or Chromium.

- **Stills and flows are separate runs.** A `shot` action can freeze animation until the next capture. Take stills with `--reduced`, which jumps to the final state, and test animated flows with `eval` checks and no screenshots in the middle of the run. If a frame comes out blank or stale, take it again before treating it as a bug.
- **Test the real controls.** Prefer clicking the actual buttons over setting state directly, and include reversing and interrupting mid-animation.
- **Check the design.** Run `node <taste>/scripts/inspect.mjs <url> --widths 1440,390`, then look at the screenshots yourself. Passing the inspector is the minimum, not the grade.
- **Run the tests and read the console.** Then repeat the main flow on the production build, not just the dev server.

If the build uses downloaded images or footage, check that each one appears in `ASSETS.md` with its license.

Report what was verified and, plainly, what wasn't: real devices, sound, and motion seen at full speed are usually out of reach here.

## 6. Installing anything new

If a skill in the table is missing, the user can install the whole set with `npx github:mithulpranav24012008/3d-studio`. For any other skill or tool the task needs, give the user the command and let them run it, so they see its security summary. Don't use `-y` to skip confirmation.
