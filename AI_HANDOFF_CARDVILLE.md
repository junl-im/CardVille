# CardVille AI Handoff

이 파일은 대화가 끊겼을 때 다른 AI나 개발자가 바로 이어받을 수 있도록 만든 인계서입니다.  
CardVille 작업을 계속할 때는 먼저 `README.md`와 이 파일을 읽고, 그다음 실제 코드를 확인하세요.


## 현재 작업 기준: 1.0.60

현재 기준 버전은 1.0.60입니다.  
이번 버전은 1.0.59 LobbyImageGateVillageRepair를 기준으로, 오프닝 영상 유지, 로비 복귀 후 입력 먹통, 건물 위 OPEN/LOCK 텍스트, fallback 카드 노출 위험, 좌우 여백 낭비를 함께 보정한 폴리시/안정화 패스입니다. `intro-video-holds-until-assets-v160`, `lobby-input-reset-v160`, `lobby-fullscreen-spread-v160`, `lobby-edge-to-edge-spread-v160`, `lobby-edge-npc-spread-v160`가 핵심 기준입니다.



### 1.0.60 오프닝 유지/로비 입력 복구/전체폭 마을 폴리시 패스

- 목적:
  - 첫 시작 준비가 길어지는 환경에서도 오프닝 영상이 끊기지 않고 계속 보이게 합니다.
  - 마을 건물 위 `OPEN`/`LOCK` 같은 상태 텍스트와 fallback 카드 느낌을 제거해 실제 마을 그림이 먼저 보이게 합니다.
  - 건물에 들어갔다가 광장으로 돌아온 뒤 아무 입력도 되지 않는 문제를 고칩니다.
  - 390×844 모바일 기준 좌우 끝 공간을 더 적극적으로 사용합니다.
- 원인:
  - `MainLobbyScene` 인스턴스는 재사용되는데, 건물 진입 시 `busy = true`가 된 뒤 로비로 돌아와도 `create()`에서 다시 `false`로 초기화하지 않아 건물/NPC/설정 버튼 입력이 막힐 수 있었습니다.
  - 1.0.59는 fallback을 크게 보이지 않도록 줄였지만, `drawMissingBuildingFallback()`와 `OPEN`/`LOCK` 상태 칩 코드가 아직 남아 있어 사용자 기준 실패 화면처럼 보일 여지가 있었습니다.
- 코드 반영:
  - `src/game/scenes/IntroLoadingScene.ts`
    - `video.loop = true`
    - `delayedCall(4200` 조기 진입 타이머 없음
    - 사용자용 `로딩중` 문구 제거, 얇은 진행 바만 유지
    - `intro-video-holds-until-assets-v160`
  - `src/game/scenes/MainLobbyScene.ts`
    - `create()` 시작 때 `busy`, 걷기 타이머, hero/cat 참조, 말풍선/설정 패널 상태 초기화
    - `lobby-input-reset-v160`
    - 상단 HUD는 왼쪽 실제 화면 끝 기준, 앨범/설정은 오른쪽 실제 화면 끝 기준으로 배치
    - 좌우 사이드 음영 제거
    - `OPEN`/`LOCK` 텍스트와 `badgeOpen` 렌더링 제거
    - 누락 건물 fallback은 보이지 않게 숨김 처리
    - `lobby-fullscreen-spread-v160`
  - `src/game/data/dioramaBuildings.ts`
    - 좌우 건물 컬럼을 더 바깥쪽으로 이동하고 시각 크기를 소폭 확대
    - `lobby-edge-to-edge-spread-v160`
  - `src/game/data/lobbyEntities.ts`
    - 건물 이동에 맞춰 주요 NPC와 사이드 소품도 좌우 끝으로 재배치
    - `lobby-edge-npc-spread-v160`
  - `src/game/data/assetManifest.ts`
    - `CARDVILLE_ASSET_VERSION = 1.0.60`
    - `LOBBY_INTRO_VIDEO_HOLD_TAG` 추가
  - `tools/check-real-village-lobby.mjs`
    - SVG 파일 없음
    - 4.2초 조기 진입 없음
    - OPEN/LOCK/fallback 문구 없음
    - busy reset 있음
    - 건물/NPC PNG 포함
- 검증:
  - `npm run check:real-village-lobby` 추가
  - `npm run verify`에 포함
- 주의:
  - 로비 하단에는 패치 버전/자산 개수/업데이트 문구를 다시 노출하지 마세요.
  - 정상 플레이 화면에 fallback 카드, `이미지 재시도`, `OPEN`, `LOCK`, `에셋 적용` 문구가 보이면 실패로 봅니다.
  - 새 문서 파일은 만들지 말고 README.md와 AI_HANDOFF_CARDVILLE.md에만 기록하세요.


### 1.0.59 로비 이미지 강제 로딩/스크린샷 기반 배치 핫픽스

- 목적:
  - 사용자 스크린샷에서 마을이 실제 건물 이미지가 아니라 노란 fallback 카드처럼 보이는 문제를 최우선 수정했습니다.
- 원인:
  - `IntroLoadingScene`의 4.2초 강제 `finish()`가 로비 핵심 이미지 로딩 완료 전 `MainLobbyScene`을 시작할 수 있었습니다.
- 코드 반영:
  - `src/game/scenes/IntroLoadingScene.ts`
    - 강제 `finish()` 제거
    - 로딩 완료 전에는 `tryFinish()`만 호출
    - `lobby-force-load-gate-v159`
  - `src/game/scenes/MainLobbyScene.ts`
    - `ensureLobbyCriticalAssets()` 추가
    - 로비 직접 진입 시 누락된 핵심 건물/NPC/배경 PNG 재로딩
    - 상단 HUD 왼쪽 정렬, 앨범/설정 우측 정렬
    - 최하단 패치/자산/업데이트 문구 런타임 노출 제거
    - `lobby-screenshot-repair-v159`
    - `lobby-no-bottom-patch-text-v159`
  - `src/game/data/dioramaBuildings.ts`
    - 카드 성을 아래로 내리고, 좌우/하단 건물 좌표와 크기 재조정
    - `lobby-wide-village-spacing-v159`
  - `src/game/data/assetManifest.ts`
    - `CARDVILLE_ASSET_VERSION = 1.0.59`
    - `LOBBY_FORCE_LOAD_GATE_TAG` 추가
- 검증:
  - `tools/check-lobby-screenshot-repair.mjs` 추가
  - `npm run check:lobby-screenshot-repair` 추가
- 주의:
  - 로비 하단에는 패치 버전/자산 개수/업데이트 문구를 다시 노출하지 마세요.
  - 로비 건물 fallback 카드를 크게 보여주는 방식은 금지합니다.


### 1.0.58 플레이필드/UI/엔진 점검

- 목적:
  - 사용자가 지적한 것처럼 글씨가 커진 만큼 UI 컨테이너도 같이 커져야 하므로, 주요 게임 화면의 카드/패널/버튼/힌트 레일을 모바일 기준으로 다시 배치했습니다.
- 코드 반영:
  - `src/game/systems/ScreenUISystem.ts` 신규 추가
    - `screen-ui-redesign-v158`
    - `playfield-safezone-v158`
    - `mobile-touch-target-v158`
    - `assertNoVerticalOverlap()`
  - `src/game/ui/GameButton.ts`
    - 기본 hit zone을 최소 56px로 확대
    - 라벨 크기 기준 상향
  - `src/game/ui/TextStyles.ts`
    - `mobile-readable-text-v158`
    - 큰 안내 문구 배율 1.40
  - `src/game/scenes/PlayScene.ts`
    - 말 카드 보드/목표/하단 액션/안내 문구의 세로 안전 영역 조정
    - `mobile-card-layout-v158`
  - `src/game/scenes/MathLabScene.ts`, `EnglishSchoolScene.ts`
    - 답안 카드 영역을 170×104 터치 기준으로 확대
    - `calculateComboScore()` 사용
  - `src/game/scenes/MemoryForestScene.ts`, `DailyMissionScene.ts`
    - 큰 글씨 기준으로 보드/미션/하단 버튼 겹침 점검
  - `src/game/systems/CardGameSystem.ts`
    - `card-game-performance-v158`
    - `card-engine-upgrade-v158`
    - `createTapGuard()`와 `calculateComboScore()` 추가
- 검증:
  - `tools/check-screen-playfield-v158.mjs` 추가
  - `check:screen-playfield` 추가
  - `npm run verify`에 포함
- 패치 정책:
  - self-contained 안정형 패치 유지: `src/`, `tools/`, `public/assets`, 버전 동기화 파일, README, AI_HANDOFF, docs 포함
- 신규 문서 파일은 생성하지 않았습니다.


### 1.0.57 카드 UI/성능 점검

- 업로드 파일:
  - `CardVille_WordCard_UI_1.0.51_PNG.zip`
- 적용 목적:
  - 말 카드 화면에 사용 가능한 프리미엄 카드 프레임/카드 뒷면을 실제 런타임에 연결했습니다.
  - 커진 모바일 글씨 때문에 기존 카드/패널/버튼 배치가 답답해지는 문제를 보정했습니다.
- 에셋 처리:
  - 원본 카드 UI PNG는 텍스트가 없어 no baked text 정책에는 맞습니다.
  - 외곽 체크무늬 배경이 RGB로 구워져 있어 flood-fill 기반으로 alpha PNG로 재가공했습니다.
  - `public/assets/cards/word_ui/`에 PNG/WebP companion을 저장했습니다.
- 코드 반영:
  - `src/game/data/assetManifest.ts`
    - `CARDVILLE_ASSET_VERSION = 1.0.57`
    - `wordCardFrameLayoutA`, `wordCardFrameLayoutB`, `wordCardFrameLayoutC`, `wordCardFrameSyllableSlots`, `wordCardBackDesign` 추가
  - `src/game/systems/CardGameSystem.ts`
    - `word-card-ui-frame-v157`
    - `mobile-card-layout-v157`
    - `card-game-performance-v157`
    - `shuffleCopy()` Fisher-Yates 셔플 추가
  - `src/game/scenes/PlayScene.ts`
    - 말 카드 보드 폭을 확장하고 왼쪽 세로 버튼 레일을 하단 액션 레일로 이동
    - 목표 카드/플레이 카드/카드 뒷면에 새 WordCard UI 프레임 적용
  - `src/game/scenes/MathLabScene.ts`, `EnglishSchoolScene.ts`
    - 답안 카드와 터치존을 모바일 글씨 크기에 맞게 확대
  - `src/game/scenes/MemoryForestScene.ts`, `MathLabScene.ts`, `EnglishSchoolScene.ts`
    - `sort(() => Math.random() - 0.5)` 대신 `shuffleCopy()` 사용
  - `src/game/ui/TextStyles.ts`
    - `mobile-readable-text-v157`
    - 기본 배율 1.20, 큰 글씨 1.38
- 검증:
  - `tools/check-card-game-ui.mjs` 추가
  - `check:card-game-ui` 추가
  - `npm run verify`에 포함
- 패치 정책:
  - 1.0.57 패치 ZIP도 self-contained 안정형 패치로 유지합니다.
  - `src/`, `tools/`, `public/assets`, 버전 동기화 파일, README, AI_HANDOFF, docs를 포함합니다.
- 신규 문서 파일은 생성하지 않았습니다.


### 1.0.56 로비 HUD/에셋 가시성 핫픽스

- 목적:
  - 마을 진입 후 HUD와 다른 UI가 건물/NPC를 덮는 체감 문제를 수정했습니다.
  - 사용자가 제공한 건물/NPC 에셋이 실제 로비에서 적용되지 않은 것처럼 보이지 않도록 런타임 키, 배치, 크기, 검증을 다시 묶었습니다.
