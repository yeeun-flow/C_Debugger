// ══════════════════════════════════════════════════════════
//  TOPIC_META: 사이드바 동적 생성용
// ══════════════════════════════════════════════════════════
const TOPIC_META = [
  { group: '조건문', key: 'if_basic', label: 'if / else', sub: '기본 조건 분기', icon: '🔀', isSub: false },
  { group: '조건문', key: 'if_elseif', label: 'else if 체인', tag: 'CHAIN', tagStyle: 'accent', isSub: true },
  { group: '조건문', key: 'nested_if', label: '중첩 if', tag: 'NEST', tagStyle: 'purple', isSub: true },
  { group: '조건문', key: 'switch_basic', label: 'switch / case', sub: '다중 값 분기', icon: '🔄', isSub: false },
  { group: '조건문', key: 'switch_fallthrough', label: 'fall-through', tag: 'WARN', tagStyle: 'red', isSub: true },
  { group: '반복문', key: 'for_basic', label: 'for 루프', sub: '횟수 확정 반복', icon: '🔁', isSub: false },
  { group: '반복문', key: 'for_nested', label: '중첩 for', tag: 'NEST', tagStyle: 'purple', isSub: true },
  { group: '반복문', key: 'while_basic', label: 'while 루프', sub: '조건 기반 반복', icon: '🌀', isSub: false },
  { group: '반복문', key: 'dowhile', label: 'do-while', sub: '최소 1회 실행', icon: '↩', isSub: false },
  { group: '점프문', key: 'break_stmt', label: 'break', sub: '루프 즉시 탈출', icon: '⛔', isSub: false },
  { group: '점프문', key: 'continue_stmt', label: 'continue', sub: '이번 반복 건너뜀', icon: '⏭', isSub: false },
  { group: '점프문', key: 'return_stmt', label: 'return', sub: '함수 종료·반환', icon: '↩️', isSub: false },
  { group: '점프문', key: 'goto_stmt', label: 'goto', sub: '무조건 점프 ⚠', icon: '🏹', isSub: false },
  { group: '메모리 관리', key: 'stack_frames', label: '스택 프레임', sub: '할당 / 해제 시각화', icon: '📐', isSub: false },
  { group: '메모리 관리', key: 'malloc_free', label: 'malloc / free', sub: '힙 동적 할당', icon: '🧱', isSub: false },
  { group: '메모리 관리', key: 'ptr_arrow', label: '포인터 화살표', tag: 'PTR', tagStyle: 'accent', isSub: true },
];

// ══════════════════════════════════════════════════════════
//  DATA: 각 토픽 정의
// ══════════════════════════════════════════════════════════

const TOPICS = {

  // ── if / else 기본 ─────────────────────────────────────
  if_basic: {
    name: 'if_basic.c',
    title: 'if / else 기본',
    varTypes: { score: 'int' },
    concept: `<b>if (조건)</b>문은 조건이 <b class="g">참(non-zero)</b>이면 블록 실행,
<b class="r">거짓(0)</b>이면 else 블록 실행합니다.<br>
<code>else</code>는 생략 가능하며, 조건이 맞지 않으면 건너뜁니다.`,
    vars: { score: null },
    baseAddr: { score: '0x7fff5200' },
    code: [
      { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank: true },
      { text: ``, blank: true },
      { text: `<span class="ty">int</span> <span class="fn-c">main</span>() {`, blank: true },
      { id: 'decl',   text: `    <span class="ty">int</span> <span class="vr">score</span> = <span class="nm">85</span>;` },
      { text: ``, blank: true },
      { id: 'cond1',  text: `    <span class="kw">if</span> (<span class="vr">score</span> >= <span class="nm">90</span>) {` },
      { id: 'exec1',  text: `        <span class="fn-c">printf</span>(<span class="st">"A학점\\n"</span>);`, indent:1 },
      { id: 'else1',  text: `    } <span class="kw">else if</span> (<span class="vr">score</span> >= <span class="nm">80</span>) {` },
      { id: 'exec2',  text: `        <span class="fn-c">printf</span>(<span class="st">"B학점\\n"</span>);`, indent:1 },
      { id: 'else2',  text: `    } <span class="kw">else</span> {` },
      { id: 'exec3',  text: `        <span class="fn-c">printf</span>(<span class="st">"F학점\\n"</span>);`, indent:1 },
      { text: `    }`, blank: true },
      { id: 'ret',    text: `    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text: `}`, blank: true },
    ],
    steps: [
      { line:'decl',  type:'exec', vars:{score:85}, explain:`<b>int score = 85</b> 선언 및 초기화. 스택 <b>0x7fff5200</b>에 4바이트 할당.`, output:null },
      { line:'cond1', type:'exec', cond:false, explain:`<b class="e-cond">조건 검사:</b> score(85) >= 90? → <span class="e-skip">거짓(false)</span>. 이 블록은 건너뜁니다.`, output:null },
      { line:'exec1', type:'skip', explain:`85 >= 90 이 거짓이므로 <b>"A학점"</b> printf는 <span class="e-skip">실행되지 않음</span>.`, output:null },
      { line:'else1', type:'exec', cond:true,  explain:`<b class="e-cond">조건 검사:</b> score(85) >= 80? → <span class="e-exec">참(true)</span>. 이 블록 실행!`, output:null },
      { line:'exec2', type:'exec', explain:`<span class="e-exec">실행:</span> printf("B학점\\n") — 조건 score>=80 이 참이므로 출력.`, output:'B학점' },
      { line:'else2', type:'skip', explain:`else 블록은 위 조건이 참이었으므로 <span class="e-skip">건너뜀</span>.`, output:null },
      { line:'exec3', type:'skip', explain:`"F학점" printf는 <span class="e-skip">실행되지 않음</span>.`, output:null },
      { line:'ret',   type:'exec', explain:`<b>return 0</b> — main() 종료, OS에 0 반환. 스택 프레임 해제.`, output:null },
    ]
  },

  // ── else if 체인 ───────────────────────────────────────
  if_elseif: {
    name: 'elseif_chain.c',
    title: 'else if 체인',
    varTypes: { x: 'int' },
    concept: `<b>else if</b> 체인은 위에서부터 차례로 조건을 검사합니다.<br>
<b class="g">처음으로 참인 조건</b>의 블록만 실행되고, 나머지는 모두 건너뜁니다.<br>
<code>else</code>는 아무 조건도 맞지 않을 때의 기본값입니다.`,
    vars: { x: null },
    baseAddr: { x: '0x7fff5200' },
    code: [
      { text: `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank:true },
      { text: ``, blank:true },
      { text: `<span class="ty">int</span> <span class="fn-c">main</span>() {`, blank:true },
      { id:'decl',  text:`    <span class="ty">int</span> <span class="vr">x</span> = <span class="nm">42</span>;` },
      { id:'c1',    text:`    <span class="kw">if</span>      (<span class="vr">x</span> < <span class="nm">0</span>)   <span class="fn-c">printf</span>(<span class="st">"음수\\n"</span>);` },
      { id:'c2',    text:`    <span class="kw">else if</span> (<span class="vr">x</span> == <span class="nm">0</span>)  <span class="fn-c">printf</span>(<span class="st">"영\\n"</span>);` },
      { id:'c3',    text:`    <span class="kw">else if</span> (<span class="vr">x</span> < <span class="nm">10</span>)  <span class="fn-c">printf</span>(<span class="st">"한 자리\\n"</span>);` },
      { id:'c4',    text:`    <span class="kw">else if</span> (<span class="vr">x</span> < <span class="nm">100</span>) <span class="fn-c">printf</span>(<span class="st">"두 자리\\n"</span>);` },
      { id:'c5',    text:`    <span class="kw">else</span>              <span class="fn-c">printf</span>(<span class="st">"세 자리 이상\\n"</span>);` },
      { id:'ret',   text:`    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text:`}`, blank:true },
    ],
    steps: [
      { line:'decl', type:'exec', vars:{x:42}, explain:`<b>int x = 42</b> 선언. 스택 0x7fff5200에 저장.`, output:null },
      { line:'c1',   type:'exec', cond:false, explain:`<b class="e-cond">검사:</b> x(42) < 0? → <span class="e-skip">거짓</span>. "음수" 건너뜀.`, output:null },
      { line:'c2',   type:'exec', cond:false, explain:`<b class="e-cond">검사:</b> x(42) == 0? → <span class="e-skip">거짓</span>. "영" 건너뜀.`, output:null },
      { line:'c3',   type:'exec', cond:false, explain:`<b class="e-cond">검사:</b> x(42) < 10? → <span class="e-skip">거짓</span>. "한 자리" 건너뜀.`, output:null },
      { line:'c4',   type:'exec', cond:true,  explain:`<b class="e-cond">검사:</b> x(42) < 100? → <span class="e-exec">참!</span> "두 자리" 실행.`, output:'두 자리' },
      { line:'c5',   type:'skip', explain:`앞 조건이 참이었으므로 else는 <span class="e-skip">완전히 건너뜀</span>.`, output:null },
      { line:'ret',  type:'exec', explain:`<b>return 0</b> — main() 종료.`, output:null },
    ]
  },

  // ── 중첩 if ─────────────────────────────────────────────
  nested_if: {
    name: 'nested_if.c',
    title: '중첩 if (Nested if)',
    varTypes: { x: 'int', y: 'int' },
    concept: `if 블록 안에 또 다른 if가 들어가는 구조입니다.<br>
<b class="r">Dangling else 주의:</b> <code>else</code>는 항상 <b>가장 가까운 if</b>와 짝을 이룹니다.<br>
중괄호 <code>{}</code>를 명시하면 이 문제를 예방할 수 있습니다.`,
    vars: { x: null, y: null },
    baseAddr: { x: '0x7fff5204', y: '0x7fff5200' },
    code: [
      { text:`<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank:true },
      { text:``, blank:true },
      { text:`<span class="ty">int</span> <span class="fn-c">main</span>() {`, blank:true },
      { id:'d1',  text:`    <span class="ty">int</span> <span class="vr">x</span> = <span class="nm">15</span>, <span class="vr">y</span> = <span class="nm">3</span>;` },
      { id:'o1',  text:`    <span class="kw">if</span> (<span class="vr">x</span> > <span class="nm">10</span>) {            <span class="cm">// 외부 if</span>` },
      { id:'p1',  text:`        <span class="fn-c">printf</span>(<span class="st">"x > 10\\n"</span>);` },
      { id:'i1',  text:`        <span class="kw">if</span> (<span class="vr">y</span> > <span class="nm">5</span>) {        <span class="cm">// 내부 if</span>` },
      { id:'p2',  text:`            <span class="fn-c">printf</span>(<span class="st">"y > 5\\n"</span>);` },
      { id:'ie',  text:`        } <span class="kw">else</span> {              <span class="cm">// 내부 else</span>` },
      { id:'p3',  text:`            <span class="fn-c">printf</span>(<span class="st">"y <= 5\\n"</span>);` },
      { text:`        }`, blank:true },
      { id:'oe',  text:`    } <span class="kw">else</span> {                  <span class="cm">// 외부 else</span>` },
      { id:'p4',  text:`        <span class="fn-c">printf</span>(<span class="st">"x <= 10\\n"</span>);` },
      { text:`    }`, blank:true },
      { id:'ret', text:`    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text:`}`, blank:true },
    ],
    steps: [
      { line:'d1',  type:'exec', vars:{x:15,y:3}, explain:`<b>x=15, y=3</b> 선언. 스택 0x7fff5204(x), 0x7fff5200(y).`, output:null },
      { line:'o1',  type:'exec', cond:true,  explain:`<b class="e-cond">외부 if:</b> x(15) > 10? → <span class="e-exec">참</span>. 외부 블록 진입.`, output:null },
      { line:'p1',  type:'exec', explain:`<span class="e-exec">실행:</span> printf("x > 10\\n").`, output:'x > 10' },
      { line:'i1',  type:'exec', cond:false, explain:`<b class="e-cond">내부 if:</b> y(3) > 5? → <span class="e-skip">거짓</span>. 내부 else로 이동.`, output:null },
      { line:'p2',  type:'skip', explain:`y > 5 가 거짓이므로 "y > 5" printf는 <span class="e-skip">건너뜀</span>.`, output:null },
      { line:'ie',  type:'exec', explain:`<b>내부 else</b> 블록 진입 (y <= 5 이므로).`, output:null },
      { line:'p3',  type:'exec', explain:`<span class="e-exec">실행:</span> printf("y <= 5\\n").`, output:'y <= 5' },
      { line:'oe',  type:'skip', explain:`외부 if 가 참이었으므로 외부 else는 <span class="e-skip">건너뜀</span>.`, output:null },
      { line:'p4',  type:'skip', explain:`외부 else 내부도 <span class="e-skip">실행 안 됨</span>.`, output:null },
      { line:'ret', type:'exec', explain:`<b>return 0</b> — 종료.`, output:null },
    ]
  },

  // ── switch 기본 ──────────────────────────────────────────
  switch_basic: {
    name: 'switch.c',
    title: 'switch / case',
    varTypes: { day: 'int' },
    concept: `<b>switch</b>는 하나의 정수/문자 값을 여러 <code>case</code>와 비교합니다.<br>
일치하는 case부터 실행하며, <code>break</code>로 탈출합니다.<br>
<b class="r">break 미사용 → fall-through 발생!</b> <code>default</code>는 어떤 case도 일치하지 않을 때 실행됩니다.`,
    vars: { day: null },
    baseAddr: { day: '0x7fff5200' },
    code: [
      { text:`<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank:true },
      { text:``, blank:true },
      { text:`<span class="ty">int</span> <span class="fn-c">main</span>() {`, blank:true },
      { id:'d1',   text:`    <span class="ty">int</span> <span class="vr">day</span> = <span class="nm">3</span>;` },
      { id:'sw',   text:`    <span class="kw">switch</span> (<span class="vr">day</span>) {` },
      { id:'c1',   text:`        <span class="kw">case</span> <span class="nm">1</span>: <span class="fn-c">printf</span>(<span class="st">"월요일\\n"</span>); <span class="kw">break</span>;` },
      { id:'c2',   text:`        <span class="kw">case</span> <span class="nm">2</span>: <span class="fn-c">printf</span>(<span class="st">"화요일\\n"</span>); <span class="kw">break</span>;` },
      { id:'c3',   text:`        <span class="kw">case</span> <span class="nm">3</span>: <span class="fn-c">printf</span>(<span class="st">"수요일\\n"</span>); <span class="kw">break</span>;` },
      { id:'c4',   text:`        <span class="kw">case</span> <span class="nm">4</span>: <span class="fn-c">printf</span>(<span class="st">"목요일\\n"</span>); <span class="kw">break</span>;` },
      { id:'c5',   text:`        <span class="kw">case</span> <span class="nm">5</span>: <span class="fn-c">printf</span>(<span class="st">"금요일\\n"</span>); <span class="kw">break</span>;` },
      { id:'def',  text:`        <span class="kw">default</span>: <span class="fn-c">printf</span>(<span class="st">"주말\\n"</span>);` },
      { text:`    }`, blank:true },
      { id:'ret',  text:`    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text:`}`, blank:true },
    ],
    steps: [
      { line:'d1',  type:'exec', vars:{day:3}, explain:`<b>day = 3</b> 선언. 스택 0x7fff5200 (4bytes).`, output:null },
      { line:'sw',  type:'exec', explain:`switch(day) 평가 — day값(3)으로 점프 테이블 조회 시작.`, output:null },
      { line:'c1',  type:'skip', explain:`case 1: day(3) ≠ 1 → <span class="e-skip">건너뜀</span>.`, output:null },
      { line:'c2',  type:'skip', explain:`case 2: day(3) ≠ 2 → <span class="e-skip">건너뜀</span>.`, output:null },
      { line:'c3',  type:'exec', explain:`case 3: day(3) == 3 → <span class="e-exec">일치!</span> "수요일" 출력 후 break로 switch 탈출.`, output:'수요일' },
      { line:'c4',  type:'skip', explain:`break 이후라 case 4는 <span class="e-skip">실행 안 됨</span>.`, output:null },
      { line:'c5',  type:'skip', explain:`case 5도 <span class="e-skip">건너뜀</span>.`, output:null },
      { line:'def', type:'skip', explain:`default도 <span class="e-skip">건너뜀</span> (이미 case 3이 실행됨).`, output:null },
      { line:'ret', type:'exec', explain:`<b>return 0</b> — 종료.`, output:null },
    ]
  },

  // ── switch fall-through ──────────────────────────────────
  switch_fallthrough: {
    name: 'fallthrough.c',
    title: 'fall-through 현상',
    varTypes: { n: 'int' },
    concept: `<code>break</code>를 생략하면 다음 case로 <b class="r">fall-through</b> 됩니다.<br>
