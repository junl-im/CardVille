# CardVille 1.0.30

카드마을 `<CardVille>`은 소년과 검은 고양이가 함께 카드마을을 탐험하며, 카드를 모아 마을을 성장시키는 모바일 우선 카드 퍼즐 게임입니다.

## 1.0.30 업데이트 내역

- **마을 건물 에셋 패스**를 진행해 이전의 프레임형/크롭형 건물 자산을 실제 투명 배경 건물 컷아웃 자산으로 교체했습니다.
- 마을 건물 9종을 각각 독립 PNG/WebP 에셋으로 다시 반영했습니다.
  - 카드 성
  - 도서관
  - 연산 연구소
  - 카드 상점
  - 학교
  - 기억의 숲
  - 이벤트 광장
  - 항구
  - 중앙 광장
- 디오라마 배경도 건물이 겹쳐 보이는 배경 의존도를 낮추고, 개별 건물이 올라가는 모바일 세로 로비용 배경으로 교체했습니다.
- `src/game/data/dioramaBuildings.ts`의 건물 크기, 위치, 이동 타깃을 새 컷아웃 자산 기준으로 조정했습니다.
- `MainLobbyScene`에 건물 바닥 그림자 처리를 추가해 투명 컷아웃 건물이 배경 위에 따로 떠 보이지 않게 보정했습니다.
- 마을 건물 자산 검증을 추가했습니다.
  - `tools/check-building-assets.mjs`
  - `npm run check:building-assets`
  - `npm run verify`에 포함
- GitHub Actions 자동 배포 흐름은 그대로 유지하며, `.github/workflows/deploy.yml`의 `npm run verify` 기준으로 통과하도록 정리했습니다.
- 새 버전별 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, 앱 내부 버전 표기를 1.0.30으로 동기화했습니다.

> 참고: 임시 채팅 환경이라 별도 이미지 생성 모델을 직접 호출하지는 못합니다. 이번 패치는 코드에 바로 적용 가능한 투명 PNG/WebP 건물 컷아웃을 직접 생성해 반영한 버전이며, 향후 최종 상용 원화가 나오면 같은 파일명으로 덮어쓰기만 하면 로비 코드가 꼬이지 않도록 구성했습니다.

## 1.0.29 업데이트 내역

- **콘텐츠 엔진 패스**를 진행해 연구소와 기억의 숲을 더 이상 준비중 안내만 하는 화면이 아니라 실제 플레이 가능한 1차 미니게임으로 열었습니다.
- 연산 연구소 1차 플레이를 추가했습니다.
  - `src/game/data/mathStages.ts`
  - `src/game/scenes/MathLabScene.ts`
  - 덧셈, 뺄셈, 곱셈, 빈칸 저울 문제를 카드 선택 방식으로 풉니다.
  - 정답/오답 피드백, 콤보, 생명, 점수, 보상 카드팩 연결을 포함합니다.
- 기억의 숲 1차 플레이를 추가했습니다.
  - `src/game/data/memoryStages.ts`
  - `src/game/scenes/MemoryForestScene.ts`
  - 시작 프리뷰 후 카드 뒷면을 뒤집어 같은 그림 짝을 찾는 구조입니다.
  - 선택 횟수, 매칭 수, 점수, 보상 카드팩 연결을 포함합니다.
- `modeCatalog.ts`에 `routeScene`을 추가해 모드별 목적지를 데이터로 배정했습니다.
- 연구소 건물은 `MathLabScene`, 기억의 숲 건물은 `MemoryForestScene`으로 직접 이동하게 변경했습니다.
- `ModeSelectScene`에서도 열린 모드가 각자 알맞은 장면으로 이동하도록 정리했습니다.
- 카카오/모바일 뒤로가기 오버레이에서 새 장면도 안전하게 정리되도록 `BackButtonSystem`의 관리 장면 목록에 추가했습니다.
- 콘텐츠 연결 검증을 추가했습니다.
  - `tools/check-content-engine.mjs`
  - `npm run check:content-engine`
  - `npm run verify`에 포함
- 새 버전별 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, 앱 내부 버전 표기를 1.0.29로 동기화했습니다.

## 1.0.28 업데이트 내역

