// const os = require('os');
import os from 'os';
import fs from 'fs';
import { execSync } from 'child_process';

const currentPlatform = os.platform();
const platformFile = './.last_platform';

let lastPlatform = null;
if (fs.existsSync(platformFile)) {
  lastPlatform = fs.readFileSync(platformFile, 'utf-8').trim();
}

if (lastPlatform && lastPlatform !== currentPlatform) {
  console.log(`Platform changed from ${lastPlatform} to ${currentPlatform}. Cleaning node_modules...`);
  execSync('rm -rf node_modules package-lock.json', { stdio: 'inherit' });
}

fs.writeFileSync(platformFile, currentPlatform);