의도적으로 활용할 수도 있지만 대부분의 경우 버그입니다.<br>
<b>case 4, 5처럼</b> 같은 동작을 공유할 때만 의도적으로 사용하세요.`,
    vars: { n: null },
    baseAddr: { n: '0x7fff5200' },
    code: [
      { text:`<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank:true },
      { text:`<span class="ty">int</span> <span class="fn-c">main</span>() {`, blank:true },
      { id:'d1',  text:`    <span class="ty">int</span> <span class="vr">n</span> = <span class="nm">2</span>;` },
      { id:'sw',  text:`    <span class="kw">switch</span> (<span class="vr">n</span>) {` },
      { id:'c1',  text:`        <span class="kw">case</span> <span class="nm">1</span>:` },
      { id:'p1',  text:`            <span class="fn-c">printf</span>(<span class="st">"case 1\\n"</span>);` },
      { id:'br1', text:`            <span class="kw">break</span>;  <span class="cm">// ← 있음</span>` },
      { id:'c2',  text:`        <span class="kw">case</span> <span class="nm">2</span>:   <span class="cm">// ← break 없음!</span>` },
      { id:'p2',  text:`            <span class="fn-c">printf</span>(<span class="st">"case 2\\n"</span>);` },
      { id:'c3',  text:`        <span class="kw">case</span> <span class="nm">3</span>:   <span class="cm">// ← fall-through 도착</span>` },
      { id:'p3',  text:`            <span class="fn-c">printf</span>(<span class="st">"case 3\\n"</span>);` },
      { id:'br3', text:`            <span class="kw">break</span>;` },
      { text:`    }`, blank:true },
      { id:'ret', text:`    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text:`}`, blank:true },
    ],
    steps: [
      { line:'d1',  type:'exec', vars:{n:2}, explain:`<b>n = 2</b> 선언.`, output:null },
      { line:'sw',  type:'exec', explain:`switch(n=2) 시작 — case 2 검색.`, output:null },
      { line:'c1',  type:'skip', explain:`case 1: n(2) ≠ 1 → <span class="e-skip">건너뜀</span>.`, output:null },
      { line:'c2',  type:'exec', explain:`case 2: n(2) == 2 → <span class="e-exec">일치! 진입.</span>`, output:null },
      { line:'p2',  type:'exec', explain:`<span class="e-exec">실행:</span> printf("case 2").`, output:'case 2' },
      { line:'c3',  type:'exec', explain:`<b class="r">⚠ fall-through!</b> break가 없어서 case 3으로 <b class="r">자동 진행</b>됩니다!`, output:null },
      { line:'p3',  type:'exec', explain:`<span class="e-exec">실행:</span> printf("case 3") — 의도치 않은 실행!`, output:'case 3' },
      { line:'br3', type:'exec', explain:`break를 만나 switch 탈출.`, output:null },
      { line:'ret', type:'exec', explain:`<b>return 0</b>.`, output:null },
    ]
  },

  // ── for 기본 ─────────────────────────────────────────────
  for_basic: {
    name: 'for_loop.c',
    title: 'for 루프',
    varTypes: { i: 'int', sum: 'int' },
    concept: `<b>for (초기식; 조건식; 증감식)</b><br>
