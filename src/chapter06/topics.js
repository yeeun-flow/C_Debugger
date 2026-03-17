// ══════════════════════════════════════════════════════════
//  TOPIC_META: 6장 조건 선택 (if / switch)
// ══════════════════════════════════════════════════════════
const TOPIC_META = [
  { group: 'if 문', key: 'basicif', label: '01basicif', sub: '폭염 주의보', icon: '🌡', isSub: false },
  { group: 'if 문', key: 'evenifelse', label: '02evenifelse', tag: 'BUG', tagStyle: 'red', isSub: true },
  { group: 'if 문', key: 'gpa', label: '03addsub', sub: 'GPA 구분', icon: '📊', isSub: false },
  { group: 'if 문', key: 'nestedif', label: '04nestedif', sub: '운전면허 합격', icon: '🚗', isSub: false },
  { group: 'if 문', key: 'ageifelse', label: '05ageifelse', sub: '나이 구분', icon: '👤', isSub: false },
  { group: 'switch 문', key: 'arithswitch', label: '06arithswitch', sub: '사칙연산 계산기', icon: '🔢', isSub: false },
  { group: 'switch 문', key: 'seasonswitch', label: '07seasonswitch', tag: 'FALL', tagStyle: 'accent', isSub: true },
  { group: 'switch 문', key: 'scoreswitch', label: '09scoreswitch2', sub: '점수→학점', icon: '📝', isSub: false },
  { group: '실습', key: 'lab1', label: 'lab1pay', sub: '세 정수 최대값', icon: '🔺', isSub: false },
  { group: '실습', key: 'lab2', label: 'lab2shapeswitch', sub: '도형 면적', icon: '⬜', isSub: false },
];

// ══════════════════════════════════════════════════════════
//  DATA: 각 토픽 정의
// ══════════════════════════════════════════════════════════

