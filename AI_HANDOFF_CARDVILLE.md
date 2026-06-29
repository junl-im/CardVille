# CardVille AI Handoff

이 파일은 대화가 끊겼을 때 다른 AI나 개발자가 바로 이어받을 수 있도록 만든 인계서입니다.  
CardVille 작업을 계속할 때는 먼저 `README.md`와 이 파일을 읽고, 그다음 실제 코드를 확인하세요.

## 1. 프로젝트 정체성

- 프로젝트명: 카드마을 CardVille
- 슬로건: 카드를 모아 꿈의 마을을 완성하세요.
- 장르: 카드 퍼즐, 단어, 연산, 기억력, 교육, 수집, 성장, 캐주얼
- 핵심 방향: 단순 카드게임이 아니라 브랜드가 있는 모바일 판타지 카드마을 게임
- 브랜드 키워드: 소년, 검은 고양이, 카드, 따뜻한 판타지 마을
- 그래픽 방향: 프리미엄 2.5D 판타지, 따뜻한 골드/보라/블루/갈색
- 절대 피할 것: 조악한 교육게임 느낌, 무분별한 SVG, 불필요한 문서 파일 양산

## 2. 고정 캐릭터

사용자가 업로드한 키아트의 소년과 검은 고양이가 CardVille의 고정 브랜드 기준입니다.

### 소년

- 12~14세 느낌
- 밝고 용감하며 모험심 있음
- 항상 웃는 인상
- 파란 망토
- 갈색 부츠
- 흰 셔츠
- 갈색 바지
- 머리, 눈, 비율, 색감, 의상 방향은 바꾸지 말 것

### 검은 고양이

- 항상 주인공과 함께 다님
- 힌트, 튜토리얼, 이벤트, 이모션 담당
- 로비 이동, 튜토리얼 말풍선, 이벤트 반응에 적극 활용

### 기준 이미지

```txt
public/assets/brand/cardville_fixed_character_reference.png
```

이 이미지는 스타일 기준입니다. 앞으로 새 이미지, UI, 아이콘, 영상, 로비 연출을 만들 때 이 캐릭터 인상이 유지되어야 합니다.

## 3. 현재 로비 설계

로그인 후 로비는 한 화면 디오라마 방식입니다.

```txt
           카드 성

도서관      광장      연구소

상점        주인공    학교

기억의 숲   이벤트    항구
```

### 핵심 규칙

- 세로 모바일 화면 기준
- 카메라 고정
- 스크롤 없음
- 한 화면에 주요 건물 모두 표시
- 건물 터치 시 소년과 고양이가 해당 건물까지 3~5걸음 이동
- 이동 후 건물 문 열림, 빛, 바운스 같은 짧은 전환 연출
- 배경은 큰 판타지 일러스트처럼 보이되 건물과 오브젝트는 개별 PNG/WebP로 분리

### 현재 우선 오픈 건물

- 도서관: 낱말 카드
- 연구소: 연산 준비실 또는 모드 선택
- 상점: 카드 앨범
- 기억의 숲: 기억력 준비
- 이벤트: 카드팩 보상

### 준비중 건물

- 카드 성
- 광장
- 학교
- 항구

## 4. 주요 파일 구조

```txt
README.md
AI_HANDOFF_CARDVILLE.md
index.html
package.json
vite.config.ts
public/build.json
public/health.html
public/reset.html
public/assets/brand/cardville_fixed_character_reference.png
public/assets/ui/cardville_login_bg.png
public/assets/video/cardville_intro_loading.mp4
public/assets/diorama/
src/main.ts
src/game/data/brandRules.ts
src/game/data/dioramaBuildings.ts
src/game/data/wordStages.ts
src/game/scenes/LoginScene.ts
src/game/scenes/IntroLoadingScene.ts
src/game/scenes/MainLobbyScene.ts
src/game/scenes/StageSelectScene.ts
src/game/scenes/PlayScene.ts
src/game/scenes/RewardScene.ts
src/game/scenes/CollectionScene.ts
src/game/systems/AuthSystem.ts
src/game/systems/BackButtonSystem.ts
src/game/systems/LayoutSystem.ts
src/game/systems/SaveSystem.ts
src/game/systems/SecuritySystem.ts
tools/check-deploy.mjs
tools/check-brand.mjs
tools/check-ui.mjs
tools/check-layout.mjs
tools/check-association.mjs
tools/check-security.mjs
```

## 5. 기술 스택