순서: <b>초기식 → 조건 검사 → 본문 → 증감식 → 조건 검사 …</b><br>
반복 횟수가 명확할 때 가장 적합합니다. 세 부분 모두 생략 가능합니다.`,
    vars: { i: null, sum: null },
    baseAddr: { i: '0x7fff51fc', sum: '0x7fff5200' },
    code: [
      { text:`<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank:true },
      { text:`<span class="ty">int</span> <span class="fn-c">main</span>() {`, blank:true },
      { id:'ds',    text:`    <span class="ty">int</span> <span class="vr">sum</span> = <span class="nm">0</span>;` },
      { id:'finit', text:`    <span class="kw">for</span> (<span class="ty">int</span> <span class="vr">i</span>=<span class="nm">1</span>; <span class="vr">i</span><=<span class="nm">4</span>; <span class="vr">i</span>++) {  <span class="cm">// ① 초기식</span>` },
      { id:'fcond', text:`        <span class="cm">// ② 조건 검사: i &lt;= 4</span>`, blank:true },
      { id:'fbody', text:`        <span class="vr">sum</span> += <span class="vr">i</span>;              <span class="cm">// ③ 본문</span>` },
      { id:'fstep', text:`        <span class="cm">// ④ 증감식: i++</span>`, blank:true },
      { text:`    }`, blank:true },
      { id:'pr',    text:`    <span class="fn-c">printf</span>(<span class="st">"sum=%d\\n"</span>, <span class="vr">sum</span>);` },
      { id:'ret',   text:`    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text:`}`, blank:true },
    ],
    steps: [
      { line:'ds',    type:'exec', vars:{i:'—', sum:0}, explain:`<b>sum=0</b> 선언.` },
      { line:'finit', type:'exec', vars:{i:1, sum:0},   explain:`<b>① 초기식:</b> i=1 생성. 조건 i(1)<=4 → 참. 루프 진입.` },
      { line:'fbody', type:'exec', vars:{i:1, sum:1},   explain:`<b>③ 본문:</b> sum += i → sum = 0+1 = <b>1</b>.`, output:'i=1 → sum=1' },
      { line:'finit', type:'exec', vars:{i:2, sum:1},   explain:`<b>④ i++ → i=2.</b> 조건 i(2)<=4 → 참. 계속.` },
      { line:'fbody', type:'exec', vars:{i:2, sum:3},   explain:`<b>③ 본문:</b> sum += 2 → sum = <b>3</b>.`, output:'i=2 → sum=3' },
      { line:'finit', type:'exec', vars:{i:3, sum:3},   explain:`<b>④ i++ → i=3.</b> 조건 i(3)<=4 → 참.` },
      { line:'fbody', type:'exec', vars:{i:3, sum:6},   explain:`<b>③ 본문:</b> sum += 3 → sum = <b>6</b>.`, output:'i=3 → sum=6' },
      { line:'finit', type:'exec', vars:{i:4, sum:6},   explain:`<b>④ i++ → i=4.</b> 조건 i(4)<=4 → 참.` },
      { line:'fbody', type:'exec', vars:{i:4, sum:10},  explain:`<b>③ 본문:</b> sum += 4 → sum = <b>10</b>.`, output:'i=4 → sum=10' },
      { line:'finit', type:'exec', vars:{i:5, sum:10},  explain:`<b>④ i++ → i=5.</b> 조건 i(5)<=4 → <span class="e-skip">거짓!</span> 루프 탈출.` },
      { line:'pr',    type:'exec', explain:`<span class="e-exec">실행:</span> printf("sum=10").`, output:'sum=10' },
      { line:'ret',   type:'exec', explain:`<b>return 0</b> — 종료.` },
    ]
  },

  // ── for 중첩 ─────────────────────────────────────────────
  for_nested: {
    name: 'nested_for.c',
    title: '중첩 for',
    varTypes: { i: 'int', j: 'int' },
    concept: `for 안에 for가 중첩된 구조입니다.<br>
외부 루프 1회 실행 시 내부 루프는 <b>전체 반복</b>을 완료합니다.<br>
2D 배열 순회, 구구단 등에 사용됩니다.`,
    vars: { i: null, j: null },
    baseAddr: { i: '0x7fff5200', j: '0x7fff51fc' },
    code: [
      { text:`<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank:true },
      { text:`<span class="ty">int</span> <span class="fn-c">main</span>() {`, blank:true },
      { id:'fo',  text:`    <span class="kw">for</span> (<span class="ty">int</span> <span class="vr">i</span>=<span class="nm">1</span>; <span class="vr">i</span><=<span class="nm">2</span>; <span class="vr">i</span>++) {  <span class="cm">// 외부</span>` },
      { id:'fi',  text:`        <span class="kw">for</span> (<span class="ty">int</span> <span class="vr">j</span>=<span class="nm">1</span>; <span class="vr">j</span><=<span class="nm">3</span>; <span class="vr">j</span>++) {  <span class="cm">// 내부</span>` },
      { id:'pr',  text:`            <span class="fn-c">printf</span>(<span class="st">"(%d,%d) "</span>, <span class="vr">i</span>, <span class="vr">j</span>);` },
      { text:`        }`, blank:true },
      { id:'nl',  text:`        <span class="fn-c">printf</span>(<span class="st">"\\n"</span>);` },
      { text:`    }`, blank:true },
      { id:'ret', text:`    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text:`}`, blank:true },
    ],
    steps: [
      { line:'fo', type:'exec', vars:{i:1,j:'—'}, explain:`외부 i=1. 조건 1<=2 → 참.` },
      { line:'fi', type:'exec', vars:{i:1,j:1},   explain:`내부 j=1. 조건 1<=3 → 참.` },
      { line:'pr', type:'exec', vars:{i:1,j:1},   explain:`printf("(1,1) ").`, output:'(1,1) ' },
      { line:'fi', type:'exec', vars:{i:1,j:2},   explain:`j++ → j=2. 조건 2<=3 → 참.` },
      { line:'pr', type:'exec', vars:{i:1,j:2},   explain:`printf("(1,2) ").`, output:'(1,2) ' },
      { line:'fi', type:'exec', vars:{i:1,j:3},   explain:`j++ → j=3. 조건 3<=3 → 참.` },
      { line:'pr', type:'exec', vars:{i:1,j:3},   explain:`printf("(1,3) ").`, output:'(1,3) ' },
      { line:'fi', type:'exec', vars:{i:1,j:4},   explain:`j++ → j=4. 조건 4<=3 → <span class="e-skip">거짓</span>. 내부 루프 탈출.` },
      { line:'nl', type:'exec',                    explain:`printf("\\n") — 줄 바꿈.`, output:'↵ 새줄' },
      { line:'fo', type:'exec', vars:{i:2,j:'—'}, explain:`i++ → i=2. 조건 2<=2 → 참. 외부 2회차.` },
      { line:'fi', type:'exec', vars:{i:2,j:1},   explain:`내부 j 다시 1. 조건 1<=3 → 참.` },
      { line:'pr', type:'exec', vars:{i:2,j:1},   explain:`printf("(2,1) ").`, output:'(2,1) ' },
      { line:'fi', type:'exec', vars:{i:2,j:2},   explain:`j++ → j=2.`, },
      { line:'pr', type:'exec', vars:{i:2,j:2},   explain:`printf("(2,2) ").`, output:'(2,2) ' },
      { line:'fi', type:'exec', vars:{i:2,j:3},   explain:`j++ → j=3.` },
      { line:'pr', type:'exec', vars:{i:2,j:3},   explain:`printf("(2,3) ").`, output:'(2,3) ' },
      { line:'fi', type:'exec', vars:{i:2,j:4},   explain:`j=4, 4<=3 → <span class="e-skip">거짓</span>. 내부 루프 탈출.` },
      { line:'nl', type:'exec',                    explain:`줄 바꿈.`, output:'↵ 새줄' },
      { line:'fo', type:'exec', vars:{i:3,j:'—'}, explain:`i=3, 3<=2 → <span class="e-skip">거짓</span>. 외부 루프도 탈출.` },
      { line:'ret',type:'exec',                    explain:`<b>return 0</b>.` },
    ]
  },

  // ── while ───────────────────────────────────────────────
  while_basic: {
    name: 'while.c',
    title: 'while 루프',
    varTypes: { n: 'int' },
    concept: `<b>while (조건)</b> — 조건을 <b>먼저 검사</b>하고 참이면 실행합니다.<br>
