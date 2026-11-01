#!/usr/bin/env node
// Installs 3D Studio and the skills it runs, for Claude Code, Codex and Antigravity.
// Each skill is fetched from its author's own repository; none are bundled here.
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';

const SKILLS_CLI = 'skills@1.7.4';
const AGENTS = ['claude-code', 'codex', 'antigravity'];
const SELF = 'mithulpranav24012008/3d-studio';

const DEPENDENCIES = [
  ['Leonxlnx/taste-skill', ['design-taste-frontend']],
  ['emilkowalski/skills', ['animate', 'apple-design']],
  ['cloudai-x/threejs-skills', [
    'threejs-animation', 'threejs-asset-pipeline', 'threejs-fundamentals', 'threejs-geometry',
    'threejs-interaction', 'threejs-lighting', 'threejs-loaders', 'threejs-materials',
    'threejs-performance', 'threejs-postprocessing', 'threejs-react-three-fiber',
    'threejs-shaders', 'threejs-textures',
  ]],
  ['majidmanzarpour/threejs-game-skills', ['threejs-debug-profiler']],
  ['EnzeD/r3f-skills', ['r3f-fundamentals']],
  ['vladmdgolam/agent-skills', ['blender-mcp']],
  ['wheresryan22/anatomy', ['anatomy']],
];

const HELP = `Install 3D Studio and the skills it runs.

  npx github:${SELF}

Options
  --yes            Skip the confirmation
  --agents <list>  Comma-separated: ${AGENTS.join(',')} (default: all three)
  --only-skill     Install 3D Studio alone, without the skills it runs
  --project        Install into the current project instead of your user folder
  --from <source>  Install 3D Studio from a fork or local folder
  --help           Show this message
`;

function parse(argv) {
  const options = { yes: false, agents: AGENTS, onlySkill: false, project: false, from: SELF };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--yes' || arg === '-y') options.yes = true;
    else if (arg === '--only-skill') options.onlySkill = true;
    else if (arg === '--project') options.project = true;
    else if (arg === '--agents') options.agents = (argv[++i] ?? '').split(',').filter(Boolean);
    else if (arg === '--from') options.from = argv[++i];
    else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  const unknown = options.agents.filter((agent) => !AGENTS.includes(agent));
  if (unknown.length) throw new Error(`Unknown agent: ${unknown.join(', ')}. Choose from ${AGENTS.join(', ')}.`);
  if (!options.agents.length) throw new Error(`--agents needs at least one of ${AGENTS.join(', ')}.`);
  if (!options.from) throw new Error('--from needs a source.');
  return options;
}

function add(source, skills, options) {
  const args = ['--yes', SKILLS_CLI, 'add', source];
  for (const skill of skills) args.push('--skill', skill);
  for (const agent of options.agents) args.push('--agent', agent);
  if (!options.project) args.push('--global');
  if (options.yes) args.push('--yes');
  const windows = process.platform === 'win32';
  const quoted = windows ? args.map((arg) => `"${arg}"`) : args;
  const run = spawnSync(windows ? 'npx.cmd' : 'npx', quoted, { stdio: 'inherit', shell: windows });
  return run.status === 0;
}

// Antigravity reads user skills from ~/.gemini/config/skills, which the skills CLI doesn't write to,
// so they are copied there from the CLI's shared folder.
function copyToAntigravity(names) {
  const from = join(homedir(), '.agents', 'skills');
  const to = join(homedir(), '.gemini', 'config', 'skills');
  const marker = '.installed-by-3d-studio';
  mkdirSync(to, { recursive: true });
  const skipped = [];
  for (const name of names) {
    const source = join(from, name);
    const target = join(to, name);
    if (!existsSync(source)) continue;
    if (existsSync(target)) {
      if (!existsSync(join(target, marker))) {
        skipped.push(name);
        continue;
      }
      rmSync(target, { recursive: true, force: true });
    }
    cpSync(source, target, { recursive: true, dereference: true });
    writeFileSync(join(target, marker), '');
  }
  return skipped;
}

// The skills CLI doesn't prompt once skills and agents are named, so the one confirmation lives here.
async function confirm(sources, options) {
  console.log(`This will install for ${options.agents.join(', ')}:\n`);
  for (const [source, skills] of sources) console.log(`  ${source}: ${skills.join(', ')}`);
  console.log('\nSkills are instructions your agent follows, and some include scripts. They run with your agent\'s permissions.');
  if (!process.stdin.isTTY) {
    console.error('\nNo terminal to ask in. Add --yes to install anyway.');
    return false;
  }
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await prompt.question('\nInstall these? (y/N) ');
  prompt.close();
  return /^y(es)?$/i.test(answer.trim());
}

async function main() {
  const options = parse(process.argv.slice(2));
  if (options.help) {
    console.log(HELP);
    return 0;
  }

  const sources = [[options.from, ['3d-studio']], ...(options.onlySkill ? [] : DEPENDENCIES)];
  if (!options.yes && !(await confirm(sources, options))) {
    console.log('Nothing installed.');
    return 1;
  }
  const failed = [];
  for (const [index, [source, skills]] of sources.entries()) {
    console.log(`\n[${index + 1}/${sources.length}] ${skills.length > 1 ? `${skills.length} skills` : skills[0]} from ${source}`);
    if (!add(source, skills, options)) failed.push(source);
  }

  if (options.agents.includes('antigravity') && !options.project) {
    const skipped = copyToAntigravity(sources.flatMap(([, skills]) => skills));
    if (skipped.length) console.log(`\nLeft your existing Antigravity copies alone: ${skipped.join(', ')}`);
  }

  if (failed.length) {
    console.error(`\nThese didn't install: ${failed.join(', ')}. Run the command again to retry them.`);
    return 1;
  }
  console.log('\nDone. Restart your agent, then ask it to use 3d-studio.');
  return 0;
}

try {
  process.exitCode = await main();
} catch (error) {
  console.error(`${error.message}\n\n${HELP}`);
  process.exitCode = 1;
}