- 코드 반영:
  - `src/game/data/assetManifest.ts`
    - `CARDVILLE_ASSET_VERSION = 1.0.56`
    - `USER_LOBBY_ASSET_ASSIGNMENTS` 추가
    - `user-lobby-asset-assignment-v156` 추가
  - `src/game/data/dioramaBuildings.ts`
    - `USER_LOBBY_ASSET_ASSIGNMENT_TAG = user-lobby-asset-assignment-v156`
    - 도서관/상점/숲 왼쪽 컬럼 x=66, 연구소/학교/항구 오른쪽 컬럼 x=324/332
    - 성 y=258로 내려 상단 HUD와 겹치지 않게 조정
    - 도서관/연구소 `visualWidth: 184`, 숲/항구 `visualWidth: 158`
  - `src/game/data/lobbyEntities.ts`
    - `LOBBY_USER_ASSET_NPC_TAG = user-lobby-npc-visible-v156`
    - `npcMerchant`, `npcWizard`, `npcLibrarian`, `npcForestSagePremium` 크기/위치 확대
  - `src/game/scenes/MainLobbyScene.ts`
    - `LOBBY_VERSION = 1.0.56`
    - `lobby-ui-nonoverlap-v156` 추가
    - `lobby-user-assets-visible-v156` 추가
    - 상단 HUD, 앨범, 설정 버튼, 추천 리본, 하단 힌트를 서로 다른 안전 레인에 배치
    - 건물/NPC GameObject 이름에 실제 visible/user-asset 감사 태그를 붙임
  - `src/game/ui/TextStyles.ts`
    - `mobile-readable-text-v156`
- 검증:
  - `tools/check-lobby-asset-placement.mjs` 추가
  - `check:lobby-asset-placement` 추가
  - `npm run verify`에 포함
  - 기존 로비/모바일/화면 안정성 검증도 1.0.56 좌표와 태그 기준으로 갱신
- 패치 정책:
  - 1.0.56 패치 ZIP도 self-contained 안정형 패치로 유지합니다.
  - `src/`, `tools/`, `public/assets`, 버전 동기화 파일, README, AI_HANDOFF, docs를 포함합니다.
- 신규 문서 파일은 생성하지 않았습니다.


### 1.0.55 로비/NPC/건물/배경 에셋 UIUX 패스

- 업로드 파일:
  - `CardVille_Lobby_NPC_Buildings_Backgrounds_1.0.50_PNG.zip`
- 적용 목적:
  - 새 에셋을 전부 넣기보다, 로비와 각 게임 화면에서 실제 체감 품질이 올라가는 것만 선별했습니다.
  - 1.0.54의 마을 진입/건물 PNG 안정화는 유지합니다.
- 에셋 처리:
  - 체크무늬/흰색 배경이 RGB로 구워진 건물/NPC PNG를 alpha cutout으로 재가공했습니다.
  - 모든 적용 에셋에 WebP companion을 재생성했습니다.
  - 건물 4종: 성/도서관/연구소/기억의 숲을 새 프리미엄 컷아웃으로 교체했습니다.
  - NPC 4종: 사서/연구소 마법사/상점 상인/숲지기를 새 프리미엄 컷아웃으로 교체 또는 추가했습니다.
  - 배경 6종: 로비, 도서관, 연구소, 숲, 상점, 앨범 홀 배경을 재가공했습니다.
- 코드 반영:
  - `src/game/data/assetManifest.ts`
    - `bgLibraryGreatHallPremium`, `bgStarMagicLabPremium`, `bgMemoryForestPremium`, `bgGrandPalacePremium`, `npcForestSagePremium` 추가
    - `CARDVILLE_ASSET_VERSION = 1.0.55`
  - `src/game/systems/DrawSystem.ts`
    - `CardVilleSceneBackdropVariant` 추가
    - `scene-premium-backdrop-v155` 추가
    - 도서관/연구소/상점/앨범/숲 배경을 장면별로 분리
  - `src/game/data/dioramaBuildings.ts`
    - 좌우 컬럼 x=74/x=316 기준으로 재배치
    - 새 건물 비율에 맞춰 `visualWidth: 226/172/146` 기준으로 조정
    - `npcForestSagePremium`를 기억의 숲 역할에 연결
  - `src/game/data/lobbyEntities.ts`
    - 새 NPC 위치와 터치존을 이름표/하단 HUD와 겹치지 않게 조정
  - `src/game/scenes/MainLobbyScene.ts`
    - `LOBBY_VERSION = 1.0.55`
    - `lobby-art-placement-v155` 추가
- 장면별 UIUX:
  - `PlayScene`: 도서관 대강당 배경
  - `MathLabScene`: 별빛 연금 연구소 배경
  - `MemoryForestScene`: 기억의 숲 길 배경
  - `ShopScene`: 카드 포션 상점 배경
  - `CollectionScene`: 궁전/앨범 홀 배경
- 모바일 텍스트:
  - `TextStyles.ts`
  - `mobile-readable-text-v155`
  - 기본 배율 1.17, 큰 글씨 1.34
  - 작은 텍스트 최소 가독 크기를 다시 상향
- 검증:
  - `tools/check-lobby-art-ui.mjs` 추가
  - `check:lobby-art-ui` 추가
  - `npm run verify`에 포함
  - 기존 모바일/로비/빌딩/화면 안정성 검증도 1.0.55 기준으로 갱신
- 패치 정책:
  - 1.0.55 패치 ZIP도 self-contained 안정형 패치로 유지합니다.
  - `src/`, `tools/`, `public/assets`, 버전 동기화 파일, README, AI_HANDOFF, docs를 포함합니다.
- 신규 문서 파일은 생성하지 않았습니다.


### 1.0.54 마을 진입/건물 이미지 핫픽스 패스

- 목적:
  - 게임 진입 후 마을에서 먹통처럼 보인다는 피드백을 최우선으로 반영했습니다.
  - 마을 건물 이미지가 없는 것처럼 보이는 문제를 런타임 로드 경로와 표시 크기 양쪽에서 막았습니다.
- 로딩 안정화:
  - `src/game/scenes/IntroLoadingScene.ts`
  - `CARDVILLE_LOBBY_BOOT_HARDENING_TAG = lobby-boot-asset-hardening-v154`
  - `src/game/data/assetManifest.ts`
  - `LOBBY_CRITICAL_PNG_ASSET_KEYS`, `LOBBY_CRITICAL_PNG_RUNTIME_TAG = lobby-critical-png-runtime-v154`
  - WebP companion은 유지하지만, 마을 배경/건물/핵심 디오라마 토큰은 PNG master를 직접 로드합니다.
  - WebP 자동 치환 실패로 건물 텍스처가 빠지는 경우를 방지합니다.
- 장면 전환 안정화:
  - `src/game/systems/NavigationSystem.ts`
  - `CARDVILLE_NAVIGATION_HARDENING_TAG = scene-navigation-no-freeze-v154`
  - `safeStart()`가 Phaser delayedCall과 native `window.setTimeout`을 같이 사용합니다.
  - 전환 중 입력 잠금이 남지 않도록 `restoreInput()`을 보강했습니다.
- 로비 표시:
  - `src/game/scenes/MainLobbyScene.ts`
  - `LOBBY_BOOT_ASSET_HARDENING_TAG = lobby-building-visible-png-v154`
  - `assertCriticalLobbyTextures()` 추가
  - 로비 생성 시 `this.input.enabled = true`로 입력 회복을 명시합니다.
  - 건물 이미지 오브젝트에 `visible:<assetKey>:lobby-building-visible-png-v154` 이름을 붙였습니다.
- 마을 배치:
  - `src/game/data/dioramaBuildings.ts`
  - `imageY` 추가
  - 성 `visualWidth: 232`, 좌우 건물 `visualWidth: 182`, 이벤트 `visualWidth: 160` 기준으로 확대했습니다.
  - 좌우 끝 공간 활용은 유지하되, 이름표와 하단 힌트 패널이 겹치지 않게 y좌표를 보정했습니다.
- 모바일 글씨:
  - `src/game/ui/TextStyles.ts`
  - `mobile-readable-text-v154`
  - 기본 배율 1.14, 큰 안내 문구 배율 1.30으로 상향했습니다.
- 검증:
  - `tools/check-lobby-boot-assets.mjs` 추가
  - `check:lobby-boot-assets` 추가
  - 기존 로비/빌딩/모바일/런타임 검증을 1.0.54 토큰으로 갱신했습니다.
- 패치 정책:
  - 1.0.54 패치 ZIP도 self-contained 안정형 패치로 유지합니다.
  - `src/`, `tools/`, `public/assets`, 버전 동기화 파일, README, AI_HANDOFF, docs를 포함합니다.
- 신규 문서 파일은 생성하지 않았습니다.


### 1.0.53 실제 나가기/모바일 가독성/로비 배치 패스

- 목적:
  - 사용자가 지적한 “나가기 버튼은 창이 닫혀야 한다” 피드백을 반영했습니다.
  - blank-page 이동 방식은 종료 UX가 아니므로 제거했습니다.
  - 모바일 화면에서 작은 글씨가 잘 안 보일 수 있어 공통 텍스트 배율과 버튼 라벨 최소 크기를 올렸습니다.
  - 로비 건물은 좌우 끝 공간까지 쓰되, 중앙을 너무 다닥다닥 채우지 않도록 재배치했습니다.
- 나가기 흐름:
  - `src/game/systems/BackButtonSystem.ts`
  - `CARDVILLE_EXIT_FLOW_TAG = exit-real-close-v153`
  - `requestNativeCloseBridge()` 추가
  - 지원 가능한 앱/WebView 환경에서는 `CardVilleNative.close`, `CardVilleNative.exitApp`, `Android.closeApp`, `Android.exitApp`, `webkit.messageHandlers.cardvilleClose`를 먼저 시도합니다.
  - 이후 `window.close()`만 시도합니다.
  - `history.back`, `location.href`, blank-page fallback은 제거했습니다.
  - 닫기가 차단되면 `다시 나가기`, `첫 화면가기`, `계속하기` 복구 UI만 보여줍니다.
- 모바일 글씨:
  - `src/game/ui/TextStyles.ts`
  - `CARDVILLE_MOBILE_TEXT_TAG = mobile-readable-text-v153`
  - `readableSize()` / `mobileTextScale()` 추가
  - 큰 안내 문구 설정 시 글자 배율이 더 커집니다.
  - `GameButton` 기본 라벨 크기와 최소 축소 크기를 키웠습니다.
- 로비 배치:
  - `src/game/data/dioramaBuildings.ts`
  - 도서관/상점/숲은 x=62/58 쪽 왼쪽 컬럼으로 이동했습니다.
  - 연구소/학교/항구는 x=328/332 쪽 오른쪽 컬럼으로 이동했습니다.
  - 광장/이벤트는 중앙 컬럼으로 유지했습니다.
  - `village-edge-spacing-v153`, `mobile-readable-layout-v153`를 추가했습니다.
- UI 에셋:
  - 업로드 파일: `CardVille_UI_Only_1.0.48_PNG.zip`
  - 대부분은 1.0.51에 이미 동일 적용되어 중복 복사하지 않았습니다.
  - `vfx_reward_burst_premium.png`는 검은 RGB 배경을 alpha로 처리해 `public/assets/effects/effect_reward_burst_premium.png`와 WebP companion으로 갱신했습니다.
  - `ui_reward_popup_premium.png`는 이미지에 영문 텍스트가 박혀 있어 보류했습니다.
- 검증:
  - `tools/check-mobile-exit-layout.mjs` 추가
  - `check:mobile-exit-layout` 추가
  - `tools/check-exit-flow.mjs`는 real-close/no blank-page 기준으로 갱신
  - `tools/check-screen-ui-stability.mjs`는 모바일 텍스트/로비 배치 태그 기준으로 갱신
- 패치 정책:
  - 1.0.53 패치 ZIP도 self-contained 안정형 패치로 유지합니다.
  - `src/`, `tools/`, `public/assets`, 버전 동기화 파일, README, AI_HANDOFF, docs를 포함합니다.
- 신규 문서 파일은 생성하지 않았습니다.


### 1.0.52 화면 단위 안정성/기술 품질 패스

