# CardVille v0.4 - 카드팩과 컬렉션 루프

v0.4의 목표는 CardVille의 핵심 보상 루프를 실제 코드에 연결하는 것입니다.

```txt
게임 플레이
↓
스테이지 클리어
↓
결과 화면
↓
경험치 / 코인 지급
↓
카드팩 획득 판정
↓
카드팩 오픈
↓
새 카드 획득
↓
컬렉션 앨범 등록
↓
다시 꿈의 서고 / 스테이지 선택
```

## 구현된 파일

```txt
public/assets/data/packs/card_packs.json
src/game/types/CollectionTypes.ts
src/game/systems/CollectionSystem.ts
src/game/scenes/RewardScene.ts
src/game/scenes/CollectionScene.ts
src/firebase/firestore.ts
firebase/firestore.rules
```

## 저장 구조

v0.4에서는 두 가지 저장을 동시에 사용합니다.

```txt
1. localStorage
- 즉시 반응하는 앨범 표시
- Firebase 저장 실패 시에도 로컬 테스트 가능

2. Firestore
- 로그인 유저의 컬렉션 백업
- users/{uid}/collections/{cardId}
```

## 카드팩 데이터

카드팩은 `public/assets/data/packs/card_packs.json`에서 관리합니다.

```txt
packId
slots
rarityWeights
availableSets
visual
```

새 카드팩을 만들 때는 코드 수정 없이 JSON에 새 pack을 추가하면 됩니다.

## 컬렉션 데이터

컬렉션 원본 카드는 `public/assets/data/cards/collection.base.json`에서 관리합니다.

```txt
setId
set title
world
cards
```

각 카드는 다음 필드를 가집니다.

```txt
cardId
name
rarity
imageKey
```

## 현재 v0.4 설계 의도

- 카드팩 확률은 클라이언트에서 처리합니다.
- 유료 결제 또는 경쟁 랭킹 보상과 연결하지 않습니다.
- 실제 상용 결제 보상으로 확장할 경우 서버 검증 또는 Cloud Functions가 필요합니다.
- v0.4는 무료 플랜과 빠른 개발을 우선합니다.

## 다음 패치 후보

```txt
v0.5 로그인 UI 완성
v0.6 카드 이미지 WebP 실제 적용
v0.7 사운드 / 햅틱 / 카드 뒤집기 강화
v0.8 일일 미션 / 출석 보상
```