- 사용자가 제공한 고정 캐릭터 기준 이미지의 톤을 기준으로 **프리미엄 에셋 패스**를 진행했습니다.
- 기존의 낮은 해상도 느낌이 강했던 로비 핵심 자산을 PNG/WebP 쌍으로 다시 확보했습니다.
- 디오라마 배경 `public/assets/diorama/diorama_bg.png`를 780×1688 고해상도 세로 배경으로 교체했습니다.
- 건물 9종을 512×430 프리미엄 프레임형 미니어처로 교체했습니다.
  - 카드 성, 도서관, 연구소, 상점, 학교, 기억의 숲, 이벤트, 항구, 광장
- 소년/고양이 런타임 토큰을 기준 이미지에서 추출한 고해상도 스탠디 자산으로 교체했습니다.
  - `hero_idle`, `hero_walk_*`, `hero_blink`, `hero_cheer`
  - `cat_idle`, `cat_walk_*`, `cat_tail`, `cat_hint`
- NPC 8종, 주요 소품, UI 패널, 말풍선, 터치 리플, 건물 글로우, 아이콘을 PNG/WebP로 재정비했습니다.
- 로비 안전 규칙에 저품질 임시 그림 금지와 프리미엄 톤 유지 규칙을 추가했습니다.
- `tools/check-premium-assets.mjs`와 `check:premium-assets`를 추가해 배경/건물/캐릭터/NPC/UI의 최소 해상도와 WebP 동반 파일을 검증합니다.
- GitHub Actions 자동 검증 흐름은 유지하며, `npm run verify`에 `check:premium-assets`를 포함했습니다.
- 새 버전별 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, 앱 내부 버전 표기를 1.0.28로 동기화했습니다.

> 참고: 임시 채팅 환경에서는 별도 이미지 생성 모델을 직접 호출할 수 없어서, 이번 패치는 제공된 기준 이미지와 절차적 PNG/WebP 제작으로 런타임 자산을 고해상도화한 버전입니다. 최종 상용 일러스트는 이 구조와 파일명 그대로 교체하면 됩니다.

## 1.0.27 업데이트 내역

- 대규모 업데이트 전 꼬임을 줄이기 위해 로비 배치 데이터와 NPC/소품 데이터를 `src/game/data/lobbyEntities.ts`로 분리했습니다.
- 건물별 콘텐츠 배정을 `src/game/data/modeCatalog.ts`로 정리하고, 연구소는 연산, 기억의 숲은 기억력 모드 안내로 연결했습니다.
- `ModeSelectScene`을 건물에서 들어온 목적에 맞게 추천 모드가 강조되는 구조로 개선했습니다.
- `QualitySystem`을 추가해 기기 성능, `prefers-reduced-motion`, URL 플래그에 따라 로비 파티클/반짝임/반복 애니메이션 밀도를 자동 조절합니다.
- Phaser 렌더러를 `AUTO`로 변경해 가능한 환경에서는 WebGL을 사용하고, 필요하면 Canvas로 fallback되게 정리했습니다.
- 확장 화면에서 cover 이미지 중심이 어긋날 수 있는 부분을 보정했습니다.
- 준비중 토스트 배경이 누적될 수 있는 부분을 정리해 반복 터치 시 오브젝트가 남지 않게 했습니다.
- 로비/콘텐츠/엔진 연결 상태를 검증하는 `tools/check-polish.mjs`와 `check:polish`를 추가했습니다.
- 새 버전별 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, 앱 내부 버전 표기를 1.0.27로 동기화했습니다.

## 1.0.26 업데이트 내역

- 디오라마 로비의 NPC 8종에 터치 대사와 말풍선 UI를 연결했습니다.
- NPC마다 짧은 성격 연출을 추가했습니다: 상인 손흔들기, 마법사 반짝임, 사서 책 아이콘, 경비병 안내, 선생님/요리사/마을고양이 반응.
- NPC 터치 영역과 터치 리플을 추가해 건물뿐 아니라 마을 주민도 상호작용 대상으로 보이게 했습니다.
- 로비 우측에 설정 버튼을 추가하고, 현재 로비 안전 규칙을 확인하는 간단한 패널을 연결했습니다.
- 건물 입장 중에는 NPC 말풍선과 설정 패널이 자동으로 닫히도록 정리해 화면 겹침을 방지했습니다.
- 새 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, 앱 내부 버전 표기를 1.0.26으로 동기화했습니다.

