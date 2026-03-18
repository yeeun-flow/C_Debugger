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
  { group: 'switch 문', key: 'seasonswitch', label: '07seasonswitch', sub: '월→계절', icon: '🍂', isSub: false },
  { group: 'switch 문', key: 'ternary_ops', label: '08scoreswitch', sub: '최대/최소/절대값/홀짝', icon: '❓', isSub: false },
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
사용자로부터 온도를 입력받아 <b>32.0℃ 이상이면 폭염 주의보</b>를 출력합니다.`,
    vars: { temperature: null },
    baseAddr: { temperature: '0x7fff5200' },
    code: [
      { text: `<span class="pp">#define</span> _CRT_SECURE_NO_WARNINGS`, blank: true },
      { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
      { text: ``, blank: true },
      { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
      { id: 'decl', text: `    <span class="ty">double</span> <span class="vr">temperature</span>;` },
      { id: 'p0', text: `    <span class="fn-c">printf</span>(<span class="st">"현재 온도 입력: "</span>);` },
      { id: 'scan', text: `    <span class="fn-c">scanf</span>(<span class="st">"%lf"</span>, &<span class="vr">temperature</span>);` },
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
      {
        line: 'decl',
        type: 'exec',
        vars: { temperature: '???' },
        explain: `<b>double temperature;</b> — 아직 값은 정해지지 않은 상태입니다.`,
        output: null,
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [
                { name: 'temperature', type: 'double', bytes: 8, val: '???', addr: '0x7fff5200', highlight: true },
              ],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 8,
        },
      },
      {
        line: 'p0',
        type: 'exec',
        explain: `<span class="e-exec">실행:</span> printf("현재 온도 입력: ").`,
        output: '현재 온도 입력: ',
      },
      {
        line: 'scan',
        type: 'exec',
        vars: { temperature: 35.0 },
        explain: `<span class="e-exec">실행:</span> scanf("%lf", &temperature) — 사용자가 <b>35.0</b>을 입력했다고 가정합니다.`,
        output: '→ 입력: 35.0',
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [
                { name: 'temperature', type: 'double', bytes: 8, val: '35.0', addr: '0x7fff5200', highlight: true },
              ],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 8,
        },
      },
      {
        line: 'cond',
        type: 'exec',
        cond: true,
        explain: `<b class="e-cond">조건:</b> temperature(35.0) >= 32.0 ? → <span class="e-exec">참</span>, if 블록 실행.`,
        output: null,
      },
      {
        line: 'p1',
        type: 'exec',
        explain: `<span class="e-exec">실행:</span> printf("폭염 주의보를 발령합니다.\\n").`,
        output: '폭염 주의보를 발령합니다.',
      },
      {
        line: 'p2',
        type: 'exec',
        explain: `<span class="e-exec">실행:</span> printf("건강에 유의하세요.\\n").`,
        output: '건강에 유의하세요.',
      },
      {
        line: 'p3',
        type: 'exec',
        explain: `<span class="e-exec">실행:</span> 현재 온도를 항상 출력합니다.`,
        output: '현재 온도는 섭씨 35.00 입니다.',
      },
      {
        line: 'ret',
        type: 'exec',
        explain: `<b>return 0;</b> — main 함수 종료, 스택 프레임 해제.`,
        output: null,
        memViz: { stack: [], heap: [], totalBytes: 0, released: 'main 프레임 해제' },
      },
    ],
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
      { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
      { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">n</span>;` },
      { id: 'p0', text: `    <span class="fn-c">printf</span>(<span class="st">"정수 입력: "</span>);` },
      { id: 'scan', text: `    <span class="fn-c">scanf</span>(<span class="st">"%d"</span>, &<span class="vr">n</span>);` },
      { text: ``, blank: true },
      { id: 'cond', text: `    <span class="kw">if</span> (<span class="vr">n</span> % <span class="nm">2</span>)    <span class="cm">// n % 2 != 0 이면 홀수</span>` },
      { id: 'p1', text: `    {`, blank: true },
      { id: 'p1body', text: `        <span class="fn-c">printf</span>(<span class="st">"홀수\\n"</span>);`, indent: 1 },
      { id: 'bug', text: `    };                  <span class="cm">// ⚠️ 여기 세미콜론이 오류! else와 연결 끊김</span>` },
      { id: 'else', text: `    <span class="kw">else</span>` },
      { id: 'elsebody', text: `    {`, blank: true },
      { id: 'p2', text: `        <span class="fn-c">printf</span>(<span class="st">"짝수\\n"</span>);`, indent: 1 },
      { text: `    }`, blank: true },
      { text: ``, blank: true },
      { id: 'ternary', text: `    (<span class="vr">n</span> % <span class="nm">2</span>) ? <span class="fn-c">printf</span>(<span class="st">"홀수\\n"</span>) : <span class="fn-c">printf</span>(<span class="st">"짝수\\n"</span>);` },
      { text: ``, blank: true },
      { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text: `}`, blank: true },
    ],
    steps: [
      {
        line: 'decl',
        type: 'exec',
        vars: { n: '???' },
        explain: `<b>int n;</b> — 아직 값이 없는 상태로 스택에 4바이트 확보.`,
        output: null,
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [{ name: 'n', type: 'int', bytes: 4, val: '???', addr: '0x7fff5200', highlight: true }],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 4,
        },
      },
      {
        line: 'p0',
        type: 'exec',
        explain: `printf("정수 입력: ") — 프롬프트를 출력합니다.`,
        output: '정수 입력: ',
      },
      {
        line: 'scan',
        type: 'exec',
        vars: { n: 7 },
        explain: `scanf("%d", &n) — 사용자가 <b>7</b>을 입력했다고 가정합니다.`,
        output: '→ 입력: 7',
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [{ name: 'n', type: 'int', bytes: 4, val: '7', addr: '0x7fff5200', highlight: true }],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 4,
        },
      },
      {
        line: 'cond',
        type: 'exec',
        cond: true,
        explain: `<b class="e-cond">검사:</b> n(7) % 2 = 1 → <span class="e-exec">참</span>, if 블록으로 진입합니다.`,
        output: null,
      },
      {
        line: 'p1body',
        type: 'exec',
        explain: `printf("홀수\\n") — 홀수라는 줄은 정상적으로 출력됩니다.`,
        output: '홀수',
      },
      {
        line: 'bug',
        type: 'exec',
        explain: `<b class="r">버그 지점:</b> <code>};</code> 때문에 if 문이 여기서 끝나버립니다. 이후 <code>else</code>는 <b>아무 if와도 연결되지 않아</b> 컴파일 오류가 발생합니다.`,
        output: null,
      },
      {
        line: 'ternary',
        type: 'exec',
        explain: `조건연산자 표현식: (n%2) ? printf("홀수") : printf("짝수") — 위 if-else와 동등한 로직을 한 줄로 작성한 예시입니다.`,
        output: '홀수',
      },
      {
        line: 'ret',
        type: 'exec',
        explain: `<b>return 0;</b> — 프로그램 종료, 스택 프레임 해제.`,
        output: null,
        memViz: { stack: [], heap: [], totalBytes: 0, released: 'main 프레임 해제' },
      },
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
      { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
      { id: 'decl', text: `    <span class="ty">double</span> <span class="vr">gpa</span>;` },
      { id: 'p0', text: `    <span class="fn-c">printf</span>(<span class="st">"평균평점 입력: "</span>);` },
      { id: 'scan', text: `    <span class="fn-c">scanf</span>(<span class="st">"%lf"</span>, &<span class="vr">gpa</span>);` },
      { text: ``, blank: true },
      { id: 'c1', text: `    <span class="kw">if</span> (<span class="vr">gpa</span> >= <span class="nm">4.3</span>)` },
      { id: 'p1', text: `        <span class="fn-c">printf</span>(<span class="st">"최우등\\n"</span>);`, indent: 1 },
      { id: 'c2', text: `    <span class="kw">else if</span> (<span class="vr">gpa</span> >= <span class="nm">3.8</span>)` },
      { id: 'p2', text: `        <span class="fn-c">printf</span>(<span class="st">"우등\\n"</span>);`, indent: 1 },
      { id: 'c3', text: `    <span class="kw">else if</span> (<span class="vr">gpa</span> >= <span class="nm">3.0</span>)` },
      { id: 'p3', text: `        <span class="fn-c">printf</span>(<span class="st">"우수\\n"</span>);`, indent: 1 },
      { id: 'c4', text: `    <span class="kw">else</span>` },
      { id: 'p4', text: `        <span class="fn-c">printf</span>(<span class="st">"3.0 미만\\n"</span>);`, indent: 1 },
      { text: ``, blank: true },
      { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text: `}`, blank: true },
    ],
    steps: [
      {
        line: 'decl',
        type: 'exec',
        vars: { gpa: '???' },
        explain: `<b>double gpa;</b> — GPA 값을 저장할 변수, 아직 입력 전입니다.`,
        output: null,
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [{ name: 'gpa', type: 'double', bytes: 8, val: '???', addr: '0x7fff5200', highlight: true }],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 8,
        },
      },
      {
        line: 'p0',
        type: 'exec',
        explain: `printf("평균평점 입력: ") — 프롬프트 출력.`,
        output: '평균평점 입력: ',
      },
      {
        line: 'scan',
        type: 'exec',
        vars: { gpa: 3.9 },
        explain: `scanf("%lf", &gpa) — 사용자가 <b>3.9</b>를 입력했다고 가정합니다.`,
        output: '→ 입력: 3.9',
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [{ name: 'gpa', type: 'double', bytes: 8, val: '3.9', addr: '0x7fff5200', highlight: true }],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 8,
        },
      },
      {
        line: 'c1',
        type: 'exec',
        cond: false,
        explain: `<b class="e-cond">검사:</b> gpa(3.9) >= 4.3 ? → <span class="e-skip">거짓</span>. "최우등"은 실행되지 않습니다.`,
        output: null,
      },
      {
        line: 'c2',
        type: 'exec',
        cond: true,
        explain: `<b class="e-cond">검사:</b> gpa(3.9) >= 3.8 ? → <span class="e-exec">참</span>. 여기서 체인이 멈춥니다.`,
        output: null,
      },
      {
        line: 'p2',
        type: 'exec',
        explain: `printf("우등\\n") — "우등" 한 줄만 출력됩니다.`,
        output: '우등',
      },
      {
        line: 'ret',
        type: 'exec',
        explain: `<b>return 0;</b> — 프로그램 종료, 스택 프레임 해제.`,
        output: null,
        memViz: { stack: [], heap: [], totalBytes: 0, released: 'main 프레임 해제' },
      },
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
      { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
      { id: 'd1', text: `    <span class="ty">int</span> <span class="vr">type</span>, <span class="vr">point</span>;` },
      { id: 'p0', text: `    <span class="fn-c">printf</span>(<span class="st">"번호를 선택: 1(1종면허), 2(2종면허): "</span>);` },
      { id: 'scanType', text: `    <span class="fn-c">scanf</span>(<span class="st">"%d"</span>, &<span class="vr">type</span>);` },
      { id: 'p1', text: `    <span class="fn-c">printf</span>(<span class="st">"필기시험 점수 입력: "</span>);` },
      { id: 'scanPoint', text: `    <span class="fn-c">scanf</span>(<span class="st">"%d"</span>, &<span class="vr">point</span>);` },
      { text: ``, blank: true },
      { id: 'c1', text: `    <span class="kw">if</span> (<span class="vr">type</span> == <span class="nm">1</span>)` },
      { id: 'b1', text: `    {`, blank: true },
      { id: 'c2', text: `        <span class="kw">if</span> (<span class="vr">point</span> >= <span class="nm">70</span>)` },
      { id: 'p2', text: `            <span class="fn-c">printf</span>(<span class="st">"1종면허 합격\\n"</span>);`, indent: 1 },
      { id: 'e1', text: `        <span class="kw">else</span>` },
      { id: 'p3', text: `            <span class="fn-c">printf</span>(<span class="st">"1종면허 불합격\\n"</span>);`, indent: 1 },
      { id: 'b1e', text: `    }`, blank: true },
      { id: 'c3', text: `    <span class="kw">else if</span> (<span class="vr">type</span> == <span class="nm">2</span>)` },
      { id: 'b2', text: `    {`, blank: true },
      { id: 'c4', text: `        <span class="kw">if</span> (<span class="vr">point</span> >= <span class="nm">60</span>)` },
      { id: 'p4', text: `            <span class="fn-c">printf</span>(<span class="st">"2종면허 합격\\n"</span>);`, indent: 1 },
      { id: 'e2', text: `        <span class="kw">else</span>` },
      { id: 'p5', text: `            <span class="fn-c">printf</span>(<span class="st">"2종면허 불합격\\n"</span>);`, indent: 1 },
      { id: 'b2e', text: `    }`, blank: true },
      { text: ``, blank: true },
      { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text: `}`, blank: true },
    ],
    steps: [
      {
        line: 'd1',
        type: 'exec',
        vars: { type: '???', point: '???' },
        explain: `<b>int type, point;</b> — 면허 종류와 점수를 저장할 두 정수 변수입니다.`,
        output: null,
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [
                { name: 'type', type: 'int', bytes: 4, val: '???', addr: '0x7fff5204', highlight: true },
                { name: 'point', type: 'int', bytes: 4, val: '???', addr: '0x7fff5200', highlight: true },
              ],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 8,
        },
      },
      {
        line: 'p0',
        type: 'exec',
        explain: `printf("번호를 선택: 1(1종면허), 2(2종면허): ") — 면허 종류 선택 안내.`,
        output: '번호를 선택: 1(1종면허), 2(2종면허): ',
      },
      {
        line: 'scanType',
        type: 'exec',
        vars: { type: 1 },
        explain: `scanf("%d", &type) — 사용자가 <b>1</b>을 입력했다고 가정합니다. (1종 면허)`,
        output: '→ 입력: 1',
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [
                { name: 'type', type: 'int', bytes: 4, val: '1', addr: '0x7fff5204', highlight: true },
                { name: 'point', type: 'int', bytes: 4, val: '???', addr: '0x7fff5200', highlight: false },
              ],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 8,
        },
      },
      {
        line: 'p1',
        type: 'exec',
        explain: `printf("필기시험 점수 입력: ") — 점수 입력 프롬프트.`,
        output: '필기시험 점수 입력: ',
      },
      {
        line: 'scanPoint',
        type: 'exec',
        vars: { type: 1, point: 75 },
        explain: `scanf("%d", &point) — 사용자가 <b>75</b>점을 입력했다고 가정합니다.`,
        output: '→ 입력: 75',
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [
                { name: 'type', type: 'int', bytes: 4, val: '1', addr: '0x7fff5204', highlight: false },
                { name: 'point', type: 'int', bytes: 4, val: '75', addr: '0x7fff5200', highlight: true },
              ],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 8,
        },
      },
      {
        line: 'c1',
        type: 'exec',
        cond: true,
        explain: `<b class="e-cond">외부 if:</b> type(1) == 1 ? → <span class="e-exec">참</span>, 1종 블록으로 진입.`,
        output: null,
      },
      {
        line: 'c2',
        type: 'exec',
        cond: true,
        explain: `<b class="e-cond">내부 if:</b> point(75) >= 70 ? → <span class="e-exec">참</span>, 합격 출력.`,
        output: null,
      },
      {
        line: 'p2',
        type: 'exec',
        explain: `printf("1종면허 합격\\n") — 합격 메시지가 출력됩니다.`,
        output: '1종면허 합격',
      },
      {
        line: 'ret',
        type: 'exec',
        explain: `<b>return 0;</b> — 프로그램 종료, 스택 프레임 해제.`,
        output: null,
        memViz: { stack: [], heap: [], totalBytes: 0, released: 'main 프레임 해제' },
      },
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
      { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
      { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">age</span> = <span class="nm">0</span>;` },
      { id: 'p0', text: `    <span class="fn-c">printf</span>(<span class="st">"당신의 나이는? "</span>);` },
      { id: 'scan', text: `    <span class="fn-c">scanf</span>(<span class="st">"%d"</span>, &<span class="vr">age</span>);` },
      { text: ``, blank: true },
      { id: 'c1', text: `    <span class="kw">if</span> (<span class="vr">age</span> >= <span class="nm">20</span>)` },
      { id: 'b1', text: `    {`, blank: true },
      { id: 'c2', text: `        <span class="kw">if</span> (<span class="vr">age</span> >= <span class="nm">65</span>)` },
      { id: 'p1', text: `            <span class="fn-c">printf</span>(<span class="st">"당신은 어르신입니다.\\n"</span>);`, indent: 1 },
      { id: 'e1', text: `        <span class="kw">else</span>` },
      { id: 'p2', text: `            <span class="fn-c">printf</span>(<span class="st">"당신은 성인입니다.\\n"</span>);`, indent: 1 },
      { id: 'b1e', text: `    }`, blank: true },
      { id: 'e2', text: `    <span class="kw">else</span>` },
      { id: 'b2', text: `    {`, blank: true },
      { id: 'p3', text: `        <span class="fn-c">printf</span>(<span class="st">"당신은 미성년자입니다.\\n"</span>);`, indent: 1 },
      { id: 'b2e', text: `    }`, blank: true },
      { text: ``, blank: true },
      { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text: `}`, blank: true },
    ],
    steps: [
      {
        line: 'decl',
        type: 'exec',
        vars: { age: 0 },
        explain: `<b>int age = 0;</b> — 초기값 0으로 선언.`,
        output: null,
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [{ name: 'age', type: 'int', bytes: 4, val: '0', addr: '0x7fff5200', highlight: true }],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 4,
        },
      },
      {
        line: 'p0',
        type: 'exec',
        explain: `printf("당신의 나이는? ") — 사용자에게 나이를 묻는 메시지.`,
        output: '당신의 나이는? ',
      },
      {
        line: 'scan',
        type: 'exec',
        vars: { age: 30 },
        explain: `scanf("%d", &age) — 사용자가 <b>30</b>을 입력했다고 가정합니다.`,
        output: '→ 입력: 30',
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [
                { name: 'age', type: 'int', bytes: 4, val: '30', addr: '0x7fff5200', highlight: true },
              ],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 4,
        },
      },
      {
        line: 'c1',
        type: 'exec',
        cond: true,
        explain: `<b class="e-cond">검사:</b> age(30) >= 20 ? → <span class="e-exec">참</span>, 성인/어르신 블록으로 진입.`,
        output: null,
      },
      {
        line: 'c2',
        type: 'exec',
        cond: false,
        explain: `<b class="e-cond">내부 if:</b> age(30) >= 65 ? → <span class="e-skip">거짓</span>, else로 이동.`,
        output: null,
      },
      {
        line: 'p2',
        type: 'exec',
        explain: `printf("당신은 성인입니다.\\n") — 20 이상 65 미만이므로 성인으로 분류.`,
        output: '당신은 성인입니다.',
      },
      {
        line: 'ret',
        type: 'exec',
        explain: `<b>return 0;</b> — 프로그램 종료, 스택 프레임 해제.`,
        output: null,
        memViz: { stack: [], heap: [], totalBytes: 0, released: 'main 프레임 해제' },
      },
    ]
  },

  // ── 06arithswitch: 사칙연산 ───────────────────────────
  arithswitch: {
    name: '06arithswitch.c',
    title: 'switch (사칙연산 계산기)',
    varTypes: { x: 'double', y: 'double', result: 'double', op: 'int' },
    concept: `<b>switch</b> — 정수값에 따라 여러 case 분기.<br>
<code>break</code> 없으면 다음 case로 fall-through!<br>
1→+, 2→-, 3→*, 4→/`,
    vars: { x: null, y: null, result: null, op: null },
    baseAddr: { op: '0x7fff5200', x: '0x7fff5208', y: '0x7fff5210', result: '0x7fff5218' },
    code: [
      { text: `<span class="pp">#define</span> _CRT_SECURE_NO_WARNINGS`, blank: true },
      { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
      { text: ``, blank: true },
      { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
      { id: 'decl', text: `    <span class="ty">double</span> <span class="vr">x</span>, <span class="vr">y</span>, <span class="vr">result</span>;` },
      { id: 'decl2', text: `    <span class="ty">int</span> <span class="vr">op</span>;` },
      { id: 'p0', text: `    <span class="fn-c">printf</span>(<span class="st">"두 실수 입력: "</span>);` },
      { id: 'scanXY', text: `    <span class="fn-c">scanf</span>(<span class="st">"%lf %lf"</span>, &<span class="vr">x</span>, &<span class="vr">y</span>);` },
      { id: 'p1', text: `    <span class="fn-c">printf</span>(<span class="st">"연산종류 번호선택 1(+), 2(-), 3(*), 4(/): "</span>);` },
      { id: 'scanOp', text: `    <span class="fn-c">scanf</span>(<span class="st">"%d"</span>, &<span class="vr">op</span>);` },
      { text: ``, blank: true },
      { id: 'sw', text: `    <span class="kw">switch</span> (<span class="vr">op</span>)` },
      { id: 'swb', text: `    {`, blank: true },
      { id: 'c1', text: `        <span class="kw">case</span> <span class="nm">1</span>: <span class="fn-c">printf</span>(<span class="st">"%.2f + %.2f = %.2f\\n"</span>, <span class="vr">x</span>, <span class="vr">y</span>, <span class="vr">x</span> + <span class="vr">y</span>); <span class="kw">break</span>;` },
      { id: 'c2', text: `        <span class="kw">case</span> <span class="nm">2</span>: <span class="fn-c">printf</span>(<span class="st">"%.2f - %.2f = %.2f\\n"</span>, <span class="vr">x</span>, <span class="vr">y</span>, <span class="vr">x</span> - <span class="vr">y</span>); <span class="kw">break</span>;` },
      { id: 'c3', text: `        <span class="kw">case</span> <span class="nm">3</span>: <span class="fn-c">printf</span>(<span class="st">"%.2f * %.2f = %.2f\\n"</span>, <span class="vr">x</span>, <span class="vr">y</span>, <span class="vr">x</span> * <span class="vr">y</span>); <span class="kw">break</span>;` },
      { id: 'c4', text: `        <span class="kw">case</span> <span class="nm">4</span>: <span class="fn-c">printf</span>(<span class="st">"%.2f / %.2f = %.2f\\n"</span>, <span class="vr">x</span>, <span class="vr">y</span>, <span class="vr">x</span> / <span class="vr">y</span>); <span class="kw">break</span>;` },
      { id: 'def', text: `        <span class="kw">default</span>: <span class="fn-c">printf</span>(<span class="st">"번호를 잘못 선택했습니다.\\n"</span>); <span class="kw">break</span>;` },
      { text: `    }`, blank: true },
      { text: ``, blank: true },
      { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text: `}`, blank: true },
    ],
    steps: [
      {
        line: 'decl',
        type: 'exec',
        vars: { x: '???', y: '???', result: '???' },
        explain: `<b>double x, y, result;</b> — 두 실수와 결과를 저장할 변수입니다.`,
        output: null,
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [
                { name: 'x', type: 'double', bytes: 8, val: '???', addr: '0x7fff5208', highlight: true },
                { name: 'y', type: 'double', bytes: 8, val: '???', addr: '0x7fff5210', highlight: true },
                { name: 'result', type: 'double', bytes: 8, val: '???', addr: '0x7fff5218', highlight: true },
              ],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 24,
        },
      },
      {
        line: 'decl2',
        type: 'exec',
        vars: { op: '???' },
        explain: `<b>int op;</b> — 연산 종류(1~4)를 나타내는 정수.`,
        output: null,
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [
                { name: 'op', type: 'int', bytes: 4, val: '???', addr: '0x7fff5200', highlight: true },
                { name: 'x', type: 'double', bytes: 8, val: '???', addr: '0x7fff5208', highlight: true },
                { name: 'y', type: 'double', bytes: 8, val: '???', addr: '0x7fff5210', highlight: true },
                { name: 'result', type: 'double', bytes: 8, val: '???', addr: '0x7fff5218', highlight: true },
              ],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 28,
        },
      },
      {
        line: 'p0',
        type: 'exec',
        explain: `printf("두 실수 입력: ") — 두 실수를 입력받기 위한 프롬프트.`,
        output: '두 실수 입력: ',
      },
      {
        line: 'scanXY',
        type: 'exec',
        vars: { x: 10.0, y: 3.0, result: '???', op: '???' },
        explain: `scanf("%lf %lf", &x, &y) — 사용자가 <b>10 3</b>을 입력했다고 가정합니다.`,
        output: '→ 입력: 10 3',
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [
                { name: 'op', type: 'int', bytes: 4, val: '???', addr: '0x7fff5200', highlight: false },
                { name: 'x', type: 'double', bytes: 8, val: '10.0', addr: '0x7fff5208', highlight: true },
                { name: 'y', type: 'double', bytes: 8, val: '3.0', addr: '0x7fff5210', highlight: true },
                { name: 'result', type: 'double', bytes: 8, val: '???', addr: '0x7fff5218', highlight: false },
              ],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 28,
        },
      },
      {
        line: 'p1',
        type: 'exec',
        explain: `printf("연산종류 번호선택 1(+), 2(-), 3(*), 4(/): ") — 연산 종류 선택 안내.`,
        output: '연산종류 번호선택 1(+), 2(-), 3(*), 4(/): ',
      },
      {
        line: 'scanOp',
        type: 'exec',
        vars: { x: 10.0, y: 3.0, result: '???', op: 1 },
        explain: `scanf("%d", &op) — 사용자가 <b>1</b>(덧셈)을 선택했다고 가정합니다.`,
        output: '→ 입력: 1',
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [
                { name: 'op', type: 'int', bytes: 4, val: '1', addr: '0x7fff5200', highlight: true },
                { name: 'x', type: 'double', bytes: 8, val: '10.0', addr: '0x7fff5208', highlight: false },
                { name: 'y', type: 'double', bytes: 8, val: '3.0', addr: '0x7fff5210', highlight: false },
                { name: 'result', type: 'double', bytes: 8, val: '???', addr: '0x7fff5218', highlight: false },
              ],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 28,
        },
      },
      {
        line: 'sw',
        type: 'exec',
        explain: `<b class="e-cond">switch(op)</b> — op(1) 값으로 해당 case를 찾습니다.`,
        output: null,
      },
      {
        line: 'c1',
        type: 'exec',
        explain: `<span class="e-exec">case 1:</span> printf("%.2f + %.2f = %.2f", x, y, x+y) → 10.00 + 3.00 = 13.00 출력.`,
        output: '10.00 + 3.00 = 13.00',
      },
      {
        line: 'ret',
        type: 'exec',
        explain: `<b>return 0;</b> — 프로그램 종료.`,
        output: null,
        memViz: { stack: [], heap: [], totalBytes: 0, released: 'main 프레임 해제' },
      },
    ]
  },

  // ── 07seasonswitch: 월→계절 ───────────────────────────
  seasonswitch: {
    name: '07seasonswitch.c',
    title: 'switch (월→계절)',
    varTypes: { month: 'int' },
    concept: `<b>switch</b>에서 여러 <code>case</code>를 한 블록에 이어서 쓰면<br>
<b class="g">같은 동작을 공유</b>하는 패턴을 만들 수 있습니다.<br>
4·5 → 봄, 6·7·8 → 여름, 9·10·11 → 가을, 12·1·2·3 → 겨울.`,
    vars: { month: null },
    baseAddr: { month: '0x7fff5200' },
    code: [
      { text: `<span class="pp">#define</span> _CRT_SECURE_NO_WARNINGS`, blank: true },
      { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
      { text: ``, blank: true },
      { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
      { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">month</span>;` },
      { id: 'p0', text: `    <span class="fn-c">printf</span>(<span class="st">"월(month)을 입력: "</span>);` },
      { id: 'scan', text: `    <span class="fn-c">scanf</span>(<span class="st">"%d"</span>, &<span class="vr">month</span>);` },
      { text: ``, blank: true },
      { id: 'sw', text: `    <span class="kw">switch</span> (<span class="vr">month</span>)` },
      { id: 'swb', text: `    {`, blank: true },
      { id: 'c1', text: `        <span class="kw">case</span> <span class="nm">4</span>: <span class="kw">case</span> <span class="nm">5</span>:` },
      { id: 'p1', text: `            <span class="fn-c">printf</span>(<span class="st">"%d월은 봄입니다.\\n"</span>, <span class="vr">month</span>); <span class="kw">break</span>;` },
      { id: 'c2', text: `        <span class="kw">case</span> <span class="nm">6</span>: <span class="kw">case</span> <span class="nm">7</span>: <span class="kw">case</span> <span class="nm">8</span>:` },
      { id: 'p2', text: `            <span class="fn-c">printf</span>(<span class="st">"%d월은 여름입니다.\\n"</span>, <span class="vr">month</span>); <span class="kw">break</span>;` },
      { id: 'c3', text: `        <span class="kw">case</span> <span class="nm">9</span>: <span class="kw">case</span> <span class="nm">10</span>: <span class="kw">case</span> <span class="nm">11</span>:` },
      { id: 'p3', text: `            <span class="fn-c">printf</span>(<span class="st">"%d월은 가을입니다.\\n"</span>, <span class="vr">month</span>); <span class="kw">break</span>;` },
      { id: 'c4', text: `        <span class="kw">case</span> <span class="nm">12</span>: <span class="kw">case</span> <span class="nm">1</span>: <span class="kw">case</span> <span class="nm">2</span>: <span class="kw">case</span> <span class="nm">3</span>:` },
      { id: 'p4', text: `            <span class="fn-c">printf</span>(<span class="st">"%d월은 겨울입니다.\\n"</span>, <span class="vr">month</span>); <span class="kw">break</span>;` },
      { id: 'def', text: `        <span class="kw">default</span>:` },
      { id: 'p5', text: `            <span class="fn-c">printf</span>(<span class="st">"월(month)을 잘못 입력했습니다.\\n"</span>);` },
      { text: `    }`, blank: true },
      { text: ``, blank: true },
      { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text: `}`, blank: true },
    ],
    steps: [
      {
        line: 'decl',
        type: 'exec',
        vars: { month: '???' },
        explain: `<b>int month;</b> — 월을 저장할 정수 변수입니다.`,
        output: null,
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [{ name: 'month', type: 'int', bytes: 4, val: '???', addr: '0x7fff5200', highlight: true }],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 4,
        },
      },
      {
        line: 'p0',
        type: 'exec',
        explain: `printf("월(month)을 입력: ") — 사용자에게 월을 입력받습니다.`,
        output: '월(month)을 입력: ',
      },
      {
        line: 'scan',
        type: 'exec',
        vars: { month: 8 },
        explain: `scanf("%d", &month) — 사용자가 <b>8</b>을 입력했다고 가정합니다.`,
        output: '→ 입력: 8',
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [
                { name: 'month', type: 'int', bytes: 4, val: '8', addr: '0x7fff5200', highlight: true },
              ],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 4,
        },
      },
      {
        line: 'sw',
        type: 'exec',
        explain: `<b>switch(month)</b> — month(8)에 따라 알맞은 case 블록으로 진입합니다.`,
        output: null,
      },
      {
        line: 'c1',
        type: 'skip',
        explain: `<b>case 4, 5:</b> month(8)은 4나 5가 아니므로 이 블록은 <span class="e-skip">건너뜁니다</span>.`,
        output: null,
      },
      {
        line: 'p1',
        type: 'skip',
        explain: `봄 출력은 실행되지 않습니다.`,
        output: null,
      },
      {
        line: 'c2',
        type: 'exec',
        explain: `<b>case 6, 7, 8:</b> 8이 포함되므로 이 블록이 선택됩니다.`,
        output: null,
      },
      {
        line: 'p2',
        type: 'exec',
        explain: `printf("%d월은 여름입니다.\\n", month) — "8월은 여름입니다."를 출력합니다.`,
        output: '8월은 여름입니다.',
      },
      {
        line: 'ret',
        type: 'exec',
        explain: `<b>return 0;</b> — 프로그램 종료, 스택 프레임 해제.`,
        output: null,
        memViz: { stack: [], heap: [], totalBytes: 0, released: 'main 프레임 해제' },
      },
    ],
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
      { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
      { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">score</span>;` },
      { id: 'p0', text: `    <span class="fn-c">printf</span>(<span class="st">"점수(0에서 100사이) 입력: "</span>);` },
      { id: 'scan', text: `    <span class="fn-c">scanf</span>(<span class="st">"%d"</span>, &<span class="vr">score</span>);` },
      { text: ``, blank: true },
      { id: 'cRange', text: `    <span class="kw">if</span> (<span class="vr">score</span> < <span class="nm">0</span> || <span class="vr">score</span> > <span class="nm">100</span>)` },
      { id: 'bRange', text: `    {`, blank: true },
      { id: 'pErr', text: `        <span class="fn-c">printf</span>(<span class="st">"점수 입력이 잘못되었습니다.\\n"</span>);` },
      { id: 'ret0', text: `        <span class="kw">return</span> <span class="nm">0</span>;` },
      { id: 'bRangeE', text: `    }`, blank: true },
      { text: ``, blank: true },
      { id: 'sw', text: `    <span class="kw">switch</span> (<span class="vr">score</span> / <span class="nm">10</span>)   <span class="cm">// 90점대 → 9, 80점대 → 8 ...</span>` },
      { id: 'swb', text: `    {`, blank: true },
      { id: 'def', text: `        <span class="kw">default</span>:          <span class="fn-c">printf</span>(<span class="st">"점수가 %d 점으로 성적이 F 입니다.\\n"</span>, <span class="vr">score</span>); <span class="kw">break</span>;` },
      { id: 'c9', text: `        <span class="kw">case</span> <span class="nm">10</span>: <span class="kw">case</span> <span class="nm">9</span>:  <span class="fn-c">printf</span>(<span class="st">"점수가 %d 점으로 성적이 A 입니다.\\n"</span>, <span class="vr">score</span>); <span class="kw">break</span>;` },
      { id: 'c8', text: `        <span class="kw">case</span> <span class="nm">8</span>:           <span class="fn-c">printf</span>(<span class="st">"점수가 %d 점으로 성적이 B 입니다.\\n"</span>, <span class="vr">score</span>); <span class="kw">break</span>;` },
      { id: 'c7', text: `        <span class="kw">case</span> <span class="nm">7</span>:           <span class="fn-c">printf</span>(<span class="st">"점수가 %d 점으로 성적이 C 입니다.\\n"</span>, <span class="vr">score</span>); <span class="kw">break</span>;` },
      { id: 'c6', text: `        <span class="kw">case</span> <span class="nm">6</span>:           <span class="fn-c">printf</span>(<span class="st">"점수가 %d 점으로 성적이 D 입니다.\\n"</span>, <span class="vr">score</span>); <span class="kw">break</span>;` },
      { text: `    }`, blank: true },
      { text: ``, blank: true },
      { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text: `}`, blank: true },
    ],
    steps: [
      {
        line: 'decl',
        type: 'exec',
        vars: { score: '???' },
        explain: `<b>int score;</b> — 점수를 저장할 정수 변수입니다.`,
        output: null,
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [{ name: 'score', type: 'int', bytes: 4, val: '???', addr: '0x7fff5200', highlight: true }],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 4,
        },
      },
      {
        line: 'p0',
        type: 'exec',
        explain: `printf("점수(0에서 100사이) 입력: ") — 점수 입력 안내.`,
        output: '점수(0에서 100사이) 입력: ',
      },
      {
        line: 'scan',
        type: 'exec',
        vars: { score: 85 },
        explain: `scanf("%d", &score) — 사용자가 <b>85</b>를 입력했다고 가정합니다.`,
        output: '→ 입력: 85',
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [
                { name: 'score', type: 'int', bytes: 4, val: '85', addr: '0x7fff5200', highlight: true },
              ],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 4,
        },
      },
      {
        line: 'cRange',
        type: 'exec',
        cond: false,
        explain: `<b class="e-cond">범위 검사:</b> score(85) < 0 || 85 > 100 ? → <span class="e-skip">거짓</span>, 정상 범위이므로 계속 진행.`,
        output: null,
      },
      {
        line: 'sw',
        type: 'exec',
        explain: `<b>switch(score/10)</b> — 85 / 10 = <b>8</b> (정수 나눗셈) 이므로 case 8로 분기.`,
        output: null,
      },
      {
        line: 'c8',
        type: 'exec',
        explain: `<span class="e-exec">case 8:</span> "점수가 85 점으로 성적이 B 입니다."를 출력합니다.`,
        output: '점수가 85 점으로 성적이 B 입니다.',
      },
      {
        line: 'ret',
        type: 'exec',
        explain: `<b>return 0;</b> — 프로그램 종료, 스택 프레임 해제.`,
        output: null,
        memViz: { stack: [], heap: [], totalBytes: 0, released: 'main 프레임 해제' },
      },
    ]
  },

  // ── 08scoreswitch: 조건 연산자 ─────────────────────────
  ternary_ops: {
    name: '08scoreswitch.c',
    title: '조건 연산자 (최대/최소/절대값/홀짝)',
    varTypes: { a: 'int', b: 'int' },
    concept: `조건 연산자 <code>조건 ? 값1 : 값2</code>로<br>
<b>최대값, 최소값, 절대값, 홀짝</b>을 모두 한 줄로 계산할 수 있습니다.<br>
<code>printf</code> 자체를 선택하거나, <code>%s</code>에 넣을 문자열을 선택하는 두 가지 패턴을 함께 보여줍니다.`,
    vars: { a: null, b: null },
    baseAddr: { a: '0x7fff5204', b: '0x7fff5200' },
    code: [
      { text: `<span class="pp">#define</span> _CRT_SECURE_NO_WARNINGS`, blank: true },
      { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
      { text: ``, blank: true },
      { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
      { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">a</span> = <span class="nm">0</span>, <span class="vr">b</span> = <span class="nm">0</span>;` },
      { id: 'p0', text: `    <span class="fn-c">printf</span>(<span class="st">"두 정수 입력 >> "</span>);` },
      { id: 'scan', text: `    <span class="fn-c">scanf</span>(<span class="st">"%d%d"</span>, &<span class="vr">a</span>, &<span class="vr">b</span>);` },
      { text: ``, blank: true },
      { id: 'max', text: `    <span class="fn-c">printf</span>(<span class="st">"최대값: %d "</span>, (<span class="vr">a</span> > <span class="vr">b</span>) ? <span class="vr">a</span> : <span class="vr">b</span>);` },
      { id: 'min', text: `    <span class="fn-c">printf</span>(<span class="st">"최소값: %d\\n"</span>, (<span class="vr">a</span> < <span class="vr">b</span>) ? <span class="vr">a</span> : <span class="vr">b</span>);` },
      { id: 'abs_a', text: `    <span class="fn-c">printf</span>(<span class="st">"절대값: %d "</span>, (<span class="vr">a</span> > <span class="nm">0</span>) ? <span class="vr">a</span> : -<span class="vr">a</span>);` },
      { id: 'abs_b', text: `    <span class="fn-c">printf</span>(<span class="st">"절대값: %d\\n"</span>, (<span class="vr">b</span> > <span class="nm">0</span>) ? <span class="vr">b</span> : -<span class="vr">b</span>);` },
      { text: ``, blank: true },
      { id: 'odd_even_a', text: `    ((<span class="vr">a</span> % <span class="nm">2</span>) == <span class="nm">0</span>) ? <span class="fn-c">printf</span>(<span class="st">"짝수 "</span>) : <span class="fn-c">printf</span>(<span class="st">"홀수 "</span>);` },
      { id: 'odd_even_b', text: `    <span class="fn-c">printf</span>(<span class="st">"%s\\n"</span>, ((<span class="vr">b</span> % <span class="nm">2</span>) == <span class="nm">0</span>) ? <span class="st">"짝수"</span> : <span class="st">"홀수"</span>);` },
      { text: ``, blank: true },
      { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text: `}`, blank: true },
    ],
    steps: [
      {
        line: 'decl',
        type: 'exec',
        vars: { a: 0, b: 0 },
        explain: `<b>int a=0, b=0;</b> — 두 정수를 0으로 초기화합니다.`,
        output: null,
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [
                { name: 'a', type: 'int', bytes: 4, val: '0', addr: '0x7fff5204', highlight: true },
                { name: 'b', type: 'int', bytes: 4, val: '0', addr: '0x7fff5200', highlight: true },
              ],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 8,
        },
      },
      {
        line: 'p0',
        type: 'exec',
        explain: `printf("두 정수 입력 >> ") — a, b 입력 프롬프트.`,
        output: '두 정수 입력 >> ',
      },
      {
        line: 'scan',
        type: 'exec',
        vars: { a: 7, b: -4 },
        explain: `scanf("%d%d", &a, &b) — 사용자가 <b>7 -4</b>를 입력했다고 가정합니다.`,
        output: '→ 입력: 7 -4',
        memViz: {
          stack: [
            {
              fn: 'main',
              color: 'main',
              vars: [
                { name: 'a', type: 'int', bytes: 4, val: '7', addr: '0x7fff5204', highlight: true },
                { name: 'b', type: 'int', bytes: 4, val: '-4', addr: '0x7fff5200', highlight: true },
              ],
              retAddr: '0x400640',
            },
          ],
          heap: [],
          totalBytes: 8,
        },
      },
      {
        line: 'max',
        type: 'exec',
        explain: `최대값: (a > b) ? a : b → (7 > -4) 이므로 <b>7</b>.`,
        output: '최대값: 7 ',
      },
      {
        line: 'min',
        type: 'exec',
        explain: `최소값: (a < b) ? a : b → (7 < -4)는 거짓이므로 <b>-4</b>.`,
        output: '최소값: -4',
      },
      {
        line: 'abs_a',
        type: 'exec',
        explain: `a의 절대값: (a > 0) ? a : -a → a=7 > 0 이므로 그대로 <b>7</b>.`,
        output: '절대값: 7 ',
      },
      {
        line: 'abs_b',
        type: 'exec',
        explain: `b의 절대값: (b > 0) ? b : -b → b=-4 ≤ 0 이므로 -(-4)=<b>4</b>.`,
        output: '절대값: 4',
      },
      {
        line: 'odd_even_a',
        type: 'exec',
        explain: `((a % 2) == 0) ? printf("짝수 ") : printf("홀수 ") → 7%2=1 이므로 <b>"홀수 "</b> 출력.`,
        output: '홀수 ',
      },
      {
        line: 'odd_even_b',
        type: 'exec',
        explain: `((b % 2) == 0) ? "짝수" : "홀수" → -4%2=0 이므로 문자열 <b>"짝수"</b>를 선택해 "%s"로 출력.`,
        output: '짝수',
      },
      {
        line: 'ret',
        type: 'exec',
        explain: `<b>return 0;</b> — 프로그램 종료.`,
        output: null,
      },
    ],
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
      { line: 'end', type: 'exec', explain: `<b>프로그램 종료</b> — main 함수 스택 프레임 해제.`, output: null,
        memViz: { stack: [], heap: [], totalBytes: 0, released: 'main 프레임 해제' } },
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
      { line: 'end', type: 'exec', explain: `<b>프로그램 종료</b> — main 함수 스택 프레임 해제.`, output: null,
        memViz: { stack: [], heap: [], totalBytes: 0, released: 'main 프레임 해제' } },
    ]
  },
};
