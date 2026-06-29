# CardVille 1.0.53

카드마을 `<CardVille>`은 소년과 검은 고양이가 함께 카드마을을 탐험하며, 카드를 모아 마을을 성장시키는 모바일 우선 카드 퍼즐 게임입니다.



## 1.0.53 업데이트 내역

- **실제 나가기/모바일 가독성/로비 배치/UI 에셋 선별 패스**를 진행했습니다.
- 나가기 버튼 동작을 다시 고쳤습니다.
  - `BackButtonSystem` 태그를 `exit-real-close-v153`로 갱신했습니다.
  - 나가기 버튼은 `window.close()`와 앱/WebView native close bridge만 시도합니다.
  - `history.back`, `location.href`, blank-page fallback을 제거했습니다. 빈 페이지 이동 제거 기준을 검증합니다.
  - 브라우저가 닫기를 막으면 게임을 멈추거나 다른 페이지로 보내지 않고, `다시 나가기`, `첫 화면가기`, `계속하기` 복구 UI만 보여줍니다.
- 모바일 글씨 가독성을 개선했습니다.
  - `TextStyles.ts`에 `mobile-readable-text-v153`를 추가했습니다.
  - 390px 폭 모바일 화면에서 8~11px급 작은 글씨가 너무 작게 보이지 않도록 최소 가독 크기와 접근성 큰 글씨 배율을 적용했습니다.
  - `GameButton` 기본 라벨 크기와 최소 축소 크기를 키웠습니다.
- 로비 배치를 다시 넓혔습니다.
  - 도서관/상점/숲은 왼쪽 끝 공간을 더 사용하고, 연구소/학교/항구는 오른쪽 끝 공간을 더 사용합니다.
  - 중앙에는 광장/이벤트/주인공 동선 숨 쉴 공간을 남겼고, 좌우 끝 공간을 더 적극적으로 활용했습니다.
  - `village-edge-spacing-v153`, `mobile-readable-layout-v153` 태그를 추가했습니다.
  - 건물 터치존이 서로 겹치지 않도록 `check:mobile-exit-layout`에서 다시 검사합니다.
- UI 전용 추가 에셋을 선별 적용했습니다.
  - `CardVille_UI_Only_1.0.48_PNG.zip`를 비교했습니다.
  - 대부분은 1.0.51에 이미 동일하게 적용되어 있어 중복 적용하지 않았습니다.
  - `vfx_reward_burst_premium.png`는 검은 배경을 alpha로 정리해 `effect_reward_burst_premium` 보상 버스트로 갱신했습니다.
  - 텍스트가 이미지 안에 박힌 `ui_reward_popup_premium.png`는 정책상 계속 보류합니다.
- 검증 추가/갱신:
  - `tools/check-mobile-exit-layout.mjs`
  - `tools/check-exit-flow.mjs` real-close 기준 갱신
  - `tools/check-screen-ui-stability.mjs` 모바일 가독성 기준 갱신
  - `tools/check-building-assets.mjs`, `tools/check-village-visuals.mjs` 새 로비 배치 기준 갱신
  - `npm run check:mobile-exit-layout`
- `npm run verify`에 `check:mobile-exit-layout`을 포함했습니다.
- 신규 문서 파일은 만들지 않았습니다.
- 삭제 파일은 없습니다.
- `node_modules`, `dist`, `package-lock.json`은 통파일 ZIP에서 제외합니다.


## 1.0.52 업데이트 내역

- **불안정/겹침/배치/기술부채/UIUX 안정화 패스**를 진행했습니다.
- 주요 장면 이동을 `NavigationSystem.safeStart` / `NavigationSystem.safeRestart`로 통합했습니다.
  - 빠른 연속 터치로 중복 장면 전환이 발생하는 것을 막습니다.
  - `BackConfirmScene` 같은 모달성 씬이 남아 화면을 막는 상황을 전환 전에 정리합니다.
  - 이동 중 짧은 입력 차단막을 표시해 “멈춘 것처럼 보이는” 전환을 줄입니다.
- `GameButton` 안정성과 디자인을 보강했습니다.
  - 버튼 액션 예외를 잡아 콘솔에 `[CardVille] button action failed`로 남깁니다.
  - 비활성 버튼도 흐릿하게 무너지는 대신 회색 프리미엄 팔레트로 다시 그려집니다.
  - `screen-wide-premium-button-v152` 감사 태그를 추가했습니다.
- 로비 UI/배치 안정성을 보강했습니다.
  - `MainLobbyScene.drawRouteOverviewRibbon()` 추가
  - 상단에 오늘 추천 건물/미션 READY 상태를 보여주는 작은 루트 리본을 추가했습니다.
  - `screen-ui-stability-pass-v152` 태그를 추가했습니다.
  - `lobbyLayoutPlan.ts`에 장면 전환, route ribbon, UI 안정성 감사 항목을 추가했습니다.
- 성능/에셋 런타임을 개선했습니다.
  - `public/assets`의 모든 PNG에 WebP companion을 보강했습니다.
  - WebP 지원 브라우저에서는 `IntroLoadingScene`이 PNG 대신 WebP 경로를 우선 로드합니다.
  - 캐시 버스터는 기존처럼 `CARDVILLE_ASSET_VERSION`을 유지합니다.
  - `webp-asset-runtime-v152` 태그를 추가했습니다.
- 검증 추가:
  - `tools/check-navigation-guard.mjs`
  - `tools/check-webp-runtime.mjs`
  - `tools/check-screen-ui-stability.mjs`
  - `npm run check:navigation-guard`
  - `npm run check:webp-runtime`
  - `npm run check:screen-ui-stability`
- `npm run verify`에 위 검증 3개를 포함했습니다.
- 기존 FullIndividual 에셋, 마을 건물 가독성 확대, 나가기 복구, PremiumAAA 선별 적용, WebP companion 정책은 유지합니다.
- 신규 문서 파일은 만들지 않았습니다.
- 삭제 파일은 없습니다.
- `node_modules`, `dist`, `package-lock.json`은 통파일 ZIP에서 제외합니다.


## 1.0.51 업데이트 내역

- **FullIndividual 프리미엄 에셋 적용 패스**를 진행했습니다.
- 업로드된 `CardVille_New_Assets_FullIndividual_1.0.47_PNG_ONLY.zip`를 분석해, 기존 1.0.50 통파일에 적용 가치가 높은 자산만 선별했습니다.
- 적용/갱신한 자산:
  - 상점 내부 배경 `bg_shop_interior.png`
  - 마을 낮/밤 배경 레퍼런스 `bg_lobby_day.png`, `bg_lobby_night.png`
  - 상점 건물 `building_shop.png` 재정리
  - 상점 주인 `npc_shopkeeper.png` 및 `npc_merchant.png` 교체
  - 고양이 힌트 이모션 4종 재적용
  - 모드별 카드 뒷면 4종
  - 상점 오퍼 카드 프레임 4종
  - 스테이지 선택 카드 프레임 3종
  - 희귀도별 보상 상자 4종
  - 프리미엄 코인/보석/XP/카드더스트 아이콘 4종
  - 상태 배지 5종
  - 결과 리본/왕관/별 장식
  - 도서관/연구소/숲 코너 삽화 3종
  - 고양이 발자국 튜토리얼 포인터 2종
- 장면 반영:
  - `ShopScene`은 상점 내부 배경, 오퍼 카드 프레임, 프리미엄 재화 아이콘을 사용합니다.
  - `StageSelectScene`은 모드별 스테이지 카드 프레임과 카드 뒷면을 사용합니다.
  - `ModeSelectScene`은 도서관/연구소/숲 코너 삽화를 약한 액센트로 사용합니다.
  - `RewardPopupSystem`과 `RewardScene`은 리본/별/왕관/희귀도별 보상 상자를 사용합니다.
  - `PlayScene`과 `MemoryForestScene`은 프리미엄 카드 뒷면을 사용합니다.
  - `CoachMarkSystem`은 고양이 발자국 포인터를 앵커 안내에 사용합니다.
- 보류:
  - `ui_reward_popup_premium.png`는 이미지 안에 `REWARDS`, `YOU RECEIVED`, `CLAIM` 텍스트가 박혀 있어 no baked text 정책과 충돌하므로 계속 보류했습니다.
  - `building_tavern_premium.png`는 파일은 보존하지만, 현재 교육/카드마을 역할에 맞지 않아 런타임에는 연결하지 않았습니다.
