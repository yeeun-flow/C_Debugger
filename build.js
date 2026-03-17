#!/usr/bin/env node
/**
 * c_debugger.html 단일 파일 배포용 빌드 스크립트
 * index.html + styles.css + topics.js + debugger.js → c_debugger.html
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const sampleDir = path.join(dir, 'src', 'sample');
const html = fs.readFileSync(path.join(sampleDir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(sampleDir, 'styles.css'), 'utf8');
const topics = fs.readFileSync(path.join(sampleDir, 'topics.js'), 'utf8');
const debuggerJs = fs.readFileSync(path.join(sampleDir, 'debugger.js'), 'utf8');

let out = html
  .replace('<link rel="stylesheet" href="styles.css">', `<style>\n${css}\n</style>`)
  .replace('<script src="topics.js"></script>', `<script>\n${topics}\n</script>`)
  .replace('<script src="debugger.js"></script>', `<script>\n${debuggerJs}\n</script>`);

fs.writeFileSync(path.join(dir, 'c_debugger.html'), out);
console.log('✓ c_debugger.html 생성 완료');
