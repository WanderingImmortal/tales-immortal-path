/**
 * Bundle lesser-sect generator for browser (IIFE global LesserSectGen).
 * Run: node scripts/bundle-lesser-sects-lab.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const deployDir = path.join(root, 'sandbox', 'lesser-sects');
const outDeploy = path.join(deployDir, 'lesser-sects-bundle.js');

fs.mkdirSync(deployDir, { recursive: true });

const entry = path.join(root, 'prototype', 'procedural-lesser-sects', 'lab-entry.js');
const cmd = `npx --yes esbuild@0.25.9 "${entry}" --bundle --platform=browser --format=iife --global-name=LesserSectGen --outfile="${outDeploy}"`;

execSync(cmd, { cwd: root, stdio: 'inherit' });
console.log('Wrote', outDeploy);