## 1.0.25 업데이트 내역

- GitHub는 `.github/workflows/deploy.yml` 기준으로 자동 Actions 배포/검증이 진행되므로, 이번 업데이트도 `npm run verify` 체인에 맞춰 정리했습니다.
- 초대형 업데이트 전 꼬임 방지를 위해 자산을 `src/game/data/assetManifest.ts` 한 곳에서 관리하도록 추가했습니다.
- 건물, NPC, 소품, UI, 아이콘, 캐릭터/고양이 프레임을 포함한 핵심 자산 베이스를 확보했습니다.
- 추가 자산은 SVG 없이 PNG/WebP 중심으로 생성했습니다.
- 기존 디오라마 건물 PNG에 WebP 동반 파일을 추가해 향후 용량 최적화와 배포 전환을 쉽게 했습니다.
- 로비에 NPC와 소품을 배치했습니다.
- 로비 터치 피드백, 건물 선택 글로우, 잠금 배지, 문 열림 빛, 말풍선, 토스트 UI를 새 UI 자산과 연결했습니다.
- 소년과 검은 고양이 이동 시 간단한 걷기 프레임 교체가 동작하도록 연결했습니다.
- `tools/check-assets.mjs`를 추가해 자산 누락, 중복 key, SVG 유입, README/인계서 정책을 자동 점검합니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, 앱 내부 버전 표기를 1.0.25로 동기화했습니다.
- 버전별 문서 파일은 새로 만들지 않고, 누적 기록은 이 `README.md`에만 추가했습니다.

## 1.0.24 업데이트 내역

- 앞으로 결과 보고 형식을 아래 순서로 고정합니다.
  1. 업데이트 내역
  2. 기타 확인 사항
  3. 다음 업데이트 예정
  4. ZIP 파일
- 앞으로 전달 파일은 항상 2개로 제공합니다.
  - 통파일: 전체 프로젝트 ZIP
  - 패치파일: 직전 버전에서 바뀐 파일만 담은 ZIP
- 불필요한 문서 파일 생성을 중단합니다.
- 누적 업데이트 기록은 `README.md`에만 남깁니다.
- 대화가 끊겨도 이어받을 수 있도록 `AI_HANDOFF_CARDVILLE.md` 인계서를 추가했습니다.
- 이전 버전별 패치노트/감사 문서는 통파일에서 정리했습니다.
- 앱 동작용 버전 상수, `package.json`, `public/build.json`, `health.html`, `reset.html`을 1.0.24로 동기화했습니다.

## 현재 핵심 방향

```txt
CardVille = 소년 + 검은 고양이 + 카드 + 따뜻한 판타지 마을
```

CardVille은 단순 카드게임이 아니라 브랜드가 있는 게임으로 갑니다.  
소년 주인공과 검은 고양이는 모든 일러스트, 영상, UI, 아이콘, 로비, 이벤트에서 동일한 기준으로 유지합니다.

## 고정 캐릭터 규칙

- 소년 주인공은 파란 망토, 갈색 부츠, 흰 셔츠, 갈색 바지를 유지합니다.
- 검은 고양이는 항상 소년과 함께 다니는 마스코트입니다.
- 머리, 눈, 비율, 색감, 의상 방향은 고정합니다.
- 기준 이미지 경로: `public/assets/brand/cardville_fixed_character_reference.png`
- SVG는 사용하지 않습니다.
- 그래픽은 PNG, WebP, Sprite Atlas, MP4 중심으로 관리합니다.

## 현재 로비 구조

로그인 후 로비는 스크롤 없는 한 화면 카드마을 디오라마입니다.

```txt
           카드 성

도서관      광장      연구소

상점        주인공    학교

기억의 숲   이벤트    항구
```

- 카메라는 고정입니다.
- 한 화면에 모든 주요 건물이 보입니다.
- 건물을 터치하면 소년과 검은 고양이가 3~5걸음 짧게 뛰어간 뒤 화면이 전환됩니다.
- NPC를 터치하면 대사 말풍선과 짧은 제스처가 표시됩니다.
- 우선 입장 건물은 도서관, 연구소, 상점, 기억의 숲, 이벤트입니다.
- 카드 성, 광장, 학교, 항구는 화면에 보이지만 준비중 상태입니다.
- 배경은 큰 판타지 일러스트 느낌을 유지하고, 건물은 개별 PNG/WebP 에셋으로 배치합니다.

