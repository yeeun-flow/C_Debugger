// ══════════════════════════════════════════════════════════
//  CONSTANTS
// ══════════════════════════════════════════════════════════
const IDS = {
  themeToggle: 'themeToggle',
  themeIcon: 'themeIcon',
  themeLabel: 'themeLabel',
  codeArea: 'codeArea',
  memTable: 'memTable',
  outputArea: 'outputArea',
  stackVizArea: 'stackVizArea',
  memVizByteLabel: 'memVizByteLabel',
  explainBox: 'explainBox',
  condBadge: 'condBadge',
  stepNum: 'stepNum',
  stepTotal: 'stepTotal',
  topBadge: 'topBadge',
  btnPrev: 'btnPrev',
  btnStep: 'btnStep',
  editorTitle: 'editorTitle',
  tabCodeName: 'tabCodeName',
  topTitle: 'topTitle',
  conceptBody: 'conceptBody',
  sidebarScroll: 'sidebarScroll',
};

// ══════════════════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════════════════
const state = {
  currentTopic: 'basicif',
  stepIndex: 0,
  outputLines: [],
  varState: {},
  lastMemViz: null,  // 이전 스텝 메모리 (동일 시 업데이트 생략)
};

// ══════════════════════════════════════════════════════════
//  UTILS
// ══════════════════════════════════════════════════════════
function escHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function $(id) {
  return document.getElementById(id);
}

// ══════════════════════════════════════════════════════════
//  RENDER OUTPUT (공통)
// ══════════════════════════════════════════════════════════
function renderOutput(lines, emptyMsg) {
  const area = $(IDS.outputArea);
  if (!lines || lines.length === 0) {
    area.innerHTML = `<span class="output-dim">${emptyMsg || '// 실행 결과가 여기 표시됩니다'}</span>`;
    return;
  }
  area.innerHTML = lines.map((l, i) =>
    `<span class="output-line">${i === lines.length - 1 ? '<span style="color:var(--accent-y)">▶</span> ' : '  '}${escHtml(l.text)}</span>`
  ).join('\n');
  area.scrollTop = area.scrollHeight;
}

