import fs from 'fs';
import path from 'path';

import { execSync } from 'child_process';
const oldBuf = execSync('git show 40ff552:docs/assets/screenshots/project-dark-en.png');
console.log('40ff552 project-dark-en.png size:', oldBuf.readUInt32BE(16), 'x', oldBuf.readUInt32BE(20), 'bytes:', oldBuf.length);

const origBuf = execSync('git show 40ff552^:docs/assets/screenshots/project.png');
console.log('original project.png size:', origBuf.readUInt32BE(16), 'x', origBuf.readUInt32BE(20), 'bytes:', origBuf.length);
fs.writeFileSync('C:/Users/jluck/.gemini/antigravity/brain/ef36c7e4-3ea2-4f3b-8fb0-16cc9e4f87a5/scratch/original-project.png', origBuf);