- 목적:
  - 빠른 연속 터치, 장면 전환 중 입력, 모달 잔류, 버튼 비활성 상태, 로비 추천 동선, PNG 로딩 성능을 한 번에 점검했습니다.
  - UIUX와 기술 안정성을 다음 에셋 패치 전 기준선으로 고정합니다.
- 신규 시스템:
  - `src/game/systems/NavigationSystem.ts`
  - `CARDVILLE_NAVIGATION_GUARD_TAG = scene-navigation-guard-v152`
  - `safeStart()` / `safeRestart()`로 주요 장면 이동을 공통 가드 처리합니다.
  - `BackConfirmScene`이 남아 화면을 막는 상황을 전환 전에 정리합니다.
- 버튼 안정화:
  - `GameButton`에 `CARDVILLE_BUTTON_UX_AUDIT_TAG = screen-wide-premium-button-v152` 추가
  - 버튼 액션 예외를 잡아 로그로 남깁니다.
  - disabled 버튼은 회색 프리미엄 팔레트로 다시 그려져 깨진 버튼처럼 보이지 않습니다.
- 로비 배치/추천 루트:
  - `MainLobbyScene.drawRouteOverviewRibbon()` 추가
  - 추천 건물과 이벤트 READY 상태를 상단 리본으로 표시합니다.
  - `SCREEN_UI_STABILITY_TAG = screen-ui-stability-pass-v152` 추가
  - `lobbyLayoutPlan.ts`는 1.0.52로 갱신했고, route ribbon/NavigationSystem/UI 안정성 체크를 포함합니다.
- 성능/에셋:
  - `public/assets`의 모든 PNG에 WebP companion을 보강했습니다.
  - `IntroLoadingScene`은 브라우저가 WebP를 지원하면 `.png` 대신 `.webp` 경로를 우선 로드합니다.
  - `CARDVILLE_WEBP_RUNTIME_TAG = webp-asset-runtime-v152` 추가
- 검증:
  - `tools/check-navigation-guard.mjs`
  - `tools/check-webp-runtime.mjs`
  - `tools/check-screen-ui-stability.mjs`
  - `npm run verify`에 `check:navigation-guard`, `check:webp-runtime`, `check:screen-ui-stability` 포함
- 패치 정책:
  - 1.0.52 패치 ZIP도 self-contained 안정형 패치로 유지합니다.
  - `src/`, `tools/`, `public/assets`, 버전 동기화 파일, README, AI_HANDOFF, docs를 포함합니다.
- 신규 문서 파일은 생성하지 않았습니다.


### 1.0.51 FullIndividual 프리미엄 에셋 적용 패스

- 업로드 파일: `CardVille_New_Assets_FullIndividual_1.0.47_PNG_ONLY.zip`
- 적용 목적:
  - 마을/상점/스테이지/보상/코치 화면에서 새 프리미엄 에셋이 실제로 보이도록 연결합니다.
  - 단순 파일 복사가 아니라 투명도, 텍스트 박힘, 현재 역할 적합성을 기준으로 선별합니다.
- 적용한 주요 자산:
  - `bg_shop_interior.png`, `bg_lobby_day.png`, `bg_lobby_night.png`
  - `building_card_shop_premium.png` → `public/assets/diorama/building_shop.png`
  - `npc_shopkeeper.png` → `npc_shopkeeper.png`, `npc_merchant.png`
  - `cat_hint_happy/sleepy/surprise/think.png`
  - `card_back_library/math/memory/rare.png`
  - `ui_offer_card_daily/coin/gem/featured.png`
  - `ui_stage_card_word/math/memory.png`
  - `chest_common/rare/epic/legendary.png`
  - `icon_coin_premium`, `icon_gem_premium`, `icon_xp_star`, `icon_card_dust`
  - `badge_next/ready/best/locked/clear`
  - `ui_result_ribbon`, `ui_result_crown`, `ui_result_stars`
  - `illu_library_corner`, `illu_math_lab_corner`, `illu_memory_forest_corner`
  - `ui_cat_paw_pointer`, `ui_cat_paw_tap`
- 장면 연결:
  - `ShopScene`: `shop-interior-backdrop-v151`, `shop-offer-premium-frame-v151`, 프리미엄 코인/보석 아이콘
  - `StageSelectScene`: `stage-card-frame-v151`, 모드별 카드 뒷면
  - `ModeSelectScene`: `mode-illustration-v151`
  - `RewardPopupSystem`: 리본/별/왕관/보상 상자
  - `RewardScene`: 결과 리본/별/희귀도별 상자
  - `PlayScene`: `cardBackLibraryPremium`
  - `MemoryForestScene`: `cardBackMemoryPremium`
  - `CoachMarkSystem`: `coach-paw-pointer-v151`
- 보류:
  - `ui_reward_popup_premium.png`는 텍스트 박힘 정책 충돌로 계속 보류합니다.
  - `building_tavern_premium.png`는 파일만 보존하고, 술집/주점 인상이 현재 CardVille 교육 카드마을 역할과 맞지 않아 런타임 연결은 보류합니다.
- 검증:
  - `tools/check-full-individual-assets.mjs` 추가
  - `npm run check:full-individual-assets` 추가
  - `npm run verify`에 포함
- 패치 정책:
  - 이번 패치 ZIP은 새 UI/카드/보상/상점/스테이지 PNG와 WebP companion을 포함하는 self-contained 안정형 패치로 구성해야 합니다.
  - `PremiumAAA 선별 에셋 적용 패스` 기록과 `tavern 건물은 키즈/교육 톤과 역할이 맞지 않아 보류` 기록은 기존 검증 때문에 유지해야 합니다.
- 신규 문서 파일은 생성하지 않았습니다.

### 1.0.50 나가기/마을 비주얼 긴급 복구 패스

- 사용자 피드백:
  - “나가기 버튼 눌러도 별반응없고 오히려 멈추는 것 같다.”
  - “마을 건물 이쁜 이미지 에셋이 더 잘 보여야 한다.”
- 원인 판단:
  - DOM 뒤로가기 확인창과 Phaser `BackConfirmScene` fallback이 동시에 남을 수 있었습니다.
  - `window.close()`는 대부분의 모바일 브라우저에서 차단되므로, 기존 `나가는 중...` 상태가 복구 안내 없이 화면을 막아 멈춘 것처럼 보일 수 있었습니다.
  - 새 마을 건물은 고해상도지만 로비 내 렌더 크기가 작아 체감상 이미지가 없는 것처럼 약하게 보일 수 있었습니다.
- 수정:
  - `BackButtonSystem`에 `CARDVILLE_EXIT_FLOW_TAG = exit-no-freeze-v150` 추가. 1.0.53에서 `exit-real-close-v153`로 교체됨
  - DOM 오버레이가 정상 생성되면 `BackConfirmScene` fallback을 남기지 않도록 `stopSceneFallback()` 추가
  - 브라우저가 닫기를 막으면 `showExitBlockedRecovery()` 복구 오버레이 표시
  - `BackConfirmScene.requestExit()`를 `BackButtonSystem.requestExit()`로 통합
  - `GAME_SCENES` 정리 대상에 `EnglishSchoolScene`, `DailyMissionScene` 포함
  - `diorama_bg.png`를 1080×1920 프리미엄 마을 배경으로 재생성
  - 9개 건물의 `visualWidth/visualHeight`를 확대하고 `premiumStage` 접지 패널 추가
  - `VILLAGE_VISIBLE_BUILDING_SCALE_TAG = village-readable-building-scale-v150` 추가
- 검증:
  - `tools/check-exit-flow.mjs` 추가
  - `tools/check-village-visuals.mjs` 추가
  - `npm run verify`에 `check:exit-flow`, `check:village-visuals` 포함
- 패치 정책:
  - 1.0.50 패치 ZIP은 마을 건물 PNG/WebP와 배경 에셋을 포함하는 self-contained 안정형 패치로 구성해야 합니다.
- 신규 문서 파일은 생성하지 않았습니다.

### 1.0.49 PremiumAAA 선별 에셋 적용 패스

- 업로드 파일: `CardVille_New_Assets_PremiumAAA_1.0.46_PNG.zip`
- 선별 적용:
  - `building_card_shop_premium.png` → `public/assets/diorama/building_shop.png`
  - `hero_traveler_premium.png` → `public/assets/characters/hero_traveler_premium.png`, `public/assets/diorama/character_boy_token.png`
  - `black_cat_mascot_premium.png` → `public/assets/characters/black_cat_mascot_premium.png`, `public/assets/diorama/mascot_black_cat_token.png`
  - `card_frame_legendary_premium.png` → `public/assets/cards/frames/frame_legendary_gold_normal.png`
  - `vfx_reward_burst_premium.png` → `public/assets/effects/effect_reward_burst_premium.png`
  - `treasure_chest_premium.png` → `public/assets/ui/ui_treasure_chest_premium.png`
- 처리: 흰색/체크무늬/검은색 RGB 배경을 alpha PNG로 정리하고 WebP companion을 생성했습니다.
- 장면 반영:
  - `MainLobbyScene`: 로비 파티에서 `heroTravelerPremium`, `blackCatMascotPremium` 우선 사용
  - `ShopScene`: 새 `dioramaShop`과 `npcMerchant`를 상점 상단 액센트로 표시
- 보류:
  - `ui_reward_popup_premium.png`: 이미지 안에 `REWARDS`, `YOU RECEIVED`, `CLAIM` 같은 영문 텍스트가 박혀 있어 no baked text 정책과 충돌합니다.
  - `building_tavern_premium.png`: tavern 건물은 키즈/교육 톤과 역할이 맞지 않아 보류했습니다. 추후 `guild hall` 또는 `adventure inn`으로 텍스트/술집 인상을 제거한 버전이 오면 이벤트/원정 건물 후보로 재검토합니다.
- 검증:
  - `tools/check-premium-asset-select.mjs` 추가
  - `npm run verify`에 `check:premium-asset-select` 포함
- 핵심 기록: 앞으로 업로드 에셋은 전부 넣지 말고, 아트 바이블/역할/텍스트 박힘/no-SVG/투명도 기준을 통과한 것만 선별 적용합니다.
- 신규 문서 파일은 생성하지 않았습니다.

### 1.0.48 마을 이미지 표시/버튼 프리미엄 복구 패스

- 사용자 피드백: “왜 마을은 이미지가 없는가, 버튼 디자인도 시작 버튼만큼 신경 써야 한다.”
- 원인 판단:
  - 1.0.47 패치 ZIP은 1.0.46 프리미엄 에셋 적용본을 기준으로 한 델타 패치였습니다. 기준 통파일에 `public/assets/diorama/building_*.png` 프리미엄 PNG가 없으면 마을 이미지가 누락될 수 있습니다.
  - 1.0.46/1.0.47에서 에셋은 들어갔지만, 패치만 적용하는 상황을 충분히 고려하지 못했습니다.
  - 시작 화면 버튼은 `skin:false` 무광 벡터 CTA였지만, 다른 장면의 `GameButton`은 기본적으로 기존 baked button skin을 사용할 수 있어 품질 차이가 났습니다.
- 수정:
  - `IntroLoadingScene`에 `resolveAssetUrl()` 추가
  - `import.meta.env.BASE_URL` 기반으로 `assets/...`를 로드
  - `CARDVILLE_ASSET_VERSION`을 URL query로 붙여 캐시 갱신
  - `loaderror` 로그 추가
  - `MainLobbyScene.drawMissingBuildingFallback()` 추가
  - `GameButton` 기본값을 시작 버튼과 유사한 프리미엄 벡터 CTA로 변경
  - 기존 PNG 버튼 스킨은 `options.skin === true`일 때만 사용
  - 1.0.48 패치 ZIP은 마을 핵심 이미지와 WebP companion을 포함하는 self-contained 패치로 작성
- 검증:
  - `tools/check-asset-runtime.mjs` 추가
  - `tools/check-premium-buttons.mjs` 추가
  - `npm run verify`에 `check:asset-runtime`, `check:premium-buttons` 포함