// ══════════════════════════════════════════════════════════
//  RENDER CODE
// ══════════════════════════════════════════════════════════
function renderCode(topic, activeLineId, type) {
  const t = TOPICS[topic];
  const area = $(IDS.codeArea);
  area.innerHTML = '';
  t.code.forEach((line, idx) => {
    const div = document.createElement('div');
    div.className = 'code-line';
    div.id = 'codeline_' + (line.id || 'blank_' + idx);

    let cls = '';
    if (line.id && line.id === activeLineId) {
      if (type === 'exec') cls = 'hl-exec';
      else if (type === 'skip') cls = 'hl-skip';
      else cls = 'hl-next';
    }
    if (cls) div.classList.add(cls);

    const arrow = type === 'exec' ? '▶' : type === 'skip' ? '✕' : '→';

    div.innerHTML = `
      <div class="line-gutter">
        <span class="line-num">${idx + 1}</span>
        <div class="exec-arrow">${arrow}</div>
      </div>
      <div class="line-code">${line.text}</div>
    `;
    area.appendChild(div);
  });

  const activeEl = activeLineId ? document.getElementById('codeline_' + activeLineId) : null;
  if (activeEl) activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

// ══════════════════════════════════════════════════════════
//  RENDER MEMORY TABLE
// ══════════════════════════════════════════════════════════
function renderMemTable(topic, newVars) {
  const t = TOPICS[topic];
  const tbody = $(IDS.memTable);
  const addrs = t.baseAddr || {};
  const varTypes = t.varTypes || {};

  if (newVars) {
    for (const k in newVars) {
      const old = state.varState[k];
      state.varState[k] = { val: newVars[k], changed: (old === undefined || old.val !== newVars[k]) };
    }
  }

  let html = '';
  const entries = Object.keys(state.varState);
  if (entries.length === 0) {
    html = `<tr><td colspan="4" style="color:var(--text3);padding:8px 10px;font-size:11px">— 아직 변수 없음 —</td></tr>`;
  } else {
    entries.forEach(k => {
      const v = state.varState[k];
      const addr = addrs[k] || '0x7fff????';
      const type = varTypes[k] || 'int';
      const cls = v.changed ? 'mem-val-changed' : '';
      html += `<tr class="${cls}">
        <td class="mem-addr-cell">${addr}</td>
        <td class="mem-name-cell">${k}</td>
        <td class="mem-type-cell">${type}</td>
        <td class="mem-val-cell">${v.val}</td>
      </tr>`;
      v.changed = false;
    });
  }
  tbody.innerHTML = html;
}

// ══════════════════════════════════════════════════════════
//  RENDER OUTPUT (append / clear)
// ══════════════════════════════════════════════════════════
function appendOutput(text) {
  if (!text) return;
  state.outputLines.push({ text });
  renderOutput(state.outputLines);
}

function clearOutput() {
  state.outputLines = [];
  renderOutput([], '// 실행 결과가 여기 표시됩니다');
}

// ══════════════════════════════════════════════════════════
//  MEMORY MAP: 값 → 헥스 바이트 (리틀 엔디안)
// ══════════════════════════════════════════════════════════
function valToHexBytes(val, type, bytes) {
  const b = bytes || (type && type.includes('*') ? 8 : type === 'double' ? 8 : 4);
  const empty = () => Array(b).fill('??');
  if (val === '???' || val === null || val === undefined) return empty();
  if (type === 'int' || type === 'int*') {
    if (type.includes('*')) {
      if (typeof val === 'string' && val.startsWith('0x')) {
        const hex = val.replace('0x','').replace(/[^0-9a-fA-F]/g,'').padStart(16,'0').slice(-16);
        const pairs = [];
        for (let i = hex.length - 2; i >= 0; i -= 2) pairs.push(hex.slice(i, i + 2));
        return pairs.length ? pairs : empty();
      }
      return empty();
    }
    const n = typeof val === 'string' ? parseInt(val, 10) : val;
    if (isNaN(n)) return empty();
    const hex = (n >>> 0).toString(16).padStart(8, '0');
    return [hex.slice(6,8), hex.slice(4,6), hex.slice(2,4), hex.slice(0,2)];
  }
  if (type === 'double') {
    const f = parseFloat(val);
    if (isNaN(f)) return empty();
    const buf = new ArrayBuffer(8);
    new DataView(buf).setFloat64(0, f, true);
    return Array.from(new Uint8Array(buf)).map(x => x.toString(16).padStart(2, '0'));
  }
  return empty();
}

// ══════════════════════════════════════════════════════════
//  STACK VISUALIZER RENDERER
// ══════════════════════════════════════════════════════════
function renderStackViz(memViz) {
  const area = $(IDS.stackVizArea);
  const byteLabel = $(IDS.memVizByteLabel);

  if (!memViz) {
    area.innerHTML = '<span style="font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--text3);padding:10px 12px;display:block">— Step을 진행하면 메모리 상태가 표시됩니다 —</span>';
    byteLabel.textContent = '';
    return;
  }

  const ptrLinks = memViz.ptrLinks || memViz.pointers || [];
  const { stack = [], heap = [], totalBytes = 0, released } = memViz;
  byteLabel.textContent = `${totalBytes}B`;

  let html = '';

  // ── 메모리맵 시각화 (스택 변수, 위로 쌓임 = 최신이 위) ───
  const allVars = stack.slice().reverse().flatMap(f => f.vars.map(v => ({ ...v, fn: f.fn })));
  if (allVars.length > 0) {
    html += `<div class="mem-map-col">
      <div class="mem-map-label">🗺 메모리 맵 <span class="mem-map-hint">(↑ 최신 위)</span></div>
      <div class="mem-map-grid">`;

    allVars.forEach(v => {
      const hexBytes = valToHexBytes(v.val, v.type, v.bytes);
      const hlCls = v.highlight ? 'mem-cell-row highlight-row' : 'mem-cell-row';
      html += `<div class="${hlCls}">
        <div class="mem-cell-addr">${escHtml(v.addr)}</div>
        <div class="mem-cell-name">${escHtml(v.name)}</div>
        <div class="mem-cell-bytes">`;
      hexBytes.forEach((h, i) => {
        html += `<span class="mem-byte" title="${escHtml(v.name)} byte ${i}">${escHtml(h)}</span>`;
      });
      html += `</div>
        <div class="mem-cell-val">${escHtml(String(v.val))}</div>
      </div>`;
    });

    html += `</div></div>`;
  }

  // ── STACK COLUMN ──
  html += `<div class="stack-col">
    <div class="stack-col-label">📦 STACK  (↓성장)</div>`;

  if (stack.length === 0 && heap.length === 0) {
    // empty state handled below
  } else if (stack.length === 0) {
    html += `<div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text3);padding:8px;text-align:center">비어있음</div>`;
  } else {
    stack.slice().reverse().forEach(frame => {
      const headerCls = `frame-fn-${frame.color}`;
      const varBytes = frame.vars.reduce((a, v) => a + v.bytes, 0);
      const totalFrameBytes = varBytes + 8 + 8;

      html += `<div class="stack-frame">
        <div class="frame-header ${headerCls}">
          <span>${escHtml(frame.fn)}()</span>
          <span style="font-size:9px;opacity:0.85">${totalFrameBytes}B</span>
        </div>`;

      frame.vars.forEach(v => {
        const hlCls = v.highlight ? 'highlight-row' : '';
        html += `<div class="frame-row ${hlCls}">
          <span class="frame-row-name">${escHtml(v.name)}</span>
          <span class="frame-row-type">${escHtml(v.type)}</span>
          <span class="frame-row-val" title="${escHtml(String(v.val))}">${escHtml(String(v.val))}</span>
          <span class="frame-row-bytes">${v.bytes}B</span>
        </div>`;
      });

      if (frame.vars.length > 0) {
        const lo = frame.vars[frame.vars.length - 1].addr;
        const hi = frame.vars[0].addr;
        html += `<div class="frame-addr-row">
          <span class="frame-addr-label">addr</span>
          <span class="frame-addr-val">${lo !== hi ? lo + '~' + hi.slice(-4) : lo}</span>
        </div>`;
      }

      html += `<div class="frame-ret-row">
        <span class="frame-ret-label">ret →</span>
        <span class="frame-ret-val">${escHtml(frame.retAddr)}</span>
      </div>`;

      html += `<div class="frame-total-row">
        <span class="frame-total-label">frame total</span>
        <span class="frame-total-val">${totalFrameBytes}B</span>
      </div>
      </div>`;
    });
  }

  html += `</div>`;

  // ── POINTER CONNECTORS ──
  if (heap.length > 0 && ptrLinks.length > 0) {
    html += `<div class="ptr-connector">`;
    ptrLinks.forEach(pl => {
      const isDangling = pl.dangling || false;
      html += `<div class="${isDangling ? 'ptr-dangling' : ''}" style="display:flex;align-items:center;gap:4px;margin-bottom:4px">
        <span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:${isDangling ? 'var(--accent-r)' : 'var(--accent)'}">
          ${escHtml(pl.from)}
        </span>
        <div class="ptr-line"></div>
      </div>`;
    });
    html += `</div>`;
  } else if (heap.length > 0) {
    html += `<div style="display:flex;align-items:center;padding:0 6px">
      <div style="width:16px;height:1px;background:var(--border2)"></div>
    </div>`;
  }

  // ── HEAP COLUMN ──
  if (heap.length > 0) {
    html += `<div class="stack-col" style="min-width:130px">
      <div class="stack-col-label">🧱 HEAP  (↑성장)</div>`;

    heap.forEach(blk => {
      const headerCls = blk.freed ? 'freed-header' : '';
      const blockCls  = blk.freed ? 'heap-block freed' : 'heap-block';
      html += `<div class="${blockCls}">
        <div class="heap-header ${headerCls}">
          <span>${escHtml(blk.label)}</span>
          <span>${blk.bytes}B</span>
        </div>`;

      blk.items.forEach(it => {
        html += `<div class="heap-row">
          <span class="heap-row-name">${escHtml(it.name)}</span>
          <span class="heap-row-val" title="${escHtml(String(it.val))}">${escHtml(String(it.val))}</span>
          <span class="heap-row-bytes">${it.bytes}B</span>
        </div>`;
      });

      html += `<div class="heap-addr-row">${escHtml(blk.addr)}</div>
      </div>`;
    });

    html += `</div>`;
  }

  // ── RELEASED NOTICE ──
  if (released) {
    html += `<div style="position:absolute;bottom:6px;left:10px;right:10px">
      <div class="released-banner">⬇ ${escHtml(released)}</div>
    </div>`;
  }

  // ── EMPTY STATE ──
  if (stack.length === 0 && heap.length === 0) {
    html = `<div class="viz-empty">
      <span class="viz-empty-icon">✅</span>
      <span class="viz-empty-text">모든 메모리 해제됨</span>
      ${released ? `<span class="viz-empty-sub">${escHtml(released)}</span>` : ''}
    </div>`;
  }

  area.style.position = 'relative';
  area.innerHTML = html;
}

// ══════════════════════════════════════════════════════════
//  STEP LOGIC
// ══════════════════════════════════════════════════════════
function updateUI() {
  const t = TOPICS[state.currentTopic];
  const total = t.steps.length;
  $(IDS.stepNum).textContent = state.stepIndex;
  $(IDS.stepTotal).textContent = total;
  $(IDS.topBadge).textContent = `STEP ${state.stepIndex} / ${total}`;
  $(IDS.btnPrev).disabled = state.stepIndex === 0;
  $(IDS.btnStep).disabled = state.stepIndex >= total;

  if (state.stepIndex === 0) {
    state.lastMemViz = null;
    renderCode(state.currentTopic, null, null);
    $(IDS.explainBox).innerHTML = '▶ Step 버튼을 눌러 실행을 시작하세요.';
    $(IDS.condBadge).innerHTML = '';
    renderMemTable(state.currentTopic, null);
    renderStackViz(null);
    return;
  }

  const step = t.steps[state.stepIndex - 1];
  renderCode(state.currentTopic, step.line, step.type);
  $(IDS.explainBox).innerHTML = step.explain || '';

  if (step.cond !== undefined) {
    $(IDS.condBadge).innerHTML = step.cond
      ? `<span class="cond-badge cond-true">✓ TRUE</span>`
      : `<span class="cond-badge cond-false">✗ FALSE</span>`;
  } else {
    $(IDS.condBadge).innerHTML = '';
  }

  renderMemTable(state.currentTopic, step.vars || null);
  if (step.memViz !== undefined) {
    const memViz = step.memViz || null;
    const memChanged = !_memVizEqual(memViz, state.lastMemViz);
    if (memChanged) {
      state.lastMemViz = memViz;
      renderStackViz(memViz);
    }
  }
}

function _memVizEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return !a && !b;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch (_) { return false; }
}

