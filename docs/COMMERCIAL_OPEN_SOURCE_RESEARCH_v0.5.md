# 카드빌 3매치 상용급 개선 소스 조사 — v0.5 (2026-10-14)

## 기준 및 법적 구분

이 문서는 온라인 공식 개발사·원본 저작자 공개 페이지와 오픈소스 저장소를 조사한 **이식 가능성 표**이다. 상용 게임은 플레이 방식·문제 설계·연출 리듬만 참고하며 **소스코드, 이미지, 음악, 캐릭터, 상표는 복사하지 않는다**. 오픈소스도 코드 라이선스와 에셋 라이선스를 따로 확인한다. 드래그 중심 조작은 기본이되 키보드 대체 수단을 남겨 접근성을 보장한다.

## 경쟁 게임 기능·상용 벤치마크

| 게임 | 공식 근거 | 가져올 자체 구현 아이디어 | 금지 영역 |
|---|---|---|---|
| 애니팡4 | https://corp.wemadeplay.com/press/2022/9/28/-4-4- | 보조 아이템(망치·셔플·광역), 강화 순서, 게임 맥락별 선택 UI | 공식 이미지·음악·게임 데이터 |
| 애니팡4 | https://corp.wemadeplay.com/press/2022/5/2/-4- | 퍼즐 외 보상형 미니게임·기간제 순위 이벤트 | 실제 캐릭터·상표·화면 복제 |
| Royal Match | https://www.royalmatch.com/ | 로켓/TNT/광역광원 등 *서로 다른 특수 블록의 조합 결과*, 다양한 목표·장애물, 성 내부 꾸미기 경제 | 상용 로켓·왕·화면 이미지 복사 |
| Project Makeover | https://www.projectmakeover.com/game-features/ | 퍼즐 보상→옷장/공간 꾸미기, 파트별 성장, 챕터형 미션 연결 | 스토리·인물·아트 재사용 |
| Project Makeover | https://www.projectmakeover.com/faq/ | 목표별 장애물, 이동 횟수 관리, 초과 이동 보상, 지속 업데이트 | 원작 콘텐츠 복제 |

## 코드/아키텍처 재사용 후보

| 자료 | 주소 | 공개 라이선스·주의 | 추천 적용 |
|---|---|---|---|
| Kenney Match-3 Starter Kit | https://github.com/KenneyNL/Starter-Kit-Match-3 | MIT 코드 / CC0 포함 2D·사운드, Godot 4.6 프로젝트 | PC 왼쪽 드래그, 입자·소리 타이밍, 커서/탄성 피드백: **기준 구현 1순위**. JavaScript로 재작성 필요 |
| sempitern0 Match3 Board | https://github.com/sempitern0/match3-board | MIT 코드 (Godot), 에셋별 검토 | 시퀀스 룰(T/L/가로·세로), 드래그 vs 슬라이드, 비매치 원상복귀, 중력 변형, 상태머신 |
| rembound/Match-3-Game-HTML5 파생 | https://github.com/bazhanius/match-3-game | MIT 저장소, 이미지/아이콘별 재확인 | Canvas 기반 보드 렌더링, 모바일, 자동 힌트, 삭제 영역/조커/타이머 기능 |
| ElliotH2 match-three-game | https://github.com/ElliotH2/Match-Three-Game | MIT | HTML/JS 기반 기본 드래그 참조, 현 vanilla 엔진과 비교 |
| oruman/phaser3-match3 | https://github.com/oruman/phaser3-match3 | GitHub MIT 표시, **에셋 개별 확인** | Phaser 3로 전환 시 코드 참조 후보 |
| openforge/openfarm-puzzle-game | https://github.com/openforge/openfarm-puzzle-game | MIT 소스, Phaser/Angular/Ionic/Capacitor | 모바일 패키징·유지보수·클라우드 연동 구조 검토 |
| Phaser 3 | https://phaser.io/download/license | MIT 엔진, 샘플 에셋은 별도 | 수백 파티클·스프라이트·전환 효과가 늘어날 때 렌더러 리빌드 후보 |
| PixiJS 8 | https://pixijs.com/8.x/guides/components/renderers | 엔진 사용 오픈소스 / WebGL 권장, WebGPU는 브라우저 격차 | 타일 2D를 GPU 렌더링으로 통합하는 중장기 후보 (지금 교체하지 않음) |
| Bit Serenity Match3 | https://github.com/Bit-Serenity-Studios/Match3/blob/main/ASSETS_LICENSES.md | 자기 에셋 라이선스 매트릭스와 출처별 CC0 구분 | 표준화된 에셋 provenance 기록 방식 벤치마크 |

## 즉시 받을 수 있는 아트·HUD·사운드 (CC0)

