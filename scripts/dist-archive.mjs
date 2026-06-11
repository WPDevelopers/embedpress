#!/usr/bin/env node
/**
 * Fast WordPress.org dist archive for EmbedPress.
 *
 * Why this exists: `wp dist-archive` walks the ENTIRE plugin directory and
 * filters every file against .distignore one by one. EmbedPress's working
 * tree is ~1.5 GB / 180k+ files, almost all of it node_modules — so the
 * command spends its time stat-ing and pattern-matching 180k files it then
 * throws away. This script inverts that: it copies only the INCLUDED
 * top-level entries into a clean staging folder, scrubs the path/glob
 * excludes from that copy, and zips it. node_modules is never walked.
 *
 * Mirrors xspeed's scripts/dist-archive.mjs. Honors the existing
 * .distignore verbatim — top-level names are skipped at copy time, and
 * path/glob entries are scrubbed from the staged tree afterwards.
 *
 * Usage:
 *   node scripts/dist-archive.mjs            # build assets + stage + zip
 *   node scripts/dist-archive.mjs --no-build # skip `npm run build`
 */
import { execSync } from 'node:child_process';
import { mkdirSync, rmSync, cpSync, existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = resolve(root, 'dist');
const slug = 'embedpress';

const args = process.argv.slice(2);
const skipBuild = args.includes('--no-build');

// Version is read from embedpress.php's `Version:` header — the value
// WordPress itself reads and what wp.org keys releases off. package.json's
// version is build-tool metadata that doesn't ship and is easy to forget.
function readPluginVersion() {
  const main = readFileSync(resolve(root, `${slug}.php`), 'utf8');
  const match = main.match(/^[ \t/*#@]*Version:\s*(\S+)/im);
  if (!match) throw new Error(`Could not parse Version header from ${slug}.php`);
  return match[1];
}

// Build the runtime assets first (static/ -> assets/, compiled blocks/SPAs)
// unless explicitly skipped. The zip must ship the production build.
if (!skipBuild) {
  console.log('Building assets (npm run build)...');
  execSync('npm run build', { cwd: root, stdio: 'inherit' });
}

const version = readPluginVersion();
const versionedZipName = `${slug}.${version}.zip`;
const latestZipName = `${slug}.zip`;

// Parse .distignore. Split entries into:
//   - topLevelIgnores: bare names (no '/' or '*') matched against root
//     entries and skipped at copy time — this is what keeps node_modules,
//     src, static, tests, etc. out of the walk entirely.
//   - scrubEntries: anything with a '/' or '*' (e.g. '/docs',
//     'vendor/wpdevelopers/embera/doc', '**/.DS_Store', '*.map') — applied
//     against the STAGED copy after the fast top-level copy.
const distignorePath = resolve(root, '.distignore');
const ignoreEntries = existsSync(distignorePath)
  ? readFileSync(distignorePath, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
  : [];

const topLevelIgnores = new Set(
  ignoreEntries.filter((e) => !e.includes('/') && !e.includes('*'))
);
const scrubEntries = ignoreEntries.filter((e) => e.includes('/') || e.includes('*'));

// Always exclude the output dir and VCS dir from staging, regardless of
// .distignore — staging dist/ into dist/embedpress/dist would recurse, and
// .git is never shippable.
const alwaysSkip = new Set(['dist', '.git']);
const include = readdirSync(root).filter(
  (entry) => !topLevelIgnores.has(entry) && !alwaysSkip.has(entry)
);

// Fresh staging dir: dist/embedpress/
rmSync(dist, { recursive: true, force: true });
const folderPath = resolve(dist, slug);
mkdirSync(folderPath, { recursive: true });

for (const item of include) {
  const src = resolve(root, item);
  if (!existsSync(src)) {
    console.warn(`skip (missing): ${item}`);
    continue;
  }
  cpSync(src, resolve(folderPath, item), { recursive: true });
}

// Scrub the path/glob excludes from the staged copy. We translate each
// .distignore entry into a `find -path` pattern relative to the staged
// folder. Leading slash means repo-root-anchored; '**' and '*' are passed
// through to find's glob. This reproduces what wp dist-archive would have
// removed, but only over the (small) staged tree.
for (const raw of scrubEntries) {
  // Normalize: strip a leading slash (root-anchored), collapse '**' to '*'
  // since find's -path already matches across '/'.
  const rel = raw.replace(/^\//, '');
  const pattern = `${folderPath}/${rel}`.replace(/\*\*/g, '*');
  try {
    execSync(`find "${folderPath}" -path "${pattern}" -prune -exec rm -rf {} + 2>/dev/null || true`, {
      stdio: 'ignore',
      shell: '/bin/sh',
    });
  } catch {
    // best-effort; a non-matching pattern is fine
  }
}

// Drop a "Silence is golden" index.php into every staged directory that
// lacks one, so directory listing on misconfigured servers can't enumerate
// plugin files.
execSync(
  `find "${folderPath}" -type d ! -exec test -e "{}/index.php" \\; -exec sh -c 'printf "%s\\n%s\\n%s\\n" "<?php" "defined( '\\''ABSPATH'\\'' ) || exit;" "// Silence is golden." > "$1/index.php"' _ {} \\;`,
  { stdio: 'inherit' }
);

// Final guard: refuse to zip if a non-permitted file slipped through.
// Mirrors the WP.org reviewer file-type allowlist (TS/dev configs are
// permitted per team convention; binaries/archives are not).
// Note: .ftl (PDF.js Fluent locale files) and .mp3 (bundled audio) ship as
// part of the vendored PDF viewer / player — both are required at runtime.
const permittedExt = /\.(php|js|mjs|cjs|ts|tsx|jsx|css|scss|sass|less|map|txt|md|json|xml|html|htm|png|svg|jpe?g|gif|webp|ico|woff2?|ttf|eot|otf|mo|po|pot|pdf|csv|ftl|mp3|mp4|wav)$/i;
const permittedNames = /^(LICENSE|license\.txt|\.htaccess|readme\.txt)$/i;
const offenders = execSync(`find "${folderPath}" -type f`)
  .toString()
  .trim()
  .split('\n')
  .filter(Boolean)
  .filter((p) => {
    const name = p.split('/').pop();
    return !permittedExt.test(name) && !permittedNames.test(name);
  });

if (offenders.length) {
  console.error('\nNon-permitted files in staged folder:');
  offenders.slice(0, 50).forEach((p) => console.error(`  ${p.replace(folderPath, '')}`));
  if (offenders.length > 50) console.error(`  ... and ${offenders.length - 50} more`);
  console.error('\nRefusing to build ZIP. Add these to .distignore or extend the allowlist in scripts/dist-archive.mjs.');
  process.exit(1);
}

// Build both:
//   - dist/embedpress.<version>.zip  — versioned archive for release tagging
//   - dist/embedpress.zip            — latest-pointer, overwritten each build
const versionedZipPath = resolve(dist, versionedZipName);
const latestZipPath = resolve(dist, latestZipName);

execSync(`zip -rq "${versionedZipPath}" "${slug}"`, { cwd: dist, stdio: 'inherit' });
cpSync(versionedZipPath, latestZipPath);

const versionedKB = (statSync(versionedZipPath).size / 1024).toFixed(1);
const folderKB = (execSync(`du -sk "${folderPath}"`).toString().trim().split(/\s+/)[0] * 1).toFixed(0);

console.log(`\n✓ ${slug}/ (${folderKB} KB unzipped)`);
console.log(`  ${folderPath}`);
console.log(`✓ ${latestZipName} (${versionedKB} KB)`);
console.log(`  ${latestZipPath}`);
console.log(`✓ ${versionedZipName} (${versionedKB} KB)`);
console.log(`  ${versionedZipPath}`);
