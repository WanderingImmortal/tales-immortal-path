/**
 * Bundle combat sandbox for browser lab (IIFE global CombatSandbox).
 * Run: node scripts/bundle-combat-sandbox-lab.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'prototype', 'combat-sandbox', 'dist');
const outFile = path.join(outDir, 'lab-bundle.js');

fs.mkdirSync(outDir, { recursive: true });

const entry = path.join(root, 'prototype', 'combat-sandbox', 'lab-entry.js');
const cmd = `npx --yes esbuild@0.25.9 "${entry}" --bundle --platform=browser --format=iife --global-name=CombatSandbox --outfile="${outFile}"`;

execSync(cmd, { cwd: root, stdio: 'inherit' });
console.log('Wrote', outFile);