처음부터 조건이 거짓이면 <b class="r">0번 실행</b>될 수 있습니다.<br>
반복 횟수가 불명확하거나 조건 기반일 때 적합합니다.`,
    vars: { n: null },
    baseAddr: { n: '0x7fff5200' },
    code: [
      { text:`<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank:true },
      { text:`<span class="ty">int</span> <span class="fn-c">main</span>() {`, blank:true },
      { id:'d1',   text:`    <span class="ty">int</span> <span class="vr">n</span> = <span class="nm">1</span>;` },
      { id:'wc',   text:`    <span class="kw">while</span> (<span class="vr">n</span> <= <span class="nm">32</span>) {   <span class="cm">// 조건 먼저</span>` },
      { id:'pr',   text:`        <span class="fn-c">printf</span>(<span class="st">"%d\\n"</span>, <span class="vr">n</span>);` },
      { id:'inc',  text:`        <span class="vr">n</span> *= <span class="nm">2</span>;         <span class="cm">// n 직접 관리</span>` },
      { text:`    }`, blank:true },
      { id:'ret',  text:`    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text:`}`, blank:true },
    ],
    steps: [
      { line:'d1',  type:'exec', vars:{n:1},  explain:`<b>n=1</b> 선언.` },
      { line:'wc',  type:'exec', cond:true, vars:{n:1},  explain:`<b>② 조건:</b> n(1) <= 32 → <span class="e-exec">참</span>. 루프 진입.` },
      { line:'pr',  type:'exec', explain:`printf("1\\n").`, output:'1' },
      { line:'inc', type:'exec', vars:{n:2},  explain:`n *= 2 → n = <b>2</b>.` },
      { line:'wc',  type:'exec', cond:true, vars:{n:2},  explain:`<b>조건:</b> n(2) <= 32 → <span class="e-exec">참</span>.` },
      { line:'pr',  type:'exec', explain:`printf("2").`, output:'2' },
      { line:'inc', type:'exec', vars:{n:4},  explain:`n *= 2 → n = <b>4</b>.` },
      { line:'wc',  type:'exec', cond:true, vars:{n:4},  explain:`<b>조건:</b> n(4) <= 32 → <span class="e-exec">참</span>.` },
      { line:'pr',  type:'exec', explain:`printf("4").`, output:'4' },
      { line:'inc', type:'exec', vars:{n:8},  explain:`n *= 2 → n = <b>8</b>.` },
      { line:'wc',  type:'exec', cond:true, vars:{n:8},  explain:`<b>조건:</b> n(8) <= 32 → <span class="e-exec">참</span>.` },
      { line:'pr',  type:'exec', explain:`printf("8").`, output:'8' },
      { line:'inc', type:'exec', vars:{n:16}, explain:`n *= 2 → n = <b>16</b>.` },
      { line:'wc',  type:'exec', cond:true, vars:{n:16}, explain:`<b>조건:</b> n(16) <= 32 → <span class="e-exec">참</span>.` },
      { line:'pr',  type:'exec', explain:`printf("16").`, output:'16' },
      { line:'inc', type:'exec', vars:{n:32}, explain:`n *= 2 → n = <b>32</b>.` },
      { line:'wc',  type:'exec', cond:true, vars:{n:32}, explain:`<b>조건:</b> n(32) <= 32 → <span class="e-exec">참</span>.` },
      { line:'pr',  type:'exec', explain:`printf("32").`, output:'32' },
      { line:'inc', type:'exec', vars:{n:64}, explain:`n *= 2 → n = <b>64</b>.` },
      { line:'wc',  type:'exec', cond:false,vars:{n:64}, explain:`<b>조건:</b> n(64) <= 32 → <span class="e-skip">거짓!</span> 루프 탈출.` },
      { line:'ret', type:'exec', explain:`<b>return 0</b>.` },
    ]
  },

  // ── do-while ────────────────────────────────────────────
  dowhile: {
    name: 'do_while.c',
    title: 'do-while 루프',
    varTypes: { input: 'int' },
    concept: `<b>do { … } while(조건);</b> — 블록을 <b>먼저 실행</b>한 뒤 조건 검사합니다.<br>
조건이 처음부터 거짓이어도 <b class="g">최소 1회는 반드시 실행</b>됩니다.<br>
메뉴 선택, 비밀번호 재시도 패턴에 적합합니다.`,
    vars: { input: null },
    baseAddr: { input: '0x7fff5200' },
    code: [
      { text:`<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank:true },
      { text:`<span class="ty">int</span> <span class="fn-c">main</span>() {`, blank:true },
      { id:'d1',  text:`    <span class="ty">int</span> <span class="vr">input</span>;` },
      { id:'dob', text:`    <span class="kw">do</span> {                    <span class="cm">// 먼저 실행</span>` },
      { id:'pr',  text:`        <span class="fn-c">printf</span>(<span class="st">"1~5 입력: "</span>);` },
      { id:'sc',  text:`        <span class="fn-c">scanf</span>(<span class="st">"%d"</span>, &<span class="vr">input</span>);` },
      { id:'wc',  text:`    } <span class="kw">while</span> (<span class="vr">input</span> < <span class="nm">1</span> || <span class="vr">input</span> > <span class="nm">5</span>); <span class="cm">// 나중 검사</span>` },
      { id:'pr2', text:`    <span class="fn-c">printf</span>(<span class="st">"입력값: %d\\n"</span>, <span class="vr">input</span>);` },
      { id:'ret', text:`    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text:`}`, blank:true },
    ],
    steps: [
      { line:'d1',  type:'exec', vars:{input:'(미정)'}, explain:`<b>input</b> 선언 (초기화 안 됨).` },
      { line:'dob', type:'exec', explain:`<b>do 블록 시작.</b> 조건과 관계없이 무조건 첫 실행.` },
      { line:'pr',  type:'exec', explain:`<span class="e-exec">실행:</span> printf("1~5 입력: ").`, output:'1~5 입력: ' },
      { line:'sc',  type:'exec', vars:{input:7}, explain:`scanf → 사용자가 <b>7</b> 입력 (시뮬레이션).`, output:'→ 입력: 7' },
      { line:'wc',  type:'exec', cond:true, vars:{input:7}, explain:`<b>조건:</b> input(7) < 1 || 7 > 5 → <span class="e-skip">true</span>. 범위 초과! <b>다시 반복.</b>` },
      { line:'pr',  type:'exec', explain:`다시 프롬프트 출력.`, output:'1~5 입력: ' },
      { line:'sc',  type:'exec', vars:{input:3}, explain:`사용자가 <b>3</b> 입력.`, output:'→ 입력: 3' },
      { line:'wc',  type:'exec', cond:false, vars:{input:3}, explain:`<b>조건:</b> 3 < 1 || 3 > 5 → <span class="e-exec">false</span>. 정상 범위, 루프 탈출!` },
      { line:'pr2', type:'exec', explain:`<span class="e-exec">실행:</span> printf("입력값: 3\\n").`, output:'입력값: 3' },
      { line:'ret', type:'exec', explain:`<b>return 0</b>.` },
    ]
  },

  // ── break ───────────────────────────────────────────────
  break_stmt: {
    name: 'break.c',
    title: 'break 문',
    varTypes: { i: 'int', found: 'int' },
    concept: `<b>break</b>는 가장 안쪽 <code>for/while/switch</code>를 <b>즉시 탈출</b>합니다.<br>
중첩 루프에서 <b>가장 안쪽 루프만</b> 탈출합니다.<br>
배열 탐색, 조건 충족 시 조기 종료에 주로 사용됩니다.`,
    vars: { i: null, found: null },
    baseAddr: { i: '0x7fff51fc', found: '0x7fff5200' },
    code: [
      { text:`<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank:true },
      { text:`<span class="ty">int</span> <span class="fn-c">main</span>() {`, blank:true },
      { id:'da',   text:`    <span class="ty">int</span> <span class="vr">arr</span>[]={<span class="nm">3</span>,<span class="nm">7</span>,<span class="nm">9</span>,<span class="nm">1</span>}, <span class="vr">found</span>=<span class="nm">-1</span>;` },
      { id:'fl',   text:`    <span class="kw">for</span> (<span class="ty">int</span> <span class="vr">i</span>=<span class="nm">0</span>; <span class="vr">i</span><<span class="nm">4</span>; <span class="vr">i</span>++) {` },
      { id:'ci',   text:`        <span class="kw">if</span> (<span class="vr">arr</span>[<span class="vr">i</span>] == <span class="nm">9</span>) {` },
      { id:'fn',   text:`            <span class="vr">found</span> = <span class="vr">i</span>;` },
      { id:'brk',  text:`            <span class="kw">break</span>;   <span class="cm">// 즉시 탈출</span>` },
      { text:`        }`, blank:true },
      { text:`    }`, blank:true },
      { id:'pr',   text:`    <span class="fn-c">printf</span>(<span class="st">"found=%d\\n"</span>, <span class="vr">found</span>);` },
      { id:'ret',  text:`    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text:`}`, blank:true },
    ],
    steps: [
      { line:'da',  type:'exec', vars:{i:'—', found:-1}, explain:`arr={3,7,9,1} 선언. found=-1 (미발견 의미).` },
      { line:'fl',  type:'exec', vars:{i:0, found:-1},   explain:`i=0. 조건 0<4 → 참.` },
      { line:'ci',  type:'exec', cond:false,             explain:`arr[0]=3, 3==9? → <span class="e-skip">거짓</span>. 건너뜀.` },
      { line:'fl',  type:'exec', vars:{i:1, found:-1},   explain:`i++ → i=1. 1<4 → 참.` },
      { line:'ci',  type:'exec', cond:false,             explain:`arr[1]=7, 7==9? → <span class="e-skip">거짓</span>.` },
      { line:'fl',  type:'exec', vars:{i:2, found:-1},   explain:`i++ → i=2. 2<4 → 참.` },
      { line:'ci',  type:'exec', cond:true,              explain:`arr[2]=9, 9==9? → <span class="e-exec">참!</span> 진입.` },
      { line:'fn',  type:'exec', vars:{i:2, found:2},    explain:`<b>found = 2</b> 저장.` },
      { line:'brk', type:'exec',                         explain:`<b class="e-exec">break!</b> 루프 즉시 탈출. i=3 실행 안 됨.`, output:'⛔ break — 루프 탈출' },
      { line:'pr',  type:'exec',                         explain:`printf("found=2").`, output:'found=2' },
      { line:'ret', type:'exec',                         explain:`<b>return 0</b>.` },
    ]
  },

  // ── continue ────────────────────────────────────────────
  continue_stmt: {
    name: 'continue.c',
    title: 'continue 문',
    varTypes: { i: 'int' },
    concept: `<b>continue</b>는 현재 반복의 나머지를 건너뛰고 <b>다음 반복</b>으로 이동합니다.<br>