## 현재 실행 흐름

```txt
접속
→ 풀스크린 시작 화면
→ 게임 시작 또는 로그인 선택
→ 인트로 영상과 함께 에셋 로딩
→ 카드마을 디오라마 로비
→ 건물 또는 NPC 상호작용
→ 건물 선택 시 소년과 고양이 이동 연출
→ 게임/보상/앨범 화면
→ 카드 획득 및 저장
→ 마을 복귀
```

## 개발 실행

```bash
npm install --no-audit --no-fund --no-package-lock
npm run dev
```

## 검증

```bash
npm run verify
```

검증 항목:

```txt
npm run build
npm run check:deploy
npm run check:brand
npm run check:assets
npm run check:premium-assets
npm run check:building-assets
npm run check:content-engine
npm run check:polish
npm run check:ui
npm run check:layout
npm run check:association
npm run check:security
```

## 배포

GitHub Pages 설정:

```txt
Settings
→ Pages
→ Source: GitHub Actions
```

배포 후 확인:

```txt
https://junl-im.github.io/CardVille/health.html
https://junl-im.github.io/CardVille/deploy-proof.html
https://junl-im.github.io/CardVille/version.json
https://junl-im.github.io/CardVille/
```

## 에셋 정책

- SVG 사용 금지
- PNG / WebP / MP4 사용
- 대형 카드 이미지 전체 강제 preload 금지
- 시작 화면은 가볍게 유지
- 게임 리소스는 게임 시작 후 인트로 영상 중 단계적으로 로딩
- 배경은 큰 판타지 일러스트처럼 보이게 구성
- 건물, NPC, 소품, UI, 아이콘, 캐릭터 프레임은 개별 에셋으로 분리
- 모든 런타임 자산 key와 경로는 `src/game/data/assetManifest.ts`에서 중복 없이 관리
- 향후 계절 이벤트, 장식 변경, 신규 건물 추가가 쉽도록 관리

## ZIP 전달 규칙

앞으로 업데이트를 만들 때는 항상 아래 두 파일을 제공합니다.

```txt
CardVille_Project_Starter_전체버전명.zip
CardVille_Project_Patch_이전버전_to_새버전.zip
```

- 통파일은 전체 프로젝트입니다.
- 패치파일은 직전 버전에서 변경되거나 새로 추가된 파일만 포함합니다.
- `node_modules`와 `dist`는 ZIP에 넣지 않습니다.
- 버전별 별도 패치노트 파일은 만들지 않습니다.
- 업데이트 기록은 이 README에 누적합니다.
- 대화 인수인계 내용은 `AI_HANDOFF_CARDVILLE.md`에 누적합니다.

## 누적 업데이트 기록

### 1.0.27

- 로비 NPC/소품 배치 데이터를 `lobbyEntities.ts`로 분리해 중복과 겹침 점검 기반 마련
- 건물별 콘텐츠 배정 데이터를 `modeCatalog.ts`로 정리
- 연구소 → 연산, 기억의 숲 → 기억력 추천 모드 연결
- 성능 품질 시스템 `QualitySystem.ts` 추가
- 저사양/모션감소 환경에서 ambient 오브젝트, 반짝임, 반복 tween 밀도 자동 축소
- Phaser 렌더러를 AUTO로 변경해 WebGL/Canvas fallback 구조 적용
- cover 이미지 중심 보정과 준비중 토스트 오브젝트 누적 방지
- `check:polish` 검증 스크립트 추가
- 런타임 버전 1.0.27 동기화

### 1.0.26

- NPC 8종 터치 대사와 말풍선 UI 연결
- 상인/마법사/사서/선생님/요리사/경비병/마을고양이/아이의 짧은 제스처 연출 추가
- 로비 NPC 터치 영역, 리플 피드백, 하단 힌트 문구 업데이트
- 설정 버튼과 로비 안전 규칙 패널 추가
- 건물 입장 시 열린 패널 정리로 UI 겹침 방지
- 런타임 버전 1.0.26 동기화