- 검증 추가:
  - `tools/check-full-individual-assets.mjs`
  - `npm run check:full-individual-assets`
- `npm run verify`에 `check:full-individual-assets`를 포함했습니다.
- `PremiumAAA 선별 에셋 적용` 정책은 유지합니다. 텍스트 박힘 보상 팝업은 보류하고, tavern 건물도 역할이 맞기 전까지 보류합니다.
- 신규 문서 파일은 만들지 않았습니다.
- 삭제 파일은 없습니다.
- `node_modules`, `dist`, `package-lock.json`은 통파일 ZIP에서 제외합니다.

## 1.0.50 업데이트 내역

- **나가기/마을 비주얼 긴급 복구 패스**를 진행했습니다.
- 나가기 버튼 멈춤 복구:
  - DOM 뒤로가기 오버레이와 Phaser `BackConfirmScene`이 동시에 남아 화면을 막을 수 있던 구조를 정리했습니다.
  - `BackButtonSystem`에 `exit-no-freeze-v150` 가드를 추가했습니다.
  - 1.0.53에서 이 복구 흐름은 실제 창 닫기 시도와 `첫 화면가기`, `계속하기`만 남기고 blank-page 이동을 제거했습니다.
  - `BackConfirmScene`의 직접 종료 경로를 `BackButtonSystem.requestExit()`로 통합했습니다.
- 마을 건물 가독성 확대:
  - `diorama_bg.png`를 1080×1920 프리미엄 마을 배경으로 재생성했습니다.
  - 9개 마을 건물 PNG/WebP를 self-contained 패치 표면에 포함합니다.
  - 새 고해상도 건물이 작게 묻히지 않도록 `visualWidth/visualHeight`를 확대했습니다.
  - `MainLobbyScene`에 `village-readable-building-scale-v150` 태그와 `premiumStage` 접지 패널을 추가해 건물이 배경에 묻히지 않도록 했습니다.
- 검증 추가:
  - `tools/check-exit-flow.mjs`
  - `tools/check-village-visuals.mjs`
  - `npm run check:exit-flow`
  - `npm run check:village-visuals`
- `npm run verify`에 `check:exit-flow`, `check:village-visuals`를 포함했습니다.
- 신규 문서 파일은 만들지 않았습니다.
- 삭제 파일은 없습니다.
- `node_modules`, `dist`, `package-lock.json`은 통파일 ZIP에서 제외합니다.

## 1.0.49 업데이트 내역

- **PremiumAAA 선별 에셋 적용 패스**를 진행했습니다.
- 업로드된 `CardVille_New_Assets_PremiumAAA_1.0.46_PNG.zip`를 분석해 실제 런타임에 도움이 되는 자산만 선별했습니다.
- 적용한 자산:
  - `building_card_shop_premium.png` → `public/assets/diorama/building_shop.png`로 정리 적용
  - `hero_traveler_premium.png` → `heroTravelerPremium`, `diorama/character_boy_token`으로 적용
  - `black_cat_mascot_premium.png` → `blackCatMascotPremium`, `diorama/mascot_black_cat_token`으로 적용
  - `card_frame_legendary_premium.png` → `frame_legendary_gold_normal`으로 적용
  - `vfx_reward_burst_premium.png` → `effect_reward_burst_premium`으로 적용
  - `treasure_chest_premium.png` → `ui_treasure_chest_premium`으로 적용
- 모든 적용 자산은 RGB 배경을 alpha PNG로 재정리하고 WebP companion을 다시 생성했습니다.
- `MainLobbyScene`은 로비 파티에서 `heroTravelerPremium`과 `blackCatMascotPremium`을 우선 사용합니다.
- `ShopScene`은 새 카드 상점 건물과 상점 NPC를 상단 액센트로 보여줍니다.
- 텍스트 박힘 보상 팝업은 보류했습니다. no baked text 정책과 충돌합니다.
- tavern 건물은 키즈/교육 톤과 현재 콘텐츠 역할이 맞지 않아 보류했습니다.
- `tools/check-premium-asset-select.mjs`와 `npm run check:premium-asset-select`를 추가했습니다.
- `npm run verify`에 `check:premium-asset-select`를 포함했습니다.
- 마을 이미지 표시 복구, 공통 프리미엄 버튼, BASE_URL 캐시버스터, self-contained 에셋 패치 정책은 유지했습니다.
- 신규 문서 파일은 만들지 않았습니다.
- 삭제 파일은 없습니다.
- `node_modules`, `dist`, `package-lock.json`은 통파일 ZIP에서 제외합니다.

## 1.0.48 업데이트 내역

- **마을 이미지 표시 복구/버튼 프리미엄 복구 패스**를 진행했습니다.
- 사용자 피드백 기준 핵심 문제를 인정하고 바로잡았습니다.
  - 마을 이미지가 안 보이는 경우: 1.0.47 패치 ZIP이 1.0.46 에셋 적용본 위에 올라가는 델타 패치였기 때문에, 기준 통파일에 프리미엄 PNG가 없으면 로비가 텍스처 누락 상태가 될 수 있었습니다.
  - 버튼 디자인 문제: 시작 화면은 무광 벡터 CTA였지만 다른 장면의 `GameButton`은 기존 구운 버튼 스킨을 기본값으로 계속 사용할 수 있었습니다.
- `IntroLoadingScene`을 수정해 모든 런타임 에셋을 `import.meta.env.BASE_URL` 기준 절대 경로로 로드합니다.
- 모든 에셋 로드 URL에 `CARDVILLE_ASSET_VERSION` 쿼리를 붙여 GitHub Pages/브라우저 캐시가 오래된 마을 이미지를 붙잡는 문제를 줄였습니다.
- 에셋 로드 실패 시 콘솔에 `[CardVille] asset load failed` 경고를 남기도록 했습니다.
- `MainLobbyScene`에 `drawMissingBuildingFallback`을 추가해, 어떤 이유로 건물 텍스처가 빠져도 빈 네모가 아니라 프리미엄 대체 카드와 아이콘으로 표시되게 했습니다.
- 시작 화면 CTA 품질을 공통 GameButton 기본값으로 확장했습니다.
- `GameButton` 기본 디자인을 시작 화면 CTA와 같은 프리미엄 벡터 버튼으로 변경했습니다.
  - 기존 구운 PNG 버튼 스킨은 `options.skin === true`일 때만 사용합니다.
  - 기본 버튼은 골드/블루/퍼플/코랄 톤별 그라데이션, 외곽선, 하단 베벨, 굵은 라벨을 사용합니다.
- 1.0.48 패치 ZIP은 더 이상 얇은 델타만 담지 않고, 마을 표시 핵심 에셋을 포함하는 **self-contained 안정형 패치**로 만듭니다.
- `tools/check-asset-runtime.mjs`와 `npm run check:asset-runtime`을 추가했습니다.
- `tools/check-premium-buttons.mjs`와 `npm run check:premium-buttons`를 추가했습니다.
- `npm run verify`에 두 검증을 포함했습니다.
- 신규 이미지 에셋은 추가하지 않았고, 1.0.46에서 적용된 프리미엄 건물/캐릭터/UI 에셋을 패치 표면에 다시 포함합니다.
- 신규 문서 파일은 만들지 않았습니다.
- 삭제 파일은 없습니다.
- `node_modules`, `dist`, `package-lock.json`은 통파일 ZIP에서 제외합니다.

## 1.0.47 업데이트 내역