- Phaser 3
- TypeScript
- Vite
- Canvas/WebGL 자동
- Firebase는 선택 로그인 시 CDN 지연 로딩
- LocalStorage 자동 저장
- GitHub Pages 배포
- PWA/Service Worker 캐시는 현재 비활성 유지

## 6. 실행과 검증

개발 실행:

```bash
npm install --no-audit --no-fund --no-package-lock
npm run dev
```

전체 검증:

```bash
npm run verify
```

`npm run verify`는 아래를 포함합니다.

```txt
npm run build
npm run check:deploy
npm run check:brand
npm run check:ui
npm run check:layout
npm run check:association
npm run check:security
```

ZIP 생성 시에는 `node_modules`와 `dist`를 포함하지 않습니다.

## 7. 사용자가 정한 전달 규칙

앞으로 답변 보고는 반드시 아래 순서로 작성합니다.

```txt
업데이트 내역
기타 확인 사항
다음 업데이트 예정
ZIP 파일
```

그리고 ZIP은 항상 두 개를 제공합니다.

```txt
통파일: 전체 프로젝트 ZIP
패치파일: 직전 버전에서 바뀐 파일만 담은 ZIP
```

### 문서 생성 규칙

- 버전별 패치노트 파일을 새로 만들지 않습니다.
- 업데이트 기록은 `README.md`에만 누적합니다.
- 인수인계 내용은 이 `AI_HANDOFF_CARDVILLE.md`에 누적합니다.
- 정말 필요한 문서만 유지합니다.
- 불필요한 임시 보고서, 중복 문서, 버전별 감사 문서 생성을 피합니다.


## 8. 1.0.28 프리미엄 에셋 패스

이번 업데이트는 사용자가 제공한 고정 캐릭터 기준 이미지의 톤을 기준으로 로비 자산의 품질 기준을 올린 패치입니다. 핵심 목적은 “초딩 교육게임 같은 임시 자산” 느낌을 줄이고, CardVille를 소년/검은 고양이/따뜻한 판타지 마을 브랜드로 보이게 만드는 것입니다.

### 핵심 변경

- `public/assets/diorama/diorama_bg.png`를 780×1688 고해상도 세로 디오라마 배경으로 교체했습니다.
- 건물 9종을 512×430 프리미엄 프레임형 PNG/WebP 자산으로 교체했습니다.
- 소년과 고양이는 기준 이미지에서 추출한 고해상도 스탠디로 교체했습니다.
- NPC 8종, 소품, UI 패널, 말풍선, 터치 리플, 건물 글로우, 아이콘을 재정비했습니다.
- `tools/check-premium-assets.mjs`와 `check:premium-assets`를 추가해 프리미엄 에셋 검증을 CI에 넣었습니다.
- `package.json`의 `verify`는 기존 `check:assets`, `check:polish`에 더해 `check:premium-assets`를 실행합니다.
- `lobbyEntities.ts`의 안전 규칙에 저품질 임시 그림 금지와 프리미엄 톤 유지 규칙을 추가했습니다.

### 주의

- 임시 채팅 환경에서는 별도 이미지 생성 모델을 직접 호출할 수 없습니다. 이번 버전은 제공된 기준 이미지와 절차적 PNG/WebP 제작으로 런타임 자산을 고해상도화한 구조적 패치입니다.
- 최종 상용 일러스트가 준비되면 기존 파일명과 매니페스트 키를 유지한 채 같은 경로에 덮어쓰면 코드 변경 없이 교체할 수 있습니다.
- 새 버전별 문서 파일은 만들지 않았고, 이 인계서와 README에만 기록했습니다.

## 9. 1.0.27 배치/콘텐츠/성능 다듬기 업데이트

이번 업데이트는 초대형 확장을 계속하기 전, 로비 데이터와 콘텐츠 배정, 성능 정책을 먼저 정리한 안정화 패치입니다. 새 대형 이미지 에셋을 늘리기보다 중복과 꼬임을 줄이는 구조 개선을 우선했습니다.

### 핵심 변경