### 1.0.25

- GitHub Actions 자동 배포 흐름을 유지한 채 `npm run verify`에 `check:assets`를 추가
- 핵심 자산 매니페스트 `src/game/data/assetManifest.ts` 추가
- 캐릭터 프레임 추가: 소년 idle/walk/blink/cheer, 검은 고양이 idle/walk/tail/hint
- NPC 추가: 사서, 마법사, 상인, 선생님, 경비병, 요리사, 아이, 마을고양이
- 소품 추가: 분수, 나무, 벤치, 깃발, 이정표, 랜턴, 연기, 창문빛, 새, 반딧불, 카드 트레일, 화분, 96 타일 가이드
- UI 추가: 글래스 패널, 우드 패널, 골드 패널, 이름표, 말풍선, 잠금 배지, 건물 글로우, 문 빛, 토스트, 터치 리플, 퀘스트 마커, 닫기/설정 버튼
- 모드/건물 아이콘 추가: 도서관, 연구소, 숲, 학교, 이벤트, 성, 항구, 광장, NPC, 자산
- 기존 디오라마 건물/오브젝트에 WebP 동반 파일 추가
- 로비에 NPC, 소품, UI 피드백, 걷기 프레임 교체 연결
- 런타임 버전 1.0.25 동기화

### 1.0.24

- 보고 형식 고정: 업데이트 내역 → 기타 확인 사항 → 다음 업데이트 예정 → ZIP 파일
- 통파일 + 패치파일 2종 전달 규칙 고정
- 버전별 문서 생성 중단
- README 누적 기록 정책 적용
- AI 인계서 `AI_HANDOFF_CARDVILLE.md` 추가
- 통파일 기준으로 과거 버전별 문서 정리
- 런타임 버전 1.0.24 동기화

### 1.0.23

- 로그인 후 메인 로비를 한 화면 카드마을 디오라마 방식으로 재구성
- 카메라 고정, 스크롤 없음, 모바일 세로 화면에서 모든 핵심 건물 확인 가능
- 도서관, 연구소, 상점, 기억의 숲, 이벤트를 우선 입장 건물로 배치
- 카드 성, 광장, 학교, 항구는 한 화면에 보이되 준비중 상태로 유지
- 건물 터치 시 소년과 검은 고양이가 3~5걸음 짧게 뛰어간 뒤 빛 연출 후 화면 전환
- 큰 배경 일러스트 느낌의 디오라마 배경과 개별 건물 PNG 에셋 추가
- 구름, 카드, 나비, 반딧불 느낌의 미세 애니메이션 추가
- SVG 금지 정책 유지

### 1.0.22

- CardVille를 살아있는 카드마을 브랜드 게임 방향으로 고정
- 소년 주인공 + 검은 고양이 마스코트를 브랜드 고정 기준으로 등록
- 고정 캐릭터 기준 이미지 추가
- 그래픽 방향을 프리미엄 2.5D 판타지 감성으로 명문화
- PNG/WebP/Sprite Atlas 중심 정책 유지

### 1.0.21

- 첫 실행 직전 HTML 가짜 시작 버튼 및 중복 시작 화면 제거 정책 강화
- 오프닝 영상은 실제 재생이 시작될 때만 화면에 표시
- 휴대폰 뒤로가기 팝업을 DOM 우선 + Phaser 보조 방식으로 강화
- 로그인 버튼 간격과 하단 패널을 더 촘촘하게 정리
- 카드 앞면을 더 불투명하고 편안한 2.5D 캐주얼 스타일로 보정
- 연상 데이터 오분류 수정 및 검증 강화
- 보안, 저장, 외부 CDN 검증 보강

### 1.0.20

- HTML 임시 시작 버튼 제거
- 로그인 화면 버튼 압축 및 안내 문구 정리
- DOM 기반 뒤로가기 확인 팝업 추가
- 저장 데이터 정규화와 이메일 입력 검증 강화
- 연상 카테고리와 검증 스크립트 보강

### 1.0.19