- 핵심 기록: 앞으로 “이미지 적용 패치” 뒤의 보정 패치라도, 사용자가 패치 ZIP만 적용할 수 있으므로 로비 핵심 이미지 파일을 패치 표면에 포함합니다.
- 신규 문서 파일은 생성하지 않았습니다.

### 1.0.47 프리미엄 로비 에셋 배치 보정 패스

- 기준: `CardVille_Project_Starter_1.0.46_PremiumAssetBatchApply_Full.zip`
- 문제 원인: 1.0.46에서 들어온 마을 건물 PNG 9종은 1254×1254 정사각 고해상도 컷아웃인데, 로비 렌더링은 기존 직사각형 박스에 `setDisplaySize(width,height)`로 강제 맞추고 있었습니다. 이 때문에 건물 원본 비율이 눌리거나 세부 장식이 작게 보일 수 있었습니다.
- 수정:
  - `MainLobbyScene.fitImageToBox()` 추가
  - 건물/NPC 이미지를 원본 비율 유지 방식으로 렌더링
  - `visualWidth`, `visualHeight`, `nameplateY`, `statusY`, `statusX` 추가
  - 성/도서관/연구소/광장/상점/학교/숲/이벤트/항구 위치와 터치존 보정
  - `npc_merchant`, `npc_town_cat` 크기/위치 보정
  - 광장 소품, 벤치, 랜턴, 표지판 위치 보정
  - 열린 건물 `uiDoorLight` 접지 글로우 추가
  - 이벤트 건물 `READY n` 칩이 숲/항구와 겹치지 않도록 안쪽 배치
- 검증:
  - `LOBBY_PREMIUM_VISUAL_FIT_AUDIT` 추가
  - `tools/check-lobby-premium-fit.mjs` 추가
  - `npm run verify`에 `check:lobby-premium-fit` 포함
- 핵심 기록: setDisplaySize 강제 비율 왜곡을 fitImageToBox로 교체했습니다.
- 신규 이미지 에셋은 없습니다.
- 신규 문서 파일은 생성하지 않았습니다.

### 1.0.46 프리미엄 PNG 배치 에셋 적용 패스

- 업로드 파일:
  - `CardVille_Batch1_PremiumFantasyVillage.zip`
  - `CardVille_Batch2_PremiumFantasyVillage.zip`
  - `CardVille_Asset_MassProduction_1.0.45_PNG.zip`
- 적용 전 확인 결과: 대부분의 PNG가 alpha PNG가 아니라 체크무늬/흰색/검은색 배경이 RGB로 구워진 상태였습니다.
- 처리: 체크무늬/흰색 배경 RGB 자산을 alpha PNG로 정리하고 WebP companion을 생성했습니다.
- 실제 교체:
  - `public/assets/diorama/building_*.png` 9종
  - `public/assets/characters/npc_merchant.png`
  - `public/assets/characters/npc_town_cat.png`
  - `public/assets/cards/frames/frame_legendary_gold_normal.png`
- 신규 연결:
  - `cat_hint_happy`, `cat_hint_think`, `cat_hint_surprise`, `cat_hint_sleepy`
  - `effect_pack_burst_common`, `effect_pack_burst_rare`, `effect_pack_burst_epic`, `effect_pack_burst_legendary`
  - `effect_reward_burst_premium`
  - `ui_math_console`, `ui_memory_board`, `ui_treasure_chest_premium`
- 장면 반영:
  - `CoachMarkSystem`: 말풍선 톤별 고양이 이모션 사용
  - `RewardPopupSystem`: 보상 버스트/상자/고양이 이모션 사용
  - `RewardScene`: 희귀도별 카드팩 버스트 사용
  - `MathLabScene`: 연산 연구소 콘솔 패널 사용
  - `MemoryForestScene`: 숲 보드 패널/생각 고양이 사용
- 보류:
  - `cardville_ui_reward_popup_premium.png`는 이미지 안에 영문 텍스트가 박혀 있어 no baked text 정책과 충돌하므로 적용하지 않았습니다.
- 검증:
  - `tools/check-applied-assets.mjs` 추가
  - `npm run verify`에 `check:applied-assets` 포함
- 새 문서 파일은 생성하지 않았습니다.

### 1.0.45 아트 바이블/미션 라우트 병합 패스

- 사용자 변경분을 우선 보존했습니다.
  - `docs/CARDVILLE_ART_DIRECTION_BIBLE.md`
  - `docs/CARDVILLE_ASSET_PROMPT_PACK.md`
  - `src/game/data/artDirection.ts`
  - `tools/check-art-direction.mjs`
  - `brandRules.ts`의 Premium Fantasy Village / Stylized Realism / Warm Sunset Lighting / 1:4.5 캐릭터 비율 / no-SVG 정책
- SVG 사용 금지, PNG/WebP 전용 방향은 계속 유지합니다.
- 완주 미션 라우트를 다시 병합했습니다.
  - `v144-perfect-day-lobby-route`
  - 오늘 완주 보상
  - 로비 READY 라우팅
  - 이벤트 건물 `READY n`, `MISSION`, `DONE` 상태칩
  - `check:mission-route`
- `npm run verify`는 `check:art-direction`과 `check:mission-route`를 모두 포함해야 합니다.
- 신규 이미지 에셋은 아직 추가하지 않았습니다.
- 이번 패치에서 새 문서 파일은 생성하지 않았고, 사용자가 제공한 아트 바이블/프롬프트 팩 문서만 보존했습니다.
- 패치 ZIP에는 CI 섞임 방지를 위해 `src/`, `tools/`, `package.json`, `index.html`, `public/build.json`, `public/health.html`, `public/reset.html`, `README.md`, `AI_HANDOFF_CARDVILLE.md`, `docs/`의 관련 파일을 포함합니다.

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
- 연구소: 연산 연구소 스테이지 선택
- 상점: 카드팩 상점 허브, 일일 무료팩, 구매팩, 카드 앨범 바로가기
- 기억의 숲: 기억력 스테이지 선택
- 이벤트: 일일 미션, 출석, 주간 미션, 오늘 완주 보상, 로비 READY 라우팅

### 준비중 건물

- 카드 성
- 광장
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


## 13. 1.0.36 상점 오퍼/콤보 복구 UX 안정화 패스

1.0.36은 1.0.35 시작 화면/도서관 플레이 프리미엄 폴리시 이후 이어진 UI/UX, 안정성, 검증 강화 업데이트입니다. 상점은 오퍼 추천, 무료팩 충전 상태, 구매 전환 연출을 추가했고, 도서관은 콤보 코치와 복구 셔플 안내를 추가했습니다. 또한 `BackConfirmScene`의 정리 대상 장면 목록이 최신 장면 구성과 맞지 않던 문제를 바로잡았습니다.

### 주요 변경 파일

- `src/game/scenes/ShopScene.ts`
- `src/game/systems/SaveSystem.ts`
- `src/game/scenes/RewardScene.ts`
- `src/game/scenes/PlayScene.ts`
- `src/game/scenes/BackConfirmScene.ts`
- `tools/check-ux-safety.mjs` 신규 추가
- `package.json`, `public/build.json`, `public/health.html`, `public/reset.html`, `index.html`
- `src/main.ts`, `src/game/data/assetManifest.ts`, `src/game/data/brandRules.ts`, `src/game/data/lobbyLayoutPlan.ts`, `src/game/scenes/MainLobbyScene.ts`, `src/game/scenes/LoginScene.ts`
- `README.md`, `AI_HANDOFF_CARDVILLE.md`

### 상점 오퍼/무료팩 UX

- `ShopScene`에 `recommendedOfferId`를 추가해 현재 상태에서 가장 자연스러운 오퍼를 강조합니다.
  - 무료팩 수령 가능: `daily_free`
  - 보석 3개 이상: `gem_pack`
  - 그 외: `coin_pack`
- 상단에 `drawDailyStatusMeter`를 추가해 무료팩이 준비됐는지, 다음 수령까지 얼마나 충전됐는지 보여줍니다.
- 최근 구매팩 기록을 `SaveSystem.getLastShopOffer()`로 읽어 상점 상단에 표시합니다.
- 구매 직후 `showPurchaseTransition` 오버레이를 띄운 뒤 `RewardScene`으로 이동합니다. 사용자가 버튼을 빠르게 연타해도 `purchaseLocked`와 `this.input.enabled = false`로 중복 구매/중복 이동을 막습니다.

### 저장/경제 시스템 추가

- 새 저장 키: `cardville.shop.lastOffer.v136`
- 새 메서드:
  - `SaveSystem.recordShopOffer(offerId)`
  - `SaveSystem.getLastShopOffer()`
- `SaveSystem.clear()`는 `SHOP_LAST_OFFER_KEY`도 같이 삭제합니다.
- 기존 일일 무료팩 키 `cardville.shop.dailyPack.v134`는 유지합니다. 일일 무료팩 저장 키를 바꾸면 기존 유저의 당일 수령 상태가 꼬일 수 있으므로 신중히 변경하세요.

### 카드팩 결과 UX

- `RewardScene`에서 `source === 'shop'`인 경우 결과 버튼을 두 개로 분리했습니다.
  - `상점으로`
  - `앨범 보기`
- 플레이 보상팩은 기존처럼 큰 `카드 앨범 보기` 버튼을 유지합니다.
- 상점 구매팩은 이전 1.0.34 기준대로 코인/보석 환급 없이 카드와 XP 중심 보상입니다.

### 도서관 콤보/복구 UX

- `PlayScene` 하단 레일을 확장해 `comboCoachText`와 `bonusPipRects`를 표시합니다.
- `bonusMeter`는 4칸 피프로 표시하며, 4칸이 찬 뒤 다음 정답에서 보너스 점수를 안내합니다.
- 현재 TOP 카드 중 목표 계열 정답이 없으면 셔플 버튼 라벨을 `복구N`으로 바꾸고, 힌트 버튼은 `힌트?` 상태로 잠급니다.
- `pulseAssistButton`은 모션 허용 환경에서만 복구 버튼을 살짝 강조합니다.
- 향후 이어하기 기능 확장 시 게이지 유실이 없도록 `ResumeState`에 `bonusMeter`를 포함했습니다.

### 뒤로가기/장면 정리 안정성

- `BackConfirmScene` 내부 `GAME_SCENES` 목록에 최신 장면을 추가했습니다.
  - `MathLabScene`
  - `MemoryForestScene`
  - `ShopScene`
- 기존 `BackButtonSystem`에는 이미 `ShopScene`이 포함되어 있었지만, Phaser fallback 씬인 `BackConfirmScene` 목록은 오래되어 있었습니다. 이 불일치를 해결했습니다.

### 검증

- `tools/check-ux-safety.mjs` 신규 추가
- `npm run verify`에 `check:ux-safety` 포함
- 검증 항목:
  - 상점 추천 오퍼/무료팩 게이지/구매 전환 토큰
  - `SaveSystem` 최근 오퍼 저장/초기화 토큰
  - 상점 카드팩 결과의 `상점으로` 버튼
  - 도서관 콤보/복구 UX 토큰
  - `BackConfirmScene` 최신 장면 목록
  - README/AI_HANDOFF/빌드 버전 동기화
- 이번 1.0.36 산출 전 `npm run verify` 전체 통과를 확인했습니다.

### 다음 AI 주의사항

- 상점에 오퍼를 더 추가하면 390×844 화면에서 하단 `앨범 보기`/`게임관`/`광장으로` 버튼과 겹치지 않는지 먼저 확인하세요.
- `cardville.shop.dailyPack.v134`는 일일 수령 상태 키입니다. 무료팩 정책 자체를 바꾸지 않는 한 유지하는 편이 안전합니다.
- `ShopScene` 구매 플로우는 `purchaseLocked`와 `this.input.enabled = false`를 함께 사용합니다. 구매 결과 전환 중 입력을 다시 열지 마세요.
- 도서관 하단 레일은 이미 빡빡합니다. 새 버튼을 추가하기보다 `comboCoachText` 문구를 바꾸는 방식이 안전합니다.
- 패치 ZIP은 삭제 대상 없이 변경/추가 파일만 포함합니다.