- `MainLobbyScene.ts` 안에 있던 NPC/소품 배열을 `src/game/data/lobbyEntities.ts`로 분리했습니다.
- 건물별 콘텐츠 배정을 `src/game/data/modeCatalog.ts`로 정리했습니다.
- 연구소는 `math`, 기억의 숲은 `memory` 추천 모드로 `ModeSelectScene`에 연결됩니다.
- `ModeSelectScene`은 어떤 건물에서 들어왔는지에 따라 추천 모드를 강조하고, 준비중 콘텐츠는 다음 작업 내용을 토스트로 보여줍니다.
- `src/game/systems/QualitySystem.ts`를 추가해 저사양/모션감소 환경에서 로비 ambient 오브젝트와 반짝임 밀도를 낮춥니다.
- `src/main.ts`의 Phaser renderer를 `AUTO`로 바꿔 WebGL 우선, Canvas fallback이 가능하게 했습니다.
- `LayoutSystem.addCoverImage` 중심 좌표를 visible bounds 기준으로 보정했습니다.
- 준비중 건물 토스트 배경이 반복 터치마다 남을 수 있는 부분을 정리했습니다.
- `tools/check-polish.mjs`와 `check:polish`를 추가해 로비, 콘텐츠 배정, 품질 시스템, 렌더러 설정을 CI에서 같이 검증합니다.

### 주의

- 버전별 별도 문서는 만들지 않았습니다.
- 1.0.27은 콘텐츠를 대량 구현한 버전이 아니라, 다음 미니게임/상점 확장 전 구조와 검증을 고정하는 패치입니다.
- 새 모드나 건물을 추가할 때는 `modeCatalog.ts`, `dioramaBuildings.ts`, `lobbyEntities.ts`, `assetManifest.ts` 간의 배정이 어긋나지 않도록 확인해야 합니다.

## 10. 1.0.26 NPC 대화/로비 연출 업데이트

이번 업데이트는 1.0.25에서 확보한 자산을 새로 늘리기보다, 기존 NPC/UI 자산을 실제 로비 상호작용으로 연결한 패치입니다.

### 핵심 변경

- `MainLobbyScene.ts`에서 NPC 8종에 대사 배열과 제스처 타입을 연결했습니다.
- NPC 터치 시 `uiSpeechBubble` 말풍선, 하단 힌트 문구, 터치 리플이 같이 반응합니다.
- 상인 손흔들기, 마법사 반짝임, 사서 책 아이콘, 선생님/요리사/마을고양이/경비병/아이 반응을 기존 자산으로 구성했습니다.
- 로비 설정 버튼을 추가해 현재 로비 안전 규칙을 게임 안에서 확인할 수 있게 했습니다.
- 건물 입장 중에는 말풍선과 설정 패널을 닫아 UI 겹침을 막습니다.

### 주의

- 별도 신규 문서 파일은 만들지 않았습니다.
- 이번 패치는 새 대형 에셋 추가보다 기존 자산 연결과 코드 안정성을 우선했습니다.

## 11. 1.0.25 자산 기반 업데이트

이번 업데이트는 다음 대규모 기능 개발 전에 자산과 로딩 구조를 먼저 정리한 버전입니다.

### 핵심 변경

- GitHub Actions 자동 배포 파일은 `.github/workflows/deploy.yml`에 있으며, push 또는 수동 실행 시 `npm run verify`를 실행합니다.
- `package.json`의 `verify`에 `npm run check:assets`가 추가되었습니다.
- 모든 런타임 자산은 `src/game/data/assetManifest.ts`에서 key/path/category/role 단위로 관리합니다.
- `IntroLoadingScene`은 asset manifest를 읽어 중복 key 없이 preload합니다.
- 기존 수동 preload 라인은 안전을 위해 남겨두었고, `queuedKeys` Set으로 중복 등록을 막습니다.

### 추가 자산

- 캐릭터 프레임: `public/assets/characters/hero_*.png`, `cat_*.png`
- NPC: 사서, 마법사, 상인, 선생님, 경비병, 요리사, 아이, 마을고양이
- 소품: 분수, 나무, 벤치, 깃발, 이정표, 랜턴, 연기, 창문빛, 새, 반딧불, 카드 트레일, 화분, 96 타일
- UI: 글래스/우드/골드 패널, 이름표, 말풍선, 잠금 배지, 건물 글로우, 문 빛, 토스트, 터치 리플, 퀘스트 마커, 닫기/설정 버튼
- 아이콘: 도서관, 연구소, 숲, 학교, 이벤트, 성, 항구, 광장, NPC, 자산
- 기존 디오라마 PNG에 WebP 동반 파일을 추가했습니다.

### 주의

- 현재 추가 자산은 고급 일러스트 최종본이 아니라 개발 진행을 위한 스타일 통일형 PNG/WebP 기반 자산 베이스입니다.
- 고정 캐릭터 원본 이미지는 그대로 유지해야 하며, `public/assets/brand/cardville_fixed_character_reference.png`는 기준 이미지로만 사용합니다.
- 새 에셋을 추가할 때는 반드시 `assetManifest.ts`에도 등록하고 `check-assets`를 통과시켜야 합니다.