break와 달리 루프 자체는 유지됩니다.<br>
for에서는 증감식으로, while에서는 조건 검사로 이동합니다.`,
    vars: { i: null },
    baseAddr: { i: '0x7fff5200' },
    code: [
      { text:`<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank:true },
      { text:`<span class="ty">int</span> <span class="fn-c">main</span>() {`, blank:true },
      { id:'fl',  text:`    <span class="kw">for</span> (<span class="ty">int</span> <span class="vr">i</span>=<span class="nm">1</span>; <span class="vr">i</span><=<span class="nm">5</span>; <span class="vr">i</span>++) {` },
      { id:'ci',  text:`        <span class="kw">if</span> (<span class="vr">i</span> % <span class="nm">2</span> == <span class="nm">0</span>) {   <span class="cm">// 짝수면</span>` },
      { id:'cnt', text:`            <span class="kw">continue</span>;        <span class="cm">// 건너뜀</span>` },
      { text:`        }`, blank:true },
      { id:'pr',  text:`        <span class="fn-c">printf</span>(<span class="st">"%d "</span>, <span class="vr">i</span>);` },
      { text:`    }`, blank:true },
      { id:'ret', text:`    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text:`}`, blank:true },
    ],
    steps: [
      { line:'fl',  type:'exec', vars:{i:1}, explain:`i=1. 조건 1<=5 → 참.` },
      { line:'ci',  type:'exec', cond:false, explain:`1%2==0? → <span class="e-skip">거짓</span> (홀수). continue 안 함.` },
      { line:'pr',  type:'exec', explain:`printf("1 ").`, output:'1 ' },
      { line:'fl',  type:'exec', vars:{i:2}, explain:`i++ → i=2. 조건 참.` },
      { line:'ci',  type:'exec', cond:true,  explain:`2%2==0? → <span class="e-exec">참</span> (짝수). continue 실행!` },
      { line:'cnt', type:'exec', explain:`<b class="e-exec">continue!</b> printf 건너뛰고 i++ → 다음 반복.`, output:'⏭ i=2 건너뜀' },
      { line:'fl',  type:'exec', vars:{i:3}, explain:`i=3. 조건 참.` },
      { line:'ci',  type:'exec', cond:false, explain:`3%2==0? → <span class="e-skip">거짓</span>. 통과.` },
      { line:'pr',  type:'exec', explain:`printf("3 ").`, output:'3 ' },
      { line:'fl',  type:'exec', vars:{i:4}, explain:`i=4.` },
      { line:'ci',  type:'exec', cond:true,  explain:`4%2==0? → <span class="e-exec">참</span>. continue!` },
      { line:'cnt', type:'exec', explain:`<b class="e-exec">continue!</b> i=4 건너뜀.`, output:'⏭ i=4 건너뜀' },
      { line:'fl',  type:'exec', vars:{i:5}, explain:`i=5.` },
      { line:'ci',  type:'exec', cond:false, explain:`5%2==0? → <span class="e-skip">거짓</span>.` },
      { line:'pr',  type:'exec', explain:`printf("5 ").`, output:'5 ' },
      { line:'fl',  type:'exec', vars:{i:6}, explain:`i=6, 6<=5 → <span class="e-skip">거짓</span>. 루프 종료.` },
      { line:'ret', type:'exec', explain:`<b>return 0</b>.` },
    ]
  },

  // ── return ──────────────────────────────────────────────
  return_stmt: {
    name: 'return.c',
    title: 'return 문 & 함수 스택',
    varTypes: { a: 'int', b: 'int', result: 'int', s: 'int' },
    concept: `<b>return [값];</b> — 함수를 즉시 종료하고 호출자에게 값을 반환합니다.<br>
void 함수는 <code>return;</code> 또는 생략 가능합니다.<br>
return 시 <b>현재 함수의 스택 프레임이 해제</b>됩니다.`,
    vars: { a: null, b: null, result: null, s: null },
    baseAddr: {},
    code: [
      { text:`<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank:true },
      { text:``, blank:true },
      { id:'fndef', text:`<span class="ty">int</span> <span class="fn-c">add</span>(<span class="ty">int</span> <span class="vr">a</span>, <span class="ty">int</span> <span class="vr">b</span>) {` },
      { id:'rl',    text:`    <span class="ty">int</span> <span class="vr">result</span> = <span class="vr">a</span> + <span class="vr">b</span>;` },
      { id:'ret2',  text:`    <span class="kw">return</span> <span class="vr">result</span>; <span class="cm">// 스택 프레임 해제</span>` },
      { text:`}`, blank:true },
      { text:``, blank:true },
      { text:`<span class="ty">int</span> <span class="fn-c">main</span>() {`, blank:true },
      { id:'call',  text:`    <span class="ty">int</span> <span class="vr">s</span> = <span class="fn-c">add</span>(<span class="nm">3</span>, <span class="nm">4</span>);` },
      { id:'pr',    text:`    <span class="fn-c">printf</span>(<span class="st">"s=%d\\n"</span>, <span class="vr">s</span>);` },
      { id:'ret',   text:`    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text:`}`, blank:true },
    ],
    steps: [
      {
        line:'call', type:'exec', vars:{s:'???'},
        explain:`main: <b>add(3,4)</b> 호출 직전. main 프레임(s=???)만 스택에 있음.`,
        memViz:{ stack:[
          { fn:'main', color:'main', vars:[
            { name:'s', type:'int', bytes:4, val:'???', addr:'0x7fff5200', highlight:false }
          ], retAddr:'0x400640' }
        ], heap:[], totalBytes:20 }
      },
      {
        line:'fndef', type:'exec', vars:{a:3, b:4},
        explain:`<b>add() 프레임 생성 +20B.</b> 매개변수 a=3, b=4 스택에 복사. result 공간 확보.`,
        memViz:{ stack:[
          { fn:'main', color:'main', vars:[
            { name:'s', type:'int', bytes:4, val:'???', addr:'0x7fff5200', highlight:false }
          ], retAddr:'0x400640' },
          { fn:'add', color:'call', vars:[
            { name:'a',      type:'int', bytes:4, val:'3',   addr:'0x7fff51e8', highlight:true },
            { name:'b',      type:'int', bytes:4, val:'4',   addr:'0x7fff51e4', highlight:true },
            { name:'result', type:'int', bytes:4, val:'???', addr:'0x7fff51e0', highlight:false },
          ], retAddr:'0x400590' }
        ], heap:[], totalBytes:40 }
      },
      {
        line:'rl', type:'exec', vars:{a:3, b:4, result:7},
        explain:`result = a + b = 3 + 4 = <b>7</b>. 0x7fff51e0 에 저장.`,
        memViz:{ stack:[
          { fn:'main', color:'main', vars:[
            { name:'s', type:'int', bytes:4, val:'???', addr:'0x7fff5200', highlight:false }
          ], retAddr:'0x400640' },
          { fn:'add', color:'call', vars:[
            { name:'a',      type:'int', bytes:4, val:'3', addr:'0x7fff51e8', highlight:false },
            { name:'b',      type:'int', bytes:4, val:'4', addr:'0x7fff51e4', highlight:false },
            { name:'result', type:'int', bytes:4, val:'7', addr:'0x7fff51e0', highlight:true  },
          ], retAddr:'0x400590' }
        ], heap:[], totalBytes:40 }
      },
      {
        line:'ret2', type:'exec', vars:{},
        explain:`<b>return 7</b> → RAX 레지스터에 7 저장. add 프레임 <b class="r">-20B 해제</b>. 복귀 주소 0x400590 으로 점프.`,
        output:'add() → return 7',
        memViz:{ stack:[
          { fn:'main', color:'main', vars:[
            { name:'s', type:'int', bytes:4, val:'???', addr:'0x7fff5200', highlight:false }
          ], retAddr:'0x400640' }
        ], heap:[], totalBytes:20, released:'add 프레임 -20B 해제' }
      },
      {
        line:'call', type:'exec', vars:{s:7},
        explain:`main 재개. 반환값 7 → <b>s</b>에 저장 (0x7fff5200). add 프레임은 사라짐.`,
        memViz:{ stack:[
          { fn:'main', color:'main', vars:[
            { name:'s', type:'int', bytes:4, val:'7', addr:'0x7fff5200', highlight:true }
          ], retAddr:'0x400640' }
        ], heap:[], totalBytes:20 }
      },
      {
        line:'pr', type:'exec',
        explain:`printf("s=7\\n").`,
        output:'s=7',
        memViz:{ stack:[
          { fn:'main', color:'main', vars:[
            { name:'s', type:'int', bytes:4, val:'7', addr:'0x7fff5200', highlight:false }
          ], retAddr:'0x400640' }
        ], heap:[], totalBytes:20 }
      },
      {
        line:'ret', type:'exec',
        explain:`main <b>return 0</b> — OS에 0 반환. main 프레임 <b class="r">-20B 해제</b>. 스택 비어있음.`,
        memViz:{ stack:[], heap:[], totalBytes:0, released:'main 프레임 -20B 해제 → 스택 비어있음' }
      },
    ]
  },

  // ── goto ────────────────────────────────────────────────
  goto_stmt: {
    name: 'goto.c',
    title: 'goto 문 ⚠',
    varTypes: { i: 'int' },
    concept: `<b>goto 레이블;</b> — 프로그램 흐름을 지정 위치로 <b>무조건 이동</b>합니다.<br>
