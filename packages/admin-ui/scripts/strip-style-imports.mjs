// Remove CSS/style side-effect imports from emitted .d.ts files.
// vue-tsc preserves `import './style.css'` lines in declarations, which break
// consumers that type-check with `skipLibCheck: false` (TS2882) because no
// declaration exists for the asset. They carry no type information, so strip them.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const typesDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../dist/types',
);

// Matches: import './foo.css'; / import "../bar.scss"; (side-effect imports of style assets)
const STYLE_IMPORT =
    /^\s*import\s+['"][^'"]+\.(css|scss|sass|less|styl)['"];?\s*$/;

async function* walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* walk(full);
        else if (entry.name.endsWith('.d.ts')) yield full;
    }
}

let stripped = 0;
for await (const file of walk(typesDir)) {
    const lines = (await readFile(file, 'utf8')).split('\n');
    const kept = lines.filter((line) => !STYLE_IMPORT.test(line));
    if (kept.length !== lines.length) {
        stripped += lines.length - kept.length;
        await writeFile(file, kept.join('\n'));
    }
}
console.log(`strip-style-imports: removed ${stripped} style import line(s)`);
