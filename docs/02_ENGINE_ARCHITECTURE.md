# 엔진 아키텍처

## 기본 원칙

PlayScene은 특정 게임 하나에 묶이면 안 된다.

모드 데이터는 JSON에서 읽고, ModeSystem이 모드 타입을 해석하며, CardView가 공통 카드 UI를 담당한다.

## 구조

```txt
src/game/scenes
- BootScene
- PreloadScene
- TitleScene
- HomeScene
- ModeSelectScene
- PlayScene
- CollectionScene
- SettingsScene

src/game/systems
- ModeSystem
- RewardSystem
- HapticSystem
- KakaoBrowserSystem

src/game/ui
- CardView
- SceneHelpers

src/firebase
- firebaseApp
- auth
- firestore
```

## 확장 방법

새 모드를 만들 때는 다음만 추가한다.

1. `public/assets/data/modes/*.json` 생성
2. `ModeSystem.ts`의 `MODE_LIST`에 등록
3. 기존 `PlayScene`에서 공통 카드 매칭 룰로 실행

고유 룰이 필요한 모드는 이후 `RuleResolver`를 추가해서 분리한다.