## 9. 1.0.29 콘텐츠 엔진 패스

1.0.29는 준비중이던 콘텐츠 중 연구소와 기억의 숲을 실제 플레이 가능한 1차 미니게임으로 여는 업데이트입니다.

### 추가/변경 파일

- `src/game/data/mathStages.ts`
- `src/game/scenes/MathLabScene.ts`
- `src/game/data/memoryStages.ts`
- `src/game/scenes/MemoryForestScene.ts`
- `tools/check-content-engine.mjs`
- `modeCatalog.ts`에 `routeScene` 추가
- `dioramaBuildings.ts`에서 연구소/기억의 숲 직접 장면 이동으로 변경
- `ModeSelectScene.ts`에서 모드별 장면 분기 추가
- `BackButtonSystem.ts`에 새 장면 정리 대상 추가

### 핵심 동작

- 도서관은 기존처럼 `StageSelectScene` → `PlayScene` 흐름을 유지합니다.
- 연구소는 `MathLabScene`으로 직접 진입합니다.
- 기억의 숲은 `MemoryForestScene`으로 직접 진입합니다.
- 두 신규 미니게임은 성공/실패 후 우선 `RewardScene` 카드팩 보상 흐름으로 연결합니다.
- 아직 모드별 영구 진행도 저장은 추가하지 않았습니다. 다음 패치에서 `SaveSystem`의 범용 모드 기록 구조를 확장할 수 있습니다.

### 검증

- `npm run check:content-engine`이 추가되었습니다.
- `npm run verify`는 build, deploy, brand, assets, premium-assets, content-engine, polish, ui, layout, association, security 순서로 확인합니다.


## 10. 1.0.30 마을 건물 에셋 패스

1.0.30은 사용자가 지적한 “마을 건물 에셋이 실제로 반영됐는지” 문제를 해결하기 위한 업데이트입니다. 1.0.28의 프레임형/크롭형 건물 표현은 로비에 바로 쓰기에는 부족하므로, 이번 버전에서 건물 9종을 투명 배경의 개별 컷아웃 PNG/WebP로 다시 반영했습니다.

### 교체된 건물 자산

- `public/assets/diorama/building_castle.png` / `.webp`
- `public/assets/diorama/building_library.png` / `.webp`
- `public/assets/diorama/building_lab.png` / `.webp`
- `public/assets/diorama/building_shop.png` / `.webp`
- `public/assets/diorama/building_school.png` / `.webp`
- `public/assets/diorama/building_forest.png` / `.webp`
- `public/assets/diorama/building_event.png` / `.webp`
- `public/assets/diorama/building_harbor.png` / `.webp`
- `public/assets/diorama/building_plaza.png` / `.webp`
- `public/assets/diorama/diorama_bg.png` / `.webp`

### 코드 반영

- `src/game/data/dioramaBuildings.ts`에서 새 컷아웃 건물 기준으로 크기/위치/이동 타깃을 조정했습니다.
- `src/game/scenes/MainLobbyScene.ts`에 `baseShadow`를 추가해 투명 건물 컷아웃이 배경 위에 안정적으로 얹히도록 했습니다.
- 기존 매니페스트 key는 유지했습니다. 즉, `dioramaCastle`, `dioramaLibrary` 등 기존 코드 경로가 바뀌지 않으므로 중복/꼬임 없이 교체됩니다.

### 검증

- `tools/check-building-assets.mjs`를 추가했습니다.
- `npm run check:building-assets`는 9개 건물이 512×512 이상인지, WebP 동반 파일이 있는지, 파일이 비어 있지 않은지, 로비 배치 코드가 새 기준으로 갱신됐는지 확인합니다.
- `npm run verify`에 `check:building-assets`가 포함되어 GitHub Actions 자동 검증 흐름에서도 같이 확인됩니다.

### 다음 AI 주의사항

- 프레임형 크롭 자산 금지. 건물은 배경 일부를 잘라 만든 액자형 카드가 아니라, 반드시 투명 배경의 개별 건물 오브젝트여야 합니다.
- 건물 파일명은 유지하세요. 최종 상용 원화가 나오면 같은 파일명으로 덮어써야 코드가 꼬이지 않습니다.
- `docs/`에 새 버전별 문서 만들지 말고 README와 이 인계서에만 누적하세요.
- 새 에셋 추가 시 SVG 금지, PNG/WebP 동반, `assetManifest.ts` 등록, 검증 스크립트 통과를 지켜야 합니다.