const TOPICS = {

  // ── 01basicif: 폭염 주의보 ─────────────────────────────
  basicif: {
    name: '01basicif.c',
    title: 'if 문 (폭염 주의보)',
    varTypes: { temperature: 'double' },
    concept: `<b>if (조건식)</b> — 조건이 <b class="g">참(0이 아닌 값)</b>이면 블록 실행.<br>
온도 32°C 이상이면 폭염 주의보 메시지를 출력합니다.<br>
<code>if</code> 뒤에 세미콜론 <code>;</code>을 붙이면 블록이 비어있는 것과 같음!`,
    vars: { temperature: null },
    baseAddr: { temperature: '0x7fff5200' },
    code: [
      { text: `<span class="pp">#define</span> _CRT_SECURE_NO_WARNINGS`, blank: true },
      { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
      { text: ``, blank: true },
      { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
      { id: 'decl', text: `    <span class="ty">double</span> <span class="vr">temperature</span> = <span class="nm">35.0</span>;` },
      { text: ``, blank: true },
      { id: 'cond', text: `    <span class="kw">if</span> (<span class="vr">temperature</span> >= <span class="nm">32.0</span>) {` },
      { id: 'p1', text: `        <span class="fn-c">printf</span>(<span class="st">"폭염 주의보를 발령합니다.\\n"</span>);`, indent: 1 },
      { id: 'p2', text: `        <span class="fn-c">printf</span>(<span class="st">"건강에 유의하세요.\\n"</span>);`, indent: 1 },
      { text: `    }`, blank: true },
      { id: 'p3', text: `    <span class="fn-c">printf</span>(<span class="st">"현재 온도는 섭씨 %.2f 입니다.\\n"</span>, <span class="vr">temperature</span>);` },
      { text: ``, blank: true },
      { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text: `}`, blank: true },
    ],
    steps: [
      { line: 'decl', type: 'exec', vars: { temperature: 35.0 }, explain: `<b>double temperature = 35.0</b> — 스택 0x7fff5200에 8바이트 할당.`, output: null,
        memViz: { stack: [{ fn: 'main', color: 'main', vars: [{ name: 'temperature', type: 'double', bytes: 8, val: '35.0', addr: '0x7fff5200', highlight: true }], retAddr: '0x400640' }], heap: [], totalBytes: 8 } },
      { line: 'cond', type: 'exec', cond: true, explain: `<b class="e-cond">조건:</b> temperature(35.0) >= 32.0? → <span class="e-exec">참</span>. 블록 진입.`, output: null },
      { line: 'p1', type: 'exec', explain: `<span class="e-exec">실행:</span> printf("폭염 주의보를 발령합니다.\\n")`, output: '폭염 주의보를 발령합니다.' },
      { line: 'p2', type: 'exec', explain: `<span class="e-exec">실행:</span> printf("건강에 유의하세요.\\n")`, output: '건강에 유의하세요.' },
      { line: 'p3', type: 'exec', explain: `<span class="e-exec">실행:</span> printf — 항상 실행되는 문장.`, output: '현재 온도는 섭씨 35.00 입니다.' },
      { line: 'ret', type: 'exec', explain: `<b>return 0</b> — main() 종료.`, output: null,
        memViz: { stack: [], heap: [], totalBytes: 0, released: 'main 프레임 해제' } },
    ]
  },

  // ── 02evenifelse: 홀수/짝수 (버그 포함) ─────────────────
  evenifelse: {
    name: '02evenifelse.c',
    title: 'if-else (홀수/짝수) ⚠️ 버그',
    varTypes: { n: 'int' },
    concept: `<b>};</b> 뒤의 세미콜론이 <b class="r">컴파일 오류</b>를 유발합니다.<br>
if 블록이 세미콜론으로 종료되어 <code>else</code>가 연결되지 않음.<br>
올바른 코드: <code>}</code> 뒤에 세미콜론 없이 바로 <code>else</code>`,
    vars: { n: null },
    baseAddr: { n: '0x7fff5200' },
    code: [
      { text: `<span class="pp">#define</span> _CRT_SECURE_NO_WARNINGS`, blank: true },
      { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
      { text: ``, blank: true },
      { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">n</span> = <span class="nm">7</span>;` },
      { id: 'cond', text: `    <span class="kw">if</span> (<span class="vr">n</span> % <span class="nm">2</span>) {  <span class="cm">// n%2 != 0 이면 홀수</span>` },
      { id: 'p1', text: `        <span class="fn-c">printf</span>(<span class="st">"홀수\\n"</span>);`, indent: 1 },
      { id: 'bug', text: `    };  <span class="cm">// ⚠️ 세미콜론 → else 연결 끊김!</span>` },
      { id: 'else', text: `    <span class="kw">else</span> {` },
      { id: 'p2', text: `        <span class="fn-c">printf</span>(<span class="st">"짝수\\n"</span>);`, indent: 1 },
      { text: `    }`, blank: true },
    ],
    steps: [
      { line: 'decl', type: 'exec', vars: { n: 7 }, explain: `<b>int n = 7</b> — 스택에 4바이트 할당. <b class="g">신규 생성</b>이므로 메모리맵에 표시.`, output: null,
        memViz: { stack: [{ fn: 'main', color: 'main', vars: [{ name: 'n', type: 'int', bytes: 4, val: '7', addr: '0x7fff5200', highlight: true }], retAddr: '0x400640' }], heap: [], totalBytes: 4 } },
      { line: 'cond', type: 'exec', vars: { n: 7 }, cond: true, explain: `<b class="e-cond">검사:</b> n(7) % 2 = 1 → <span class="e-exec">참</span>. 홀수 블록. (메모리 변화 없음)`, output: null },
      { line: 'p1', type: 'exec', explain: `<span class="e-exec">실행:</span> printf("홀수\\n")`, output: '홀수' },
      { line: 'bug', type: 'exec', explain: `<b class="r">버그:</b> <code>};</code> — 여기서 if문이 끝나버림. else가 고아가 됨 → 컴파일 에러!`, output: null },
    ]
  },

  // ── 03addsub: GPA 구분 ─────────────────────────────────
  gpa: {
    name: '03addsub.c',
    title: 'if-else if (GPA 구분)',
    varTypes: { gpa: 'double' },
    concept: `여러 조건을 <b>위에서 아래로 순서대로</b> 검사합니다.<br>
<b class="g">처음으로 참인 조건</b>의 블록만 실행. 4.3 이상 → 최우등, 3.8 이상 → 우등, ...`,
    vars: { gpa: null },
    baseAddr: { gpa: '0x7fff5200' },
    code: [
      { text: `<span class="pp">#define</span> _CRT_SECURE_NO_WARNINGS`, blank: true },
      { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
      { text: ``, blank: true },
      { id: 'decl', text: `    <span class="ty">double</span> <span class="vr">gpa</span> = <span class="nm">3.9</span>;` },
      { text: ``, blank: true },
      { id: 'c1', text: `    <span class="kw">if</span> (<span class="vr">gpa</span> >= <span class="nm">4.3</span>)` },
      { id: 'p1', text: `        <span class="fn-c">printf</span>(<span class="st">"최우등\\n"</span>);`, indent: 1 },
      { id: 'c2', text: `    <span class="kw">else if</span> (<span class="vr">gpa</span> >= <span class="nm">3.8</span>)` },
      { id: 'p2', text: `        <span class="fn-c">printf</span>(<span class="st">"우등\\n"</span>);`, indent: 1 },
      { id: 'c3', text: `    <span class="kw">else if</span> (<span class="vr">gpa</span> >= <span class="nm">3.0</span>)` },
      { id: 'p3', text: `        <span class="fn-c">printf</span>(<span class="st">"우수\\n"</span>);`, indent: 1 },
      { id: 'c4', text: `    <span class="kw">else</span>` },
      { id: 'p4', text: `        <span class="fn-c">printf</span>(<span class="st">"3.0 미만\\n"</span>);`, indent: 1 },
    ],
    steps: [
      { line: 'decl', type: 'exec', vars: { gpa: 3.9 }, explain: `<b>gpa = 3.9</b> 선언.`, output: null,
        memViz: { stack: [{ fn: 'main', color: 'main', vars: [{ name: 'gpa', type: 'double', bytes: 8, val: '3.9', addr: '0x7fff5200', highlight: true }], retAddr: '0x400640' }], heap: [], totalBytes: 8 } },
      { line: 'c1', type: 'exec', cond: false, explain: `<b class="e-cond">검사:</b> gpa(3.9) >= 4.3? → <span class="e-skip">거짓</span>.`, output: null },
      { line: 'c2', type: 'exec', cond: true, explain: `<b class="e-cond">검사:</b> gpa(3.9) >= 3.8? → <span class="e-exec">참!</span>`, output: null },
      { line: 'p2', type: 'exec', explain: `<span class="e-exec">실행:</span> printf("우등\\n")`, output: '우등' },
    ]
  },

  // ── 04nestedif: 운전면허 ──────────────────────────────
  nestedif: {
    name: '04nestedif.c',
    title: '중첩 if (운전면허 합격)',
    varTypes: { type: 'int', point: 'int' },
    concept: `if 안에 또 다른 if — <b>중첩 if</b>.<br>
1종: 70점 이상 합격, 2종: 60점 이상 합격.<br>
<b class="r">Dangling else:</b> else는 가장 가까운 if와 쌍. <code>{}</code>로 명확히!`,
    vars: { type: null, point: null },
    baseAddr: { type: '0x7fff5204', point: '0x7fff5200' },
    code: [
      { text: `<span class="pp">#define</span> _CRT_SECURE_NO_WARNINGS`, blank: true },
      { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
      { text: ``, blank: true },
      { id: 'd1', text: `    <span class="ty">int</span> <span class="vr">type</span> = <span class="nm">1</span>, <span class="vr">point</span> = <span class="nm">75</span>;` },
      { id: 'c1', text: `    <span class="kw">if</span> (<span class="vr">type</span> == <span class="nm">1</span>) {` },
      { id: 'c2', text: `        <span class="kw">if</span> (<span class="vr">point</span> >= <span class="nm">70</span>)` },
      { id: 'p1', text: `            <span class="fn-c">printf</span>(<span class="st">"1종면허 합격\\n"</span>);`, indent: 1 },
      { id: 'e1', text: `        <span class="kw">else</span>` },
      { id: 'p2', text: `            <span class="fn-c">printf</span>(<span class="st">"1종면허 불합격\\n"</span>);`, indent: 1 },
      { id: 'c3', text: `    } <span class="kw">else if</span> (<span class="vr">type</span> == <span class="nm">2</span>) { ... }` },
    ],
    steps: [
      { line: 'd1', type: 'exec', vars: { type: 1, point: 75 }, explain: `<b>type=1, point=75</b> — 1종, 75점.`, output: null,
        memViz: { stack: [{ fn: 'main', color: 'main', vars: [{ name: 'type', type: 'int', bytes: 4, val: '1', addr: '0x7fff5204', highlight: true }, { name: 'point', type: 'int', bytes: 4, val: '75', addr: '0x7fff5200', highlight: true }], retAddr: '0x400640' }], heap: [], totalBytes: 8 } },
      { line: 'c1', type: 'exec', cond: true, explain: `<b class="e-cond">검사:</b> type==1? → <span class="e-exec">참</span>. 1종 블록 진입.`, output: null },
      { line: 'c2', type: 'exec', cond: true, explain: `<b class="e-cond">내부 if:</b> point(75)>=70? → <span class="e-exec">참</span>.`, output: null },
      { line: 'p1', type: 'exec', explain: `<span class="e-exec">실행:</span> printf("1종면허 합격\\n")`, output: '1종면허 합격' },
    ]
  },

  // ── 05ageifelse: 나이 구분 ─────────────────────────────
  ageifelse: {
    name: '05ageifelse.c',
    title: '중첩 if (나이 구분)',
    varTypes: { age: 'int' },
    concept: `age >= 20 이면 성인/어르신, 아니면 미성년자.<br>
20 이상이면 다시 65 이상인지 검사 → 어르신 vs 성인.`,
    vars: { age: null },
    baseAddr: { age: '0x7fff5200' },
    code: [
      { text: `<span class="pp">#define</span> _CRT_SECURE_NO_WARNINGS`, blank: true },
      { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
      { text: ``, blank: true },
      { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">age</span> = <span class="nm">30</span>;` },
      { id: 'c1', text: `    <span class="kw">if</span> (<span class="vr">age</span> >= <span class="nm">20</span>) {` },
      { id: 'c2', text: `        <span class="kw">if</span> (<span class="vr">age</span> >= <span class="nm">65</span>)` },
      { id: 'p1', text: `            <span class="fn-c">printf</span>(<span class="st">"어르신\\n"</span>);`, indent: 1 },
      { id: 'e1', text: `        <span class="kw">else</span>` },
      { id: 'p2', text: `            <span class="fn-c">printf</span>(<span class="st">"성인\\n"</span>);`, indent: 1 },
      { id: 'e2', text: `    } <span class="kw">else</span> {` },
      { id: 'p3', text: `        <span class="fn-c">printf</span>(<span class="st">"미성년자\\n"</span>);`, indent: 1 },
      { text: `    }`, blank: true },
    ],
    steps: [
      { line: 'decl', type: 'exec', vars: { age: 30 }, explain: `<b>age = 30</b>`, output: null,
        memViz: { stack: [{ fn: 'main', color: 'main', vars: [{ name: 'age', type: 'int', bytes: 4, val: '30', addr: '0x7fff5200', highlight: true }], retAddr: '0x400640' }], heap: [], totalBytes: 4 } },
      { line: 'c1', type: 'exec', cond: true, explain: `age(30) >= 20? → <span class="e-exec">참</span>.`, output: null },
      { line: 'c2', type: 'exec', cond: false, explain: `age(30) >= 65? → <span class="e-skip">거짓</span>. else로.`, output: null },
      { line: 'p2', type: 'exec', explain: `<span class="e-exec">실행:</span> printf("성인\\n")`, output: '성인' },
    ]
  },

  // ── 06arithswitch: 사칙연산 ───────────────────────────
  arithswitch: {
    name: '06arithswitch.c',
    title: 'switch (사칙연산 계산기)',
    varTypes: { x: 'double', y: 'double', op: 'int' },
    concept: `<b>switch</b> — 정수값에 따라 여러 case 분기.<br>
<code>break</code> 없으면 다음 case로 fall-through!<br>
1→+, 2→-, 3→*, 4→/`,
    vars: { x: null, y: null, op: null },
    baseAddr: { x: '0x7fff5210', y: '0x7fff5208', op: '0x7fff5200' },
    code: [
      { text: `<span class="pp">#define</span> _CRT_SECURE_NO_WARNINGS`, blank: true },
      { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
      { text: ``, blank: true },
      { id: 'decl', text: `    <span class="ty">double</span> <span class="vr">x</span>=<span class="nm">10</span>, <span class="vr">y</span>=<span class="nm">3</span>; <span class="ty">int</span> <span class="vr">op</span>=<span class="nm">1</span>;` },
      { id: 'sw', text: `    <span class="kw">switch</span> (<span class="vr">op</span>) {` },
      { id: 'c1', text: `        <span class="kw">case</span> <span class="nm">1</span>: <span class="fn-c">printf</span>(<span class="st">"%.2f + %.2f = %.2f\\n"</span>, x, y, x+y); <span class="kw">break</span>;` },
      { id: 'c2', text: `        <span class="kw">case</span> <span class="nm">2</span>: ... <span class="kw">break</span>;` },
      { id: 'def', text: `        <span class="kw">default</span>: <span class="fn-c">printf</span>(<span class="st">"잘못 선택\\n"</span>); <span class="kw">break</span>;` },
      { text: `    }`, blank: true },
    ],
    steps: [
      { line: 'decl', type: 'exec', vars: { x: 10, y: 3, op: 1 }, explain: `<b>x=10, y=3, op=1</b> — 덧셈 선택.`, output: null,
        memViz: { stack: [{ fn: 'main', color: 'main', vars: [{ name: 'x', type: 'double', bytes: 8, val: '10', addr: '0x7fff5210', highlight: true }, { name: 'y', type: 'double', bytes: 8, val: '3', addr: '0x7fff5208', highlight: true }, { name: 'op', type: 'int', bytes: 4, val: '1', addr: '0x7fff5200', highlight: true }], retAddr: '0x400640' }], heap: [], totalBytes: 20 } },
      { line: 'sw', type: 'exec', explain: `<b>switch(op)</b> — op=1이므로 case 1로 점프.`, output: null },
      { line: 'c1', type: 'exec', explain: `<span class="e-exec">case 1:</span> printf → 10.00 + 3.00 = 13.00`, output: '10.00 + 3.00 = 13.00' },
    ]
  },

  // ── 07seasonswitch: fall-through ──────────────────────
  seasonswitch: {
    name: '07seasonswitch.c',
    title: 'switch fall-through (월→계절)',
    varTypes: { month: 'int' },
    concept: `<code>break</code> 없이 여러 case를 묶으면 같은 동작 공유.<br>
case 4: case 5: → 봄, case 6: case 7: case 8: → 여름, ...`,
    vars: { month: null },
    baseAddr: { month: '0x7fff5200' },
    code: [
      { text: `<span class="pp">#define</span> _CRT_SECURE_NO_WARNINGS`, blank: true },
      { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
      { text: ``, blank: true },
      { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">month</span> = <span class="nm">8</span>;` },
      { id: 'c1', text: `        <span class="kw">case</span> <span class="nm">4</span>: <span class="kw">case</span> <span class="nm">5</span>: <span class="fn-c">printf</span>(<span class="st">"봄"</span>); <span class="kw">break</span>;` },
      { id: 'c2', text: `        <span class="kw">case</span> <span class="nm">6</span>: <span class="kw">case</span> <span class="nm">7</span>: <span class="kw">case</span> <span class="nm">8</span>: <span class="fn-c">printf</span>(<span class="st">"여름"</span>); <span class="kw">break</span>;` },
      { id: 'c3', text: `        <span class="kw">case</span> <span class="nm">9</span>: <span class="kw">case</span> <span class="nm">10</span>: <span class="kw">case</span> <span class="nm">11</span>: ...` },
    ],
    steps: [
      { line: 'decl', type: 'exec', vars: { month: 8 }, explain: `<b>month = 8</b>`, output: null,
        memViz: { stack: [{ fn: 'main', color: 'main', vars: [{ name: 'month', type: 'int', bytes: 4, val: '8', addr: '0x7fff5200', highlight: true }], retAddr: '0x400640' }], heap: [], totalBytes: 4 } },
      { line: 'c2', type: 'exec', explain: `case 6,7,8 → 8월은 여름. fall-through로 case 8 매칭.`, output: '8월은 여름입니다.' },
    ]
  },

  // ── 09scoreswitch2: 점수→학점 ─────────────────────────
  scoreswitch: {
    name: '09scoreswitch2.c',
    title: 'switch + 정수 나눗셈 (점수→학점)',
    varTypes: { score: 'int' },
    concept: `<b>score / 10</b> — 십의 자리만 추출! 85/10=8 → case 8(B학점).<br>
90점대→9, 80점대→8, ... default는 F.`,
    vars: { score: null },
    baseAddr: { score: '0x7fff5200' },
    code: [
      { text: `<span class="pp">#define</span> _CRT_SECURE_NO_WARNINGS`, blank: true },
      { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
      { text: ``, blank: true },
      { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">score</span> = <span class="nm">85</span>;` },
      { id: 'sw', text: `    <span class="kw">switch</span> (<span class="vr">score</span> / <span class="nm">10</span>) {` },
      { id: 'c8', text: `        <span class="kw">case</span> <span class="nm">8</span>: <span class="fn-c">printf</span>(<span class="st">"B"</span>); <span class="kw">break</span>;` },
      { id: 'c9', text: `        <span class="kw">case</span> <span class="nm">9</span>: <span class="kw">case</span> <span class="nm">10</span>: <span class="fn-c">printf</span>(<span class="st">"A"</span>); <span class="kw">break</span>;` },
      { id: 'def', text: `        <span class="kw">default</span>: <span class="fn-c">printf</span>(<span class="st">"F"</span>); <span class="kw">break</span>;` },
      { text: `    }`, blank: true },
    ],
    steps: [
      { line: 'decl', type: 'exec', vars: { score: 85 }, explain: `<b>score = 85</b>`, output: null,
        memViz: { stack: [{ fn: 'main', color: 'main', vars: [{ name: 'score', type: 'int', bytes: 4, val: '85', addr: '0x7fff5200', highlight: true }], retAddr: '0x400640' }], heap: [], totalBytes: 4 } },
      { line: 'sw', type: 'exec', explain: `score/10 = 85/10 = <b>8</b> (정수 나눗셈) → case 8.`, output: null },
      { line: 'c8', type: 'exec', explain: `<span class="e-exec">case 8:</span> B학점 출력.`, output: '점수가 85 점으로 성적이 B 입니다.' },
    ]
  },

  // ── lab1pay: 세 정수 최대값 ───────────────────────────
  lab1: {
    name: 'lab1pay.c',
    title: '실습: 세 정수 최대값',
    varTypes: { x: 'int', y: 'int', z: 'int' },
    concept: `중첩 if로 x>y 이면 x와 z 비교, 아니면 y와 z 비교.<br>
예: 5, 12, 8 → 최대 12`,
    vars: { x: null, y: null, z: null },
    baseAddr: { x: '0x7fff5208', y: '0x7fff5204', z: '0x7fff5200' },
    code: [
      { text: `<span class="pp">#define</span> _CRT_SECURE_NO_WARNINGS`, blank: true },
      { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
      { text: ``, blank: true },
      { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">x</span>=<span class="nm">5</span>, <span class="vr">y</span>=<span class="nm">12</span>, <span class="vr">z</span>=<span class="nm">8</span>;` },
      { id: 'c1', text: `    <span class="kw">if</span> (<span class="vr">x</span> > <span class="vr">y</span>) {` },
      { id: 'c2', text: `        <span class="kw">if</span> (<span class="vr">x</span> > <span class="vr">z</span>) <span class="fn-c">printf</span>(<span class="st">"%d"</span>, x);` },
      { id: 'e1', text: `        <span class="kw">else</span> <span class="fn-c">printf</span>(<span class="st">"%d"</span>, z);` },
      { id: 'e2', text: `    } <span class="kw">else</span> {` },
      { id: 'c3', text: `        <span class="kw">if</span> (<span class="vr">y</span> > <span class="vr">z</span>) <span class="fn-c">printf</span>(<span class="st">"%d"</span>, y);` },
      { id: 'e3', text: `        <span class="kw">else</span> <span class="fn-c">printf</span>(<span class="st">"%d"</span>, z);` },
      { text: `    }`, blank: true },
    ],
    steps: [
      { line: 'decl', type: 'exec', vars: { x: 5, y: 12, z: 8 }, explain: `<b>x=5, y=12, z=8</b>`, output: null,
        memViz: { stack: [{ fn: 'main', color: 'main', vars: [{ name: 'x', type: 'int', bytes: 4, val: '5', addr: '0x7fff5208', highlight: true }, { name: 'y', type: 'int', bytes: 4, val: '12', addr: '0x7fff5204', highlight: true }, { name: 'z', type: 'int', bytes: 4, val: '8', addr: '0x7fff5200', highlight: true }], retAddr: '0x400640' }], heap: [], totalBytes: 12 } },
      { line: 'c1', type: 'exec', cond: false, explain: `x(5) > y(12)? → <span class="e-skip">거짓</span>. else 블록.`, output: null },
      { line: 'c3', type: 'exec', cond: true, explain: `y(12) > z(8)? → <span class="e-exec">참</span>. printf(y) 실행.`, output: '최대 수: 12' },
    ]
  },

  // ── lab2shapeswitch: 도형 면적 ────────────────────────
  lab2: {
    name: 'lab2shapeswitch.c',
    title: '실습: 도형 면적 (enum + switch)',
    varTypes: { input: 'int', width: 'double', height: 'double' },
    concept: `<code>enum shape { TRIANGLE=1, RECTANGLE }</code><br>
1→삼각형(가로*세로/2), 2→사각형(가로*세로)`,
    vars: { input: null, width: null, height: null },
    baseAddr: { input: '0x7fff5200', width: '0x7fff5208', height: '0x7fff5210' },
    code: [
      { text: `<span class="pp">#define</span> _CRT_SECURE_NO_WARNINGS`, blank: true },
      { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
      { text: ``, blank: true },
      { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">input</span>=<span class="nm">1</span>; <span class="ty">double</span> <span class="vr">width</span>=<span class="nm">5</span>, <span class="vr">height</span>=<span class="nm">8</span>;` },
      { id: 'sw', text: `    <span class="kw">switch</span> (<span class="vr">input</span>) {` },
      { id: 'c1', text: `        <span class="kw">case</span> TRIANGLE: <span class="fn-c">printf</span>(<span class="st">"%.2lf"</span>, width*height/2); <span class="kw">break</span>;` },
      { id: 'c2', text: `        <span class="kw">case</span> RECTANGLE: <span class="fn-c">printf</span>(<span class="st">"%.2lf"</span>, width*height); <span class="kw">break</span>;` },
      { text: `    }`, blank: true },
    ],
    steps: [
      { line: 'decl', type: 'exec', vars: { input: 1, width: 5, height: 8 }, explain: `삼각형(1), 가로5, 세로8.`, output: null,
        memViz: { stack: [{ fn: 'main', color: 'main', vars: [{ name: 'input', type: 'int', bytes: 4, val: '1', addr: '0x7fff5200', highlight: true }, { name: 'width', type: 'double', bytes: 8, val: '5', addr: '0x7fff5208', highlight: true }, { name: 'height', type: 'double', bytes: 8, val: '8', addr: '0x7fff5210', highlight: true }], retAddr: '0x400640' }], heap: [], totalBytes: 20 } },
      { line: 'c1', type: 'exec', explain: `TRIANGLE → 5*8/2 = <b>20.00</b>`, output: '삼각형 면적: 20.00' },
    ]
  },
};