<b class="r">현대 C에서는 사용을 강력히 자제합니다.</b> (스파게티 코드 유발)<br>
예외적으로 다중 중첩 루프 탈출, 오류 처리 패턴에 제한적 사용.`,
    vars: { i: null },
    baseAddr: { i: '0x7fff5200' },
    code: [
      { text:`<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank:true },
      { text:`<span class="ty">int</span> <span class="fn-c">main</span>() {`, blank:true },
      { id:'d1',  text:`    <span class="ty">int</span> <span class="vr">i</span> = <span class="nm">0</span>;` },
      { id:'lbl', text:`<span class="lbl">loop_start:</span>                  <span class="cm">// 레이블</span>` },
      { id:'ci',  text:`    <span class="kw">if</span> (<span class="vr">i</span> >= <span class="nm">4</span>) <span class="kw">goto</span> <span class="lbl">done</span>;` },
      { id:'pr',  text:`    <span class="fn-c">printf</span>(<span class="st">"i=%d\\n"</span>, <span class="vr">i</span>);` },
      { id:'inc', text:`    <span class="vr">i</span>++;` },
      { id:'gt',  text:`    <span class="kw">goto</span> <span class="lbl">loop_start</span>;     <span class="cm">// 위로 점프</span>` },
      { id:'dn',  text:`<span class="lbl">done:</span>` },
      { id:'pr2', text:`    <span class="fn-c">printf</span>(<span class="st">"완료 i=%d\\n"</span>, <span class="vr">i</span>);` },
      { id:'ret', text:`    <span class="kw">return</span> <span class="nm">0</span>;` },
      { text:`}`, blank:true },
    ],
    steps: [
      { line:'d1',  type:'exec', vars:{i:0}, explain:`<b>i=0</b> 선언.` },
      { line:'lbl', type:'exec', explain:`loop_start: 레이블 도달 (첫 번째).` },
      { line:'ci',  type:'exec', cond:false, vars:{i:0}, explain:`i(0) >= 4? → <span class="e-skip">거짓</span>. goto done 건너뜀.` },
      { line:'pr',  type:'exec', explain:`printf("i=0").`, output:'i=0' },
      { line:'inc', type:'exec', vars:{i:1}, explain:`i++ → i=1.` },
      { line:'gt',  type:'exec', explain:`<b class="e-exec">goto loop_start!</b> 위로 점프.` },
      { line:'lbl', type:'exec', explain:`loop_start: 재진입 (두 번째).` },
      { line:'ci',  type:'exec', cond:false, vars:{i:1}, explain:`i(1) >= 4? → <span class="e-skip">거짓</span>.` },
      { line:'pr',  type:'exec', explain:`printf("i=1").`, output:'i=1' },
      { line:'inc', type:'exec', vars:{i:2}, explain:`i++ → i=2.` },
      { line:'gt',  type:'exec', explain:`goto loop_start.` },
      { line:'lbl', type:'exec', explain:`loop_start: 재진입 (세 번째).` },
      { line:'ci',  type:'exec', cond:false, vars:{i:2}, explain:`i(2) >= 4? → <span class="e-skip">거짓</span>.` },
      { line:'pr',  type:'exec', explain:`printf("i=2").`, output:'i=2' },
      { line:'inc', type:'exec', vars:{i:3}, explain:`i++ → i=3.` },
      { line:'gt',  type:'exec', explain:`goto loop_start.` },
      { line:'lbl', type:'exec', explain:`loop_start: 재진입 (네 번째).` },
      { line:'ci',  type:'exec', cond:false, vars:{i:3}, explain:`i(3) >= 4? → <span class="e-skip">거짓</span>.` },
      { line:'pr',  type:'exec', explain:`printf("i=3").`, output:'i=3' },
      { line:'inc', type:'exec', vars:{i:4}, explain:`i++ → i=4.` },
      { line:'gt',  type:'exec', explain:`goto loop_start.` },
      { line:'lbl', type:'exec', explain:`loop_start: 재진입 (다섯 번째).` },
      { line:'ci',  type:'exec', cond:true, vars:{i:4},  explain:`i(4) >= 4? → <span class="e-exec">참!</span> goto done 실행.` },
      { line:'dn',  type:'exec', explain:`<b>done: 레이블</b> 도달. 루프 종료.` },
      { line:'pr2', type:'exec', explain:`printf("완료 i=4").`, output:'완료 i=4' },
      { line:'ret', type:'exec', explain:`<b>return 0</b>.` },
    ]
  },

}; // end TOPICS