- **프리미엄 로비 에셋 배치 보정 패스**를 진행했습니다.
- 1.0.46에서 적용한 1254×1254 프리미엄 건물 PNG들이 기존 직사각형 `setDisplaySize(width,height)` 렌더링 때문에 세로/가로 비율이 눌려 보일 수 있는 문제를 수정했습니다.
- `MainLobbyScene`에 `fitImageToBox`를 추가해 건물과 NPC 이미지를 원본 비율 유지 방식으로 렌더링합니다.
- 건물 데이터에 `visualWidth`, `visualHeight`, `nameplateY`, `statusY`, `statusX` 같은 프리미엄 로비 배치 필드를 추가했습니다.
- 새 건물 이미지 기준으로 성/도서관/연구소/광장/상점/학교/숲/이벤트/항구의 y좌표, 터치존, 이름표, 상태칩 위치를 다시 조정했습니다.
- `npc_merchant`와 `npc_town_cat`은 새 고해상도 에셋을 알아보기 쉽게 조금 더 크게 보이도록 배치와 크기를 보정했습니다.
- 광장 소품, 벤치, 랜턴, 표지판 위치를 새 건물 크기에 맞춰 재배치했습니다.
- 열린 건물에는 `uiDoorLight`와 접지 글로우를 더해 문이 살아 있는 느낌을 강화했습니다.
- 이벤트 건물의 `READY n` 상태칩은 숲/항구 칩과 겹치지 않도록 안쪽으로 보정했습니다.
- `src/game/data/lobbyLayoutPlan.ts`에 `LOBBY_PREMIUM_VISUAL_FIT_AUDIT`를 추가했습니다.
- `tools/check-lobby-premium-fit.mjs`와 `npm run check:lobby-premium-fit`을 추가했습니다.
- `npm run verify`에 `check:lobby-premium-fit`을 포함했습니다.
- 기존 아트 바이블, no-SVG, PNG/WebP companion, 마을 건물 에셋 패스, 로비 배치/겹침 감사, 패치 표면 완전성 규칙은 유지했습니다.
- 신규 이미지 에셋은 추가하지 않았습니다.
- 신규 문서 파일은 만들지 않았습니다.
- 삭제 파일은 없습니다.
- `node_modules`, `dist`, `package-lock.json`은 통파일 ZIP에서 제외합니다.

## 1.0.46 업데이트 내역

- **프리미엄 PNG 배치 에셋 적용 패스**를 진행했습니다.
- 사용자가 업로드한 3개 에셋 묶음을 기준으로, 바로 적용 가능한 자산과 보류해야 할 자산을 분리했습니다.
- 적용한 자산:
  - 마을 건물 9종: `building_castle`, `building_library`, `building_lab`, `building_shop`, `building_school`, `building_forest`, `building_event`, `building_harbor`, `building_plaza`
  - 상점 NPC: `npc_merchant`
  - 마을 고양이 NPC: `npc_town_cat`
  - 고양이 이모션 4종: `cat_hint_happy`, `cat_hint_think`, `cat_hint_surprise`, `cat_hint_sleepy`
  - 카드팩 오픈 이펙트 4종: `effect_pack_burst_common`, `effect_pack_burst_rare`, `effect_pack_burst_epic`, `effect_pack_burst_legendary`
  - 보상 연출 보조 이펙트: `effect_reward_burst_premium`
  - 연산 연구소 콘솔: `ui_math_console`
  - 기억의 숲 보드: `ui_memory_board`
  - 보상 상자 장식: `ui_treasure_chest_premium`
  - 전설 카드 프레임: `frame_legendary_gold_normal`
- 업로드 PNG가 실제 alpha PNG가 아니라 체크무늬/흰색/검은색 배경이 RGB로 구워진 상태였기 때문에, 자동 배경 제거 후 RGBA PNG로 다시 저장했습니다.
- 모든 적용 자산에 WebP companion을 생성했습니다.
- `src/game/data/assetManifest.ts`에 신규 이모션/이펙트/UI 자산을 등록했습니다.
- `CoachMarkSystem`은 말풍선 톤에 따라 행복/생각/놀람 고양이 이모션을 사용합니다.
- `RewardPopupSystem`은 놀람/행복/생각/졸림 고양이, 프리미엄 보상 버스트, 보상 상자 장식을 사용합니다.
- `RewardScene`은 카드팩 희귀도에 따라 common/rare/epic/legendary 버스트 이펙트를 카드팩 개봉과 카드 공개 화면에 표시합니다.
- `MathLabScene`은 `ui_math_console`을 문제 패널 장식으로 사용합니다.
- `MemoryForestScene`은 `ui_memory_board`와 `cat_hint_think`를 사용합니다.
- `cardville_ui_reward_popup_premium.png`는 이미지 안에 영문 텍스트가 박혀 있어 현재 아트 바이블의 no baked text 정책과 충돌하므로 이번 패치에서는 적용하지 않았습니다.
- `tools/check-applied-assets.mjs`와 `npm run check:applied-assets`를 추가했습니다.
- `npm run verify`에 `check:applied-assets`를 포함했습니다.
- 신규 문서 파일은 만들지 않았고, 기존 README/AI_HANDOFF 및 사용자가 추가한 아트 문서만 버전 동기화했습니다.
- 삭제 파일은 없습니다.
- `node_modules`, `dist`, `package-lock.json`은 통파일 ZIP에서 제외합니다.

## 1.0.45 업데이트 내역

- **아트 바이블/프롬프트 락 + 완주 미션 라우트 병합 패스**를 진행했습니다.
- 사용자가 패치한 `1.0.44_ArtDirectionBible_PromptLock` 통파일을 기준으로 삼고, 직전 1.0.43에서 이어진 내 1.0.44 `PerfectDayMissionRouteUX` 변경분을 충돌 없이 병합했습니다.
- 보존한 사용자 변경분:
  - `docs/CARDVILLE_ART_DIRECTION_BIBLE.md`
  - `docs/CARDVILLE_ASSET_PROMPT_PACK.md`
  - `src/game/data/artDirection.ts`
  - `src/game/data/brandRules.ts`의 프리미엄 AAA/스타일 락 방향
  - `tools/check-art-direction.mjs`
  - `npm run check:art-direction`
- 다시 적용한 미션 라우트 변경분:
  - 내부 스키마 표식 `v144-perfect-day-lobby-route` 유지
  - `DailyMissionSystem`의 `dailyCompletionReady`, `dailyCompletionClaimed`, `rewardReadyCount`, `lobbyBadgeLabel`, `shouldPrioritizeEvent`
  - `claimDailyCompletionReward()` 오늘 완주 보상
  - `getLobbyStatus()` 로비 READY 라우팅 상태 API
  - 이벤트 건물 상태칩 `READY n`, `MISSION`, `DONE`
  - `ModeSelectScene` 오늘의 미션 카드에 실제 대기 보상 수와 다음 행동 표시
- `tools/check-mission-route.mjs`와 `npm run check:mission-route`를 추가/유지했습니다.
- `npm run verify`는 이제 `check:art-direction`과 `check:mission-route`를 모두 포함합니다.
- `1.0.44_ArtDirectionBible_PromptLock` 통파일 자체 검증 결과 `npm run verify` 통과를 확인했습니다.
- 이번 병합본도 `npm run verify` 전체 통과 기준으로 확정했습니다.
- 신규 이미지 에셋은 아직 추가하지 않았습니다.
- 사용자 제공 문서 2개는 의도된 아트 바이블/프롬프트 락 문서로 판단해 보존했습니다.
- 이번 패치에서 새 문서 파일은 추가하지 않았습니다.
- 삭제 파일은 없습니다.
- `node_modules`, `dist`, `package-lock.json`은 통파일 ZIP에서 제외합니다.

## 1.0.44 업데이트 내역

- **아트 디렉션 바이블/프롬프트 락 패스**를 진행했습니다.
- 대규모 이미지 에셋 생성 전에 CardVille만의 프리미엄 AAA 모바일 게임 스타일을 먼저 고정했습니다.
- `docs/CARDVILLE_ART_DIRECTION_BIBLE.md`를 신규 추가했습니다.
  - Premium Fantasy Village, Stylized Realism, Warm Sunset Lighting, Cinematic, Soft Bloom, AAA Casual Game을 핵심 스타일로 고정했습니다.
  - `NOT children's illustration`, `NOT educational`, `NOT preschool`, `NOT flat design`, `NOT vector`, `NOT SVG`, `NOT cheap mobile game` 금지 방향을 명확히 박았습니다.
  - 20가지 색상 팔레트, 좌상단 광원, 나무/금속/유리/천/가죽/석재/마법 재질 규칙을 정의했습니다.
  - 캐릭터 비율은 머리:몸 약 1:4.5, 자연스러운 stylized proportions 기준으로 고정했습니다.
- `docs/CARDVILLE_ASSET_PROMPT_PACK.md`를 신규 추가했습니다.
  - 캐릭터, 검은 고양이, 건물, UI, 카드 프레임용 공통 프롬프트 템플릿을 정리했습니다.
  - PNG master + WebP companion + assetManifest 등록 + no SVG 납품 규칙을 명시했습니다.
- `src/game/data/artDirection.ts`를 신규 추가했습니다.
  - 코드에서 재사용 가능한 스타일 키워드, 금지 키워드, 공통 프롬프트 꼬리문, 20색 팔레트, 광원/캐릭터/재질/포맷 정책을 상수화했습니다.