## 13.1. 1.0.35 시작 화면/도서관 플레이 프리미엄 폴리시 패스

1.0.35는 1.0.34 상점 허브 이후 이어진 UI/UX 안정화 업데이트입니다. 사용자가 지적한 게임 시작/로그인 버튼 위의 줄처럼 보이는 요소를 원인별로 점검했고, 시작 화면은 무광 CTA 버튼과 재배치된 세로 간격으로 정리했습니다. 동시에 도서관 낱말 카드 플레이 화면의 목표/보드/하단 안내 영역을 더 브랜드 게임처럼 다듬었습니다.

### 주요 변경 파일

- `src/game/scenes/LoginScene.ts`
- `src/game/ui/GameButton.ts`
- `src/game/scenes/PlayScene.ts`
- `tools/check-ui.mjs`
- `tools/check-polish.mjs`
- `package.json`, `public/build.json`, `public/health.html`, `public/reset.html`
- `src/main.ts`, `src/game/data/assetManifest.ts`, `src/game/data/brandRules.ts`, `src/game/data/lobbyLayoutPlan.ts`, `src/game/scenes/MainLobbyScene.ts`
- `README.md`, `AI_HANDOFF_CARDVILLE.md`

### 시작 화면 줄처럼 보이는 현상 점검

- 원인 후보 1: `LoginScene`의 로그인 패널 내부에 있던 얇은 흰 하이라이트 바가 게임 시작 버튼 상단과 가까워 줄처럼 보일 수 있었습니다.
- 원인 후보 2: `GameButton`이 PNG 버튼 스킨을 사용할 때 스킨 자체의 상단 광택/테두리와 내부 보정 stroke가 로그인 CTA 주변에서 선처럼 보일 수 있었습니다.
- 조치: 로그인 CTA만 `LOGIN_CTA_BUTTON_STYLE`을 사용합니다. 이 옵션은 `skin: false`, `shine: false`, `debounceMs: 520`으로 시작 화면 버튼을 무광 벡터 버튼으로 그립니다.
- 조치: 제목, 상태 문구, 시작 버튼, Google 버튼, 이메일/가입 버튼 간격을 다시 잡았습니다.
- 주의: 다른 장면의 `GameButton` 기본 스킨은 유지됩니다. 전체 버튼 스킨을 끄지 말고 장면별 옵션으로 제어하세요.

### GameButton 옵션

`GameButton` 생성자에 마지막 옵션 인자를 추가했습니다.

- `skin?: boolean` - false면 PNG 버튼 스킨을 쓰지 않습니다.
- `shine?: boolean` - false면 상단 광택/내부 하이라이트를 그리지 않습니다.
- `debounceMs?: number` - 더블 탭 방어 시간을 장면별로 조정합니다.

기본값은 기존 동작을 유지합니다. 로그인 화면처럼 광택선이 문제 되는 구간에서만 옵션을 넘기는 방식입니다.

### 도서관 플레이 UI/UX 개선

- `PlayScene` 목표 영역에 목표 체인 진행 바와 퍼센트 라벨을 추가했습니다.
- 카드 보드 상단에 `카드 보드 · TOP 카드만 터치` 안내와 남은 카드 수를 표시합니다.
- 각 컬럼에 남은 장수 뱃지를 추가해 플레이어가 어느 스택을 정리해야 하는지 더 빨리 볼 수 있습니다.
- 하단 안내 문구 뒤에 어두운 레일을 추가해 배경과 글자가 섞이는 문제를 줄였습니다.
- 정답/오답 연출은 `QualitySystem`과 더 강하게 연결했습니다. 저사양/모션 감소 환경에서는 카드 settle, shake, 반짝임 수와 지속시간을 줄입니다.

### 검증

- `tools/check-ui.mjs`가 로그인 무광 CTA 옵션과 도서관 보드/목표 체인 토큰을 확인합니다.
- `tools/check-polish.mjs`가 `GameButtonOptions`, `shineEnabled`, `debounceMs`, `LOGIN_CTA_BUTTON_STYLE`, `drawPremiumBottomRail`, `ambientCount(6`, `isMotionEnabled(this.quality)` 등을 확인합니다.
- 기존 `check:shop-economy`, `check:progression`, `check:lobby-layout`, `check:content-engine`, `check:premium-assets` 흐름은 유지됩니다.
- 이번 1.0.35 산출 전 `npm run verify` 전체 통과를 확인했습니다.

### 다음 AI 주의사항

- 로그인 버튼 위 줄 문제가 다시 나오면 `LOGIN_CTA_BUTTON_STYLE`이 유지되는지, `GameButton` 기본 스킨 옵션이 로그인 버튼에 다시 적용되지 않았는지 먼저 확인하세요.
- 로그인 패널에는 얇은 흰 장식 바를 다시 넣지 마세요. 텍스트와 버튼 경계가 가까워 모바일에서 선처럼 보일 수 있습니다.
- `GameButton` 기본 동작은 기존 스킨 유지입니다. 전체 버튼을 무광으로 바꾸면 상점/보상/로비 톤이 바뀌므로 장면별 옵션을 사용하세요.
- 도서관 보드에 새 장식을 추가할 때는 390×844에서 목표 영역, 보드, 하단 안내가 겹치지 않는지 먼저 확인하세요.
- 패치 ZIP은 삭제 대상 없이 변경/추가 파일만 포함합니다.

## 13.2. 1.0.34 상점 허브/경제 UX 패스

1.0.34는 1.0.33 스테이지/카드팩/앨범 폴리시 이후 이어진 상점 건물 실사용화 업데이트입니다. 로비의 상점이 더 이상 카드 앨범으로 바로 이동하지 않고, 무료팩/구매팩/앨범/게임관 복귀를 제공하는 실제 `ShopScene` 허브로 연결됩니다.

### 주요 변경 파일

- `src/game/scenes/ShopScene.ts` 신규 추가
- `src/game/systems/SaveSystem.ts`
- `src/game/scenes/RewardScene.ts`
- `src/game/data/dioramaBuildings.ts`
- `src/game/systems/BackButtonSystem.ts`
- `src/main.ts`
- `tools/check-shop-economy.mjs` 신규 추가
- `package.json`, `public/build.json`, `public/health.html`, `public/reset.html`, `index.html`
- `README.md`, `AI_HANDOFF_CARDVILLE.md`
- 버전 상수: `assetManifest.ts`, `brandRules.ts`, `lobbyLayoutPlan.ts`, `MainLobbyScene.ts`, `LoginScene.ts`

### 상점 허브 구조

- `ShopScene`은 세 가지 카드팩 오퍼를 보여줍니다.
  - `daily_free`: 일일 무료팩
  - `coin_pack`: 상점 실버팩, 120코인
  - `gem_pack`: 왕관 프리미엄팩, 3보석
- 상점 상단에는 코인, 보석, 무료팩 상태가 표시됩니다.
- 하단에는 `앨범 보기`, `게임관`, `광장으로` 버튼이 분리되어 있어 버튼 겹침을 줄였습니다.
- 상점 구매 후에는 `RewardScene`으로 이동하며 `source: 'shop'`, `packLabel`을 전달합니다.

### 저장/경제 시스템

- `SaveSystem`에 다음 메서드가 추가되었습니다.
  - `spendCoins(amount)`
  - `spendGems(amount)`
  - `getDailyShopStatus(now?)`
  - `claimDailyShopPack(now?)`
- 일일 무료팩 저장 키는 `cardville.shop.dailyPack.v134`입니다.
- `SaveSystem.clear()`는 테스트/초기화 시 일일 무료팩 상태도 함께 지웁니다.
- 상점 구매팩은 이미 재화를 썼으므로 `RewardScene`에서 카드와 XP 중심으로 보상하고 코인/보석 환급 루프를 막습니다.

### 라우팅/UX 변경

- `dioramaBuildings.ts` 상점 건물 부제는 `카드팩 상점`입니다.
- 상점 건물 라우트는 `scene: 'ShopScene'`입니다.
- `src/main.ts`와 `BackButtonSystem.ts`에 `ShopScene`이 등록되어 앱 흐름과 뒤로가기 보호 대상에 포함됩니다.
- 기존 `CollectionScene`은 상점 내부의 `앨범 보기` 버튼과 상단 HUD 앨범 버튼으로 접근합니다.

### 검증

- `tools/check-shop-economy.mjs`가 추가되었습니다.
- `npm run verify`에 `check:shop-economy`가 포함됩니다.
- 검증 항목은 `ShopScene`, 상점 오퍼 3종, `SaveSystem` 소비/일일 무료팩 메서드, `RewardScene` shop source 분기, `dioramaBuildings.ts` 상점 라우트, `AI_HANDOFF_CARDVILLE.md`와 `README.md` 기록입니다.
- 기존 `check:polish`, `check:content-engine`, `check:progression`, `check:lobby-layout`도 유지됩니다.
- 이번 1.0.34 산출 전 `npm run verify` 전체 통과를 확인했습니다.

### 다음 AI 주의사항

- 상점 구매팩은 비용 지불 후 `RewardScene`으로 이동합니다. 구매팩에서 다시 코인을 크게 지급하면 무한 구매 루프가 될 수 있으므로 현재 `source === 'shop'` 보상 분기를 유지하세요.
- 일일 무료팩 키는 `cardville.shop.dailyPack.v134`입니다. 저장 키를 바꾸면 기존 테스트 상태가 초기화될 수 있으니 버전 의도가 있을 때만 변경하세요.
- 상점 UI는 세로 공간이 빡빡합니다. 새 오퍼를 추가하면 3개 카드 + 하단 3버튼이 겹치지 않는지 먼저 확인하세요.
- 패치 ZIP은 삭제 대상 없이 변경/추가 파일만 포함합니다.

## 13.2. 1.0.33 스테이지/카드팩/앨범 폴리시 패스

1.0.33은 1.0.32 디자인/성능/품질 패스 이후 이어진 실제 플레이 흐름 다듬기 업데이트입니다. 카드팩/앨범 디자인 체감과 연구소/기억의 숲 진입 흐름을 우선 개선했습니다.

### 주요 변경 파일

- `src/game/scenes/StageSelectScene.ts`
- `src/game/scenes/ModeSelectScene.ts`
- `src/game/scenes/MainLobbyScene.ts`
- `src/game/scenes/RewardScene.ts`
- `src/game/scenes/CollectionScene.ts`
- `tools/check-polish.mjs`
- `tools/check-content-engine.mjs`
- `tools/check-progression.mjs`
- `tools/check-lobby-layout.mjs`
- `package.json`, `public/build.json`, `public/health.html`, `public/reset.html`, `index.html`
- `src/main.ts`, `src/game/data/assetManifest.ts`, `src/game/data/brandRules.ts`, `src/game/data/lobbyLayoutPlan.ts`, `src/game/scenes/LoginScene.ts`

### 스테이지 선택 확장

- `StageSelectScene`은 이제 `word`, `math`, `memory` 모드의 공용 스테이지 선택 화면입니다.
- 도서관은 기존 낱말 카드 스테이지를 유지합니다.
- 연구소와 기억의 숲은 로비/게임 선택에서 바로 플레이로 들어가지 않고, `StageSelectScene`을 거쳐 실제 스테이지를 선택합니다.
- 진행 표시는 `SaveSystem.getModeStageRecord`, `SaveSystem.isModeStageUnlocked`, `SaveSystem.nextPlayableModeStage` 기준입니다.
- 상단 진행 스트립에는 클리어 수, 별 수, 다음 추천 단계가 표시됩니다.

### 카드팩/앨범 디자인 개선

