## C Debugger — C 제어문/메모리 학습 도구

브라우저에서 C 언어 제어문과 메모리를 **한 스텝씩 시각화**하면서 학습할 수 있는 작은 웹 프로젝트입니다.  
조건문(if / switch), 중첩 if, 점수/학점 분기 등 6장 예제를 따라가며 **코드 실행 흐름 + 스택 메모리 상태**를 동시에 볼 수 있습니다.

---

### 프로젝트 구조

- **`ch06.html`**  
  - 6장(조건 선택) 디버거의 단일 HTML 엔트리입니다.  
  - 상단 Topbar, 사이드바, 에디터 영역, 우측 패널(개념/현재 실행/메모리 맵/변수 테이블/출력) 레이아웃을 정의합니다.
  - 스크립트로 `src/chapter06/topics.js`, `src/chapter06/debugger.js`를 로드합니다.

- **`src/chapter06/topics.js`**  
  - 6장에 등장하는 각 예제 코드를 **데이터로 정의**하는 파일입니다.
  - 주요 구조:
    - `TOPIC_META`: 사이드바에 표시될 토픽 리스트/그룹 정보를 정의합니다. (예: `01basicif`, `04nestedif`, `07seasonswitch` 등)
    - `TOPICS`: 실제 C 코드, 설명, 스텝 정보를 담는 큰 객체입니다.
      - `name`: 원본 C 파일 이름 (예: `04nestedif.c`)
      - `title`: 화면에 보여줄 제목/부제
      - `varTypes`: 각 변수의 타입 정보 (`int`, `double` 등)
      - `baseAddr`: 변수들의 기본 주소(교육용 가상 주소)
      - `code`: 에디터에 렌더링할 C 코드 라인 배열
      - `steps`: 디버거가 한 스텝씩 따라갈 때 사용할 실행 정보
        - `line`: 하이라이트할 코드 라인 id
        - `type`: `exec` / `skip` / `next` (실행/건너뜀/다음)
        - `vars`: 이 스텝에서 변경되는 변수 값들 (`{ n: 7 }` 등)
        - `output`: `printf` 결과에 해당하는 출력 문자열
        - `cond`: 조건식 결과 (`true`/`false`) — 현재 실행 패널의 뱃지에 사용
        - `memViz`: 스택/힙 메모리 맵을 시각화하기 위한 구조화된 데이터

- **`src/chapter06/debugger.js`**  
  - 화면 렌더링과 Step 진행을 담당하는 **핵심 로직**입니다.
  - 주요 구성:
    - 전역 `state`: 현재 토픽 키, 현재 스텝 인덱스, 출력 라인, 변수 상태(`varState`), 마지막 메모리 스냅샷(`lastMemViz`)을 관리합니다.
    - 타입/메모리 유틸:
      - `TYPE_META`, `getTypeBytes(type)`: `int`, `double`, 포인터 등의 바이트 수를 정의/계산합니다.
      - `valToHexBytes(val, type, bytes)`: 정수/실수 값을 **리틀 엔디안 헥사 바이트 배열**로 변환하여 메모리 맵에 표시합니다.
    - 렌더 함수:
      - `renderCode(topic, activeLineId, type)`: C 코드 영역을 라인 번호, 실행/건너뜀/다음 화살표와 함께 렌더링합니다.
      - `renderMemTable(topic, newVars)`: 변수 테이블(주소/변수명/타입/값)을 그립니다. `newVars`가 들어오면 `state.varState`를 갱신합니다.
      - `renderOutput`, `appendOutput`, `clearOutput`: 출력 패널 관리.
      - 스택/메모리 뷰:
        - `_buildNormalizedStackFrames(stack, topic, varState)`: 토픽 메타데이터(`varTypes`, `baseAddr`/`_autoBaseAddr`)와 현재 변수 상태를 이용해 각 프레임/변수의 타입·주소·바이트·값을 정규화합니다.
        - `_renderMemMapColumn(normalizedStack)`: 왼쪽 메모리 맵(주소/바이트/값)을 렌더합니다.
        - `_renderStackColumn(normalizedStack, heap)`: 가운데 스택 프레임(변수 목록, 주소 범위, frame size)을 렌더합니다.
        - `_renderHeapAndPointers(heap, ptrLinks, released)`: 힙 블록, 포인터 연결선, 해제 배너를 렌더합니다.
        - `renderStackViz(memViz)`: 위 세 부분을 조합해 최종 스택/힙 시각화를 구성합니다.
    - Step 진행 로직:
      - `updateUI()`: 현재 스텝에 맞게
        - 코드 라인 하이라이트,
        - 설명 박스(현재 실행),
        - 조건 뱃지,
        - 변수 테이블,
        - 메모리 뷰
        를 모두 동기화합니다.
      - `stepForward()`, `stepBack()`, `runAll()`, `resetDebug()`: Step 제어 및 상태 복원/초기화를 담당합니다.
    - 사이드바/테마:
      - `renderSidebar()`: `TOPIC_META`를 기반으로 좌측 토픽 목록을 동적으로 생성합니다.
      - `selectTopic(topicKey)`: 토픽 선택 시 상태 초기화, 에디터 제목/개념 영역 갱신, 변수 주소 자동 계산 등을 수행합니다.
      - `getTheme`, `setTheme`, `toggleTheme`: 다크/라이트 모드 전환 및 `localStorage` 저장.
    - 리사이즈 유틸(재사용 가능하게 분리):
      - `initRightPaneResizer({ rightPaneId, resizerId, storageKey, minWidth, maxWidth })`: 에디터와 우측 패널 사이 세로 리사이저를 초기화합니다.
      - `initPanelResizers({ panelIds, storageKey })`: 개념/현재 실행/메모리 맵/변수 테이블 패널의 높이 조절 리사이저를 초기화합니다.
      - `initResize()`: 위 두 함수를 ch06 레이아웃에 맞춰 호출하는 엔트리 함수입니다.