- `src/game/data/brandRules.ts`를 새 방향에 맞춰 보강했습니다.
  - 기존 귀여운 느낌보다 Premium, Elegant, Stylish, High-end 방향을 우선합니다.
  - 주인공은 around 8 years old 느낌이지만 초딩/유치한 비율이 아닌 고급스러운 판타지 여행자 기준입니다.
- `tools/check-art-direction.mjs`와 `npm run check:art-direction`을 추가했습니다.
  - SVG 파일 존재 여부를 직접 검사합니다.
  - 아트 바이블, 프롬프트 팩, `artDirection.ts`, `brandRules.ts`, README, AI_HANDOFF가 같은 기준을 공유하는지 검증합니다.
- `npm run verify`에 `check:art-direction`을 포함했습니다.
- 신규 이미지 에셋은 아직 추가하지 않았습니다. 이번 버전은 **이미지 양산 전 스타일 고정 패스**입니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, `index.html`, 앱 내부 버전 표기를 1.0.44으로 동기화했습니다.

## 1.0.43 업데이트 내역

- **무에셋 미션 보상 팝업/접근성 UX 패스**를 진행했습니다.
- 새 이미지 에셋은 아직 준비 전이므로 기존 에셋과 벡터 UI만 사용했습니다.
- `src/game/systems/RewardPopupSystem.ts`를 신규 추가했습니다.
  - 출석 보상, 일일 미션 보상, 주간 미션 보상 수령 직후 중앙 보상 팝업을 표시합니다.
  - `reward-popup:v143` 이름으로 관리되며 모션/고대비 설정을 따라갑니다.
  - 팝업에는 `계속`, `상점 보기` 동선을 제공해 보상 수령 후 다음 행동이 끊기지 않도록 했습니다.
- `src/game/systems/DailyMissionSystem.ts`를 보강했습니다.
  - `nextActionForBoard()` 추가
  - `nextActionTitle`, `nextActionCopy`를 보드에 노출
  - 이벤트 보드 상단에서 지금 가장 좋은 다음 행동을 바로 안내합니다.
  - `recordModeClear()`에 남아 있던 중복 `return`을 제거했습니다.
- `src/game/scenes/DailyMissionScene.ts`를 개선했습니다.
  - 오늘 진행도 위에 다음 행동 카드 추가
  - 기존 토스트 중심 보상을 팝업 중심 보상 확인 흐름으로 개선
  - 보상 수령 직후 주간 게이지와 상점 이동이 자연스럽게 이어지도록 조정
- `src/game/systems/AccessibilitySystem.ts`를 신규 추가했습니다.
  - 저장 키: `cardville.accessibility.v143`
  - `편안한 모션`, `고대비 화면`, `큰 안내 문구` 설정을 localStorage에 저장합니다.
  - localStorage 차단 환경에서도 기본값으로 안전하게 동작합니다.
- `src/game/systems/QualitySystem.ts`를 접근성 설정과 연결했습니다.
  - 시스템 `prefers-reduced-motion`, URL `?reduceMotion`, 저장된 `편안한 모션` 설정을 함께 반영합니다.
  - 고대비/큰 안내 상태를 성능 요약과 코치 말풍선에 반영합니다.
- 로비 설정 패널을 개선했습니다.
  - `편안한 모션`
  - `고대비 화면`
  - `큰 안내 문구`
  - 세 가지 토글을 로비 설정에서 바로 조정할 수 있습니다.
- `tools/check-reward-popup.mjs`와 `npm run check:reward-popup`을 추가했습니다.
- `tools/check-accessibility.mjs`와 `npm run check:accessibility`를 추가했습니다.
- `npm run verify`에 `check:reward-popup`, `check:accessibility`를 포함했습니다.
- 1.0.39에서 잡은 패치 표면 완전성 규칙을 유지합니다.
- 신규 이미지 에셋은 추가하지 않았습니다.
- 신규 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- 삭제 파일은 없습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, `index.html`, 앱 내부 버전 표기를 1.0.43으로 동기화했습니다.
- `npm run verify` 전체 통과 기준으로 확정했습니다.

## 1.0.42 업데이트 내역

- **무에셋 연속 출석/주간 미션 루프 패스**를 진행했습니다.
- 새 이미지 에셋은 아직 준비 전이므로 기존 에셋과 벡터 UI만 사용했습니다.
- 기존 `cardville.dailyMission.v141` 저장 키는 유지했습니다.
  - 기존 사용자 일일 미션 데이터를 갑자기 끊지 않기 위해 저장소 이름은 유지합니다.
  - 내부 스키마 표식으로 `v142-streak-weekly`를 추가했습니다.
- `src/game/systems/DailyMissionSystem.ts`를 확장했습니다.
  - `streakDays`, `bestStreakDays`, `lastAttendanceToken` 추가
  - `weeklyToken`, `weeklyProgress`, `weeklyTarget`, `weeklyReady`, `weeklyClaimed`, `weeklyCompletionRatio` 추가
  - `claimWeeklyReward()` 추가
  - 출석 보상 코인을 연속 출석에 따라 소폭 증가하도록 변경
  - 출석/미션 보상 수령 시 주간 목표 게이지가 함께 채워지도록 연결
- `src/game/scenes/DailyMissionScene.ts`를 개선했습니다.
  - 오늘 진행도 위아래 배치를 재정리해 390×844 하단 버튼과 겹치지 않게 조정
  - 연속 출석/최고 연속 출석 표시 추가
  - 주간 보상 게이지와 `주간 수령` 버튼 추가
  - 고양이 코치 말풍선을 `daily_mission_board_v142`로 갱신
- `tools/check-weekly-mission.mjs`와 `npm run check:weekly-mission`을 추가했습니다.
  - 연속 출석 필드
  - 주간 미션 필드
  - 주간 보상 수령 API
  - 일일 미션 장면 UI 토큰
  - README/AI_HANDOFF 기록 동기화
  - 버전 동기화를 검증합니다.
- `tools/check-daily-mission.mjs`도 1.0.42 구조에 맞게 보강했습니다.
- `npm run verify`에 `check:weekly-mission`을 포함했습니다.
- 1.0.39에서 잡은 패치 표면 완전성 규칙을 유지합니다.
- 신규 이미지 에셋은 추가하지 않았습니다.
- 신규 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- 삭제 파일은 없습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, `index.html`, 앱 내부 버전 표기를 1.0.42로 동기화했습니다.
- `npm run verify` 전체 통과 기준으로 확정했습니다.

## 1.0.41 업데이트 내역

- **무에셋 일일 미션/출석 보상 루프 패스**를 진행했습니다.
- 새 이미지 에셋은 아직 준비 전이므로 기존 에셋과 벡터 UI만 사용했습니다.
- `src/game/systems/DailyMissionSystem.ts`를 신규 추가했습니다.
  - 저장 키: `cardville.dailyMission.v141`
  - UTC 일자 토큰 기반으로 매일 미션 상태가 갱신됩니다.
  - `clear_word`, `clear_english`, `clear_math`, `clear_memory`, `open_pack` 미션을 관리합니다.
  - `recordModeClear`, `recordPackOpen`, `claimAttendanceReward`, `claimMissionReward`를 제공합니다.
  - localStorage 차단 환경에서도 게임 진행이 끊기지 않도록 안전 처리했습니다.
- `src/game/scenes/DailyMissionScene.ts`를 신규 추가했습니다.
  - 출석 보상 READY/완료 상태 표시
  - 오늘 진행도 바
  - 미션별 진행도/보상/수령 버튼
  - 게임 선택, 상점, 광장 복귀 버튼
  - 고양이 코치 말풍선 `daily_mission_board_v141` 연결
- 이벤트 건물 라우트를 변경했습니다.
  - 기존: 즉시 `RewardScene` 카드팩 보상
  - 변경: `DailyMissionScene` 일일 미션 보드
  - 건물 부제: `일일 미션`
- `RewardScene`에 일일 미션 훅을 연결했습니다.
  - 카드팩 개봉 시 `DailyMissionSystem.recordPackOpen()` 호출
  - 게임 보상팩 개봉 시 모드별 `recordModeClear()` 호출
  - 상점팩은 카드팩 개봉 미션만 반영해 미션 루프가 과도하게 중복되지 않도록 했습니다.