- 플레이 화면을 반응형 playArea 기반으로 재배치
- 넓은 화면에서 카드 보드가 좌우 공간을 더 적극적으로 사용
- 카드 스택 재정렬 시 낙하/settle 애니메이션 추가
- 정답 시 sparkle 효과 추가
- 말 카드 스테이지 16개로 확장
- Firebase npm 의존성을 제거하고 CDN 지연 로딩 방식 유지

### 1.0.18

- 로그인 버튼 묶음 위치 조정
- GitHub Actions 배포 증명 파일이 package 버전을 자동 사용하도록 수정
- 로그인 버튼 위치 검증 강화

### 1.0.17

- Phaser Scale을 EXPAND로 변경해 모바일 full-bleed 레이아웃 적용
- 모든 Scene에 responsive camera 적용
- Login/Intro 배경 cover 처리
- HTML/CSS app/canvas를 fixed full viewport로 정리

### 1.0.16

- BootScene은 로그인 화면 최소 에셋만 preload하도록 정리
- 게임 시작 또는 로그인 후 IntroLoadingScene으로 이동
- 인트로 영상 재생 중 게임 리소스를 단계적으로 로딩
- 영상 실패, 자동재생 실패, 터치 스킵 fallback 추가

### 1.0.15

- 첫 로그인 화면을 풀스크린 플레이 화면처럼 재구성
- 로그인 하단 컨트롤을 키아트를 가리지 않는 위치로 재배치
- 카드 앞면, 목표 카드, 보드 레일의 과한 투명감 제거
- 버튼 글자 겹침 완화

### 1.0.14

- 플레이 화면 좌측 보조 패널을 얇게 조정하고 카드 보드 폭 확장
- 카드팩 오픈 보상 연출 추가
- 버튼, 카드팩, 효과, 파티클, 배지, 아이콘 PNG 에셋 연결
- 말 카드 스테이지 12개로 확장

### 1.0.13

- 로그인 화면 배경을 CardVille 키아트로 변경
- 로그인 버튼을 하단 글래스 패널에 재배치
- 기존 인트로 MP4를 IntroLoadingScene에서 재생
- 휴대폰 뒤로가기 팝업 추가
- 플레이 보드 폭과 카드 크기 개선
- HUD와 보상/앨범 에셋 적용

### 1.0.12

- 오프닝 영상과 뒤로가기 UX 기반 정리
- 영상 실패 시 로그인으로 넘어가는 fallback 추가
- SVG 금지 유지

### 1.0.11

- 말 카드 스테이지 8개로 확장
- 스테이지 잠금/해금 구조 추가
- 이어하기, 진행도, 보유 카드 요약 추가
- 보상 카드 희귀도 시스템과 카드 앨범 구조 추가
- UI/콘텐츠 검증 스크립트 추가

### 1.0.10

- 점수, 콤보, 최고 콤보 추가
- 정답/오답 애니메이션 추가
- 힌트와 셔플 기능 실제 동작화
- ResultScene 결과 표시와 RewardScene 보상량 계산 개선
- SaveSystem에 스테이지 진행도 저장 추가

### 1.0.9

- 플레이 화면을 말 카드 스택형 보드로 교체
- 목표 카드와 같은 계열의 말 카드를 고르는 규칙 추가
- 카드가 세로로 쌓이는 컬럼 구조 적용
- 버튼 hitbox 위치 정리
- 카드마을 광장, 게임관, 앨범 흐름 유지

### 1.0.8

- 이전 콘셉트 잔여 문구 제거
- 메인 흐름을 카드마을 광장 → 게임 선택 → 스테이지 선택 → 플레이로 정리
- 버튼 터치 영역을 모바일에 맞게 재정비
- StageSelect / ModeSelect 터치 영역 확대

### 1.0.7

- 전역 한국어 폰트 스택 추가
- Phaser Text 기본 스타일 강화
- 글래스 패널 대비 조정
- 버튼 라벨과 카드 글자 가독성 강화

### 1.0.6

- AuthSystem 호환성 메서드 복구
- 게스트는 Firebase 없이 즉시 시작
- Google/Email은 선택 시에만 Firebase 로딩 유지

### 1.0.5

- 안정 부팅 흐름 정리
- 로컬 게스트 우선 시작
- Service Worker 비활성
- 시작 시 Firebase와 대량 에셋 preload 방지
- GitHub Actions 배포 증명 유지