// ── 스택 프레임 ──────────────────────────────────────────
TOPICS.stack_frames = {
  name: 'stack_frames.c',
  title: '스택 프레임 할당 / 해제',
  varTypes: {},
  concept: `함수를 호출할 때마다 스택에 <b>프레임(frame)</b>이 쌓이고, return 시 <b>해제</b>됩니다.<br>
각 프레임은 <b>매개변수 + 지역변수 + 복귀주소</b>를 담습니다.<br>
<b class="r">스택은 높은 주소 → 낮은 주소로 성장</b>합니다.`,
  vars: {},
  baseAddr: {},
  code: [
    { text:`<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank:true },
    { text:``, blank:true },
    { id:'fd', text:`<span class="ty">int</span> <span class="fn-c">square</span>(<span class="ty">int</span> <span class="vr">n</span>) {` },
    { id:'fr', text:`    <span class="kw">return</span> <span class="vr">n</span> * <span class="vr">n</span>;` },
    { text:`}`, blank:true },
    { text:``, blank:true },
    { id:'gd', text:`<span class="ty">int</span> <span class="fn-c">add_squares</span>(<span class="ty">int</span> <span class="vr">a</span>, <span class="ty">int</span> <span class="vr">b</span>) {` },
    { id:'g1', text:`    <span class="ty">int</span> <span class="vr">s1</span> = <span class="fn-c">square</span>(<span class="vr">a</span>);` },
    { id:'g2', text:`    <span class="ty">int</span> <span class="vr">s2</span> = <span class="fn-c">square</span>(<span class="vr">b</span>);` },
    { id:'gr', text:`    <span class="kw">return</span> <span class="vr">s1</span> + <span class="vr">s2</span>;` },
    { text:`}`, blank:true },
    { text:``, blank:true },
    { text:`<span class="ty">int</span> <span class="fn-c">main</span>() {`, blank:true },
    { id:'mc', text:`    <span class="ty">int</span> <span class="vr">res</span> = <span class="fn-c">add_squares</span>(<span class="nm">3</span>, <span class="nm">4</span>);` },
    { id:'mp', text:`    <span class="fn-c">printf</span>(<span class="st">"%d\\n"</span>, <span class="vr">res</span>);` },
    { id:'mr', text:`    <span class="kw">return</span> <span class="nm">0</span>;` },
    { text:`}`, blank:true },
  ],
  steps: [
    {
      line:'mc', type:'exec',
      explain:`main: <b>add_squares(3,4)</b> 호출. main 프레임이 스택에 존재. add_squares 프레임 생성 시작.`,
      memViz: {
        stack: [
          { fn:'main', color:'main', vars:[
            { name:'res', type:'int', bytes:4, val:'???', addr:'0x7fff5200', highlight:false }
          ], retAddr:'0x400700' }
        ],
        heap: [], totalBytes: 8
      }
    },
    {
      line:'gd', type:'exec',
      explain:`<b>add_squares()</b> 프레임 생성. 매개변수 a=3(4B), b=4(4B) 스택에 복사. 총 +16바이트 할당.`,
      memViz: {
        stack: [
          { fn:'main', color:'main', vars:[
            { name:'res', type:'int', bytes:4, val:'???', addr:'0x7fff5200', highlight:false }
          ], retAddr:'0x400700' },
          { fn:'add_squares', color:'call', vars:[
            { name:'a',  type:'int', bytes:4, val:'3',   addr:'0x7fff51f0', highlight:true },
            { name:'b',  type:'int', bytes:4, val:'4',   addr:'0x7fff51ec', highlight:true },
            { name:'s1', type:'int', bytes:4, val:'???', addr:'0x7fff51e8', highlight:false },
            { name:'s2', type:'int', bytes:4, val:'???', addr:'0x7fff51e4', highlight:false },
          ], retAddr:'0x400680' }
        ],
        heap: [], totalBytes: 24
      }
    },
    {
      line:'g1', type:'exec',
      explain:`add_squares: <b>square(3)</b> 호출. square 프레임 +8바이트 추가 생성.`,
      memViz: {
        stack: [
          { fn:'main', color:'main', vars:[{ name:'res', type:'int', bytes:4, val:'???', addr:'0x7fff5200', highlight:false }], retAddr:'0x400700' },
          { fn:'add_squares', color:'call', vars:[
            { name:'a',  type:'int', bytes:4, val:'3',   addr:'0x7fff51f0', highlight:false },
            { name:'b',  type:'int', bytes:4, val:'4',   addr:'0x7fff51ec', highlight:false },
            { name:'s1', type:'int', bytes:4, val:'???', addr:'0x7fff51e8', highlight:false },
            { name:'s2', type:'int', bytes:4, val:'???', addr:'0x7fff51e4', highlight:false },
          ], retAddr:'0x400680' },
          { fn:'square', color:'call', vars:[
            { name:'n',  type:'int', bytes:4, val:'3',   addr:'0x7fff51d8', highlight:true }
          ], retAddr:'0x4005a0' }
        ],
        heap: [], totalBytes: 32
      }
    },
    {
      line:'fr', type:'exec',
      explain:`square: <b>return n*n = 9</b>. square 프레임 <b class="r">해제 -8B</b>. 복귀주소로 점프.`,
      output:'square(3) → 9',
      memViz: {
        stack: [
          { fn:'main', color:'main', vars:[{ name:'res', type:'int', bytes:4, val:'???', addr:'0x7fff5200', highlight:false }], retAddr:'0x400700' },
          { fn:'add_squares', color:'call', vars:[
            { name:'a',  type:'int', bytes:4, val:'3',   addr:'0x7fff51f0', highlight:false },
            { name:'b',  type:'int', bytes:4, val:'4',   addr:'0x7fff51ec', highlight:false },
            { name:'s1', type:'int', bytes:4, val:'9',   addr:'0x7fff51e8', highlight:true },
            { name:'s2', type:'int', bytes:4, val:'???', addr:'0x7fff51e4', highlight:false },
          ], retAddr:'0x400680' }
        ],
        heap: [], totalBytes: 24, released:'square (+8B 해제)'
      }
    },
    {
      line:'g2', type:'exec',
      explain:`add_squares: <b>square(4)</b> 두 번째 호출. square 프레임 다시 +8B 생성.`,
      memViz: {
        stack: [
          { fn:'main', color:'main', vars:[{ name:'res', type:'int', bytes:4, val:'???', addr:'0x7fff5200', highlight:false }], retAddr:'0x400700' },
          { fn:'add_squares', color:'call', vars:[
            { name:'a',  type:'int', bytes:4, val:'3',   addr:'0x7fff51f0', highlight:false },
            { name:'b',  type:'int', bytes:4, val:'4',   addr:'0x7fff51ec', highlight:false },
            { name:'s1', type:'int', bytes:4, val:'9',   addr:'0x7fff51e8', highlight:false },
            { name:'s2', type:'int', bytes:4, val:'???', addr:'0x7fff51e4', highlight:false },
          ], retAddr:'0x400680' },
          { fn:'square', color:'call', vars:[
            { name:'n',  type:'int', bytes:4, val:'4',   addr:'0x7fff51d8', highlight:true }
          ], retAddr:'0x4005b0' }
        ],
        heap: [], totalBytes: 32
      }
    },
    {
      line:'fr', type:'exec',
      explain:`square: <b>return 4*4 = 16</b>. square 프레임 <b class="r">다시 해제 -8B</b>.`,
      output:'square(4) → 16',
      memViz: {
        stack: [
          { fn:'main', color:'main', vars:[{ name:'res', type:'int', bytes:4, val:'???', addr:'0x7fff5200', highlight:false }], retAddr:'0x400700' },
          { fn:'add_squares', color:'call', vars:[
            { name:'a',  type:'int', bytes:4, val:'3',   addr:'0x7fff51f0', highlight:false },
            { name:'b',  type:'int', bytes:4, val:'4',   addr:'0x7fff51ec', highlight:false },
            { name:'s1', type:'int', bytes:4, val:'9',   addr:'0x7fff51e8', highlight:false },
            { name:'s2', type:'int', bytes:4, val:'16',  addr:'0x7fff51e4', highlight:true },
          ], retAddr:'0x400680' }
        ],
        heap: [], totalBytes: 24, released:'square (+8B 해제)'
      }
    },
    {
      line:'gr', type:'exec',
      explain:`add_squares: <b>return s1+s2 = 9+16 = 25</b>. add_squares 프레임 <b class="r">해제 -24B</b>.`,
      output:'add_squares(3,4) → 25',
      memViz: {
        stack: [
          { fn:'main', color:'main', vars:[
            { name:'res', type:'int', bytes:4, val:'25', addr:'0x7fff5200', highlight:true }
          ], retAddr:'0x400700' }
        ],
        heap: [], totalBytes: 8, released:'add_squares (+24B 해제)'
      }
    },
    {
      line:'mp', type:'exec',
      explain:`main: printf("25\\n"). 스택에는 main 프레임만 남아있음.`,
      output:'25',
      memViz: {
        stack: [
          { fn:'main', color:'main', vars:[
            { name:'res', type:'int', bytes:4, val:'25', addr:'0x7fff5200', highlight:false }
          ], retAddr:'0x400700' }
        ],
        heap: [], totalBytes: 8
      }
    },
    {
      line:'mr', type:'exec',
      explain:`main: <b>return 0</b>. main 프레임도 <b class="r">해제</b>. 스택 비어있음. 프로그램 종료.`,
      memViz: {
        stack: [],
        heap: [], totalBytes: 0, released:'main (+8B 해제) → 스택 비어있음'
      }
    },
  ]
};

// ── malloc / free ────────────────────────────────────────
TOPICS.malloc_free = {
  name: 'malloc_free.c',
  title: 'malloc / free — 힙 동적 할당',
  varTypes: { p: 'int*', arr: 'int*' },
  concept: `<b>malloc(n)</b>은 <b>힙(Heap)</b> 영역에서 n바이트를 동적 할당합니다.<br>
스택과 달리 함수가 끝나도 <b class="r">자동으로 해제되지 않습니다.</b><br>
반드시 <code>free()</code>로 직접 해제해야 합니다. 안 하면 <b class="r">메모리 누수</b>!`,
  vars: {},
  baseAddr: {},
  code: [
    { text:`<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank:true },
    { text:`<span class="pp">#include</span> <span class="st">&lt;stdlib.h&gt;</span>`, blank:true },
    { text:``, blank:true },
    { text:`<span class="ty">int</span> <span class="fn-c">main</span>() {`, blank:true },
    { id:'m1', text:`    <span class="ty">int</span> *<span class="vr">p</span> = <span class="fn-c">malloc</span>(<span class="nm">4</span>);      <span class="cm">// int 1개: 4B</span>` },
    { id:'m2', text:`    <span class="ty">int</span> *<span class="vr">arr</span> = <span class="fn-c">malloc</span>(<span class="nm">4</span>*<span class="nm">5</span>);  <span class="cm">// int 5개: 20B</span>` },
    { id:'a1', text:`    *<span class="vr">p</span> = <span class="nm">42</span>;` },
    { id:'a2', text:`    <span class="kw">for</span>(<span class="ty">int</span> <span class="vr">i</span>=<span class="nm">0</span>; <span class="vr">i</span><<span class="nm">5</span>; <span class="vr">i</span>++) <span class="vr">arr</span>[<span class="vr">i</span>]=<span class="vr">i</span>*<span class="nm">10</span>;` },
    { id:'f1', text:`    <span class="fn-c">free</span>(<span class="vr">p</span>);             <span class="cm">// 4B 해제</span>` },
    { id:'f2', text:`    <span class="fn-c">free</span>(<span class="vr">arr</span>);           <span class="cm">// 20B 해제</span>` },
    { id:'ret',text:`    <span class="kw">return</span> <span class="nm">0</span>;` },
    { text:`}`, blank:true },
  ],
  steps: [
    {
      line:'m1', type:'exec',
      explain:`<b>malloc(4)</b> — 힙에서 4바이트 할당. 포인터 p(스택)가 힙 주소 <b>0x55a3c020</b>를 가리킴.`,
      memViz: {
        stack: [
          { fn:'main', color:'main', vars:[
            { name:'p',   type:'int*', bytes:8, val:'0x55a3c020', addr:'0x7fff5200', highlight:true },
            { name:'arr', type:'int*', bytes:8, val:'???',        addr:'0x7fff51f8', highlight:false },
          ], retAddr:'0x400700' }
        ],
        heap: [
          { id:'h1', label:'malloc(4)', addr:'0x55a3c020', bytes:4, items:[{ name:'*p', val:'???', bytes:4 }], freed:false }
        ],
        totalBytes: 16+4, pointers:[{ from:'p', to:'h1' }]
      }
    },
    {
      line:'m2', type:'exec',
      explain:`<b>malloc(4×5=20)</b> — 힙에서 20바이트 추가 할당. arr(스택)가 힙 주소 <b>0x55a3c030</b>를 가리킴.`,
      memViz: {
        stack: [
          { fn:'main', color:'main', vars:[
            { name:'p',   type:'int*', bytes:8, val:'0x55a3c020', addr:'0x7fff5200', highlight:false },
            { name:'arr', type:'int*', bytes:8, val:'0x55a3c030', addr:'0x7fff51f8', highlight:true },
          ], retAddr:'0x400700' }
        ],
        heap: [
          { id:'h1', label:'malloc(4)',    addr:'0x55a3c020', bytes:4,  items:[{ name:'*p',     val:'???', bytes:4  }], freed:false },
          { id:'h2', label:'malloc(20)',   addr:'0x55a3c030', bytes:20, items:[{ name:'arr[0-4]',val:'???', bytes:20 }], freed:false }
        ],
        totalBytes: 16+24, pointers:[{ from:'p', to:'h1' },{ from:'arr', to:'h2' }]
      }
    },
    {
      line:'a1', type:'exec',
      explain:`<b>*p = 42</b> — 힙 주소 0x55a3c020에 값 42 저장. 역참조로 힙 블록에 직접 씀.`,
      memViz: {
        stack: [
          { fn:'main', color:'main', vars:[
            { name:'p',   type:'int*', bytes:8, val:'0x55a3c020', addr:'0x7fff5200', highlight:false },
            { name:'arr', type:'int*', bytes:8, val:'0x55a3c030', addr:'0x7fff51f8', highlight:false },
          ], retAddr:'0x400700' }
        ],
        heap: [
          { id:'h1', label:'malloc(4)',  addr:'0x55a3c020', bytes:4,  items:[{ name:'*p',    val:'42',  bytes:4  }], freed:false },
          { id:'h2', label:'malloc(20)', addr:'0x55a3c030', bytes:20, items:[{ name:'arr[]', val:'???', bytes:20 }], freed:false }
        ],
        totalBytes: 40, pointers:[{ from:'p', to:'h1' },{ from:'arr', to:'h2' }]
      }
    },
    {
      line:'a2', type:'exec',
      explain:`for 루프로 <b>arr[0..4] = {0,10,20,30,40}</b> 저장. 힙 20B에 데이터 기록.`,
      memViz: {
        stack: [
          { fn:'main', color:'main', vars:[
            { name:'p',   type:'int*', bytes:8, val:'0x55a3c020', addr:'0x7fff5200', highlight:false },
            { name:'arr', type:'int*', bytes:8, val:'0x55a3c030', addr:'0x7fff51f8', highlight:false },
          ], retAddr:'0x400700' }
        ],
        heap: [
          { id:'h1', label:'malloc(4)',  addr:'0x55a3c020', bytes:4,  items:[{ name:'*p',    val:'42',            bytes:4  }], freed:false },
          { id:'h2', label:'malloc(20)', addr:'0x55a3c030', bytes:20, items:[{ name:'arr[]', val:'0,10,20,30,40', bytes:20 }], freed:false }
        ],
        totalBytes: 40, pointers:[{ from:'p', to:'h1' },{ from:'arr', to:'h2' }]
      }
    },
    {
      line:'f1', type:'exec',
      explain:`<b>free(p)</b> — 힙 블록 0x55a3c020 <b class="r">4B 해제</b>. p는 여전히 그 주소를 가리키지만 접근하면 위험 (dangling pointer)!`,
      output:'free(p) → 힙 4B 해제',
      memViz: {
        stack: [
          { fn:'main', color:'main', vars:[
            { name:'p',   type:'int*', bytes:8, val:'0x55a3c020⚠', addr:'0x7fff5200', highlight:true },
            { name:'arr', type:'int*', bytes:8, val:'0x55a3c030',   addr:'0x7fff51f8', highlight:false },
          ], retAddr:'0x400700' }
        ],
        heap: [
          { id:'h1', label:'해제됨',    addr:'0x55a3c020', bytes:4,  items:[{ name:'freed', val:'—', bytes:4  }], freed:true  },
          { id:'h2', label:'malloc(20)', addr:'0x55a3c030', bytes:20, items:[{ name:'arr[]', val:'0,10,20,30,40', bytes:20 }], freed:false }
        ],
        totalBytes: 20, pointers:[{ from:'arr', to:'h2' }]
      }
    },
    {
      line:'f2', type:'exec',
      explain:`<b>free(arr)</b> — 힙 블록 0x55a3c030 <b class="r">20B 해제</b>. 힙 완전히 비어있음.`,
      output:'free(arr) → 힙 20B 해제',
      memViz: {
        stack: [
          { fn:'main', color:'main', vars:[
            { name:'p',   type:'int*', bytes:8, val:'0x55a3c020⚠', addr:'0x7fff5200', highlight:false },
            { name:'arr', type:'int*', bytes:8, val:'0x55a3c030⚠', addr:'0x7fff51f8', highlight:true },
          ], retAddr:'0x400700' }
        ],
        heap: [
          { id:'h1', label:'해제됨', addr:'0x55a3c020', bytes:4,  items:[{ name:'freed', val:'—', bytes:4  }], freed:true },
          { id:'h2', label:'해제됨', addr:'0x55a3c030', bytes:20, items:[{ name:'freed', val:'—', bytes:20 }], freed:true }
        ],
        totalBytes: 16, pointers:[]
      }
    },
    {
      line:'ret', type:'exec',
      explain:`<b>return 0</b> — main 스택 프레임도 해제. 힙+스택 모두 비어있음. 정상 종료.`,
      memViz: { stack:[], heap:[], totalBytes:0, released:'모든 메모리 해제 완료' }
    },
  ]
};