function stepForward() {
  const t = TOPICS[state.currentTopic];
  if (state.stepIndex >= t.steps.length) return;
  const step = t.steps[state.stepIndex];
  state.stepIndex++;
  if (step.output) appendOutput(step.output);
  updateUI();
}

function stepBack() {
  if (state.stepIndex <= 0) return;
  state.stepIndex--;

  state.outputLines = [];
  const t = TOPICS[state.currentTopic];
  for (let i = 0; i < state.stepIndex; i++) {
    if (t.steps[i].output) state.outputLines.push({ text: t.steps[i].output });
  }
  renderOutput(state.outputLines, '// 실행 결과가 여기 표시됩니다');

  state.varState = {};
  let lastMemViz = null;
  for (let i = 0; i < state.stepIndex; i++) {
    if (t.steps[i].vars) {
      for (const k in t.steps[i].vars) state.varState[k] = { val: t.steps[i].vars[k], changed: false };
    }
    if (t.steps[i].memViz) lastMemViz = t.steps[i].memViz;
  }
  state.lastMemViz = lastMemViz;
  renderStackViz(lastMemViz);
  updateUI();
}

function runAll() {
  const t = TOPICS[state.currentTopic];
  let lastMemViz = null;
  while (state.stepIndex < t.steps.length) {
    const step = t.steps[state.stepIndex];
    state.stepIndex++;
    if (step.output) state.outputLines.push({ text: step.output });
    if (step.vars) {
      for (const k in step.vars) state.varState[k] = { val: step.vars[k], changed: false };
    }
    if (step.memViz) lastMemViz = step.memViz;
  }
  renderOutput(state.outputLines, '// 출력 없음');
  state.lastMemViz = lastMemViz;
  if (lastMemViz) renderStackViz(lastMemViz);
  updateUI();
}