## 11. 1.0.32 디자인/성능/품질 패스

1.0.32는 1.0.31 분석 체크포인트 이후 이어진 디자인/성능/기술 품질 패스입니다. 런타임 구조를 크게 흔들지 않고, 눈에 보이는 로비 디자인 안정성, 저사양/모션 감소 대응, 버튼 터치 안정성을 우선 개선했습니다.

### 변경 파일

- `package.json`
- `public/build.json`
- `public/health.html`
- `public/reset.html`
- `index.html`
- `src/main.ts`
- `src/game/data/assetManifest.ts`
- `src/game/data/brandRules.ts`
- `src/game/data/lobbyLayoutPlan.ts`
- `src/game/scenes/LoginScene.ts`
- `src/game/scenes/MainLobbyScene.ts`
- `src/game/scenes/MathLabScene.ts`
- `src/game/scenes/MemoryForestScene.ts`
- `src/game/systems/QualitySystem.ts`
- `src/game/ui/GameButton.ts`
- `tools/check-lobby-layout.mjs`
- `tools/check-polish.mjs`
- `README.md`
- `AI_HANDOFF_CARDVILLE.md`

### 핵심 변경

- 로비 `dioramaBg`는 이제 `addCoverImage(this, 'dioramaBg', 1, 1080, 1920)` 기준으로 표시합니다. 기존처럼 390×844에 직접 맞추는 방식보다 원본 세로 배경의 비율과 초점이 안전합니다.
- `MainLobbyScene`에 `drawBuildingStatusChip`을 추가했습니다. 추천은 `NEXT`, 열린 건물은 `OPEN`, 준비중 건물은 `LOCK`으로 표시됩니다.
- `LOBBY_LAYOUT_PLAN_VERSION = '1.0.32'`로 갱신했습니다.
- `LOBBY_DESIGN_CHECKS`를 추가해 상태 칩, 모션 게이트, 버튼 라벨, 더블 탭 방어, 모션 감소 사용자 대응을 기록했습니다.
- `QualitySystem.ts`에 `allowAmbientMotion`, `ambientCount`, `isMotionEnabled`, `scaledDuration`을 추가했습니다.
- 로비/연산 연구소/기억의 숲의 반복 트윈, 파티클 개수, 카메라 shake 일부를 품질 모드에 연결했습니다.
- `GameButton.ts`는 `fitTextSize`, `compactText`, `lastActivatedAt`을 사용해 긴 라벨과 빠른 중복 터치를 방어합니다.
- `check:polish`, `check:lobby-layout` 검증이 1.0.32 디자인/품질 패스 토큰까지 확인합니다.

### 주의할 점

- 진행 저장 키 `cardville.progress.v131`은 그대로 유지했습니다. 이번 업데이트는 진행 데이터 구조 변경이 아니라 디자인/성능/품질 패스이므로 저장소 마이그레이션을 추가하지 않았습니다.
- 신규 에셋 파일은 추가하지 않았습니다. 기존 PNG/WebP 자산을 그대로 사용합니다.
- 새 문서 파일은 만들지 않았고, 기록은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 남겼습니다.
- 다음에 실제 디자인을 더 꾸밀 때는 상태 칩 위치가 건물 상단 아이콘/OPEN 배지와 겹치지 않는지 실기기에서 확인해야 합니다.

## 12. 1.0.31 로비 배치/겹침 감사 및 진행 저장/콘텐츠 확장

1.0.31은 사용자가 요구한 “겹침, 배치, 배정, 체크, 다듬기, 시스템/성능/콘텐츠 업그레이드”를 이어받은 패스입니다. 핵심은 마을 로비의 시각 오브젝트와 실제 터치 영역을 분리해 꼬임을 줄이고, 열린 콘텐츠의 진행 저장을 `word` 전용에서 전체 모드형으로 확장한 것입니다.

### 로비 배치/겹침 감사

- `src/game/data/dioramaBuildings.ts`에 `touchWidth`, `touchHeight`, `touchOffsetY`를 추가했습니다.
- 실제 터치존은 서로 겹치지 않도록 조정했습니다. 건물 이미지는 디오라마처럼 가까이 보일 수 있지만 입력 영역은 분리되어야 합니다.
- `src/game/data/lobbyLayoutPlan.ts`를 추가했습니다.
  - `LOBBY_LAYOUT_PLAN_VERSION = '1.0.31'`
  - `LOBBY_SAFE_ZONES`
  - `LOBBY_LAYOUT_GUARDS`
  - `MIN_TOUCH_SIZE`