- `RewardScene`에 팩 기대치 바와 모드별 보상 설명을 추가했습니다.
- 카드팩 오픈 전후 레이아웃을 재배치해 보상 설명, `카드 앨범 보기`, `광장으로 돌아가기` 버튼이 겹치지 않도록 정리했습니다.
- 반짝임 수는 `QualitySystem.ambientCount`와 `scaledDuration`을 사용해 품질 모드에 맞춥니다.
- `CollectionScene`에 총 보유 카드 수, 희귀/영웅/전설 수집 칩, LOCKED/앨범 보관 상태 표현을 추가했습니다.

### 검증

- `check:polish`가 `StageSelectScene`, `RewardScene`, `CollectionScene`의 1.0.33 폴리시 토큰을 확인합니다.
- `check:content-engine`이 연구소/기억의 숲이 스테이지 선택 화면을 거치는지 확인합니다.
- `check:progression`이 공용 스테이지 선택 화면의 모드별 진행 저장/해금 토큰을 확인합니다.
- `check:lobby-layout`이 1.0.33 인수인계 기록 토큰까지 확인합니다.
- 이번 1.0.33 산출 전 `npm run verify` 전체 통과를 확인했습니다.

### 다음 AI 주의사항

- 연구소/기억의 숲이 `MathLabScene`/`MemoryForestScene`으로 직접 이동하는 과거 흐름을 되돌리지 마세요. 이제 먼저 `StageSelectScene`을 거치는 것이 기준입니다.
- `StageSelectScene`은 `routeScene`을 엔트리별로 계산합니다. 새 모드를 추가할 때는 `ProgressModeId`, 데이터 파일, 스테이지 엔트리 변환, 실제 플레이 씬 라우팅을 함께 맞추세요.
- `RewardScene` 하단은 세로 공간이 빡빡합니다. 새 버튼을 추가할 때는 `카드 앨범 보기`와 `광장으로 돌아가기` 버튼 겹침을 먼저 확인하세요.
- 패치 ZIP은 삭제 대상 없이 변경/추가 파일만 포함합니다.

## 12. 현재 버전 상태

현재 기준 버전은 1.0.40입니다.

1.0.36은 상점 오퍼 추천/무료팩 충전/구매 전환 연출과 도서관 콤보/복구 UX, `BackConfirmScene` 장면 정리 안정성을 보강한 상점 오퍼/콤보 복구 UX 안정화 패스입니다. 1.0.35는 시작 화면 로그인 CTA의 줄처럼 보이는 요소를 제거하고 도서관 낱말 카드 플레이 화면의 목표 체인/카드 보드/품질 게이트를 보강한 시작 화면/도서관 플레이 프리미엄 폴리시 패스입니다. 1.0.34는 상점 건물을 실제 카드팩 상점 허브로 확장하고, 일일 무료팩/코인팩/보석팩, 재화 차감, 상점 구매팩 보상 분기를 추가한 상점 허브/경제 UX 패스입니다. 1.0.33은 연구소/기억의 숲까지 공용 스테이지 선택 화면을 거치게 하고, 카드팩 보상 화면과 카드 앨범 레이아웃을 다듬은 스테이지/카드팩/앨범 폴리시 패스입니다. 1.0.32는 cover 배경, 상태 칩, 품질 모드 게이트, 버튼 중복 터치 방어를 다듬은 디자인/성능/품질 패스입니다. 1.0.31은 로비 터치존 겹침을 정리하고 `cardville.progress.v131` 기반으로 모드별 진행 저장을 확장한 로비 배치/진행 저장 패스입니다. 1.0.30은 프레임형/크롭형 건물 표현을 실제 투명 PNG/WebP 마을 건물 컷아웃으로 교체한 마을 건물 에셋 패스였습니다. 1.0.29는 연구소 연산 미니게임과 기억의 숲 짝찾기 미니게임을 실제 플레이 가능한 1차 콘텐츠로 연결한 콘텐츠 엔진 패스였습니다. 1.0.28은 기준 이미지 톤에 맞춘 프리미엄 에셋 패스와 `check:premium-assets` 검증을 추가한 업데이트였습니다.

- GitHub Actions 자동 검증 흐름 유지
- `check:assets` 유지
- `check:polish` 유지
- `check:premium-assets` 유지
- `check:content-engine` 유지
- `check:building-assets` 유지
- `check:lobby-layout` 추가
- `check:progression` 추가
- `check:shop-economy` 추가
- `check:ux-safety` 추가
- `assetManifest.ts` 유지
- `lobbyEntities.ts` 추가
- `modeCatalog.ts` 추가
- `QualitySystem.ts` 추가
- Phaser AUTO renderer 적용
- 연구소/기억의 숲 실제 1차 미니게임 연결
- 연구소/기억의 숲 공용 스테이지 선택 화면 연결
- `MathLabScene` 추가
- `MemoryForestScene` 추가
- `ShopScene` 추가
- 상점 무료팩/구매팩 경제 흐름 추가
- 앱 동작용 버전 상수 1.0.40 동기화
- `check:ci-coherence` 추가로 버전/검증 표면/ModeSelectScene 최신화 검증

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


## 15. 1.0.37 콘텐츠 스케일/보상 차등/디자인 에셋 요청 패스

현재 기준 버전은 1.0.37입니다.

### 핵심 변경

- `src/game/data/mathStages.ts`를 5스테이지 25문제로 확장했습니다.
  - 4단계 `상점 계산 장부`
  - 5단계 `왕관 회로 시험`
- `src/game/data/memoryStages.ts`를 4스테이지 42쌍으로 확장했습니다.
  - 3단계 `반딧불 카드길`
  - 4단계 `고양이 그림자 숲`
- `StageSelectScene`에 `rewardPreview`를 추가해 스테이지 선택 화면에서 보상 기대치를 미리 보여줍니다.
- `MathLabScene`에 `progressFill`, `challengeText`, `difficultyRewardLabel`, `difficultyBonus`를 추가했습니다.
- `MemoryForestScene`은 카드 수가 20장을 넘으면 5열 동적 그리드로 전환합니다.
  - 토큰: `const columns = deck.length > 20 ? 5 : 4`
  - 보드 높이 제한: `maxBoardHeight`
  - 별 산정: `targetMoves`
  - 스테이지 보정: `stageBonus`
- `RewardScene`에 `progressionRewardBonus`를 추가했습니다.
  - 연구소: `연구소 난이도 보너스`
  - 기억의 숲: `숲 기억력 보너스`
  - 도서관: `도서관 숙련 보너스`
- 상점 구매팩은 코인 환급 루프 방지를 위해 진행 보너스에서 제외됩니다.
- `tools/check-content-scale.mjs`와 `npm run check:content-scale`을 추가하고 `npm run verify`에 포함했습니다.

### 검증 결과

- `npm run verify` 전체 통과 기준으로 확정했습니다.
- `node_modules`, `dist`는 통파일 ZIP에서 제외해야 합니다.
- 신규 문서 파일은 만들지 않았습니다. 변경 기록은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.

### 추가 디자인 이미지 에셋 요청서

사용자가 다음에 이미지를 만들 수 있도록 아래 목록을 우선순위대로 요청했습니다. 모두 CardVille 고정 스타일인 **소년+검은 고양이+따뜻한 프리미엄 2.5D 판타지+골드/보라/블루 톤**을 유지해야 합니다. SVG는 금지하고 투명 PNG와 WebP 동반을 권장합니다.

#### S급 우선 에셋

1. `public/assets/characters/npc_shopkeeper.png`
   - 상점 주인 전신 컷아웃, 1024×1536 또는 1254×1254 투명 PNG
   - 카드팩/코인 주머니/작은 망토 포인트
   - `ShopScene`, 로비 상점, 구매 성공 연출용
2. `public/assets/ui/ui_math_console.png`
   - 연산 연구소 프리미엄 문제 콘솔, 1024×720 투명 PNG
   - 마법 회로, 숫자 룬, 보라 유리판
3. `public/assets/ui/ui_memory_board.png`
   - 기억의 숲 카드 보드 패널, 1024×1024 또는 1200×900 투명 PNG
   - 잎사귀 프레임, 반딧불, 어두운 초록+골드
4. 고양이 힌트 이모션 세트
   - `cat_hint_happy.png`, `cat_hint_think.png`, `cat_hint_surprise.png`, `cat_hint_sleepy.png`
   - 각 512×512 투명 PNG
5. 희귀도별 카드팩 오픈 이펙트
   - `effect_pack_burst_common.png`, `effect_pack_burst_rare.png`, `effect_pack_burst_epic.png`, `effect_pack_burst_legendary.png`
   - 각 1024×1024 투명 PNG

#### A급 UI/UX 에셋

- `ui_stage_card_word.png`, `ui_stage_card_math.png`, `ui_stage_card_memory.png`
- `badge_next.png`, `badge_best.png`, `badge_ready.png`, `badge_locked.png`
- `icon_coin_premium.png`, `icon_gem_premium.png`, `icon_xp_star.png`
- `illust_library_corner.png`, `illust_math_lab_corner.png`, `illust_memory_forest_corner.png`
- `ui_tutorial_pointer_catpaw.png`

#### B급 분위기 에셋

- 계절 장식 팩: 봄 꽃잎, 여름 축제 깃발, 가을 낙엽/랜턴, 겨울 눈송이/리본
- 결과 스탬프: `stamp_clear.png`, `stamp_try_again.png`, `stamp_combo.png`

### 다음 AI 주의사항

- 기억의 숲 스테이지가 늘었으므로 모바일 390×844에서 24장 보드가 하단 버튼과 겹치지 않는지 계속 확인하세요.
- 새 에셋을 받을 때는 `assetManifest.ts` key를 먼저 설계하고 기존 파일명 정책을 유지하세요.
- 상점 구매팩은 비용 차감 후 보상으로 코인을 다시 지급하지 않는 현재 정책을 유지하세요.
- 다음 패치는 영어 학교 1차 수업 또는 고양이 튜토리얼/에셋 매니페스트 확장이 좋습니다.

## 16. 1.0.38 영어 학교 1차 수업/무에셋 콘텐츠 확장 패스

현재 기준 버전은 1.0.38입니다.

### 핵심 변경

- 사용자가 새 디자인 에셋을 준비하기 전까지 코드/UX/콘텐츠 중심 패치를 진행했습니다.
- `src/game/data/englishStages.ts`를 신규 추가했습니다.
  - 4교시, 24개 영어 카드 데이터 구성
  - `인사 카드 수업`, `마을 물건 카드`, `행동 카드 수업`, `짧은 문장 수업`
- `src/game/scenes/EnglishSchoolScene.ts`를 신규 추가했습니다.
  - 영어 단어를 보고 한국어 뜻 카드를 선택하는 1차 수업 모드
  - 콤보, 생명, 진행 바, 힌트, 예문, 정답/오답 피드백 포함
  - 모션/파티클은 `QualitySystem` 기준을 따릅니다.
- `src/game/data/dioramaBuildings.ts`에서 학교 건물을 실제 오픈 콘텐츠로 전환했습니다.
  - `school` subtitle: `영어 학교`
  - `open: true`
  - route: `StageSelectScene` + `modeId: english`
- `src/game/data/modeCatalog.ts`에서 영어 학교 상태를 `open`으로 전환하고 `routeScene: EnglishSchoolScene`을 추가했습니다.
- `StageSelectScene`은 `ENGLISH_STAGES`를 읽어 영어 스테이지 카드, 보상 프리뷰, `EnglishSchoolScene` 라우팅을 표시합니다.
- `ModeSelectScene`은 영어 학교 진행 요약과 다음 교시 안내를 표시합니다.
- `MainLobbyScene` 추천 동선에 학교를 포함했습니다.
  - 도서관 미완료가 끝난 뒤 영어 학교가 다음 추천 건물이 됩니다.
  - 상단 HUD 진행 수는 도서관/영어/연구소/숲 전체 열린 스테이지 합산 기준입니다.
- `RewardScene`에 `영어 카드팩 도착!`, `영어 학교 수업 보너스`를 추가했습니다.
- `BackConfirmScene` 정리 대상에 `EnglishSchoolScene`을 추가했습니다.
- `src/main.ts`에 `EnglishSchoolScene`을 등록했습니다.