- `ModeSelectScene`의 일일 콘텐츠 설명을 `오늘의 미션` 기준으로 정리했습니다.
- `BackConfirmScene`, `src/main.ts`에 `DailyMissionScene`을 등록했습니다.
- `tools/check-daily-mission.mjs`와 `npm run check:daily-mission`을 추가했습니다.
  - 미션 시스템 저장 키
  - 이벤트 건물 라우팅
  - 보상팩/모드 클리어 훅
  - README/AI_HANDOFF 기록 동기화
  - 버전 동기화를 검증합니다.
- `npm run verify`에 `check:daily-mission`을 포함했습니다.
- 1.0.39에서 잡은 패치 표면 완전성 규칙을 유지합니다.
- 신규 이미지 에셋은 추가하지 않았습니다.
- 신규 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- 삭제 파일은 없습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, `index.html`, 앱 내부 버전 표기를 1.0.41로 동기화했습니다.
- `npm run verify` 전체 통과 기준으로 확정했습니다.

## 1.0.40 업데이트 내역

- **무에셋 고양이 코치/첫 플레이 UX 패스**를 진행했습니다.
- 새 이미지 에셋은 아직 준비 전이므로 기존 `catHint` 에셋과 벡터 말풍선만 사용했습니다.
- `src/game/systems/CoachMarkSystem.ts`를 신규 추가했습니다.
  - 저장 키: `cardville.coach.seen.v140`
  - `showOnce`, `markSeen`, `reset` 제공
  - 한 번 확인한 안내는 다시 과도하게 뜨지 않도록 localStorage에 기록합니다.
  - localStorage가 막힌 브라우저에서도 게임 진행이 끊기지 않도록 안전 처리했습니다.
- 첫 플레이 안내 말풍선을 연결했습니다.
  - 로비: `고양이 길잡이`로 NEXT 건물/NPC 터치 안내
  - 스테이지 선택: 잠금/추천/NEXT/보상 미리보기 안내
  - 도서관 플레이: TOP 카드, 힌트, 복구 버튼 사용법 안내
  - 영어 학교: 영어 단어/예문/뜻 카드 선택 흐름 안내
  - 상점: 무료팩 READY, 추천 오퍼, 코인 환급 루프 방지 안내
- `tools/check-coach.mjs`와 `npm run check:coach`를 추가했습니다.
  - `CoachMarkSystem` 존재
  - 주요 장면 연결
  - 저장 키
  - README/AI_HANDOFF 기록 동기화
  - 버전 동기화를 검증합니다.
- `npm run verify`에 `check:coach`를 포함했습니다.
- 1.0.39에서 잡은 패치 표면 완전성 규칙을 유지합니다.
- 신규 이미지 에셋은 추가하지 않았습니다.
- 신규 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- 삭제 파일은 없습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, `index.html`, 앱 내부 버전 표기를 1.0.40으로 동기화했습니다.
- `npm run verify` 전체 통과 기준으로 확정했습니다.

## 1.0.39 업데이트 내역

- **CI 빌드 가드/ModeSelect 패치 표면 완전성 패스**를 진행했습니다.
- GitHub Actions 로그에서 확인된 직접 실패 원인은 `tools/check-polish.mjs`가 `src/game/scenes/ModeSelectScene.ts`의 `modeProgressSummary` 토큰을 요구했지만, 배포 저장소의 해당 파일이 최신 패치 표면에 포함되지 않아 오래된 파일 상태로 남은 것입니다.
- 전체 통파일에는 `ModeSelectScene.ts`가 정상 포함되어 있었지만, 패치 ZIP이 직전 기준 변경 파일만 담으면서 검증 스크립트가 감시하는 장면 파일 일부가 누락될 수 있는 절차상 위험이 있었습니다.
- 이번 패치 ZIP은 빌드 실패 복구를 위해 `src/`, `tools/`, `package.json`, `index.html`, `public/build.json`, `public/health.html`, `public/reset.html`, `README.md`, `AI_HANDOFF_CARDVILLE.md`를 함께 담는 안정형 패치로 구성했습니다.
- `ModeSelectScene.ts`의 모드 진행 요약 표면을 다시 명시적으로 보존했습니다.
  - `modeProgressSummary`
  - `문제팩 선택`
  - `숲 카드 선택`
  - `뜻 카드 연결`
- `tools/check-ci-coherence.mjs`를 추가했습니다.
  - 패키지/빌드/헬스/리셋/HTML/로비 버전 동기화 검증
  - `ModeSelectScene.ts` 최신화 검증
  - `check-polish` 감시 표면 유지 검증
  - README/AI_HANDOFF 기록 동기화 검증
- `npm run verify`에 `check:ci-coherence`를 포함했습니다.
- `tools/check-english-school.mjs`의 1.0.38 하드코딩 검증 일부를 현재 `package.json` 버전 기준 검증으로 정리했습니다.
- 앞으로 패치 ZIP을 만들 때는 단순 변경 파일만이 아니라 **검증 스크립트가 요구하는 파일과 라우팅 핵심 파일을 같이 담는 패치 표면 완전성 규칙**을 적용합니다.
- 신규 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- 삭제 파일은 없습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, `index.html`, 앱 내부 버전 표기를 1.0.39로 동기화했습니다.
- `npm run verify` 전체 통과 기준으로 확정했습니다.

## 1.0.38 업데이트 내역

- **영어 학교 1차 수업/무에셋 콘텐츠 확장 패스**를 진행했습니다.
- 새 이미지 에셋은 아직 받지 않았으므로 기존 에셋과 벡터 UI만 사용했습니다.
- `src/game/data/englishStages.ts`를 신규 추가했습니다.
  - 4교시, 24개 영어 카드 데이터 구성
  - 1교시: `인사 카드 수업`
  - 2교시: `마을 물건 카드`
  - 3교시: `행동 카드 수업`
  - 4교시: `짧은 문장 수업`
- `EnglishSchoolScene`을 신규 추가했습니다.
  - 영어 단어를 보고 한국어 뜻 카드를 고르는 1차 수업 모드
  - 콤보, 생명, 진행 바, 힌트, 예문, 결과 피드백 포함
  - 모션/파티클은 `QualitySystem` 기준으로 제한
- 학교 건물을 실제 오픈 콘텐츠로 전환했습니다.
  - `DIORAMA_BUILDINGS`의 `school`을 `open: true`로 변경
  - 학교 건물 터치 시 `StageSelectScene`의 `english` 모드로 이동
- `ModeSelectScene`과 `StageSelectScene`에 영어 학교 진행 요약/스테이지 목록/보상 프리뷰를 추가했습니다.
- `RewardScene`에 영어 학교 보상 문구와 `영어 학교 수업 보너스`를 추가했습니다.
- `MainLobbyScene` 추천 동선에 영어 학교를 포함했습니다.
  - 도서관 다음 미완료 추천 건물로 학교가 노출됩니다.
  - 상단 HUD 진행 수를 도서관/영어/연구소/숲 전체 열린 스테이지 기준으로 정리했습니다.
- `BackConfirmScene` 종료 정리 대상에 `EnglishSchoolScene`을 추가했습니다.
- `tools/check-english-school.mjs`와 `npm run check:english-school`을 추가했습니다.
  - 영어 스테이지/카드 수
  - 학교 건물 오픈 라우팅
  - 스테이지 선택/모드 선택/보상 연동
  - README/AI_HANDOFF 기록 동기화
  - 버전 동기화를 검증합니다.
- `npm run verify`에 `check:english-school`을 포함했습니다.
- 기존 디자인 에셋 요청서는 유지하되, 에셋 수령 전까지는 무에셋 패치로 진행합니다.
- 새 버전별 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, `index.html`, 앱 내부 버전 표기를 1.0.38로 동기화했습니다.
- `npm run verify` 전체 통과 기준으로 확정했습니다.


## 1.0.37 업데이트 내역

- **콘텐츠 스케일/보상 차등/디자인 에셋 요청 패스**를 진행했습니다.
- 연산 연구소 `mathStages.ts`를 5스테이지 25문제로 확장했습니다.
  - 신규 4단계: `상점 계산 장부`
  - 신규 5단계: `왕관 회로 시험`
  - `MathLabScene`에 단계 진행 바, 난이도 보상 문구, 단계/난이도 점수 보너스를 추가했습니다.
