const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');
const TOAST_IMPORT = `import { showToast } from "@/components/ui/Toast";`;
const STORAGE_IMPORT_RE = /import \{[^}]+\} from "@\/lib\/storage";/;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules') files.push(...walk(full));
    else if (e.isFile() && (e.name.endsWith('.tsx') || e.name.endsWith('.ts')) && e.name !== 'Toast.tsx') files.push(full);
  }
  return files;
}

let updated = 0;
for (const file of walk(SRC)) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('alert("Failed')) continue;

  // Add showToast import if not already present
  if (!content.includes('showToast') && STORAGE_IMPORT_RE.test(content)) {
    content = content.replace(STORAGE_IMPORT_RE, (m) => m + '\n' + TOAST_IMPORT);
  } else if (!content.includes('showToast')) {
    // No storage import — add after first import line
    content = content.replace(/(import .+;\n)/, `$1${TOAST_IMPORT}\n`);
  }

  // Replace all alert("Failed...") with showToast(...)
  content = content.replace(/alert\("(Failed[^"]+)"\)/g, 'showToast("$1")');

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated:', path.basename(file));
  updated++;
}
console.log(`\nDone. ${updated} files updated.`);
