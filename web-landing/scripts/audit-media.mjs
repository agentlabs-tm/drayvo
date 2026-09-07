/**
 * Lists every photograph on the site still showing licensed stock, with the
 * real shot that has to replace it.
 *
 * Exits non-zero while anything is outstanding, so it can be wired into a
 * pre-launch check: shipping a carrier's site where every truck belongs to
 * someone else is a brand problem, not a content-management one.
 *
 *   node scripts/audit-media.mjs
 */
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/lib/media.ts', import.meta.url), 'utf8');

// Parsed with a regex rather than imported: media.ts is TypeScript, and this
// script has to run under plain node with no build step.
const entries = [...src.matchAll(/^  (\w+): \{$/gm)].map((m) => m[1]);
const pending = entries.filter((key) => {
  const block = src.slice(src.indexOf(`  ${key}: {`));
  const end = block.indexOf('\n  },');
  return /swapped: false/.test(block.slice(0, end));
});

if (pending.length === 0) {
  console.log('All site photography is real Drayvo imagery.');
  process.exit(0);
}

console.log(`\n${pending.length} of ${entries.length} images are still stock placeholders:\n`);
for (const key of pending) {
  const from = src.indexOf(`  ${key}: {`);
  const block = src.slice(from, from + src.slice(from).indexOf('\n  },'));
  const shot = block.match(/shot:\s*([\s\S]*)$/);
  // The notes are authored as adjacent string literals joined by `+`, so the
  // quotes, the operators and the source indentation all have to come out
  // before the text is readable in a terminal.
  const text = shot
    ? shot[1]
        .replace(/\s*\+\s*/g, '')
        .replace(/'\s*'/g, '')
        .replace(/\\'/g, "'")
        .replace(/^\s*'|',?\s*$/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    : '(no note)';
  // Wrap to 76 columns so a long shot note stays readable.
  const wrapped = text.replace(/(.{1,72})(\s|$)/g, '    $1\n').trimEnd();
  console.log(`  ${key}\n${wrapped}\n`);
}
console.log('Replace them via src/lib/media.ts - see the header comment there.\n');
process.exit(1);