### 검증 추가

- `tools/check-english-school.mjs` 추가
- `package.json`에 `check:english-school` 추가
- `npm run verify`에 `check:english-school` 포함
- 검증 토큰:
  - 영어 스테이지 최소 4개
  - 영어 카드 최소 24개
  - 학교 건물 오픈 라우팅
  - 스테이지 선택/모드 선택/보상/뒤로가기 연동
  - README/AI_HANDOFF/버전 동기화

### 검증 결과

- `npm run verify` 전체 통과 기준으로 확정했습니다.
- 새 이미지 에셋은 추가하지 않았습니다.
- 신규 문서 파일은 만들지 않았습니다. 변경 기록은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- 삭제 파일은 없습니다.
- `node_modules`, `dist`는 통파일 ZIP에서 제외해야 합니다.

### 다음 AI 주의사항

- 영어 학교는 현재 텍스트 기반 1차 수업입니다. 사용자가 영어 학교용 이미지 에셋을 주면 다음 패치에서 `assetManifest.ts`와 장면 조건부 표시로 연결하세요.
- 추천 에셋 후보는 `npc_teacher_premium.png`, `ui_english_blackboard.png`, `ui_word_meaning_card.png`, `effect_correct_abc.png`입니다. 다만 아직 요청된 필수 에셋 1차 목록이 우선입니다.
- 학교 건물이 열린 상태이므로 로비에서 `school` 배치/상태 칩/추천 트레일 겹침을 계속 확인하세요.

## 17. 1.0.39 CI 빌드 가드/ModeSelect 패치 표면 완전성 패스

현재 기준 버전은 1.0.39입니다.

### 빌드 실패 직접 원인

사용자가 공유한 GitHub Actions 로그의 실패 지점은 아래입니다.

- 실패 스크립트: `npm run check:polish`
- 실패 파일: `src/game/scenes/ModeSelectScene.ts`
- 누락 토큰: `modeProgressSummary`

이는 게임 로직 런타임 오류라기보다 **패치 표면 누락으로 인한 저장소 파일 불일치**입니다. 전체 통파일 기준 `ModeSelectScene.ts`에는 `modeProgressSummary`가 있었지만, 패치 ZIP이 직전 버전에서 바뀐 파일만 담는 방식으로 생성되면서 검증 스크립트가 감시하는 핵심 장면 파일 일부가 배포 저장소에 최신 상태로 반영되지 않을 수 있었습니다. 그 결과 `tools/check-polish.mjs`는 새 기준을 요구하는데, 저장소의 `ModeSelectScene.ts`는 오래된 상태로 남아 CI가 실패했습니다.

### 이번 수정

- `ModeSelectScene.ts`의 진행 요약 표면을 최신 기준으로 명시 유지했습니다.
  - `modeProgressSummary`
  - `문제팩 선택`
  - `숲 카드 선택`
  - `뜻 카드 연결`
- `tools/check-ci-coherence.mjs`를 추가했습니다.
  - `package.json`, `public/build.json`, `index.html`, `health.html`, `reset.html`, `MainLobbyScene.ts` 버전 동기화
  - `ModeSelectScene.ts` 최신화 여부
  - `check-polish`가 핵심 장면을 계속 감시하는지
  - README/AI_HANDOFF 기록 동기화
- `npm run verify`에 `check:ci-coherence`를 포함했습니다.
- `tools/check-english-school.mjs`의 일부 1.0.38 하드코딩 검증을 현재 패키지 버전 기준으로 정리했습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, `index.html`, `MainLobbyScene.ts`, `src/main.ts` 버전을 1.0.39로 동기화했습니다.

### 패치 표면 완전성 규칙

앞으로 패치 ZIP은 단순히 `git diff`처럼 보이는 파일만 담지 않습니다. 아래 파일군은 빌드/검증 실패를 막기 위해 변경 여부와 상관없이 함께 넣는 안정형 패치 표면으로 취급합니다.

- `src/` 전체 또는 최소한 검증 스크립트가 감시하는 모든 `src/game/**` 파일
- `tools/` 전체
- `package.json`
- `index.html`
- `public/build.json`, `public/health.html`, `public/reset.html`
- `README.md`
- `AI_HANDOFF_CARDVILLE.md`

특히 `tools/check-*.mjs`에서 토큰을 요구하는 파일은 패치 ZIP에 반드시 포함하세요. 검증 기준만 업데이트되고 대상 파일이 빠지는 상태가 이번 실패의 핵심 재발 위험입니다.

### 검증 결과

- `npm run verify` 전체 통과 기준으로 확정했습니다.
- 신규 이미지 에셋은 추가하지 않았습니다.
- 신규 문서 파일은 만들지 않았습니다. 변경 기록은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- 삭제 파일은 없습니다.
- `node_modules`, `dist`, `package-lock.json`은 통파일 ZIP에서 제외해야 합니다.

### 다음 AI 주의사항

- 사용자가 GitHub에 패치 ZIP만 적용하는 경우가 있으므로, 앞으로 패치 ZIP은 직전 산출물 기준의 최소 변경 파일이 아니라 **검증 통과에 필요한 안정형 패치 표면**을 우선하세요.
- `check-polish`, `check-ui`, `check-ux-safety`, `check-content-scale`, `check-english-school`, `check-ci-coherence`가 요구하는 토큰 대상 파일은 반드시 패치 ZIP에 포함하세요.
- 배포 로그가 1.0.37처럼 과거 버전을 가리키면, 사용자가 최신 통파일이 아니라 이전 패치만 배포한 상태일 가능성을 먼저 확인하세요.

## 18. 다음 업데이트 후보

우선순위가 높은 다음 작업입니다.

1. 사용자가 제작할 S급 디자인 에셋을 `assetManifest.ts`에 안전하게 연결
2. 영어 학교 교실 전용 UI 에셋 연결 또는 고양이 튜토리얼 시스템 추가
3. 영어 학교 발음 힌트/그림 카드/문장 듣기 확장
4. 상점 오퍼 수량을 늘리기 전 390×844 하단 버튼 겹침 검수
5. 도서관 낱말 카드의 실패 복구 튜토리얼/힌트 연출 확장
6. 소년과 고양이 토큰을 실제 스프라이트 시트 애니메이션으로 교체
7. 계절 장식 시스템을 개별 오브젝트 에셋으로 추가
8. 실제 빌드 후 모바일 카카오 브라우저 터치/뒤로가기 테스트
9. 업로드 에셋팩의 이름 매핑과 WebP 생성 패치를 별도 진행

## 19. 패치파일 만들 때 주의

패치파일은 직전 버전에서 바뀐 파일만 담습니다.  
다만 ZIP 덮어쓰기만으로는 삭제가 자동 적용되지 않으므로, 파일 삭제가 필요한 업데이트에서는 최종 보고에 삭제 대상도 함께 알려야 합니다.

1.0.24 통파일에서는 과거 버전별 문서 폴더를 정리했습니다.  
1.0.41 패치파일은 이벤트 건물 라우트와 검증 스크립트 기준이 함께 바뀌므로 안정형 패치 표면(src/tools/package/public 핵심/문서)을 포함합니다. 삭제 대상은 없습니다.
1.0.39 패치파일은 CI 실패 재발 방지를 위해 안정형 패치 표면(src/tools/package/public 핵심/문서)을 포함합니다. 삭제 대상은 없습니다.
1.0.38 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.37 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.36 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.35 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.34 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.33 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.32 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.31 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.30 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.29 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.28 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.27 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다.
1.0.25 패치파일은 삭제 대상 없이 변경/추가 파일만 포함합니다. 완전히 깨끗한 상태가 필요하면 통파일을 사용하세요.


## 18. 1.0.40 무에셋 고양이 코치/첫 플레이 UX 패스

현재 기준 버전은 1.0.40입니다.

### 작업 목적

에셋 제작 대기 중에도 게임 체감 UX를 올리기 위해, 새 이미지 없이 기존 고양이 힌트 에셋과 벡터 말풍선으로 첫 플레이 안내를 추가했습니다. 1.0.39에서 확인한 CI/패치 표면 완전성 규칙은 유지합니다.

### 핵심 변경

- `src/game/systems/CoachMarkSystem.ts` 신규 추가
  - 저장 키: `cardville.coach.seen.v140`
  - `showOnce`, `show`, `markSeen`, `reset` 제공
  - localStorage 차단 환경에서도 예외 없이 동작하도록 안전 처리
- 로비 `MainLobbyScene.ts`
  - `showLobbyCoach` 추가
  - NEXT 건물, NPC 터치, 추천 루트 안내
- `StageSelectScene.ts`
  - `showStageCoach` 추가
  - NEXT 카드, 잠금 해제, 보상 미리보기 안내
- 도서관 `PlayScene.ts`
  - `showWordCoach` 추가
  - TOP 카드, 힌트, 복구/셔플 버튼의 역할 안내
- `EnglishSchoolScene.ts`
  - `showEnglishCoach` 추가
  - 영어 단어/예문/뜻 카드 선택 흐름 안내
- `ShopScene.ts`
  - `showShopCoach` 추가
  - 무료팩 READY, 추천 오퍼, 카드/XP 중심 상점팩 안내
- `tools/check-coach.mjs`와 `check:coach` 추가
- `npm run verify`에 `check:coach` 포함

### 검증

- `npm run verify` 전체 통과 기준으로 확정해야 합니다.
- 패치 ZIP은 1.0.39의 안정형 패치 표면 규칙을 유지해 `src/`, `tools/`, `package.json`, 핵심 public/html, README, AI_HANDOFF를 함께 포함합니다.

### 다음 작업 후보

- 에셋 수령 전: 출석/일일 미션, 튜토리얼 단계 확장, 접근성 옵션, 실패 복구 UX 강화
- 에셋 수령 후: `assetManifest.ts`에 고양이 이모션/상점 주인/팩 이펙트 연결, CoachMarkSystem의 `catHint` 조건부 이미지를 새 감정 에셋으로 교체


## 19. 1.0.41 무에셋 일일 미션/출석 보상 루프 패스

현재 기준 버전은 1.0.41입니다.

### 작업 목적

에셋 제작 대기 중에도 이벤트 건물이 실제 게임 루프를 갖도록, 새 이미지 없이 일일 미션 보드와 출석 보상을 추가했습니다. 1.0.39에서 확인한 CI/패치 표면 완전성 규칙은 계속 유지합니다.

### 핵심 변경

- `src/game/systems/DailyMissionSystem.ts` 신규 추가
  - 저장 키: `cardville.dailyMission.v141`
  - UTC 날짜 토큰으로 매일 상태 갱신
  - 미션 목록: `clear_word`, `clear_english`, `clear_math`, `clear_memory`, `open_pack`
  - 제공 API: `getBoard`, `recordModeClear`, `recordPackOpen`, `claimAttendanceReward`, `claimMissionReward`
  - localStorage가 막힌 환경에서도 예외 없이 진행되도록 안전 처리
- `src/game/scenes/DailyMissionScene.ts` 신규 추가
  - 출석 보상 READY/완료 상태
  - 오늘 진행도 바
  - 미션별 진행도, 보상, 수령 버튼
  - 게임 선택/상점/광장 복귀 버튼
  - `CoachMarkSystem`의 `daily_mission_board_v141` 안내 말풍선 연결
- `src/game/data/dioramaBuildings.ts`
  - 이벤트 건물 부제를 `일일 미션`으로 변경
  - 이벤트 건물 라우트를 `DailyMissionScene`으로 변경
- `src/game/data/modeCatalog.ts`
  - `daily` 모드를 `오늘의 미션` 설명으로 정리
  - `DailyMissionScene` 라우트 타입 추가
- `src/game/scenes/RewardScene.ts`
  - 카드팩 개봉 시 `DailyMissionSystem.recordPackOpen()` 호출
  - 게임 보상팩 개봉 시 `DailyMissionSystem.recordModeClear(this.modeId)` 호출
  - 상점팩은 `open_pack` 미션만 반영