function resetDebug() {
  state.stepIndex = 0;
  state.varState = {};
  state.lastMemViz = null;
  clearOutput();
  updateUI();
}

// ══════════════════════════════════════════════════════════
//  SIDEBAR (동적 생성)
// ══════════════════════════════════════════════════════════
function renderSidebar() {
  const container = $(IDS.sidebarScroll);
  if (!container) return;

  const tagStyles = {
    accent: 'background:rgba(91,156,246,0.1);color:var(--accent)',
    purple: 'background:rgba(183,125,255,0.1);color:var(--accent-p)',
    red: 'background:rgba(244,112,103,0.1);color:var(--accent-r)',
  };

  let currentGroup = '';
  let html = '';

  TOPIC_META.forEach(item => {
    if (item.group !== currentGroup) {
      if (currentGroup) html += '</div>';
      currentGroup = item.group;
      html += `<div class="sidebar-group"><div class="sidebar-group-label">${currentGroup}</div>`;
    }

    if (item.isSub) {
      const tagStyle = tagStyles[item.tagStyle] || tagStyles.accent;
      html += `<div class="sidebar-subitem" data-topic="${item.key}" onclick="selectTopic('${item.key}')">
        <div class="sidebar-subitem-name">${escHtml(item.label)}</div>
        <span class="sidebar-subitem-tag" style="${tagStyle}">${escHtml(item.tag || '')}</span>
      </div>`;
    } else {
      html += `<div class="sidebar-item" data-topic="${item.key}" onclick="selectTopic('${item.key}')">
        <span class="sidebar-item-icon">${item.icon || '•'}</span>
        <div class="sidebar-item-info">
          <div class="sidebar-item-name">${escHtml(item.label)}</div>
          <div class="sidebar-item-sub">${escHtml(item.sub || '')}</div>
        </div>
        <div class="sidebar-item-dot"></div>
      </div>`;
    }
  });

  if (currentGroup) html += '</div>';
  container.innerHTML = html;
}