- `MainLobbyScene`은 `drawAtmosphericPolish`, `getRecommendedBuildingId`, `drawRecommendedTrail`을 통해 분위기, 추천 경로, OPEN 배지를 표시합니다.
- `tools/check-lobby-layout.mjs`가 추가되어 9개 건물 터치존의 최소 크기, 화면 안전 영역, 겹침 여부, 열린 건물 배정을 검증합니다.

### 진행 저장/콘텐츠 확장

- `SaveSystem` 진행 저장 키를 `cardville.progress.v131`로 확장했습니다.
- `ProgressModeId = 'word' | 'math' | 'memory' | 'daily' | 'english'`를 추가했습니다.
- 새 저장 메서드:
  - `getModeStageRecord`
  - `isModeStageUnlocked`
  - `nextPlayableModeStage`
  - `saveModeStageResult`
- 기존 `saveStageResult`, `getStageRecord` 등 word 전용 wrapper는 유지했습니다.
- `MathLabScene`과 `MemoryForestScene`은 보상 진입 시 `modeId`, `stage`, `stepsLeft`를 넘깁니다.
- `RewardScene`은 카드팩 개봉 시 모드별 진행 기록을 저장합니다.
- 연산 연구소는 3스테이지 15문제로 확장했습니다.
- 기억의 숲은 2스테이지 18쌍으로 확장했고, 20장 카드용 compact 레이아웃을 추가했습니다.
- 이벤트 건물은 `daily` 모드의 오늘의 카드팩으로 열립니다.

### 검증

- `tools/check-lobby-layout.mjs` 추가
- `tools/check-progression.mjs` 추가
- `npm run verify`에 `check:lobby-layout`, `check:progression` 추가

### 다음 AI 주의사항

- 건물 시각 크기와 터치 영역은 같은 값으로 두지 마세요. 모바일에서는 터치 영역 겹침이 더 큰 문제입니다.
- 새 모드를 추가할 때는 `SaveSystem`의 mode id, `modeCatalog.ts`, 라우트, 보상 저장을 함께 맞춰야 합니다.
- 새 스테이지를 추가하면 해당 모드의 `nextPlayableModeStage`가 자연스럽게 이어지도록 최대 스테이지 수를 참조하세요.
- 새 검증은 GitHub Actions의 `npm run verify`에 들어가므로, 로컬에서 먼저 확인하세요.

## 12. 현재 버전 상태

현재 기준 버전은 1.0.32입니다.

1.0.32는 cover 배경, 상태 칩, 품질 모드 게이트, 버튼 중복 터치 방어를 다듬은 디자인/성능/품질 패스입니다. 1.0.31은 로비 터치존 겹침을 정리하고 `cardville.progress.v131` 기반으로 모드별 진행 저장을 확장한 로비 배치/진행 저장 패스입니다. 1.0.30은 프레임형/크롭형 건물 표현을 실제 투명 PNG/WebP 마을 건물 컷아웃으로 교체한 마을 건물 에셋 패스였습니다. 1.0.29는 연구소 연산 미니게임과 기억의 숲 짝찾기 미니게임을 실제 플레이 가능한 1차 콘텐츠로 연결한 콘텐츠 엔진 패스였습니다. 1.0.28은 기준 이미지 톤에 맞춘 프리미엄 에셋 패스와 `check:premium-assets` 검증을 추가한 업데이트였습니다.

- GitHub Actions 자동 검증 흐름 유지
- `check:assets` 유지
- `check:polish` 유지
- `check:premium-assets` 유지
- `check:content-engine` 유지
- `check:building-assets` 유지
- `check:lobby-layout` 추가
- `check:progression` 추가
- `assetManifest.ts` 유지
- `lobbyEntities.ts` 추가
- `modeCatalog.ts` 추가
- `QualitySystem.ts` 추가
- Phaser AUTO renderer 적용
- 연구소/기억의 숲 실제 1차 미니게임 연결
- `MathLabScene` 추가
- `MemoryForestScene` 추가
- 앱 동작용 버전 상수 1.0.32 동기화

1.0.24는 전달 규칙과 인수인계 정책 정리 업데이트였습니다. 1.0.23의 핵심은 한 화면 디오라마 로비입니다.


### 2026-06-29 통파일/에셋 분석 체크포인트

