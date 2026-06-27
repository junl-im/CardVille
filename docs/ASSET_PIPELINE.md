# CardVille Asset Pipeline

## 스타일 고정

```txt
Concept: Aqua Glass + Cute Premium + 2.5D
금지: SVG, 평면 디자인, 초딩 교육게임 느낌
허용: WebP, PNG, SpriteSheet PNG, Texture Atlas PNG/JSON
원본: 1024x1024
광원: 좌상단
그림자: 우하단
색감: 부드러운 아쿠아, 골드, 퍼플, 민트 계열
```

## 권장 폴더

```txt
public/assets/
├── backgrounds/
├── cards/
│   ├── frames/
│   ├── backs/
│   ├── shine/
│   └── shadows/
├── icons/
├── buttons/
├── popup/
├── particles/
├── effects/
├── packs/
├── badges/
├── ui/
├── fonts/
├── audio/
│   ├── bgm/
│   ├── sfx/
│   └── voice/
├── cards_image/
│   ├── animals/
│   ├── foods/
│   ├── jobs/
│   ├── sports/
│   ├── fruits/
│   ├── space/
│   └── sea/
├── manifest/
└── json/
```

## 에셋 우선순위

1. 꿈의 도서관 배경 3장: day, night, event
2. 카드 프레임 6등급: common, uncommon, rare, epic, legendary, mythic
3. 카드 뒷면 3종: star, book, magic_circle
4. 코어 UI 아이콘 30개
5. 과일/동물 카드 이미지 30장
6. 버튼/팝업 아틀라스
7. 카드팩 이미지 4종
8. 효과음 starter 20개

## AI 이미지 제작 프롬프트 기본형

```txt
premium cute 2.5D game asset, aqua glass style, soft rounded shape,
top-left soft studio light, subtle glossy reflection, gentle shadow to bottom-right,
high quality mobile casual game icon, centered object, clean transparent background,
no text, no svg, no flat design, no harsh black outline, 1024x1024
```

## 카드 이미지 규칙

- 그림과 텍스트를 함께 사용한다.
- 카드 중앙에는 일러스트를 둔다.
- 카드 하단에는 짧은 텍스트를 둔다.
- 카드 선택 시 위로 10px 떠오르고 반사광이 지나간다.
- 정답 시 별 파티클과 함께 사라지고 결과/보상으로 이어진다.