- 기억의 숲 `memoryStages.ts`를 4스테이지 42쌍으로 확장했습니다.
  - 신규 3단계: `반딧불 카드길`
  - 신규 4단계: `고양이 그림자 숲`
  - `MemoryForestScene` 보드를 카드 수에 따라 4열/5열 동적 그리드로 전환해 많은 카드가 들어와도 하단 버튼을 침범하지 않게 했습니다.
  - 기억의 숲 별 산정은 고정 선택 수가 아니라 `targetMoves` 기준으로 바꿔 스테이지 규모가 커져도 보상이 공정하게 계산됩니다.
- `StageSelectScene`에 모드별 보상 프리뷰 문구를 추가했습니다.
  - `단어 보상`
  - `집중/도전 보상`
  - `기억 보상`
- `RewardScene`에 `progressionRewardBonus`를 추가했습니다.
  - 연구소: `연구소 난이도 보너스`
  - 기억의 숲: `숲 기억력 보너스`
  - 도서관: `도서관 숙련 보너스`
  - 상점 구매팩은 기존처럼 코인 환급 루프 방지를 위해 보상 차등에서 제외합니다.
- `tools/check-content-scale.mjs`와 `npm run check:content-scale`을 추가했습니다.
  - 수학 스테이지/문제 수
  - 기억 스테이지/짝 카드 수
  - 동적 기억 보드
  - 난이도/진행 보상
  - README/AI_HANDOFF 기록 동기화를 검증합니다.
- `npm run verify`에 `check:content-scale`을 포함했습니다.
- 기존 시작 화면 무광 CTA, 상점 허브, 카드팩 보상, 앨범, 로비 배치, 진행 저장, 프리미엄 PNG/WebP, SVG 금지 정책은 유지했습니다.
- `npm run verify` 전체 통과를 확인했습니다.
- 새 버전별 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, 앱 내부 버전 표기를 1.0.37로 동기화했습니다.

### 추가 디자인 이미지 에셋 요청서

현재 코드 구조상 아래 에셋이 있으면 CardVille 스타일 연계성이 크게 좋아집니다. 새 에셋을 만들 때는 **프리미엄 2.5D 판타지, 따뜻한 골드/보라/블루, 소년과 검은 고양이 브랜드 고정, 투명 PNG + WebP 동반** 기준으로 제작하는 것이 좋습니다. SVG는 현재 정책상 사용하지 않습니다.

#### 최우선 S급 에셋

1. **상점 주인 NPC 전신 컷아웃**
   - 경로 후보: `public/assets/characters/npc_shopkeeper.png`
   - 크기 권장: 1024×1536 또는 1254×1254 투명 PNG
   - 스타일: 따뜻한 상인, 카드팩/코인 주머니/작은 망토, 소년 캐릭터와 같은 동화풍 비율
   - 용도: `ShopScene` 상단 오퍼 추천, 로비 상점 앞 NPC, 구매 성공 연출

2. **연산 연구소 프리미엄 문제 콘솔**
   - 경로 후보: `public/assets/ui/ui_math_console.png`
   - 크기 권장: 1024×720 투명 PNG
   - 스타일: 마법 회로, 숫자 룬, 노란 빛, 보라 유리판
   - 용도: `MathLabScene` 중앙 식 카드 배경, 난이도 보스 문제팩 연출

3. **기억의 숲 카드 보드 패널**
   - 경로 후보: `public/assets/ui/ui_memory_board.png`
   - 크기 권장: 1024×1024 또는 1200×900 투명 PNG
   - 스타일: 숲 잎사귀 프레임, 반딧불, 어두운 초록+골드 테두리
   - 용도: `MemoryForestScene` 카드 그리드 배경, 프리뷰/짝 발견 연출

4. **고양이 힌트 이모션 세트**
   - 경로 후보:
     - `public/assets/characters/cat_hint_happy.png`
     - `public/assets/characters/cat_hint_think.png`
     - `public/assets/characters/cat_hint_surprise.png`
     - `public/assets/characters/cat_hint_sleepy.png`
   - 크기 권장: 각 512×512 투명 PNG
   - 용도: 힌트, 실패 복구, 무료팩 READY, 콤보 코치

5. **카드팩 오픈 이펙트 스프라이트 4종**
   - 경로 후보:
     - `public/assets/effects/effect_pack_burst_common.png`
     - `public/assets/effects/effect_pack_burst_rare.png`
     - `public/assets/effects/effect_pack_burst_epic.png`
     - `public/assets/effects/effect_pack_burst_legendary.png`
   - 크기 권장: 1024×1024 투명 PNG
   - 용도: `RewardScene`, 상점 구매팩 전환, 희귀도별 보상 체감 강화

#### A급 UI/UX 에셋

6. **스테이지 선택 카드 프레임 세트**
   - 경로 후보:
     - `public/assets/ui/ui_stage_card_word.png`
     - `public/assets/ui/ui_stage_card_math.png`
     - `public/assets/ui/ui_stage_card_memory.png`
   - 크기 권장: 900×300 투명 PNG
   - 용도: `StageSelectScene`에서 모드별 카드 정체성 강화

7. **보상 리본/배지 세트**
   - 경로 후보:
     - `public/assets/ui/badge_next.png`
     - `public/assets/ui/badge_best.png`
     - `public/assets/ui/badge_ready.png`
     - `public/assets/ui/badge_locked.png`
   - 크기 권장: 512×256 투명 PNG
   - 용도: 로비 상태 칩, 상점 추천 오퍼, 무료팩, 스테이지 잠금

8. **코인/보석/XP 대형 아이콘**
   - 경로 후보:
     - `public/assets/icons/icon_coin_premium.png`
     - `public/assets/icons/icon_gem_premium.png`
     - `public/assets/icons/icon_xp_star.png`
   - 크기 권장: 512×512 투명 PNG
   - 용도: 상점, 보상 화면, 진행 보너스 줄

9. **도서관/연구소/숲 모드별 작은 배경 삽화**
   - 경로 후보:
     - `public/assets/illustrations/illust_library_corner.png`
     - `public/assets/illustrations/illust_math_lab_corner.png`
     - `public/assets/illustrations/illust_memory_forest_corner.png`
   - 크기 권장: 1024×768 투명 PNG
   - 용도: 모드 선택/스테이지 선택/결과 화면의 빈 공간 장식

10. **튜토리얼 말풍선 캐릭터 포인터**
    - 경로 후보: `public/assets/ui/ui_tutorial_pointer_catpaw.png`
    - 크기 권장: 512×512 투명 PNG
    - 스타일: 검은 고양이 발자국/금빛 화살표 조합
    - 용도: 첫 플레이, 힌트, 복구 버튼 안내

#### B급 분위기/계절 에셋

11. **계절 장식 팩**
    - 봄: 꽃잎, 작은 화분, 벚꽃 잎
    - 여름: 반짝 물방울, 축제 깃발
    - 가을: 낙엽, 호박, 따뜻한 랜턴
    - 겨울: 눈송이, 리본, 작은 트리
    - 크기 권장: 각 512×512 또는 1024×1024 투명 PNG
    - 용도: 로비 이벤트/상점/출석 보상 분위기

12. **미니게임별 실패/성공 스탬프**
    - 경로 후보:
      - `public/assets/ui/stamp_clear.png`
      - `public/assets/ui/stamp_try_again.png`
      - `public/assets/ui/stamp_combo.png`
    - 크기 권장: 768×512 투명 PNG
    - 용도: 결과 화면, 콤보 코치, 실패 복구

제작 우선순위는 **상점 주인 NPC → 고양이 힌트 이모션 → 연구소 콘솔 → 기억의 숲 보드 → 카드팩 오픈 이펙트** 순서가 가장 효율적입니다. 이 5개가 들어오면 현재 1.0.38 코드에 큰 구조 변경 없이 매니페스트 추가와 장면별 조건부 표시로 바로 흡수하기 좋습니다.

## 1.0.36 업데이트 내역

- **상점 오퍼/콤보 복구 UX 안정화 패스**를 진행했습니다.
- `ShopScene` 상점 허브를 더 실제 상점처럼 다듬었습니다.
  - 무료팩 준비 상태를 `무료팩 READY`/충전 게이지로 표시합니다.
  - 추천 오퍼를 `추천`/`BEST` 리본으로 강조합니다.
  - 최근 구매한 카드팩을 상단 상태 줄에 표시합니다.
  - 구매 직후 바로 화면이 바뀌지 않고 `showPurchaseTransition` 준비 오버레이를 거쳐 `RewardScene`으로 이동합니다.
- `SaveSystem`에 상점 최근 오퍼 기록을 추가했습니다.
  - 저장 키: `cardville.shop.lastOffer.v136`
  - 메서드: `recordShopOffer`, `getLastShopOffer`
  - `SaveSystem.clear()`에서 최근 오퍼 기록도 함께 정리합니다.
