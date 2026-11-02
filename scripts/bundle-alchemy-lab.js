/**
 * Bundle property-alchemy prototype for browser lab (IIFE global AlchemyLab).
 * Run: node scripts/bundle-alchemy-lab.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'prototype', 'property-alchemy', 'dist');
const outFile = path.join(outDir, 'lab-bundle.js');

fs.mkdirSync(outDir, { recursive: true });

const entry = path.join(root, 'prototype', 'property-alchemy', 'lab-entry.js');
const cmd = `npx --yes esbuild@0.25.9 "${entry}" --bundle --platform=browser --format=iife --global-name=AlchemyLab --outfile="${outFile}"`;

execSync(cmd, { cwd: root, stdio: 'inherit' });
console.log('Wrote', outFile);
