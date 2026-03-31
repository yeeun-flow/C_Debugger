#!/usr/bin/env node
/**
 * 각 장 topics.js의 스텝이 code 라인 id를 참조하는지 검사합니다.
 * 사용: node scripts/verify-topics.cjs
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const chapters = ['chapter06', 'chapter07', 'chapter08'];
let failed = 0;

function loadTopics(filePath) {
  const sandbox = { console };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), sandbox);
  return sandbox.TOPICS;
}

for (const ch of chapters) {
  const p = path.join(root, 'src', ch, 'topics.js');
  if (!fs.existsSync(p)) {
    console.warn('skip (missing):', p);
    continue;
  }
  let TOPICS;
  try {
    TOPICS = loadTopics(p);
  } catch (e) {
    console.error(ch, 'load error:', e.message);
    failed++;
    continue;
  }
  if (!TOPICS || typeof TOPICS !== 'object') {
    console.error(ch, 'TOPICS missing');
    failed++;
    continue;
  }

  for (const key of Object.keys(TOPICS)) {
    const t = TOPICS[key];
    const ids = new Set((t.code || []).filter((l) => l.id).map((l) => l.id));
    if (!t.steps || !Array.isArray(t.steps)) {
      console.error(`${ch}/${key}: no steps[]`);
      failed++;
      continue;
    }
    for (let si = 0; si < t.steps.length; si++) {
      const s = t.steps[si];
      if (!ids.has(s.line)) {
        console.error(`${ch}/${key} step ${si}: unknown line id "${s.line}"`);
        failed++;
      }
    }
  }
  console.log(`✓ ${ch}: ${Object.keys(TOPICS).length} topics`);
}

process.exit(failed ? 1 : 0);
