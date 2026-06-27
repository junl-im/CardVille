# CardVille Game Flow v0.2

CardVille의 기본 흐름은 아래 순서를 기준으로 고정한다.

```txt
Splash
↓
Loading
↓
Login, 최초 1회 또는 세션 만료 시
↓
Main Lobby
↓
Mode Select
↓
Stage Select
↓
Play
↓
Result
↓
Reward
↓
Main Lobby 또는 Stage Select
```

## Scene 책임

| Scene | 책임 |
| --- | --- |
| BootScene | 카카오 브라우저 뒤로가기 훅 설치, Splash 진입 |
| SplashScene | 브랜드 로고, 짧은 첫 인상 연출 |
| LoadingScene | 핵심 JSON, manifest, 월드, 컬렉션 기초 데이터 로딩 |
| LoginScene | 기존 로그인 복원, 게스트 로그인, Google 로그인 진입 |
| MainLobbyScene | 재화, 월드, 컬렉션, 게임 선택 진입 |
| ModeSelectScene | JSON 기반 게임 모드 목록 표시 |
| StageSelectScene | 선택한 모드의 스테이지 목록 표시 |
| PlayScene | 카드 생성, 선택, 정답 판정, 파티클, 진행 저장 |
| ResultScene | 점수, 콤보, 클리어 결과 표시 |
| RewardScene | 경험치, 코인, 카드팩 보상 연출 |
| CollectionScene | 앨범, 카드 등급, 수집 현황 표시 |

## v0.2 범위

- 실제 이미지 에셋은 아직 포함하지 않는다.
- SVG는 사용하지 않는다.
- 카드 이미지는 `frontImageKey` 필드로 연결할 준비만 한다.
- 현재는 이모지/절차형 그래픽으로 플레이가 가능하게 만든다.
- 실제 WebP/PNG 에셋이 들어오면 CardView와 LoadingScene에서 이미지 로딩을 연결한다.