---

### 동작 방식 요약

1. **토픽 선택**
   - 좌측 사이드바에서 토픽을 클릭하면 `selectTopic(topicKey)`가 호출됩니다.
   - `TOPICS[topicKey]`에서
     - 코드(`code`)와 개념(`concept`)을 에디터/개념 패널에 렌더링하고,
     - `varTypes` 기반으로 변수들의 자동 주소 맵(`_autoBaseAddr`)을 계산합니다.
   - 상태(`state`)를 초기화한 뒤 첫 화면을 그립니다.

2. **Step 진행**
   - 사용자가 `Step` 버튼이나 키보드(→ / n)를 누르면 `stepForward()`가 호출됩니다.
   - 현재 토픽의 `steps[state.stepIndex]`를 읽어
     - `vars`가 있으면 변수 상태를 갱신하고,
     - `output`이 있으면 출력 패널에 한 줄을 추가하며,
     - `memViz`가 있으면 스택/힙 메모리 시각화를 갱신합니다.
   - 마지막으로 `updateUI()`가 호출되어 코드 하이라이트, 설명, 조건 뱃지, 변수 테이블, 메모리 맵이 모두 동기화됩니다.

3. **메모리 맵/변수 테이블 동기화**
   - 변수 테이블은 `state.varState`를 기준으로, 메모리 맵은 `memViz` + `varState`를 합쳐 렌더링합니다.
   - 예를 들어 `scanf` 이후 스텝에서 `vars: { score: 85 }`, `memViz`가 함께 정의되어 있으면:
     - 변수 테이블은 `score = 85`로 갱신되고,
     - 메모리 맵에서는 해당 주소에 `0x55 0x00 0x00 0x00` 같은 헥사 바이트가 표시됩니다.

---

### 브라우저에서 실행 방법

1. 이 리포지토리를 클론합니다.
2. 로컬에서 `ch06.html`을 브라우저(Chrome 등)로 직접 열면 됩니다.
   - 예: 파일 탐색기에서 더블 클릭, 또는 VS Code의 “Open with Live Server” 등 사용.
3. 좌측에서 토픽을 선택하고 `Step` 버튼으로 한 줄씩 실행 흐름과 메모리를 따라가 보세요.

별도의 빌드/런타임 의존성 없이 **정적 HTML/CSS/JS만으로 동작**하도록 설계되어 있습니다.

---

### 다른 장(chapter)으로 확장 시 가이드

- 공통으로 재사용 가능한 부분
  - 메모리/스택 렌더링 로직 (`valToHexBytes`, `_buildNormalizedStackFrames`, `_renderMemMapColumn`, `_renderStackColumn`, `_renderHeapAndPointers`, `renderStackViz`)
  - Step 진행 및 상태 관리 (`state`, `updateUI`, `stepForward`, `stepBack`, `runAll`, `resetDebug`)
  - 리사이저 유틸 (`initRightPaneResizer`, `initPanelResizers`, `initResize`)
  - 테마 토글 및 사이드바 렌더링 틀 (`renderSidebar`, `toggleTheme` 계열)

- 장별로 교체/추가해야 할 부분
  - `TOPIC_META`, `TOPICS` 데이터 정의 (각 장의 예제 코드, 설명, 스텝 정보)
  - HTML 엔트리 파일(예: `ch07.html`)의 레이아웃/텍스트(Topbar 라벨, 제목 등)
  - 필요 시, 해당 장만의 특수한 메모리 표현(예: 포인터/동적 메모리/배열 등)에 대한 `memViz` 구조 확장

이 구조를 그대로 복사해 `src/chapter07/`, `ch07.html` 등을 만들면, **공통 디버거 엔진 + 장별 데이터** 패턴으로 쉽게 확장할 수 있도록 설계되어 있습니다.

