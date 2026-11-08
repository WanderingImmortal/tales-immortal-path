/**
 * Bundle property-alchemy prototype for browser lab (IIFE global AlchemyLab).
 * Outputs to sandbox/alchemy/ for static deploy + keeps dist/ for Node/test fallback.
 * Run: node scripts/bundle-alchemy-lab.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const deployDir = path.join(root, 'sandbox', 'alchemy');
const distDir = path.join(root, 'prototype', 'property-alchemy', 'dist');
const outDeploy = path.join(deployDir, 'lab-bundle.js');
const outDist = path.join(distDir, 'lab-bundle.js');

fs.mkdirSync(deployDir, { recursive: true });
fs.mkdirSync(distDir, { recursive: true });

const entry = path.join(root, 'prototype', 'property-alchemy', 'lab-entry.js');
const cmd = `npx --yes esbuild@0.25.9 "${entry}" --bundle --platform=browser --format=iife --global-name=AlchemyLab --outfile="${outDeploy}"`;

execSync(cmd, { cwd: root, stdio: 'inherit' });
fs.copyFileSync(outDeploy, outDist);
console.log('Wrote', outDeploy);
console.log('Copied to', outDist);
