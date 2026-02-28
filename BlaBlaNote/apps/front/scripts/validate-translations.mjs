import fs from 'node:fs';
import path from 'node:path';

const base = path.resolve('apps/front/src/locales');
const namespaces = ['auth','home','notes','projects','profile','settings','share','blog','admin','common'];

function flatten(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v, `${prefix}${k}.`) : `${prefix}${k}`
  );
}

let hasError = false;
for (const ns of namespaces) {
  const en = JSON.parse(fs.readFileSync(path.join(base, 'en', `${ns}.json`), 'utf8'));
  const fr = JSON.parse(fs.readFileSync(path.join(base, 'fr', `${ns}.json`), 'utf8'));
  const enKeys = new Set(flatten(en));
  const frKeys = new Set(flatten(fr));
  const missingInFr = [...enKeys].filter((k) => !frKeys.has(k));
  const missingInEn = [...frKeys].filter((k) => !enKeys.has(k));
  if (missingInFr.length || missingInEn.length) {
    hasError = true;
    console.error(`Namespace ${ns}:`);
    if (missingInFr.length) console.error('  Missing in fr:', missingInFr);
    if (missingInEn.length) console.error('  Missing in en:', missingInEn);
  }
}
if (hasError) process.exit(1);
console.log('Translations are consistent.');
