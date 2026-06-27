# JSON 모드 규격

## ModeData

```json
{
  "version": 1,
  "modeId": "word_ko_basic",
  "title": "낱말 카드",
  "type": "match_pairs",
  "world": "magic_library",
  "difficulty": 1,
  "description": "모드 설명",
  "stages": []
}
```

## StageData

```json
{
  "stageId": "word_ko_001",
  "title": "마법 도서관 1층",
  "goal": { "type": "match_pairs", "targetCount": 4 },
  "cards": [],
  "rewards": { "xp": 10, "coins": 25, "packChance": 0.25 }
}
```

## CardData

```json
{
  "id": "w001a",
  "frontText": "사과",
  "answerKey": "apple",
  "rarity": "common"
}
```

`answerKey`가 같은 카드 2장이 짝이 된다.

## Rarity

- common
- rare
- epic
- legendary