| 원본 자료 | URL | 확인한 규모/라이선스 | 목적 | 상태 |
|---|---|---|---|---|
| Kenney Puzzle Pack 2 | https://kenney.nl/assets/puzzle-pack-2 | CC0, 795개 | 보석 블록, 스파클·기본 장애물  | **선정 / 실제 파일 미이식** |
| Kenney UI Pack | https://kenney.nl/assets/ui-pack | CC0, 430개 | 버튼·게이지·탭·팝업·월드 지도 패널 | 선정 / 실제 파일 미이식 |
| Kenney Interface Sounds | https://kenney.nl/assets/interface-sounds | CC0, 100개 | 블록 이동/교환 실패/콤보/아이템 버튼 사운드 | 선정 / 실제 파일 미이식 |
| Kenney UI Audio | https://kenney.nl/assets/ui-audio | CC0, 50개 | 메뉴/경고/탭 UI 효과음 | 선정 / 실제 파일 미이식 |
| Kenney Impact Sounds | https://kenney.nl/assets/impact-sounds | CC0, 130개 | 연쇄 제거·폭발·특수 보석 충돌 | 선정 / 실제 파일 미이식 |
| Kenney Fantasy UI Borders | https://kenney-assets.itch.io/fantasy-ui-borders | CC0, 130+개 | 게임 내 팝업/프레임 꾸미기 선택안 | 선정 / 실제 파일 미이식 |
| Kenney Pixel UI Pack | https://kenney.nl/assets/pixel-ui-pack | CC0, 750개 | 픽셀풍 후보, 기본 디자인과 차이 있어 차선 | 선정 / 실제 파일 미이식 |
| Kenney Match-3 Starter Kit included assets | https://github.com/KenneyNL/Starter-Kit-Match-3 | CC0 2D/SFX | 조합 애니메이션과 동일 톤 에셋 | 선정 / 실제 파일 미이식 |

**주의:** 위 리소스는 링크·라이선스·용도까지 확인한 **이식 후보**이며, v0.5 코드에 아트 ZIP을 다운로드하거나 포함하지 않았다. 단순 링크를 ‘가져왔다’고 주장하지 않는다. 원본 공개 링크에서 파일을 받은 다음 `SOURCE_ASSET_MANIFEST.json`에 출처/라이선스/원본 SHA256/사용 경로를 기록하고 실제 씬에 연결해야 한다.

## 실제 개발 우선순위

### P0 — 조작·버그·한국어화 (v0.5 이번 단계)
- 퍼즐칸은 드래그/스와이프로만 교환; 일반 두 번 클릭 교환 삭제.
- `pointerdown/move/up/cancel`, 포인터 캡처, 이동 방향 판정, 잠금 블록 거부, 튕김 피드백, 보드 터치 스크롤 방지.
- 게임 페이지 우클릭 메뉴·우클릭 드래그·브라우저 HTML 기본 드래그 차단.
- 튜토리얼·HUD·게임 결과·10개 지역·250개 단계·부스터·설정창·확장 메뉴 한국어화.
- keyboard Enter/방향키 대체입력, 모바일 실제 포인터 E2E 390x844, PC 1366x768 검증.

### P1 — 퍼즐의 상용급 손맛 (다음 릴리스)
- 정식 Kenney CC0 블록 아트와 60fps 이동 탄성·낙하 easing, 조합 폭발 애니메이션, 프레임 기반 입자 상한.
- 3/4/5/T/L 조합별 효과·사운드 단계별 분리, 취소 시 원상복귀 150ms, 한 번 입력=한 번 이동.
- 힌트 발광 vs 유효 이동 예측, 노모브 판정 후 편집 중 셔플 방지, 움직임 가능성 재검증.
- 기본 배경/카드/별점/진행 지도부터 UI 어셋 단계적 적용. 가벼운 화면/저사양 모드 분기.

### P2 — 250레벨 실제 게임성
- 지역×장애물×모양×이동 제한×단계 목표를 데이터로 분리; 레벨별 보드 생성 시 플레이 가능성 확인.
- 실제 플레이 가능한 스테이지 비율, 랜덤-유효 이동 100회 시뮬레이션, 후반 극단적 억지난이도 제거.
- 다양한 목표(젤리 제거, 블록 낙하, 특정 색 수집), 다층 장애물, 로켓/폭탄/무지개 교차조합.
- 보스 단계 10개는 타이머·패턴 등 '실제 다른 규칙'으로 별도 설계.

### P3 — 소셜·경제·라이브 이벤트
- 로그인·기기 간 진행도 동기화·하트/재화·일일 출석·주간 도전·이벤트와 퀘스트 보상.
- Firebase 인증/Firestore 읽기쓰기 규칙·유효성검사 및 클라우드 세이브, App Check 검토.
- 글로벌 순위는 클라이언트 점수 신뢰 금지: 서버 검증/서명된 경기 결과 필요. 익명 채팅/공개 닉네임은 별도 정책.
- 원격 P2P 멀티플레이와 로컬 순위를 상용 랭킹이라고 혼동하지 않게 UI 표기.

### P4 — 성능과 신뢰성
- 애니메이션 jank 및 긴 프레임 측정(LoAF), 보드 64개 DOM 재생성보다 변경 셀만 갱신하는 증분 렌더링.
- 소형 Sprite atlas, 이미지 압축/WebP, 프리로드·캐시 버전 충돌 방지, 메모리 사용량 자동 진단.
- 경기 시작/끝·입력 취소·SW 오프라인·복구·iOS Safari·안드로이드 Chrome·PC 브라우저 E2E.
- Phaser/PixiJS로 전환은 현 DOM 엔진 기능 검사/성능수치가 병목을 증명한 뒤 결정.

## 접근성/입력 정책

게임의 **기본** 조작은 사용자가 요구한 드래그다. 동시에 W3C WCAG 2.5.7은 드래그 의존 기능의 단일 포인터 대체수단을 요구하므로, 장기적으로 '손쉬운 조작(선택-선택)'을 별도 옵션으로 제공하는 것이 접근성 측면에서 적합하다. 현 v0.5는 일반 포인터 클릭으로는 교환하지 않고 키보드 방향키+Enter 대체만 유지했으며, 이 자체가 WCAG 2.5.7 완전 준수를 의미하지는 않는다.
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