// ── 포인터 화살표 ────────────────────────────────────────
TOPICS.ptr_arrow = {
  name: 'pointer_arrow.c',
  title: '포인터 → 주소 화살표',
  varTypes: { x: 'int', y: 'int', p: 'int*' },
  concept: `<b>포인터</b>는 다른 변수의 <b>메모리 주소</b>를 저장하는 변수입니다.<br>
<code>&변수</code>로 주소를 얻고, <code>*포인터</code>로 값을 읽거나 씁니다 (역참조).<br>
포인터 자체는 <b>8바이트</b> (64-bit 주소), 가리키는 대상의 크기와 무관합니다.`,
  vars: {},
  baseAddr: {},
  code: [
    { text:`<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>`, blank:true },
    { text:`<span class="ty">int</span> <span class="fn-c">main</span>() {`, blank:true },
    { id:'d1',  text:`    <span class="ty">int</span>  <span class="vr">x</span> = <span class="nm">10</span>;` },
    { id:'d2',  text:`    <span class="ty">int</span>  <span class="vr">y</span> = <span class="nm">20</span>;` },
    { id:'dp',  text:`    <span class="ty">int</span> *<span class="vr">p</span> = &<span class="vr">x</span>;        <span class="cm">// p → x 주소</span>` },
    { id:'pr1', text:`    <span class="fn-c">printf</span>(<span class="st">"%d\\n"</span>, *<span class="vr">p</span>);   <span class="cm">// 역참조: 10</span>` },
    { id:'ch',  text:`    *<span class="vr">p</span> = <span class="nm">99</span>;             <span class="cm">// x 값 변경</span>` },
    { id:'pr2', text:`    <span class="fn-c">printf</span>(<span class="st">"%d\\n"</span>, <span class="vr">x</span>);    <span class="cm">// x = 99</span>` },
    { id:'rp',  text:`    <span class="vr">p</span> = &<span class="vr">y</span>;             <span class="cm">// p → y 주소</span>` },
    { id:'pr3', text:`    <span class="fn-c">printf</span>(<span class="st">"%d\\n"</span>, *<span class="vr">p</span>);   <span class="cm">// 역참조: 20</span>` },
    { id:'ret', text:`    <span class="kw">return</span> <span class="nm">0</span>;` },
    { text:`}`, blank:true },
  ],
  steps: [
    {
      line:'d1', type:'exec',
      explain:`<b>int x = 10</b> 선언. 스택 0x7fff5208에 4B 할당.`,
      memViz: {
        stack:[{ fn:'main', color:'main', vars:[
          { name:'x', type:'int',  bytes:4, val:'10',  addr:'0x7fff5208', highlight:true }
        ], retAddr:'0x400700' }],
        heap:[], totalBytes:4, pointers:[]
      }
    },
    {
      line:'d2', type:'exec',
      explain:`<b>int y = 20</b> 선언. 스택 0x7fff5204에 4B 할당.`,
      memViz: {
        stack:[{ fn:'main', color:'main', vars:[
          { name:'x', type:'int',  bytes:4, val:'10',  addr:'0x7fff5208', highlight:false },
          { name:'y', type:'int',  bytes:4, val:'20',  addr:'0x7fff5204', highlight:true  }
        ], retAddr:'0x400700' }],
        heap:[], totalBytes:8, pointers:[]
      }
    },
    {
      line:'dp', type:'exec',
      explain:`<b>int *p = &x</b> — 포인터 p가 x의 주소(0x7fff5208)를 저장. p 자체는 8B. 화살표: p → x.`,
      memViz: {
        stack:[{ fn:'main', color:'main', vars:[
          { name:'x', type:'int',  bytes:4, val:'10',        addr:'0x7fff5208', highlight:false },
          { name:'y', type:'int',  bytes:4, val:'20',        addr:'0x7fff5204', highlight:false },
          { name:'p', type:'int*', bytes:8, val:'0x7fff5208',addr:'0x7fff51f8', highlight:true  }
        ], retAddr:'0x400700' }],
        heap:[], totalBytes:16,
        ptrLinks:[{ from:'p', toName:'x', toAddr:'0x7fff5208' }]
      }
    },
    {
      line:'pr1', type:'exec',
      explain:`<b>*p</b> 역참조 — p가 가리키는 주소(0x7fff5208)의 값 = 10 출력.`,
      output:'10',
      memViz: {
        stack:[{ fn:'main', color:'main', vars:[
          { name:'x', type:'int',  bytes:4, val:'10',        addr:'0x7fff5208', highlight:true  },
          { name:'y', type:'int',  bytes:4, val:'20',        addr:'0x7fff5204', highlight:false },
          { name:'p', type:'int*', bytes:8, val:'0x7fff5208',addr:'0x7fff51f8', highlight:false }
        ], retAddr:'0x400700' }],
        heap:[], totalBytes:16,
        ptrLinks:[{ from:'p', toName:'x', toAddr:'0x7fff5208' }]
      }
    },
    {
      line:'ch', type:'exec',
      explain:`<b>*p = 99</b> — p가 가리키는 곳에 99 저장 → x의 값이 10에서 <b>99</b>로 바뀜!`,
      memViz: {
        stack:[{ fn:'main', color:'main', vars:[
          { name:'x', type:'int',  bytes:4, val:'99',        addr:'0x7fff5208', highlight:true  },
          { name:'y', type:'int',  bytes:4, val:'20',        addr:'0x7fff5204', highlight:false },
          { name:'p', type:'int*', bytes:8, val:'0x7fff5208',addr:'0x7fff51f8', highlight:false }
        ], retAddr:'0x400700' }],
        heap:[], totalBytes:16,
        ptrLinks:[{ from:'p', toName:'x', toAddr:'0x7fff5208' }]
      }
    },
    {
      line:'pr2', type:'exec',
      explain:`x를 직접 출력 → <b>99</b>. *p = 99 가 x를 통해 변경된 것 확인.`,
      output:'99',
      memViz: {
        stack:[{ fn:'main', color:'main', vars:[
          { name:'x', type:'int',  bytes:4, val:'99',        addr:'0x7fff5208', highlight:false },
          { name:'y', type:'int',  bytes:4, val:'20',        addr:'0x7fff5204', highlight:false },
          { name:'p', type:'int*', bytes:8, val:'0x7fff5208',addr:'0x7fff51f8', highlight:false }
        ], retAddr:'0x400700' }],
        heap:[], totalBytes:16,
        ptrLinks:[{ from:'p', toName:'x', toAddr:'0x7fff5208' }]
      }
    },
    {
      line:'rp', type:'exec',
      explain:`<b>p = &y</b> — 포인터 p가 이제 y의 주소(0x7fff5204)를 가리킴. 화살표 방향 변경!`,
      memViz: {
        stack:[{ fn:'main', color:'main', vars:[
          { name:'x', type:'int',  bytes:4, val:'99',        addr:'0x7fff5208', highlight:false },
          { name:'y', type:'int',  bytes:4, val:'20',        addr:'0x7fff5204', highlight:false },
          { name:'p', type:'int*', bytes:8, val:'0x7fff5204',addr:'0x7fff51f8', highlight:true  }
        ], retAddr:'0x400700' }],
        heap:[], totalBytes:16,
        ptrLinks:[{ from:'p', toName:'y', toAddr:'0x7fff5204' }]
      }
    },
    {
      line:'pr3', type:'exec',
      explain:`<b>*p</b> 역참조 — 이번엔 y(0x7fff5204)의 값 = <b>20</b> 출력.`,
      output:'20',
      memViz: {
        stack:[{ fn:'main', color:'main', vars:[
          { name:'x', type:'int',  bytes:4, val:'99',        addr:'0x7fff5208', highlight:false },
          { name:'y', type:'int',  bytes:4, val:'20',        addr:'0x7fff5204', highlight:true  },
          { name:'p', type:'int*', bytes:8, val:'0x7fff5204',addr:'0x7fff51f8', highlight:false }
        ], retAddr:'0x400700' }],
        heap:[], totalBytes:16,
        ptrLinks:[{ from:'p', toName:'y', toAddr:'0x7fff5204' }]
      }
    },
    {
      line:'ret', type:'exec',
      explain:`<b>return 0</b> — main 프레임 해제. x(4B) + y(4B) + p(8B) = <b>16B 모두 해제</b>.`,
      memViz:{ stack:[], heap:[], totalBytes:0, released:'스택 16B 전부 해제' }
    },
  ]
};