// ══════════════════════════════════════════════════════════
//  TOPIC SELECT
// ══════════════════════════════════════════════════════════
function selectTopic(topicKey) {
  if (!TOPICS[topicKey]) return;
  state.currentTopic = topicKey;
  state.stepIndex = 0;
  state.varState = {};
  state.outputLines = [];
  state.lastMemViz = null;

  document.querySelectorAll('.sidebar-item, .sidebar-subitem').forEach(el => {
    el.classList.remove('active');
    if (el.dataset.topic === topicKey) el.classList.add('active');
  });

  const t = TOPICS[topicKey];
  $(IDS.editorTitle).textContent = t.title;
  $(IDS.tabCodeName).textContent = t.name;
  $(IDS.topTitle).textContent = t.name;
  $(IDS.conceptBody).innerHTML = t.concept;

  clearOutput();
  renderStackViz(null);
  updateUI();
}

// ══════════════════════════════════════════════════════════
//  THEME
// ══════════════════════════════════════════════════════════
const THEME_KEY = 'cdebugger-theme';

function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const icon = $(IDS.themeIcon);
  const label = $(IDS.themeLabel);
  if (icon && label) {
    icon.textContent = theme === 'light' ? '☀️' : '🌙';
    label.textContent = theme === 'light' ? '라이트' : '다크';
  }
}

