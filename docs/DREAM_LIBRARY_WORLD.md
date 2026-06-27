# CardVille v0.3 - 꿈의 서고 Dream Library

## 핵심 방향

CardVille의 게임 선택 화면은 단순한 메뉴가 아니라 메인 월드인 `꿈의 서고`로 설계한다.
유저는 꿈의 서고에서 마법서를 고르고, 각 마법서는 하나의 게임 모드로 연결된다.

```txt
Main Lobby
↓
꿈의 서고 Dream Library
↓
낱말의 책 / 연산의 책 / 기억력의 책 / 영어의 책 / 퍼즐의 책
↓
스테이지 선택
↓
게임 플레이
```

## 왜 이 구조를 사용하나

- 게임 선택 화면 자체가 세계관이 된다.
- 새 모드를 추가할 때 새 책만 추가하면 된다.
- 로고, 배경, 카드팩, 컬렉션 앨범과 아트 톤을 통일하기 쉽다.
- 낱말, 연산, 영어, 기억력, 퍼즐을 하나의 브랜드 경험으로 묶을 수 있다.
- 장기 서비스 시 시즌 이벤트, 한정 마법서, 콜라보 월드로 확장하기 쉽다.

## v0.3 반영 내용

- `ModeSelectScene`을 `꿈의 서고` 비주얼로 전환
- 각 모드를 책 형태의 UI로 표시
- 열린 책은 `펼치기`, 잠긴 책은 `잠김` 상태로 표시
- 잠긴 책 터치 시 해금 안내 토스트 표시
- 배경에 책장, 별빛, 은은한 마법 입자 추가
- `catalog.json`에 `bookTitle`, `bookColor`, `bookSpine`, `worldNote` 필드 추가

## 확장 규칙

새 게임 모드를 추가할 때는 `public/assets/data/modes/catalog.json`에 다음 필드를 추가한다.

```json
{
  "modeId": "new_mode_id",
  "title": "새 게임 카드",
  "bookTitle": "새 게임의 책",
  "subtitle": "플레이 설명",
  "icon": "✨",
  "status": "soon",
  "unlockText": "다음 업데이트에서 열릴 예정",
  "bookColor": "0x62d9ff",
  "bookSpine": "NEW",
  "worldNote": "세계관 설명"
}
```

## 아트 방향

- Aqua Glass + Cute Premium + 2.5D
- 꿈의 서고는 푸른 유리빛, 금빛 책갈피, 별빛 입자를 기본으로 한다.
- 모든 마법서는 PNG/WebP 에셋으로 교체 가능해야 한다.
- SVG는 사용하지 않는다.
