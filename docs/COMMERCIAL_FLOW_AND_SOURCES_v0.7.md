# 라니팡! — 상용 퍼즐 진입 흐름·오픈소스 활용안

## 게임 진입 흐름 비교 (참고/자체 설계)
- **애니팡4**: 공식 발표와 실제 홍보 이미지 기준 귀여운 캐릭터·생활 배경 타이틀/로비, 별도 **단계 시작 준비 화면**(목표·아이템·시작 버튼), 플레이 화면(목표·이동수·보조 아이템), 단계 보상/진행, 이벤트/대전 모드가 핵심. 원본 캐릭터·UI 스킨·아트는 복사 금지.
  출처: https://www.asiaa.co.kr/news/articleView.html?idxno=46689 , https://newsroom.smilegate.com/bbs/board.php?bo_table=news&wr_id=665
- **애니팡2**: 공식 스토어/소개에서 확인 가능한 스테이지 중심 연속 진행, 단순 조작과 별점/장애물 반복. (모든 시즌 UI 순서를 공식 근거로 단정하지 않음.) **짧은 입장 절차+하나의 메인 행동 버튼**을 참고, 빠르게 플레이로 진입.
- **Royal Match**: 개발사 앱 설명에 스와이프 매칭→보상→지역 장식·새 장애물·시즌 이벤트를 연결. 아이템·보물상자·다음 지역 유도는 우리만의 지형/보상경제로 재설계.
  출처: https://play.google.com/store/apps/details?hl=ko&id=com.dreamgames.royalmatch
- **Project Makeover / Toon Blast / Gardenscapes**: 퍼즐 외 꾸미기 목표, 팀 협업, 별·화폐 자원 루프와 강한 튜토리얼 훅은 아이디어 비교 대상. 각 상용 IP의 소스/브랜드/그래픽은 사용하지 않음.

## 오픈소스/이식 가치 높은 시스템
1. **PixiJS Open Games / Puzzling Potions** (MIT 코드): https://github.com/pixijs/open-games/tree/main/puzzling-potions ; `screens`, `popups`, `match3`, `ui`, `assets` 분리 및 독립 팝업/씬 관리자, 저장 설정, AssetPack 아틀라스. 동일 게임 아트는 Figma 읽기 전용 조건 등 별도 확인. **당장 엔진 전체 교체하지 않고 화면 상태·팝업 전환 설계만 자체 구현**.
2. **Kenney Match-3 Starter Kit** (MIT 코드, 포함 이미지 CC0): https://github.com/KenneyNL/Starter-Kit-Match-3 ; 드래그 입력, 블록 낙하, 보조 이펙트·소리 타이밍. Godot 기반이라 JS로 구조 참고.
3. **Kenney Puzzle Pack 2 / UI Pack / Interface Sounds** (CC0): https://kenney.nl/assets/puzzle-pack-2 , https://kenney.nl/assets/ui-pack , https://kenney.nl/assets/interface-sounds ; 스프라이트·HUD·짧은 입력 효과. 이번 버전은 **직접 제작 배경**을 먼저 적용했고 Kenney 원본 에셋 파일을 재배포/도입한 단계는 아직 아님.
4. **Phaser 3 Match3 자습서**: https://phaser.io/news/2019/04/match-3-tutorial-part-1 ; 보석 이동·낙하 easing, object pool, 애니메이션 타이밍 최적화. Phaser 전체 전환은 현 DOM FPS 증거 확보 후.
5. **Phaser PixUI** (MIT 코드, 데모 아트 별도 권리): https://github.com/skhoroshavin/phaser-pixui ; 가변 크기 메뉴·모달·스크롤·버튼, 모바일 안전영역 참고. 데모 상업 아트를 그대로 복사 금지.
6. **bydecom Jungle Gems**: https://github.com/bydecom/match-3-game-engine-jungle-gems ; GameScene / UIScene / LevelLoader, 장애물·부스터 서브시스템 분리. 프로젝트 코드 라이선스 미확정, **설계 방식만 참고하고 소스 복사 금지**.

## 우선순위별 처리 상태
- [완료] P0 게임 공식 이름 '라니팡!', 한국어 첫화면/튜토리얼, 전용 원본 삽화, 게임시작 진입, 종료/뒤로가기 팝업, Fullscreen API 시도.
- [완료] P0 기존 250레벨/저장 키·스와이프 규칙 유지. 기존 live 서버 보존.
- [예정] P1 스테이지 입장 카드(목표 1줄, 시작 비용, 부스터 3개, 플레이 버튼), 초반 5단계별 신규 규칙 학습.
- [예정] P1 시작→로비 월드맵→스테이지 준비→보드→결과→다음맵 구조. 현재는 시작→보드 직접 진입; 선택지가 많아 조작이 길어지는 UI는 지양.
- [예정] P1 CSS/DOM 폭발 효과, 캐스케이드 관성, 해상도별 리소스 품질, 오프라인 PWA 아이콘·알림.
- [예정] P2 250레벨 목표 다양화/장애물 다층화, 보스 10개 고유 패턴, FPS 성능 점검, 실제 단말기 회귀.
- [예정] P3 Firestore Auth와 권한/랭킹 보안 설계, 온라인 대전 검증, 라이브 서비스 안정화.