- `src/main.ts`, `BackConfirmScene.ts`
  - `DailyMissionScene` 등록 및 뒤로가기 정리 대상에 포함
- `tools/check-daily-mission.mjs`와 `check:daily-mission` 추가
- `npm run verify`에 `check:daily-mission` 포함

### 검증

- `npm run verify` 전체 통과 기준으로 확정해야 합니다.
- 1.0.39 이후 안정형 패치 표면 규칙을 유지합니다. 패치 ZIP에는 `src/`, `tools/`, `package.json`, 핵심 public/html, README, AI_HANDOFF를 함께 포함합니다.
- `check:daily-mission`은 `DailyMissionSystem`, `DailyMissionScene`, 이벤트 건물 라우팅, 보상 훅, 문서 기록 동기화를 감시합니다.

### 다음 작업 후보

- 에셋 수령 전: 연속 출석 보상, 주간 미션, 미션 완료 연출, 접근성 옵션 강화
- 에셋 수령 후: 이벤트 건물/고양이 이모션/보상 이펙트를 `DailyMissionScene`에 연결


## 20. 1.0.42 무에셋 연속 출석/주간 미션 루프 패스

현재 기준 버전은 1.0.42입니다.

### 작업 목적

에셋 제작 대기 중에도 이벤트 건물의 장기 플레이 동기를 강화하기 위해, 새 이미지 없이 기존 일일 미션 보드에 연속 출석과 주간 미션 보상을 추가했습니다. 기존 저장 키 `cardville.dailyMission.v141`은 유지해 사용자 저장 상태를 갑자기 끊지 않고, 내부 스키마 표식 `v142-streak-weekly`로 1.0.42 확장 필드를 구분합니다.

### 핵심 변경

- `src/game/systems/DailyMissionSystem.ts` 확장
  - `streakDays`, `bestStreakDays`, `lastAttendanceToken` 추가
  - `weeklyToken`, `weeklyProgress`, `weeklyTarget`, `weeklyReady`, `weeklyClaimed`, `weeklyCompletionRatio` 추가
  - `claimWeeklyReward()` 추가
  - `addWeeklyProgress()`로 출석/미션 보상 수령이 주간 게이지를 채우도록 연결
  - 출석 보상 코인은 연속 출석에 따라 `attendanceRewardCoins`로 소폭 상승
  - UTC 날짜 기준 일일 갱신과 UTC 주간 토큰 기준 주간 갱신을 분리
- `src/game/scenes/DailyMissionScene.ts` 개선
  - 오늘 진행도, 연속 출석, 주간 보상, 출석 보상, 미션 목록 순서로 재배치
  - `drawStreakWeekly` 추가
  - `주간 수령` 버튼 추가
  - 미션 행 높이를 줄여 390×844 하단 버튼과 겹치지 않게 조정
  - 고양이 코치 ID를 `daily_mission_board_v142`로 갱신
- `tools/check-weekly-mission.mjs`와 `check:weekly-mission` 추가
- `tools/check-daily-mission.mjs`를 1.0.42 구조에 맞춰 보강
- `npm run verify`에 `check:weekly-mission` 포함

### 검증

- `npm run verify` 전체 통과 기준으로 확정해야 합니다.
- 1.0.39 이후 안정형 패치 표면 규칙을 유지합니다. 패치 ZIP에는 `src/`, `tools/`, `package.json`, 핵심 public/html, README, AI_HANDOFF를 함께 포함합니다.
- `check:weekly-mission`은 `v142-streak-weekly`, 연속 출석, 주간 미션, 주간 보상 수령, 장면 UI 토큰, 문서 기록 동기화를 감시합니다.

### 다음 작업 후보

- 에셋 수령 전: 미션 완료 순간 팝업, 주간 보상 카드팩 연출, 접근성 옵션, 난이도별 미션 가중치
- 에셋 수령 후: 이벤트 건물, 고양이 이모션, 보상 이펙트, 주간 보상 배지를 `assetManifest.ts`에 연결

### 패치 파일 주의

1.0.42 패치파일은 일일 미션 시스템과 검증 스크립트 기준이 함께 바뀌므로 안정형 패치 표면(src/tools/package/public 핵심/문서)을 포함합니다. 삭제 대상은 없습니다.

## 21. 1.0.43 무에셋 미션 보상 팝업/접근성 UX 패스

현재 기준 버전은 1.0.43입니다.

### 작업 목적

에셋 제작 대기 중에도 이벤트 건물의 보상 체감과 접근성 품질을 올리기 위해, 새 이미지 없이 미션 보상 팝업, 다음 행동 안내, 로비 접근성 토글을 추가했습니다. 기존 일일/주간 미션 저장 키는 유지하고, 신규 접근성 저장 키 `cardville.accessibility.v143`만 추가했습니다.

### 변경 파일

- `src/game/systems/RewardPopupSystem.ts` 신규 추가
  - `RewardPopupSystem.show()`로 중앙 보상 팝업 표시
  - `reward-popup:v143` 이름 사용
  - 고대비/모션 설정을 반영
  - `계속`, `상점 보기` 버튼 지원
- `src/game/systems/AccessibilitySystem.ts` 신규 추가
  - 저장 키: `cardville.accessibility.v143`
  - `toggleReduceMotion`, `toggleHighContrast`, `toggleLargeText` 제공
  - `summary()`로 로비 설정 패널에 상태 표시
- `src/game/systems/QualitySystem.ts` 수정
  - 접근성 설정을 품질 게이트에 연결
  - `highContrast`, `largeText` 필드 추가
  - 시스템 모션 감소/URL 플래그/저장 설정을 함께 반영
- `src/game/systems/CoachMarkSystem.ts` 수정
  - `largeText` 설정 시 코치 말풍선 제목/본문 크기 증가
- `src/game/systems/DailyMissionSystem.ts` 수정
  - `nextActionForBoard()` 추가
  - `nextActionTitle`, `nextActionCopy` 추가
  - `recordModeClear()` 중복 return 정리
- `src/game/scenes/DailyMissionScene.ts` 수정
  - 다음 행동 카드 추가
  - 출석/미션/주간 보상 수령 후 `RewardPopupSystem` 팝업 표시
- `src/game/scenes/MainLobbyScene.ts` 수정
  - 로비 설정 패널에 `편안한 모션`, `고대비 화면`, `큰 안내 문구` 토글 추가
- `tools/check-reward-popup.mjs` 신규 추가
- `tools/check-accessibility.mjs` 신규 추가
- `package.json` 수정
  - `check:reward-popup`, `check:accessibility` 추가
  - `npm run verify`에 두 검증 포함
- `public/build.json`, `public/health.html`, `public/reset.html`, `index.html`, 앱 내부 버전 1.0.43 동기화

### 검증 포인트

- `npm run verify` 전체 통과 필요
- `check:reward-popup`은 `RewardPopupSystem`, `nextActionForBoard`, 중복 return 제거, README/인계서 기록을 검증합니다.
- `check:accessibility`는 `AccessibilitySystem`, `cardville.accessibility.v143`, 로비 설정 토글, QualitySystem 연결, README/인계서 기록을 검증합니다.
- 1.0.42 통파일에 1.0.43 패치 ZIP을 덮어 적용해도 verify가 통과해야 합니다.

### 신규 에셋 상태

- 신규 이미지 에셋 없음
- 삭제 파일 없음
- 새 문서 파일 없음
- 기록은 `README.md`, `AI_HANDOFF_CARDVILLE.md`에만 누적

### 다음 예상 작업

에셋이 도착하기 전까지는 미션 완료 연출의 세부 동선, 접근성 설정의 장면별 적용 범위, 출석/미션 보상 밸런스를 더 다듬을 수 있습니다. 에셋이 도착하면 건물/캐릭터/고양이 이모션/보상 이펙트 매핑 패치를 우선 진행하세요.

### 패치 표면 주의

1.0.43 패치파일은 신규 시스템 파일 2개와 검증 파일 2개가 추가되므로 패치 ZIP에 반드시 포함해야 합니다. 또한 `QualitySystem.ts`, `MainLobbyScene.ts`, `DailyMissionScene.ts`, `DailyMissionSystem.ts`는 검증 스크립트가 직접 감시하므로 누락하면 CI에서 버전 섞임 문제가 다시 발생할 수 있습니다.


## 22. 1.0.44 아트 디렉션 바이블/프롬프트 락 패스

현재 기준 버전은 1.0.44입니다.

이번 패스의 목적은 이미지를 대량 생성하기 전에 CardVille의 전체 아트 방향을 먼저 고정하는 것입니다. 이제 CardVille의 기준은 단순히 귀여운 이미지가 아니라 **Premium, Elegant, Stylish, Luxury, High-end, Polished, Professional, AAA Quality**입니다.

### 추가 파일

- `docs/CARDVILLE_ART_DIRECTION_BIBLE.md`
- `docs/CARDVILLE_ASSET_PROMPT_PACK.md`
- `src/game/data/artDirection.ts`
- `tools/check-art-direction.mjs`

### 고정 스타일

- Premium Fantasy Village
- Stylized Realism
- Warm Sunset Lighting
- Cinematic
- Soft Bloom
- AAA Casual Game
- Fantasy RPG Town
- Pixar-quality rendering
- Disney-inspired cinematic lighting
- Console-quality assets
- 2.5D game assets
- Rich textures
- Detailed materials
- High-end UI
- Mobile Game of the Year quality

### 절대 금지

- NOT a children's game
- NOT educational style
- NOT preschool
- NOT kindergarten
- NOT cheap mobile game
- NOT flat design
- NOT vector illustration
- NOT SVG
- NOT childish
- NOT toy-like

SVG 사용 금지, PNG/WebP 전용 원칙을 다시 고정했습니다. 런타임 컷아웃 에셋은 투명 PNG master와 WebP companion을 같이 준비해야 하며, 실제 사용 시 `src/game/data/assetManifest.ts`에 등록해야 합니다.

### 캐릭터 새 기준

- Around 8 years old
- Natural body proportions
- Head-to-body ratio around 1:4.5
- Expressive face but not oversized eyes
- Elegant costume
- Premium character design
- Adventure outfit
- Fantasy traveler
- Modern stylized

기존처럼 머리와 눈이 너무 크고 몸이 작은 초딩/장난감 느낌은 금지합니다. 귀여움보다 고급스러움을 우선합니다.

### 검증

`npm run check:art-direction`은 다음을 확인합니다.

- SVG 파일이 프로젝트에 없는지
- 아트 바이블에 20색 팔레트, 좌상단 광원, 1:4.5 비율, PNG/WebP 규칙이 있는지
- 프롬프트 팩에 공통 positive/negative lock과 common prompt tail이 있는지
- `artDirection.ts`와 `brandRules.ts`가 같은 스타일 기준을 들고 있는지
- `package.json`의 `verify`에 `check:art-direction`이 포함되어 있는지

다음 이미지 대규모 업데이트는 이 파일들을 기준으로 진행해야 합니다.

### 1.0.51 검증 토큰 메모

ui_reward_popup_premium.png는 텍스트 박힘 정책 충돌로 계속 보류합니다.


## 1.0.58 ScreenPlayfieldEnginePolish
- 모바일 큰 글씨 기준으로 말 카드, 연산 연구소, 영어 학교, 기억의 숲, 일일 미션 화면의 패널/카드/버튼 레일 간격을 재조정했다.
- `ScreenUISystem`을 추가해 화면 안전 영역 태그, 터치 타깃, 세로 겹침 경고를 공통화했다.
- `GameButton` 기본 터치 영역을 56px 이상으로 보강하고 라벨 기본 크기를 상향했다.
- 카드게임 엔진 태그 `card-engine-upgrade-v158` 및 `calculateComboScore`/tap guard 기반을 추가했다.
- `check-screen-playfield` 검증을 추가해 UI 안전 영역, 카드 레이아웃, 터치 타깃, 엔진 태그가 누락되지 않게 했다.