- `RewardScene` 상점 구매팩 결과 UX를 개선했습니다.
  - 상점에서 연 카드팩은 결과 화면에서 `상점으로` 버튼과 `앨범 보기` 버튼을 나란히 제공합니다.
  - 플레이 보상팩은 기존처럼 큰 `카드 앨범 보기` 버튼을 유지합니다.
- 도서관 `PlayScene`에 콤보 코치/복구 UX를 추가했습니다.
  - 하단 레일을 확장해 콤보 안내와 보너스 게이지 4칸 피프를 표시합니다.
  - 현재 TOP 카드 중 정답이 없으면 `복구` 라벨로 셔플 버튼을 강조합니다.
  - 힌트가 의미 없는 상태에서는 힌트 버튼을 잠그고 셔플 복구를 안내합니다.
  - 향후 이어하기 확장을 대비해 `ResumeState`에 `bonusMeter`를 포함했습니다.
- `BackConfirmScene`의 종료 대상 장면 목록을 최신 장면 구성과 맞췄습니다.
  - `MathLabScene`
  - `MemoryForestScene`
  - `ShopScene`
- `tools/check-ux-safety.mjs`와 `npm run check:ux-safety`를 추가했습니다.
  - 상점 오퍼 추천/무료팩 쿨다운/구매 전환
  - 상점 결과 화면 복귀 버튼
  - 도서관 콤보/복구 토큰
  - 뒤로가기 확인 씬 정리 대상 최신화
  - README/AI_HANDOFF 기록 동기화를 검증합니다.
- `npm run verify`에 `check:ux-safety`를 포함했습니다.
- 기존 시작 화면 무광 CTA, 상점 허브, 카드팩 보상, 앨범, 로비 배치, 진행 저장, 프리미엄 PNG/WebP, SVG 금지 정책은 유지했습니다.
- `npm run verify` 전체 통과를 확인했습니다.
- 새 버전별 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, 앱 내부 버전 표기를 1.0.36으로 동기화했습니다.

## 1.0.35 업데이트 내역

- **시작 화면/도서관 플레이 프리미엄 폴리시 패스**를 진행했습니다.
- 게임 시작/로그인 버튼 위에 줄처럼 보이던 요소를 점검했습니다.
  - 로그인 패널의 얇은 흰 하이라이트 바와 PNG 버튼 스킨의 상단 광택/테두리가 겹치며 줄처럼 보일 수 있었습니다.
  - 로그인 구간 버튼만 `LOGIN_CTA_BUTTON_STYLE`로 분리해 `skin: false`, `shine: false` 무광 벡터 버튼을 사용하도록 바꿨습니다.
  - 제목, 안내 문구, 게임 시작, Google 로그인, 이메일/가입 버튼의 세로 간격을 다시 배치했습니다.
- `GameButton`에 선택형 옵션을 추가했습니다.
  - `skin?: boolean`
  - `shine?: boolean`
  - `debounceMs?: number`
  - 기존 버튼 스킨 흐름은 유지하면서 특정 장면에서 광택선/스킨을 끌 수 있습니다.
- 도서관 낱말 카드 `PlayScene`을 더 프리미엄 카드 보드 느낌으로 다듬었습니다.
  - 목표 카드 영역에 목표 체인 진행 바를 추가했습니다.
  - 카드 보드 상단에 `카드 보드 · TOP 카드만 터치` 안내와 남은 카드 수 표시를 추가했습니다.
  - 각 카드 컬럼 위에 남은 장수 뱃지를 추가해 배정/진행 상태를 더 쉽게 확인하도록 했습니다.
  - 하단 안내 문구 뒤에 어두운 레일을 추가해 글자 가독성을 높였습니다.
- `PlayScene` 애니메이션도 `QualitySystem`에 더 강하게 연결했습니다.
  - 카드 settle 애니메이션은 모션 허용 환경에서만 실행합니다.
  - 정답 미니 반짝임 수와 지속시간을 `ambientCount`, `scaledDuration`으로 조절합니다.
  - 오답 shake/흔들림은 `isMotionEnabled` 기준으로 제한합니다.
- `tools/check-ui.mjs`, `tools/check-polish.mjs` 검증 기준을 보강해 로그인 무광 CTA, GameButton 옵션, 도서관 보드/목표 체인 토큰을 확인합니다.
- 기존 상점 허브, 카드팩 보상, 앨범, 로비 배치, 진행 저장, 프리미엄 PNG/WebP, SVG 금지 정책은 유지했습니다.
- `npm run verify` 전체 통과를 확인했습니다.
- 새 버전별 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, 앱 내부 버전 표기를 1.0.35로 동기화했습니다.

## 1.0.34 업데이트 내역

- **상점 허브/경제 UX 패스**를 진행했습니다.
- `ShopScene`을 추가해 상점 건물이 더 이상 바로 앨범으로 이동하지 않고 실제 카드팩 상점 허브로 열립니다.
  - 일일 무료팩
  - 코인 구매팩
  - 보석 구매팩
  - 카드 앨범 바로가기
  - 게임관/광장 복귀 버튼
- `SaveSystem`에 상점 경제 보조 메서드를 추가했습니다.
  - `spendCoins`
  - `spendGems`
  - `getDailyShopStatus`
  - `claimDailyShopPack`
  - 일일 무료팩 저장 키 `cardville.shop.dailyPack.v134`
- `RewardScene`이 `source: 'shop'`과 `packLabel`을 받을 수 있게 되어 상점 구매팩과 플레이 보상팩의 보상 문구/재화 지급을 분리했습니다.
- 상점 구매팩은 이미 비용을 지불했기 때문에 카드와 XP 중심으로 보상하고, 코인 환급 루프가 생기지 않도록 조정했습니다.
- `dioramaBuildings.ts`에서 상점 건물 라우트를 `ShopScene`으로 변경하고, 부제를 `카드팩 상점`으로 바꿨습니다.
- `BackButtonSystem`과 `src/main.ts`에 `ShopScene`을 등록했습니다.
- `tools/check-shop-economy.mjs`와 `npm run check:shop-economy`를 추가해 상점 허브, 일일 무료팩, 재화 차감, 보상 소스 분기를 검증합니다.
- `npm run verify`에 `check:shop-economy`를 포함했습니다.
- 기존 로비 배치/겹침 감사, 진행 저장 확장, QualitySystem, GameButton 중복 터치 방어, 프리미엄 PNG/WebP, SVG 금지 정책은 유지했습니다.
- 새 버전별 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, 앱 내부 버전 표기를 1.0.34로 동기화했습니다.

## 1.0.33 업데이트 내역

- **스테이지/카드팩/앨범 폴리시 패스**를 진행했습니다.
- `StageSelectScene`을 모드 공용 스테이지 선택 화면으로 확장했습니다.
  - 도서관 `word` 스테이지뿐 아니라 연산 연구소 `math`, 기억의 숲 `memory` 스테이지도 같은 선택 화면에서 고를 수 있습니다.
  - 모드별 진행 기록은 `SaveSystem.getModeStageRecord`, `SaveSystem.isModeStageUnlocked`, `SaveSystem.nextPlayableModeStage` 기준으로 따로 표시합니다.
  - 클리어 수, 별 개수, 다음 추천 단계가 상단 진행 스트립에 표시됩니다.
- `ModeSelectScene`을 다듬었습니다.
  - 열린 모드 카드에 진행 요약과 다음 단계 안내를 추가했습니다.
  - 연구소/기억의 숲은 바로 플레이로 뛰지 않고 스테이지 선택 화면을 거쳐 입장합니다.
- `MainLobbyScene`의 연구소/기억의 숲 건물 이동도 스테이지 선택 화면으로 연결했습니다.
- `RewardScene` 카드팩 화면을 재배치했습니다.
  - 팩 기대치 바, 모드별 보상 설명, 품질 모드 기반 반짝임 수 조절을 추가했습니다.
  - 카드 획득 후 보상 설명, 앨범 보기 버튼, 광장 버튼이 겹치지 않도록 세로 위치를 정리했습니다.
- `CollectionScene` 카드 앨범을 보강했습니다.
  - 총 보유 카드 수와 희귀/영웅/전설 수집 칩을 추가했습니다.
  - 미획득 카드와 보유 카드의 상태 표현을 더 명확히 했습니다.