function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
}

// ══════════════════════════════════════════════════════════
//  RESIZE (드래그로 패널 크기 조절)
// ══════════════════════════════════════════════════════════
const RESIZE_KEYS = { rightPane: 'cdebugger-right-pane-width', panelHeights: 'cdebugger-panel-heights' };

function initResize() {
  const split = document.getElementById('contentSplit');
  const rightPane = document.getElementById('rightPane');
  const resizerV = document.getElementById('resizerV');

  // 우측 패널 너비 (에디터 ↔ 우측)
  let rpWidth = parseInt(localStorage.getItem(RESIZE_KEYS.rightPane) || '380', 10);
  rpWidth = Math.max(280, Math.min(600, rpWidth));
  rightPane.style.setProperty('--right-pane-width', rpWidth + 'px');

  resizerV.addEventListener('mousedown', e => {
    e.preventDefault();
    resizerV.classList.add('active');
    const startX = e.clientX;
    const startW = rightPane.offsetWidth;

    function onMove(e) {
      const dx = startX - e.clientX;
      let w = startW + dx;
      w = Math.max(280, Math.min(600, w));
      rightPane.style.setProperty('--right-pane-width', w + 'px');
    }
    function onUp() {
      resizerV.classList.remove('active');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      localStorage.setItem(RESIZE_KEYS.rightPane, String(rightPane.offsetWidth));
    }

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  // 패널 높이 (개념, 현재 실행, 메모리맵, 변수 테이블)
  const saved = JSON.parse(localStorage.getItem(RESIZE_KEYS.panelHeights) || '{}');
  const panels = ['panelConcept', 'panelExplain', 'panelMemViz', 'panelVars'];

  panels.forEach(id => {
    const panel = document.getElementById(id);
    if (!panel) return;
    const def = parseInt(panel.dataset.default || '120', 10);
    const min = parseInt(panel.dataset.min || '60', 10);
    let h = saved[id] || def;
    h = Math.max(min, h);
    panel.style.height = h + 'px';
    panel.style.minHeight = min + 'px';
    panel.style.flexShrink = '0';
  });

  document.querySelectorAll('.resizer-h[data-resize]').forEach(resizer => {
    resizer.addEventListener('mousedown', e => {
      e.preventDefault();
      resizer.classList.add('active');
      const panelId = resizer.dataset.resize;
      const panel = document.getElementById(panelId);
      if (!panel) return;
      const min = parseInt(panel.dataset.min || '60', 10);
      const startY = e.clientY;
      const startH = panel.offsetHeight;

      function onMove(e) {
        const dy = e.clientY - startY;
        let h = Math.max(min, startH + dy);
        panel.style.height = h + 'px';
      }
      function onUp() {
        resizer.classList.remove('active');
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        const saved = {};
        panels.forEach(pid => {
          const p = document.getElementById(pid);
          if (p) saved[pid] = p.offsetHeight;
        });
        localStorage.setItem(RESIZE_KEYS.panelHeights, JSON.stringify(saved));
      }

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'row-resize';
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  });
}

// ══════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════
setTheme(getTheme());
initResize();
renderSidebar();
selectTopic('basicif');
renderSidebar();
selectTopic('basicif');

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === 'ArrowRight' || e.key === 'n') stepForward();
  if (e.key === 'ArrowLeft'  || e.key === 'p') stepBack();
  if (e.key === 'r') resetDebug();
});