이번 작업은 대화 끊김 이후 최신 통파일과 사용자가 함께 올린 적용 후보 에셋팩을 먼저 분석한 체크포인트입니다. 런타임 코드나 에셋 교체는 아직 적용하지 않았고, 다음 AI가 같은 문서만 보고도 이어갈 수 있도록 분석 결과와 필수 검수 순서를 기록했습니다.

#### 입력 파일

- 통파일: `CardVille_Project_Starter_1.0.32_DesignPerformanceQuality_Full.zip`
- 적용 후보 에셋팩: `CardVille_Assets_Full_PNG.zip`

#### 현재 통파일 상태

- 루트 주요 파일: `README.md`, `AI_HANDOFF_CARDVILLE.md`, `index.html`, `package.json`, `vite.config.ts`, `tsconfig.json`, `.github/workflows/deploy.yml`, `src/`, `public/`, `tools/`
- 전체 프로젝트 파일 수: 269개
- `public/assets` 파일 수: 204개
- 매니페스트 등록 자산 수: 114개
- 별도 버전별 문서 파일은 없음. 기록은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적하는 정책이 지켜지고 있음.
- `node_modules`와 `dist`는 검증 중 로컬 작업 폴더에 생길 수 있지만 통파일/패치파일에는 넣지 말 것.

#### 검증 환경과 결과

- Node: v22.16.0
- npm: 10.9.2
- 패키지 설치 명령: `npm install --no-audit --no-fund --no-package-lock`
- 전체 검증 명령: `npm run verify`
- 검증 결과: 통과
- 통과 항목: build, check:deploy, check:brand, check:assets, check:premium-assets, check:building-assets, check:lobby-layout, check:content-engine, check:progression, check:polish, check:ui, check:layout, check:association, check:security

#### 업로드 에셋팩 분석

- `ASSET_INDEX.txt` 기준 PNG 84개 포함
- SVG 없음
- WebP 동반 파일 없음. 다음 적용 시 기존 정책에 맞춰 WebP를 생성해야 함.
- 대표 크기:
  - `public/assets/diorama/diorama_bg.png`: 1080×1920
  - `public/assets/diorama/building_castle.png`, `building_event.png`, `building_forest.png`, `building_harbor.png`, `building_plaza.png`, `building_school.png`: 1254×1254
  - `public/assets/diorama/building_lab.png`, `building_library.png`, `building_shop.png`: 512×512
  - `public/assets/characters/hero_walk_*`, `hero_blink`, `hero_cheer`: 1024×1536
  - `public/assets/characters/hero_idle.png`: 512×768
  - `public/assets/characters/cat_walk_*`, `cat_tail`, `cat_hint`: 1254×1254
  - `public/assets/characters/cat_idle.png`: 384×384
  - 카드/팩 계열: 1024×1024
  - `public/assets/ui/button_primary.png`, `button_secondary.png`, `button_small.png`: 2172×724

#### 현재 매니페스트와 이름이 다른 적용 후보

현재 코드는 기존 key와 경로를 유지해야 안정적입니다. 다음 패치에서 아래 매핑을 우선 검토하세요.

```txt
characters/npc_chef.png        -> characters/npc_cook.png
characters/npc_child.png       -> characters/npc_child_01.png
characters/npc_village_cat.png -> characters/npc_town_cat.png
props/prop_banner.png          -> props/prop_flag_red.png
props/prop_tree.png            -> props/prop_tree_oak.png
props/prop_smoke.png           -> props/prop_smoke_puff.png
props/tile_cobblestone_96.png  -> props/tile_plaza_96.png
ui/building_glow.png           -> ui/ui_building_glow.png
ui/door_light.png              -> ui/ui_door_light.png
ui/lock_badge.png              -> ui/ui_lock_badge.png
ui/nameplate.png               -> ui/ui_nameplate_gold.png
ui/panel_glass.png             -> ui/ui_panel_glass.png
ui/panel_gold.png              -> ui/ui_panel_gold.png
ui/panel_wood.png              -> ui/ui_panel_wood.png
ui/speech_bubble.png           -> ui/ui_speech_bubble.png
ui/toast_panel.png             -> ui/ui_toast.png
ui/touch_ripple.png            -> ui/ui_touch_ripple.png
icons/icon_library.png         -> icons/icon_cv_library.png
icons/icon_math_lab.png        -> icons/icon_cv_lab.png
icons/icon_forest.png          -> icons/icon_cv_forest.png
icons/icon_school.png          -> icons/icon_cv_school.png
icons/icon_event.png           -> icons/icon_cv_event.png
icons/icon_castle.png          -> icons/icon_cv_castle.png
icons/icon_harbor.png          -> icons/icon_cv_harbor.png
cards/card_pack_*.png          -> packs/pack_*_closed.png 또는 별도 카드팩 매니페스트 확장 검토
```

