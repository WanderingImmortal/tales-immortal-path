/**
 * Bundle combat sandbox for browser (IIFE global CombatSandbox).
 * Outputs to sandbox/combat/ for static deploy + prototype lab fallback.
 * Run: node scripts/bundle-combat-sandbox-lab.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const deployDir = path.join(root, 'sandbox', 'combat');
const protoDir = path.join(root, 'prototype', 'combat-sandbox', 'lab');
const outDeploy = path.join(deployDir, 'combat-sandbox-bundle.js');
const outProto = path.join(protoDir, 'combat-sandbox-bundle.js');

fs.mkdirSync(deployDir, { recursive: true });
fs.mkdirSync(protoDir, { recursive: true });

const entry = path.join(root, 'prototype', 'combat-sandbox', 'lab-entry.js');
const cmd = `npx --yes esbuild@0.25.9 "${entry}" --bundle --platform=browser --format=iife --global-name=CombatSandbox --outfile="${outDeploy}"`;

execSync(cmd, { cwd: root, stdio: 'inherit' });
fs.copyFileSync(outDeploy, outProto);
console.log('Wrote', outDeploy);
console.log('Copied to', outProto);