- `check:polish`, `check:content-engine`, `check:progression`, `check:lobby-layout` 검증 기준을 1.0.33 패치 내용까지 확인하도록 보강했습니다.
- `npm run verify` 전체 통과를 확인했습니다.
- 기존 로비 배치/겹침 감사, 진행 저장 확장, QualitySystem, GameButton 중복 터치 방어, 프리미엄 PNG/WebP, SVG 금지 정책은 유지했습니다.
- 새 버전별 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, 앱 내부 버전 표기를 1.0.33으로 동기화했습니다.

## 1.0.32 업데이트 내역

- **디자인/성능/품질 패스**를 진행했습니다.
- 로비 배경 `dioramaBg`를 1080×1920 원본 비율 기준 `addCoverImage` cover 배경으로 표시하도록 바꿔, 모바일 세로 화면에서 강제 늘림 느낌을 줄였습니다.
- 로비 좌우 가장자리 톤 보정 레이어를 추가해 넓은 기기에서도 배경과 HUD가 따로 노는 느낌을 줄였습니다.
- 건물별 상태를 더 명확하게 보이도록 `drawBuildingStatusChip`을 추가했습니다.
  - 추천 건물: `NEXT`
  - 열린 건물: `OPEN`
  - 준비중 건물: `LOCK`
- `QualitySystem`을 확장했습니다.
  - `allowAmbientMotion`
  - `ambientCount`
  - `isMotionEnabled`
  - `scaledDuration`
  - `qualitySummary`의 sparkle 상한 표시
- 로비, 연산 연구소, 기억의 숲의 반복 파티클/트윈/흔들림을 `QualitySystem` 게이트에 연결했습니다. 저사양, URL `?lite`, 또는 모션 감소 환경에서는 장식 수와 움직임을 줄입니다.
- `MathLabScene`에서 오답 카메라 shake와 정답 바운스를 모션 허용 환경에서만 실행하도록 조정했습니다.
- `MemoryForestScene`에서 반딧불 수와 매칭 바운스, 결과 텍스트 지속시간을 품질 모드에 맞춰 조정했습니다.
- `GameButton`을 다듬었습니다.
  - 긴 라벨은 `fitTextSize`와 `compactText`로 버튼 안에 맞춥니다.
  - `lastActivatedAt` 중복 터치 방어를 추가해 빠른 더블 탭으로 장면 이동이 중복 실행되는 위험을 줄였습니다.
- `lobbyLayoutPlan.ts`에 `LOBBY_DESIGN_CHECKS`를 추가해 cover 배경, 상태 칩, 모션 게이트, 버튼 라벨, 더블 탭 방어 같은 디자인/품질 기준을 데이터로 남겼습니다.
- `check:polish`와 `check:lobby-layout` 검증 기준을 1.0.32 패치 내용까지 확인하도록 보강했습니다.
- 기존 로비 배치/겹침 감사, 진행 저장, 프리미엄 PNG/WebP, SVG 금지 정책은 유지했습니다.
- 새 버전별 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, 앱 내부 버전 표기를 1.0.32로 동기화했습니다.

## 1.0.31 업데이트 내역

- **로비 배치/겹침 감사 패스**를 진행했습니다.
- `dioramaBuildings.ts`에 건물별 `touchWidth`, `touchHeight`, `touchOffsetY`를 추가해 실제 터치 영역을 개별 관리하도록 바꿨습니다.
- 건물 이미지가 시각적으로 가까이 있어도 터치존은 서로 겹치지 않도록 분리했습니다.
- `src/game/data/lobbyLayoutPlan.ts`를 추가해 로비 안전 구역, 최소 터치 크기, 배치 가드 규칙을 데이터로 남겼습니다.
- `MainLobbyScene` 디자인을 보강했습니다.
  - 배경 상하 분위기 보정 레이어 추가
  - 다음 추천 건물 하이라이트 추가
  - 추천 건물까지 카드 트레일 연출 추가
  - OPEN 배지 표시 추가
  - 설정 패널에 배치 플랜/가드 규칙 표시
- **진행 저장 확장**을 적용했습니다.
  - `SaveSystem` 진행 저장 키를 `cardville.progress.v131`로 확장
  - 기존 `word`뿐 아니라 `math`, `memory`, `daily`, `english` 모드 기록을 같은 구조로 저장
  - 기존 `cardville.progress.v111`, `cardville.progress.v110`은 legacy로 읽어 마이그레이션
- 연구소/기억의 숲 보상 카드팩이 이제 각 모드 진행 기록을 저장합니다.
- 연산 연구소 콘텐츠를 3스테이지 15문제로 확장했습니다.
- 기억의 숲 콘텐츠를 2스테이지 18쌍으로 확장했습니다.
- 20장 기억 카드가 들어와도 화면을 침범하지 않도록 기억의 숲 보드 compact 레이아웃을 추가했습니다.
- 이벤트 건물을 `오늘의 카드팩` 모드로 열고, 보상/앨범 진행 흐름에 연결했습니다.
- 검증 스크립트를 추가했습니다.
  - `tools/check-lobby-layout.mjs`
  - `tools/check-progression.mjs`
  - `npm run check:lobby-layout`
  - `npm run check:progression`
  - `npm run verify`에 포함
- GitHub Actions 자동 배포 흐름은 그대로 유지하며, `.github/workflows/deploy.yml`의 `npm run verify` 기준으로 확인합니다.
- 새 버전별 문서 파일은 만들지 않고, 변경 내역은 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에만 누적했습니다.
- `package.json`, `public/build.json`, `health.html`, `reset.html`, 앱 내부 버전 표기를 1.0.31로 동기화했습니다.


### 2026-06-29 통파일/에셋 분석 체크포인트

- 입력 통파일 `CardVille_Project_Starter_1.0.31_LayoutProgressionPolish.zip`과 적용 후보 에셋팩 `CardVille_Assets_Full_PNG.zip`을 함께 확인했습니다.
- 현재 통파일은 루트 기준 `README.md`, `AI_HANDOFF_CARDVILLE.md`, `src/`, `public/`, `tools/`, `.github/workflows/deploy.yml` 중심으로 정리되어 있고, 별도 버전별 문서 파일은 없습니다.
- 로컬 검증 환경은 Node v22.16.0, npm 10.9.2 기준으로 확인했습니다.
- `npm install --no-audit --no-fund --no-package-lock` 후 `npm run verify`를 실행했고, build/deploy/brand/assets/premium-assets/building-assets/lobby-layout/content-engine/progression/polish/ui/layout/association/security 검증이 모두 통과했습니다.
- 통파일 내 프로젝트 파일은 269개, `public/assets` 파일은 204개이며, 매니페스트 등록 자산은 114개입니다.
- 업로드 에셋팩은 `ASSET_INDEX.txt` 기준 PNG 84개입니다. SVG는 없고, WebP 동반 파일은 포함되어 있지 않습니다.
- 업로드 에셋에는 1080×1920 로비 배경, 1254×1254 건물/고양이 일부, 1024×1536 소년 프레임, 1024×1024 카드/팩, 2172×724 버튼/대형 UI가 포함되어 있습니다.
- 바로 덮어쓰기 가능한 파일도 있지만 현재 런타임 매니페스트와 파일명이 다른 자산이 많습니다. 예: `npc_chef.png` → 현재 `npc_cook.png`, `npc_child.png` → 현재 `npc_child_01.png`, `npc_village_cat.png` → 현재 `npc_town_cat.png`, `prop_banner.png` → 현재 `prop_flag_red.png`, `prop_tree.png` → 현재 `prop_tree_oak.png`, `prop_smoke.png` → 현재 `prop_smoke_puff.png`, `tile_cobblestone_96.png` → 현재 `tile_plaza_96.png`, `ui/panel_*` 계열 → 현재 `ui/ui_panel_*` 계열.
- 다음 에셋 적용 패치는 원본 PNG를 무작정 복사하지 말고, 현재 매니페스트 key 유지, 파일명 매핑, WebP 동반 생성, 390×844 모바일 로비 크롭/스케일 확인, `check:premium-assets`와 `check:building-assets` 통과 순서로 진행해야 합니다.
- 이번 체크포인트에서는 런타임 에셋 교체는 하지 않고, 끊김 대비 분석 기록만 `README.md`와 `AI_HANDOFF_CARDVILLE.md`에 남겼습니다.

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
npm run check:lobby-layout
npm run check:content-engine
npm run check:progression
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