#### 다음 에셋 적용 시 필수 순서

1. 현재 `assetManifest.ts` key를 먼저 유지한다.
2. 업로드 PNG를 현재 경로로 매핑하되, 기존 파일명을 무작정 바꾸지 않는다.
3. WebP 동반 파일을 생성한다.
4. 1254×1254 건물/고양이 에셋은 모바일 로비 배치에서 시각 크기와 터치존이 어긋나지 않는지 확인한다.
5. 1080×1920 배경은 현재 390×844/780×1688 cover 처리에서 초점이 안전한지 확인한다.
6. 대형 버튼/UI는 바로 런타임 교체하면 스케일이 과할 수 있으므로 `GameButton`/패널 코드의 9-slice 또는 표시 크기를 먼저 확인한다.
7. `npm run verify` 전체 통과 전까지 통파일을 확정하지 않는다.
8. 삭제가 필요한 파일이 생기면 패치 ZIP만으로는 삭제가 자동 반영되지 않으므로 최종 보고에 삭제 대상도 별도 고지한다.

#### 이번 체크포인트 산출 정책

- 런타임 코드 변경 없음
- 런타임 에셋 교체 없음
- 새 문서 파일 생성 없음
- 변경 기록은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 반영
- 통파일 ZIP은 전체 프로젝트에서 `node_modules`와 `dist`를 제외
- 패치 ZIP은 이번에 바뀐 `README.md`, `AI_HANDOFF_CARDVILLE.md`만 포함

## 14. 절대 유지해야 할 정책

- 소년과 검은 고양이 브랜드 고정
- SVG 사용 금지
- 모바일 세로 화면 우선
- 카카오 브라우저 대응
- 뒤로가기 확인 UX 유지
- 첫 화면은 빠르게 표시
- 게임 시작 후 인트로 영상 중 에셋 로딩
- 대형 에셋 대량 선로딩 금지
- Service Worker/PWA 캐시는 현재 비활성 유지
- Firebase는 시작 시 강제 로딩하지 말 것
- 로컬 게스트 시작은 빠르게 유지

## 15. 다음 업데이트 후보

우선순위가 높은 다음 작업입니다.

1. 도서관 낱말 카드 콘텐츠를 CardVille 브랜드형 UI로 개편
2. 연산 연구소 스테이지 선택 화면 추가
3. 기억의 숲 스테이지 선택 화면 추가
4. 상점/카드팩 UI를 마을 상점 느낌으로 개편
5. 소년과 고양이 토큰을 실제 스프라이트 시트 애니메이션으로 교체
6. 계절 장식 시스템을 개별 오브젝트 에셋으로 추가
7. 실제 빌드 후 모바일 카카오 브라우저 터치/뒤로가기 테스트

## 16. 다음 AI가 바로 해야 할 일

새 요청을 받으면 아래 순서로 진행하세요.

1. 사용자가 준 최신 ZIP을 기준으로 압축을 풉니다.
2. `README.md`에서 최신 버전과 누적 기록을 확인합니다.
3. `AI_HANDOFF_CARDVILLE.md`에서 브랜드, 전달 규칙, 금지 사항을 확인합니다.
4. 필요한 파일만 수정합니다.
5. 불필요한 문서 파일을 만들지 않습니다.
6. 가능하면 검증 스크립트를 실행합니다.
7. 결과 보고는 업데이트 내역 → 기타 확인 사항 → 다음 업데이트 예정 → ZIP 파일 순서로 작성합니다.
8. ZIP은 통파일과 패치파일 두 개를 제공합니다.

## 17. 패치파일 만들 때 주의

패치파일은 직전 버전에서 바뀐 파일만 담습니다.  
다만 ZIP 덮어쓰기만으로는 삭제가 자동 적용되지 않으므로, 파일 삭제가 필요한 업데이트에서는 최종 보고에 삭제 대상도 함께 알려야 합니다.

1.0.24 통파일에서는 과거 버전별 문서 폴더를 정리했습니다.  
1.0.32 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.31 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.30 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.29 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.28 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.27 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.25 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다. 완전히 깨끗한 상태가 필요하면 통파일을 사용하세요.
