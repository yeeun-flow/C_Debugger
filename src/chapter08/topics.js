// ══════════════════════════════════════════════════════════
//  8장 배열 — 메모리 적재(연속 블록)와 출력 동기화를 강조
//  원본 C: src/chapter08/*.c
// ══════════════════════════════════════════════════════════
(function () {
  function SM(vars, tb) {
    const total = tb != null ? tb : 16 + vars.reduce((a, v) => a + v.bytes, 0);
    return { stack: [{ fn: 'main', color: 'main', vars: vars.slice(), retAddr: '0x400640' }], heap: [], totalBytes: total };
  }
  /** 1차원 int 배열 score[0..n-1], base 주소 연속 */
  function SC(n, vals, hi) {
    const base = 0x7fff5200;
    const out = [];
    for (let k = 0; k < n; k++) {
      out.push({
        name: 'score[' + k + ']',
        type: 'int',
        bytes: 4,
        val: vals[k],
        addr: '0x' + (base + k * 4).toString(16),
        highlight: hi === k,
      });
    }
    return out;
  }
  /** 2차원 int td[r][c] row-major */
  function TD2(r, c, vals, hi) {
    const base = 0x7fff5200;
    const out = [];
    let idx = 0;
    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        const flat = i * c + j;
        out.push({
          name: 'td[' + i + '][' + j + ']',
          type: 'int',
          bytes: 4,
          val: vals[idx++],
          addr: '0x' + (base + flat * 4).toString(16),
          highlight: hi === flat,
        });
      }
    }
    return out;
  }
  /** 2차원 score[row][col] 4x2 */
  function TD42(vals) {
    const base = 0x7fff5200;
    const out = [];
    let idx = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 2; j++) {
        const flat = i * 2 + j;
        out.push({
          name: 'score[' + i + '][' + j + ']',
          type: 'int',
          bytes: 4,
          val: vals[idx++],
          addr: '0x' + (base + flat * 4).toString(16),
          highlight: false,
        });
      }
    }
    return out;
  }
  const RET = { stack: [], heap: [], totalBytes: 0, released: 'main 프레임 해제' };

  window.TOPIC_META = [
    { group: '1차원 배열', key: 'decarray', label: '01decarray', sub: '선언·적재·쓰레기 값', icon: '📊', isSub: false },
    { group: '1차원 배열', key: 'initarray', label: '02initarray', sub: '초기화·합·평균', icon: '📈', isSub: false },
    { group: '2차원 배열', key: 'tdarray', label: '03tdarray', sub: '선언 후 대입', icon: '▦', isSub: false },
    { group: '2차원 배열', key: 'inittdary', label: '04inittdary', sub: '초기화 리스트', icon: '▦', isSub: false },
    { group: '2차원 배열', key: 'tdscore', label: '05tdscore', sub: '성적표·행/열 합', icon: '📝', isSub: false },
    { group: '3차원 배열', key: 'thdary', label: '06thdary', sub: '강좌×학생×과목', icon: '🧊', isSub: false },
    { group: 'sizeof', key: 'arysize', label: '07arysize', sub: '배열 크기·행·열', icon: '📏', isSub: false },
    { group: '실습', key: 'lab1input', label: 'lab1inputarray', sub: '0 입력 종료', icon: '⌨', isSub: false },
    { group: '실습', key: 'lab2aryprint', label: 'lab2aryprint', sub: '2차원 출력', icon: '🖨', isSub: false },
  ];

  window.TOPICS = {

    decarray: {
      name: '01decarray.c',
      title: '배열 선언과 스택에의 적재',
      /* printf("%d  ",…) 조각을 터미널처럼 한 줄로 이어 표시 */
      outputConcat: true,
      varTypes: { 'score[0]': 'int', 'score[1]': 'int', 'score[2]': 'int', 'score[3]': 'int', 'score[4]': 'int', i: 'int' },
      concept: `<b>int score[SIZE];</b> — 연속된 <b>int × SIZE</b> 바이트가 스택(또는 지역 프레임)에 잡힙니다.<br>
<b>초기화하지 않은 원소</b>에는 <b>쓰레기 값</b>이 들어 있을 수 있습니다(구현·빌드에 따라 다름).<br>
이 시뮬에서는 <code>score[3]</code>을 대입하지 않은 상태를 <b>???</b>로 표시합니다.<br>
💡 Step마다 <b>메모리 맵</b>에서 주소가 연속으로 쌓이는지 확인하세요.`,
      vars: { 'score[0]': null, 'score[1]': null, 'score[2]': null, 'score[3]': null, 'score[4]': null, i: null },
      code: [
        { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
        { text: ``, blank: true },
        { text: `<span class="pp">#define</span> SIZE <span class="nm">5</span>`, blank: true },
        { text: ``, blank: true },
        { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
        { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">score</span>[SIZE];` },
        { text: ``, blank: true },
        { id: 'a0', text: `    <span class="vr">score</span>[<span class="nm">0</span>] = <span class="nm">78</span>;` },
        { id: 'a1', text: `    <span class="vr">score</span>[<span class="nm">1</span>] = <span class="nm">97</span>;` },
        { id: 'a2', text: `    <span class="vr">score</span>[<span class="nm">2</span>] = <span class="nm">85</span>;` },
        { id: 'a4', text: `    <span class="vr">score</span>[<span class="nm">4</span>] = <span class="nm">91</span>;` },
        { text: ``, blank: true },
        { id: 'forh', text: `    <span class="kw">for</span> (<span class="ty">int</span> <span class="vr">i</span> = <span class="nm">0</span>; <span class="vr">i</span> &lt; SIZE; <span class="vr">i</span>++)` },
        { id: 'pr', text: `        <span class="fn-c">printf</span>(<span class="st">"%d  "</span>, <span class="vr">score</span>[<span class="vr">i</span>]);`, indent: 1 },
        { id: 'nl', text: `    <span class="fn-c">printf</span>(<span class="st">"\\n"</span>);` },
        { text: ``, blank: true },
        { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
        { text: `}`, blank: true },
      ],
      steps: [
        { line: 'decl', type: 'exec', vars: { 'score[0]': '???', 'score[1]': '???', 'score[2]': '???', 'score[3]': '???', 'score[4]': '???' }, explain: `<b>int score[SIZE];</b> — <b>5×int</b> 연속 블록이 프레임에 할당됩니다. 아직 값은 정해지지 않았습니다.`, output: null, memViz: SM(SC(5, ['???', '???', '???', '???', '???'], null)) },
        { line: 'a0', type: 'exec', vars: { 'score[0]': 78, 'score[1]': '???', 'score[2]': '???', 'score[3]': '???', 'score[4]': '???' }, explain: `<b>score[0] = 78</b> — 첫 번째 원소에 값 기록.`, output: null, memViz: SM(SC(5, [78, '???', '???', '???', '???'], 0)) },
        { line: 'a1', type: 'exec', vars: { 'score[1]': 97 }, explain: `<b>score[1] = 97</b>`, output: null, memViz: SM(SC(5, [78, 97, '???', '???', '???'], 1)) },
        { line: 'a2', type: 'exec', vars: { 'score[2]': 85 }, explain: `<b>score[2] = 85</b>`, output: null, memViz: SM(SC(5, [78, 97, 85, '???', '???'], 2)) },
        { line: 'a4', type: 'exec', vars: { 'score[4]': 91 }, explain: `<b>score[4] = 91</b> — <code>score[3]</code>은 여전히 쓰레기(미초기화).`, output: null, memViz: SM(SC(5, [78, 97, 85, '???', 91], 4)) },
        { line: 'forh', type: 'exec', vars: { i: 0 }, explain: `<b>for</b> — <code>i=0</code>, 조건 <code>i &lt; 5</code> 참, 본문으로.`, output: null, memViz: SM(SC(5, [78, 97, 85, '???', 91], null).concat([{ name: 'i', type: 'int', bytes: 4, val: 0, addr: '0x7fff5214', highlight: true }])) },
        { line: 'pr', type: 'exec', explain: `printf — <code>i==0</code>, <code>score[0]</code> 출력.`, output: '78  ' },
        { line: 'forh', type: 'exec', vars: { i: 1 }, explain: `i++, 조건 참.`, output: null, memViz: SM(SC(5, [78, 97, 85, '???', 91], null).concat([{ name: 'i', type: 'int', bytes: 4, val: 1, addr: '0x7fff5214', highlight: true }])) },
        { line: 'pr', type: 'exec', explain: `i==1`, output: '97  ' },
        { line: 'forh', type: 'exec', vars: { i: 2 }, explain: `i==2`, output: null, memViz: SM(SC(5, [78, 97, 85, '???', 91], null).concat([{ name: 'i', type: 'int', bytes: 4, val: 2, addr: '0x7fff5214', highlight: true }])) },
        { line: 'pr', type: 'exec', explain: `i==2`, output: '85  ' },
        { line: 'forh', type: 'exec', vars: { i: 3 }, explain: `i==3 — <b>쓰레기 원소</b> 출력.`, output: null, memViz: SM(SC(5, [78, 97, 85, '???', 91], null).concat([{ name: 'i', type: 'int', bytes: 4, val: 3, addr: '0x7fff5214', highlight: true }])) },
        { line: 'pr', type: 'exec', explain: `printf score[3] (시뮬: <b>32679</b>)`, output: '32679  ' },
        { line: 'forh', type: 'exec', vars: { i: 4 }, explain: `i==4`, output: null, memViz: SM(SC(5, [78, 97, 85, '???', 91], null).concat([{ name: 'i', type: 'int', bytes: 4, val: 4, addr: '0x7fff5214', highlight: true }])) },
        { line: 'pr', type: 'exec', explain: `i==4`, output: '91  ' },
        { line: 'forh', type: 'exec', vars: { i: 5 }, explain: `i++ → 5, 조건 거짓 — 루프 종료.`, output: null, memViz: SM(SC(5, [78, 97, 85, '???', 91], null).concat([{ name: 'i', type: 'int', bytes: 4, val: 5, addr: '0x7fff5214', highlight: true }])) },
        { line: 'nl', type: 'exec', explain: `printf("\\n") — 줄 바꿈.`, output: '\n' },
        { line: 'ret', type: 'exec', explain: `<b>return 0</b> — 프레임 해제.`, output: null, memViz: RET },
      ],
    },

    initarray: {
      name: '02initarray.c',
      title: '배열 초기화와 누적 합',
      varTypes: { 'score[0]': 'double', 'score[1]': 'double', 'score[2]': 'double', 'score[3]': 'double', 'score[4]': 'double', 'score[5]': 'double', sum: 'double', i: 'int' },
      concept: `<b>double score[] = { ... };</b> — 리스트 순서대로 <b>연속 메모리</b>에 초기값이 채워집니다.<br>
<b>sum</b>은 별도의 스칼라 변수로, 배열과 인접한 주소에 잡힙니다(교육용 배치).<br>
for 루프에서 <b>sum += score[i]</b>로 <b>누적 적재</b>를 확인하세요.`,
      vars: { sum: null, i: null },
      code: [
        { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
        { text: `<span class="pp">#define</span> SIZE <span class="nm">6</span>`, blank: true },
        { text: ``, blank: true },
        { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
        { id: 'decl', text: `    <span class="ty">double</span> <span class="vr">score</span>[] = { <span class="nm">89.3</span>, <span class="nm">79.2</span>, <span class="nm">84.83</span>, <span class="nm">76.8</span>, <span class="nm">92.52</span>, <span class="nm">97.4</span> };` },
        { id: 'sum0', text: `    <span class="ty">double</span> <span class="vr">sum</span> = <span class="nm">0</span>;` },
        { text: ``, blank: true },
        { id: 'forh', text: `    <span class="kw">for</span> (<span class="ty">int</span> <span class="vr">i</span> = <span class="nm">0</span>; <span class="vr">i</span> &lt; SIZE; <span class="vr">i</span>++) {` },
        { id: 'add', text: `        <span class="vr">sum</span> += <span class="vr">score</span>[<span class="vr">i</span>];`, indent: 1 },
        { id: 'pr', text: `        <span class="fn-c">printf</span>(<span class="st">"score[%d] = %.2f\\n"</span>, <span class="vr">i</span>, <span class="vr">score</span>[<span class="vr">i</span>]);`, indent: 1 },
        { text: `    }`, blank: true },
        { id: 'pr2', text: `    <span class="fn-c">printf</span>(<span class="st">"성적의 합은 %.2f이고 평균은 %.2f이다.\\n"</span>, <span class="vr">sum</span>, <span class="vr">sum</span> / SIZE);` },
        { text: ``, blank: true },
        { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
        { text: `}`, blank: true },
      ],
      steps: [
        { line: 'decl', type: 'exec', vars: { 'score[0]': 89.3, 'score[1]': 79.2, 'score[2]': 84.83, 'score[3]': 76.8, 'score[4]': 92.52, 'score[5]': 97.4 }, explain: `초기화 리스트가 <b>연속 double 블록</b>에 기록됩니다.`, output: null, memViz: SM([{ name: 'score[0]', type: 'double', bytes: 8, val: 89.3, addr: '0x7fff5200', highlight: false }, { name: 'score[1]', type: 'double', bytes: 8, val: 79.2, addr: '0x7fff5208', highlight: false }, { name: 'score[2]', type: 'double', bytes: 8, val: 84.83, addr: '0x7fff5210', highlight: false }, { name: 'score[3]', type: 'double', bytes: 8, val: 76.8, addr: '0x7fff5218', highlight: false }, { name: 'score[4]', type: 'double', bytes: 8, val: 92.52, addr: '0x7fff5220', highlight: false }, { name: 'score[5]', type: 'double', bytes: 8, val: 97.4, addr: '0x7fff5228', highlight: false }], 6 * 8 + 16) },
        { line: 'sum0', type: 'exec', vars: { sum: 0 }, explain: `<b>sum = 0</b> — 누적 변수 준비.`, output: null, memViz: SM([{ name: 'score[0]', type: 'double', bytes: 8, val: 89.3, addr: '0x7fff5200', highlight: false }, { name: 'score[1]', type: 'double', bytes: 8, val: 79.2, addr: '0x7fff5208', highlight: false }, { name: 'score[2]', type: 'double', bytes: 8, val: 84.83, addr: '0x7fff5210', highlight: false }, { name: 'score[3]', type: 'double', bytes: 8, val: 76.8, addr: '0x7fff5218', highlight: false }, { name: 'score[4]', type: 'double', bytes: 8, val: 92.52, addr: '0x7fff5220', highlight: false }, { name: 'score[5]', type: 'double', bytes: 8, val: 97.4, addr: '0x7fff5228', highlight: false }, { name: 'sum', type: 'double', bytes: 8, val: 0, addr: '0x7fff5230', highlight: true }], 6 * 8 + 8 + 16) },
        { line: 'forh', type: 'exec', vars: { i: 0 }, explain: `i=0`, output: null },
        { line: 'add', type: 'exec', vars: { sum: 89.3 }, explain: `sum += score[0]`, output: null },
        { line: 'pr', type: 'exec', explain: `printf`, output: 'score[0] = 89.30' },
        { line: 'forh', type: 'exec', vars: { i: 1 }, explain: `i=1`, output: null },
        { line: 'add', type: 'exec', vars: { sum: 168.5 }, explain: `sum += score[1]`, output: null },
        { line: 'pr', type: 'exec', explain: `printf`, output: 'score[1] = 79.20' },
        { line: 'forh', type: 'exec', vars: { i: 2 }, explain: `i=2`, output: null },
        { line: 'add', type: 'exec', vars: { sum: 253.33 }, explain: `sum += score[2]`, output: null },
        { line: 'pr', type: 'exec', explain: `printf`, output: 'score[2] = 84.83' },
        { line: 'forh', type: 'exec', vars: { i: 3 }, explain: `i=3`, output: null },
        { line: 'add', type: 'exec', vars: { sum: 330.13 }, explain: `sum += score[3]`, output: null },
        { line: 'pr', type: 'exec', explain: `printf`, output: 'score[3] = 76.80' },
        { line: 'forh', type: 'exec', vars: { i: 4 }, explain: `i=4`, output: null },
        { line: 'add', type: 'exec', vars: { sum: 422.65 }, explain: `sum += score[4]`, output: null },
        { line: 'pr', type: 'exec', explain: `printf`, output: 'score[4] = 92.52' },
        { line: 'forh', type: 'exec', vars: { i: 5 }, explain: `i=5`, output: null },
        { line: 'add', type: 'exec', vars: { sum: 520.05 }, explain: `sum += score[5]`, output: null },
        { line: 'pr', type: 'exec', explain: `printf`, output: 'score[5] = 97.40' },
        { line: 'forh', type: 'exec', vars: { i: 6 }, explain: `루프 종료 (i=6)`, output: null },
        { line: 'pr2', type: 'exec', explain: `합·평균 출력`, output: '성적의 합은 520.05이고 평균은 86.67이다.' },
        { line: 'ret', type: 'exec', explain: `종료`, output: null, memViz: RET },
      ],
    },

    tdarray: {
      name: '03tdarray.c',
      title: '2차원 배열 — 행 우선 적재',
      varTypes: { 'td[0][0]': 'int', 'td[0][1]': 'int', 'td[0][2]': 'int', 'td[1][0]': 'int', 'td[1][1]': 'int', 'td[1][2]': 'int', i: 'int', j: 'int' },
      concept: `<b>int td[ROWS][COLS];</b> — 메모리에서는 보통 <b>행 우선(row-major)</b>으로 연속 배치됩니다.<br>
<code>td[0][0] … td[0][2]</code> 다음에 <code>td[1][0] …</code> 순으로 주소가 이어집니다.`,
      vars: {},
      code: [
        { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
        { text: `<span class="pp">#define</span> ROWSIZE <span class="nm">2</span>`, blank: true },
        { text: `<span class="pp">#define</span> COLSIZE <span class="nm">3</span>`, blank: true },
        { text: ``, blank: true },
        { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
        { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">td</span>[ROWSIZE][COLSIZE];` },
        { id: 'fill', text: `    <span class="vr">td</span>[<span class="nm">0</span>][<span class="nm">0</span>] = <span class="nm">1</span>; <span class="vr">td</span>[<span class="nm">0</span>][<span class="nm">1</span>] = <span class="nm">2</span>; <span class="vr">td</span>[<span class="nm">0</span>][<span class="nm">2</span>] = <span class="nm">3</span>;` },
        { id: 'fill2', text: `    <span class="vr">td</span>[<span class="nm">1</span>][<span class="nm">0</span>] = <span class="nm">4</span>; <span class="vr">td</span>[<span class="nm">1</span>][<span class="nm">1</span>] = <span class="nm">5</span>; <span class="vr">td</span>[<span class="nm">1</span>][<span class="nm">2</span>] = <span class="nm">6</span>;` },
        { id: 'hdr', text: `    <span class="fn-c">printf</span>(<span class="st">"반목문 for를 이용하여 출력\\n"</span>);` },
        { id: 'fori', text: `    <span class="kw">for</span> (<span class="ty">int</span> <span class="vr">i</span> = <span class="nm">0</span>; <span class="vr">i</span> &lt; ROWSIZE; <span class="vr">i</span>++) {` },
        { id: 'forj', text: `        <span class="kw">for</span> (<span class="ty">int</span> <span class="vr">j</span> = <span class="nm">0</span>; <span class="vr">j</span> &lt; COLSIZE; <span class="vr">j</span>++)`, indent: 1 },
        { id: 'pr', text: `            <span class="fn-c">printf</span>(<span class="st">"td[%d][%d] == %d "</span>, <span class="vr">i</span>, <span class="vr">j</span>, <span class="vr">td</span>[<span class="vr">i</span>][<span class="vr">j</span>]);`, indent: 1 },
        { id: 'nl', text: `        <span class="fn-c">printf</span>(<span class="st">"\\n"</span>);`, indent: 1 },
        { text: `    }`, blank: true },
        { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
        { text: `}`, blank: true },
      ],
      steps: [
        { line: 'decl', type: 'exec', vars: { 'td[0][0]': '???', 'td[0][1]': '???', 'td[0][2]': '???', 'td[1][0]': '???', 'td[1][1]': '???', 'td[1][2]': '???' }, explain: `2×3 int 블록 할당(미초기화).`, output: null, memViz: SM(TD2(2, 3, ['???', '???', '???', '???', '???', '???'], null)) },
        { line: 'fill', type: 'exec', vars: { 'td[0][0]': 1, 'td[0][1]': 2, 'td[0][2]': 3 }, explain: `첫 행 채우기 — 연속 주소에 1,2,3.`, output: null, memViz: SM(TD2(2, 3, [1, 2, 3, '???', '???', '???'], 0)) },
        { line: 'fill2', type: 'exec', vars: { 'td[1][0]': 4, 'td[1][1]': 5, 'td[1][2]': 6 }, explain: `둘째 행 채우기 — 이어서 4,5,6.`, output: null, memViz: SM(TD2(2, 3, [1, 2, 3, 4, 5, 6], 5)) },
        { line: 'hdr', type: 'exec', explain: `제목`, output: '반목문 for를 이용하여 출력' },
        { line: 'fori', type: 'exec', vars: { i: 0, j: 0 }, explain: `i=0, 내부 j 루프 시작`, output: null },
        { line: 'pr', type: 'exec', explain: `td[0][0]`, output: 'td[0][0] == 1 ' },
        { line: 'pr', type: 'exec', explain: `td[0][1]`, output: 'td[0][1] == 2 ' },
        { line: 'pr', type: 'exec', explain: `td[0][2]`, output: 'td[0][2] == 3 ' },
        { line: 'nl', type: 'exec', explain: `행 바꿈`, output: '' },
        { line: 'fori', type: 'exec', vars: { i: 1, j: 0 }, explain: `i=1`, output: null },
        { line: 'pr', type: 'exec', explain: `td[1][0]`, output: 'td[1][0] == 4 ' },
        { line: 'pr', type: 'exec', explain: `td[1][1]`, output: 'td[1][1] == 5 ' },
        { line: 'pr', type: 'exec', explain: `td[1][2]`, output: 'td[1][2] == 6 ' },
        { line: 'nl', type: 'exec', explain: `행 바꿈`, output: '' },
        { line: 'ret', type: 'exec', explain: `종료`, output: null, memViz: RET },
      ],
    },

    inittdary: {
      name: '04inittdary.c',
      title: '2차원 배열 초기화 리스트',
      varTypes: { 'td[0][0]': 'int', 'td[0][1]': 'int', 'td[0][2]': 'int', 'td[1][0]': 'int', 'td[1][1]': 'int', 'td[1][2]': 'int' },
      concept: `<b>int td[][3] = { {1}, {1,2,3} };</b> — 첫 행은 <b>1만</b> 주면 나머지는 <b>0</b>으로 채워집니다(C 규칙).`,
      vars: {},
      code: [
        { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
        { text: `<span class="pp">#define</span> ROWSIZE <span class="nm">2</span>`, blank: true },
        { text: `<span class="pp">#define</span> COLSIZE <span class="nm">3</span>`, blank: true },
        { text: ``, blank: true },
        { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
        { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">td</span>[][<span class="nm">3</span>] = { { <span class="nm">1</span> }, { <span class="nm">1</span>, <span class="nm">2</span>, <span class="nm">3</span> } };` },
        { id: 'hdr', text: `    <span class="fn-c">printf</span>(<span class="st">"반목문 for를 이용하여 출력\\n"</span>);` },
        { id: 'fori', text: `    <span class="kw">for</span> (<span class="ty">int</span> <span class="vr">i</span> = <span class="nm">0</span>; <span class="vr">i</span> &lt; ROWSIZE; <span class="vr">i</span>++) {` },
        { id: 'forj', text: `        <span class="kw">for</span> (<span class="ty">int</span> <span class="vr">j</span> = <span class="nm">0</span>; <span class="vr">j</span> &lt; COLSIZE; <span class="vr">j</span>++)`, indent: 1 },
        { id: 'pr', text: `            <span class="fn-c">printf</span>(<span class="st">"%d "</span>, <span class="vr">td</span>[<span class="vr">i</span>][<span class="vr">j</span>]);`, indent: 1 },
        { id: 'nl', text: `        <span class="fn-c">printf</span>(<span class="st">"\\n"</span>);`, indent: 1 },
        { text: `    }`, blank: true },
        { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
        { text: `}`, blank: true },
      ],
      steps: [
        { line: 'decl', type: 'exec', vars: { 'td[0][0]': 1, 'td[0][1]': 0, 'td[0][2]': 0, 'td[1][0]': 1, 'td[1][1]': 2, 'td[1][2]': 3 }, explain: `초기화 리스트가 <b>행 우선</b>으로 채워짐 — 부족한 칸은 0.`, output: null, memViz: SM(TD2(2, 3, [1, 0, 0, 1, 2, 3], null)) },
        { line: 'hdr', type: 'exec', explain: `제목`, output: '반목문 for를 이용하여 출력' },
        { line: 'fori', type: 'exec', explain: `i=0 행 출력`, output: null },
        { line: 'pr', type: 'exec', explain: `1 0 0`, output: '1 ' },
        { line: 'pr', type: 'exec', output: '0 ' },
        { line: 'pr', type: 'exec', output: '0 ' },
        { line: 'nl', type: 'exec', output: '' },
        { line: 'fori', type: 'exec', explain: `i=1`, output: null },
        { line: 'pr', type: 'exec', output: '1 ' },
        { line: 'pr', type: 'exec', output: '2 ' },
        { line: 'pr', type: 'exec', output: '3 ' },
        { line: 'nl', type: 'exec', output: '' },
        { line: 'ret', type: 'exec', explain: `종료`, output: null, memViz: RET },
      ],
    },

    tdscore: {
      name: '05tdscore.c',
      title: '2차원 성적표 — 합·평균',
      varTypes: { sum: 'int', midsum: 'int', finalsum: 'int', 'score[0][0]': 'int', 'score[0][1]': 'int', 'score[1][0]': 'int', 'score[1][1]': 'int', 'score[2][0]': 'int', 'score[2][1]': 'int', 'score[3][0]': 'int', 'score[3][1]': 'int' },
      concept: `<b>score[i][j]</b>를 이중 for로 순회하며 <b>전체 합</b>과 <b>열(중간/기말) 합</b>을 동시에 누적합니다.<br>
메모리에는 <b>4행×2열</b>이 연속 블록으로 적재됩니다.`,
      vars: { sum: 0, midsum: 0, finalsum: 0 },
      code: [
        { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
        { text: `<span class="pp">#define</span> ROWSIZE <span class="nm">4</span>`, blank: true },
        { text: `<span class="pp">#define</span> COLSIZE <span class="nm">2</span>`, blank: true },
        { text: ``, blank: true },
        { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
        { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">sum</span> = <span class="nm">0</span>, <span class="vr">midsum</span> = <span class="nm">0</span>, <span class="vr">finalsum</span> = <span class="nm">0</span>;` },
        { id: 'init', text: `    <span class="ty">int</span> <span class="vr">score</span>[][COLSIZE] = { <span class="nm">95</span>, <span class="nm">85</span>, <span class="nm">90</span>, <span class="nm">88</span>, <span class="nm">86</span>, <span class="nm">90</span>, <span class="nm">88</span>, <span class="nm">78</span> };` },
        { id: 'h1', text: `    <span class="fn-c">printf</span>(<span class="st">"       중간       기말\\n"</span>);` },
        { id: 'h2', text: `    <span class="fn-c">printf</span>(<span class="st">"    --------------------\\n"</span>);` },
        { id: 'loop', text: `    <span class="co">/* 이중 for: 행·열 순회 (Step은 출력 위주로 압축) */</span>` },
        { id: 'f1', text: `    <span class="fn-c">printf</span>(<span class="st">"    --------------------\\n"</span>);` },
        { id: 'f2', text: `    <span class="fn-c">printf</span>(<span class="st">"평균: %6.2f %10.2f\\n"</span>, (<span class="ty">double</span>)<span class="vr">midsum</span>/ROWSIZE, (<span class="ty">double</span>)<span class="vr">finalsum</span>/ROWSIZE);` },
        { id: 'f3', text: `    <span class="fn-c">printf</span>(<span class="st">"\\n성적의 합은 %d이고 "</span>, <span class="vr">sum</span>);` },
        { id: 'f4', text: `    <span class="fn-c">printf</span>(<span class="st">"평균은 %.2f이다.\\n"</span>, (<span class="ty">double</span>)<span class="vr">sum</span>/(ROWSIZE*COLSIZE));` },
        { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
        { text: `}`, blank: true },
      ],
      steps: [
        { line: 'decl', type: 'exec', vars: { sum: 0, midsum: 0, finalsum: 0 }, explain: `누적 변수 0으로 초기화.`, output: null },
        { line: 'init', type: 'exec', vars: { 'score[0][0]': 95, 'score[0][1]': 85, 'score[1][0]': 90, 'score[1][1]': 88, 'score[2][0]': 86, 'score[2][1]': 90, 'score[3][0]': 88, 'score[3][1]': 78 }, explain: `<b>4×2</b> 배열이 한 덩어리로 적재됩니다.`, output: null, memViz: SM(TD42([95, 85, 90, 88, 86, 90, 88, 78]), 8 * 4 + 16) },
        { line: 'h1', type: 'exec', explain: `헤더`, output: '       중간       기말' },
        { line: 'h2', type: 'exec', explain: `구분선`, output: '    --------------------' },
        { line: 'loop', type: 'exec', vars: { sum: 700, midsum: 359, finalsum: 341 }, explain: `이중 for로 표를 출력하고 sum/midsum/finalsum을 누적(시뮬레이션).`, output: '        95         85 ' },
        { line: 'loop', type: 'exec', output: '        90         88 ' },
        { line: 'loop', type: 'exec', output: '        86         90 ' },
        { line: 'loop', type: 'exec', output: '        88         78 ' },
        { line: 'f1', type: 'exec', explain: `구분선`, output: '    --------------------' },
        { line: 'f2', type: 'exec', explain: `열 평균`, output: '평균:  89.75      85.25' },
        { line: 'f3', type: 'exec', explain: `합`, output: '\n성적의 합은 700이고 ' },
        { line: 'f4', type: 'exec', explain: `전체 평균`, output: '평균은 87.50이다.' },
        { line: 'ret', type: 'exec', explain: `종료`, output: null, memViz: RET },
      ],
    },

    thdary: {
      name: '06thdary.c',
      title: '3차원 배열 — 강좌 블록',
      varTypes: { 'score[0][0][0]': 'int', 'score[1][0][0]': 'int' },
      concept: `<b>int score[][4][2]</b> — 첫 차원은 <b>강좌</b>, 이어서 학생·과목이 블록으로 쌓입니다.<br>
메모리는 여전히 <b>행 우선</b> 규칙으로 한 줄로 펼쳐집니다.`,
      vars: {},
      code: [
        { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
        { text: `<span class="pp">#define</span> ROWSIZE <span class="nm">4</span>`, blank: true },
        { text: `<span class="pp">#define</span> COLSIZE <span class="nm">2</span>`, blank: true },
        { text: ``, blank: true },
        { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
        { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">score</span>[][ROWSIZE][COLSIZE] = { <span class="co">/* 2×4×2 */</span> ... };` },
        { id: 'loop', text: `    <span class="kw">for</span> (<span class="ty">int</span> <span class="vr">i</span> = <span class="nm">0</span>; <span class="vr">i</span> &lt; <span class="nm">2</span>; <span class="vr">i</span>++) { <span class="co">/* 강좌 */</span>` },
        { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
        { text: `}`, blank: true },
      ],
      steps: [
        { line: 'decl', type: 'exec', vars: { 'score[0][0][0]': 95 }, explain: `3차원 블록 전체가 연속 영역에 초기화됩니다(일부만 표시).`, output: null, memViz: SM([{ name: 'score[0][0][0]', type: 'int', bytes: 4, val: 95, addr: '0x7fff5200', highlight: true }], 2 * 4 * 2 * 4 + 16) },
        { line: 'loop', type: 'exec', explain: `바깥 i=0 → <b>[강좌 1]</b> 헤더 후 학생별 행 출력(원본과 동일 패턴).`, output: '[강좌 1]' },
        { line: 'loop', type: 'exec', output: '       중간     기말' },
        { line: 'loop', type: 'exec', output: '      학생 1    95     85 ' },
        { line: 'loop', type: 'exec', explain: `i=1 → <b>[강좌 2]</b>`, output: '[강좌 2]' },
        { line: 'ret', type: 'exec', explain: `종료`, output: null, memViz: RET },
      ],
    },

    arysize: {
      name: '07arysize.c',
      title: 'sizeof — 배열 전체 vs 원소',
      varTypes: { 'data[0]': 'int', 'data[1]': 'int', 'data[2]': 'int', 'data[3]': 'int', 'data[4]': 'int' },
      concept: `<b>sizeof(배열이름)</b>은 <b>전체 바이트</b>, <b>sizeof(원소)</b>는 <b>한 칸</b>입니다.<br>
이 시뮬은 <b>일반적인 LP64</b>(int=4, double=8)을 가정합니다.`,
      vars: {},
      code: [
        { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
        { text: ``, blank: true },
        { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
        { id: 'd1', text: `    <span class="ty">int</span> <span class="vr">data</span>[] = { <span class="nm">3</span>, <span class="nm">4</span>, <span class="nm">5</span>, <span class="nm">7</span>, <span class="nm">9</span> };` },
        { id: 'p1', text: `    <span class="fn-c">printf</span>(<span class="st">"%d %d\\n"</span>, (<span class="ty">int</span>)<span class="kw">sizeof</span>(<span class="vr">data</span>), (<span class="ty">int</span>)<span class="kw">sizeof</span>(<span class="vr">data</span>[<span class="nm">0</span>]));` },
        { id: 'p2', text: `    <span class="fn-c">printf</span>(<span class="st">"배열 data 크기 == %d\\n"</span>, (<span class="ty">int</span>)(<span class="kw">sizeof</span>(<span class="vr">data</span>) / <span class="kw">sizeof</span>(<span class="vr">data</span>[<span class="nm">0</span>])));` },
        { id: 'x1', text: `    <span class="ty">double</span> <span class="vr">x</span>[][<span class="nm">2</span>] = { { <span class="nm">1.2</span>, <span class="nm">2.3</span> }, { <span class="nm">7.3</span>, <span class="nm">8.9</span> } };` },
        { id: 'p3', text: `    <span class="fn-c">printf</span>(<span class="st">"%d %d "</span>, (<span class="ty">int</span>)<span class="kw">sizeof</span>(<span class="vr">x</span>), (<span class="ty">int</span>)<span class="kw">sizeof</span>(<span class="vr">x</span>[<span class="nm">0</span>]));` },
        { id: 'p4', text: `    <span class="fn-c">printf</span>(<span class="st">"%d %d\\n"</span>, (<span class="ty">int</span>)<span class="kw">sizeof</span>(<span class="vr">x</span>[<span class="nm">1</span>]), (<span class="ty">int</span>)<span class="kw">sizeof</span>(<span class="vr">x</span>[<span class="nm">0</span>][<span class="nm">0</span>]));` },
        { id: 'p5', text: `    <span class="fn-c">printf</span>(<span class="st">"이차원 배열 x: 행수 = %d  열수 = %d\\n"</span>, (<span class="ty">int</span>)(<span class="kw">sizeof</span>(<span class="vr">x</span>)/<span class="kw">sizeof</span>(<span class="vr">x</span>[<span class="nm">0</span>])), (<span class="ty">int</span>)(<span class="kw">sizeof</span>(<span class="vr">x</span>[<span class="nm">0</span>])/<span class="kw">sizeof</span>(<span class="vr">x</span>[<span class="nm">0</span>][<span class="nm">0</span>])));` },
        { id: 'p6', text: `    <span class="fn-c">printf</span>(<span class="st">"이차원 배열 x: 전체 원소 수 = %d\\n"</span>, (<span class="ty">int</span>)(<span class="kw">sizeof</span>(<span class="vr">x</span>)/<span class="kw">sizeof</span>(<span class="vr">x</span>[<span class="nm">0</span>][<span class="nm">0</span>])));` },
        { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
        { text: `}`, blank: true },
      ],
      steps: [
        { line: 'd1', type: 'exec', vars: { 'data[0]': 3, 'data[1]': 4, 'data[2]': 5, 'data[3]': 7, 'data[4]': 9 }, explain: `5×int = 20B 연속 적재.`, output: null, memViz: SM(SC(5, [3, 4, 5, 7, 9], null)) },
        { line: 'p1', type: 'exec', explain: `sizeof`, output: '20 4' },
        { line: 'p2', type: 'exec', explain: `원소 개수`, output: '배열 data 크기 == 5' },
        { line: 'x1', type: 'exec', explain: `2×2 double`, output: null },
        { line: 'p3', type: 'exec', output: '32 16 ' },
        { line: 'p4', type: 'exec', output: '16 8' },
        { line: 'p5', type: 'exec', output: '이차원 배열 x: 행수 = 2  열수 = 2' },
        { line: 'p6', type: 'exec', output: '이차원 배열 x: 전체 원소 수 = 4' },
        { line: 'ret', type: 'exec', output: null, memViz: RET },
      ],
    },

    lab1input: {
      name: 'lab1inputarray.c',
      title: '실습 — 0 입력으로 종료',
      varTypes: { 'input[0]': 'int', i: 'int' },
      concept: `<b>do-while</b>로 읽고, <b>0</b>을 넣으면 반복을 멈춥니다. <b>input[i++]</b>는 후위 증가라 인덱스 주의.`,
      vars: {},
      code: [
        { text: `<span class="pp">#define</span> _CRT_SECURE_NO_WARNINGS`, blank: true },
        { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
        { text: ``, blank: true },
        { text: `<span class="ty">int</span> <span class="fn-c">main</span>(<span class="ty">void</span>) {`, blank: true },
        { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">input</span>[<span class="nm">20</span>] = { <span class="nm">0</span> };` },
        { id: 'p1', text: `    <span class="fn-c">printf</span>(<span class="st">"배열에 저장할 정수를 여러 개 입력하시오. "</span>);` },
        { id: 'p2', text: `    <span class="fn-c">printf</span>(<span class="st">"0을 입력하면 입력을 종료합니다.\\n"</span>);` },
        { id: 'scan', text: `    <span class="co">/* scanf 0 한 번 — 시뮬 */</span>` },
        { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
        { text: `}`, blank: true },
      ],
      steps: [
        { line: 'decl', type: 'exec', vars: { 'input[0]': 0 }, explain: `전체가 0으로 초기화된 블록(일부만 표시).`, output: null, memViz: SM([{ name: 'input[0]', type: 'int', bytes: 4, val: 0, addr: '0x7fff5200', highlight: true }], 20 * 4 + 16) },
        { line: 'p1', type: 'exec', output: '배열에 저장할 정수를 여러 개 입력하시오. ' },
        { line: 'p2', type: 'exec', output: '0을 입력하면 입력을 종료합니다.' },
        { line: 'scan', type: 'exec', vars: { 'input[0]': 0, i: 1 }, explain: `0 입력 → 루프 종료. 이후 출력 루프는 0만 있어 아무것도 출력하지 않음.`, output: '→ 입력: 0' },
        { line: 'ret', type: 'exec', output: null, memViz: RET },
      ],
    },

    lab2aryprint: {
      name: 'lab2aryprint.c',
      title: '실습 — 2차원 표 출력',
      varTypes: { 'a[0][0]': 'int', 'a[2][3]': 'int' },
      concept: `중첩 for로 <b>행·열</b>을 순회하며 <code>a[i][j]</code>를 출력합니다.`,
      vars: {},
      code: [
        { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
        { text: ``, blank: true },
        { text: `<span class="ty">int</span> <span class="fn-c">main</span>() {`, blank: true },
        { id: 'decl', text: `    <span class="ty">int</span> <span class="vr">a</span>[<span class="nm">3</span>][<span class="nm">4</span>] = { <span class="co">/* 3×4 */</span> ... };` },
        { id: 'hdr', text: `    <span class="co">/* 헤더 printf ×4 + 구분선 */</span>` },
        { id: 'loop', text: `    <span class="kw">for</span> (<span class="ty">int</span> <span class="vr">i</span> = <span class="nm">0</span>; <span class="vr">i</span> &lt; <span class="nm">3</span>; <span class="vr">i</span>++)` },
        { id: 'ret', text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
        { text: `}`, blank: true },
      ],
      steps: [
        { line: 'decl', type: 'exec', vars: { 'a[0][0]': 1, 'a[2][3]': 8 }, explain: `3×4 연속 블록(일부 값만 변수 테이블에 표시).`, output: null, memViz: SM([{ name: 'a[0][0]', type: 'int', bytes: 4, val: 1, addr: '0x7fff5200', highlight: false }, { name: 'a[2][3]', type: 'int', bytes: 4, val: 8, addr: '0x7fff522c', highlight: true }], 12 * 4 + 16) },
        { line: 'hdr', type: 'exec', output: '    원소   값    원소   값    원소   값    원소   값' },
        { line: 'hdr', type: 'exec', output: '------------------------------------------------' },
        { line: 'loop', type: 'exec', explain: `중첩 for — <code>a[2][3]</code> 출력 포함`, output: ' a[2][3] 8  ' },
        { line: 'ret', type: 'exec', output: null, memViz: RET },
      ],
    },
  };
})();
