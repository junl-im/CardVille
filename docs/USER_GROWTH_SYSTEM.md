# CardVille v0.6 User Growth System

## 목표

v0.6의 목표는 로그인한 유저의 성장 데이터가 실제 게임 화면에 반영되는 것입니다.

```txt
로그인
↓
Firestore users/{uid} 로딩
↓
메인 로비에 레벨 / XP / 코인 / 보석 표시
↓
스테이지 클리어
↓
보상 저장
↓
메인 로비에서 증가된 데이터 확인
```

## Firestore 문서 구조

```txt
/users/{uid}
  uid: string
  nickname: string
  displayName: string
  provider: string
  providerIds: string[]
  isAnonymous: boolean
  emailVerified: boolean
  level: number
  xp: number
  coins: number
  gems: number
  selectedWorld: string
  selectedCardBack: string
  createdAt: timestamp
  updatedAt: timestamp
  lastLoginAt: timestamp
```

## 레벨 계산 규칙 v0.6

v0.6은 단순하고 튜닝하기 쉬운 기준을 사용합니다.

```txt
레벨 = floor(totalXp / 100) + 1
레벨 1: 0~99 XP
레벨 2: 100~199 XP
레벨 3: 200~299 XP
```

나중에 레벨 곡선을 고급화할 때는 `getLevelFromXp()`와 `UserDataSystem.getLevelProgress()`만 교체하면 됩니다.

## UserDataSystem 역할

`src/game/systems/UserDataSystem.ts`가 유저 성장 데이터를 관리합니다.

주요 기능:

```txt
loadCurrentProfile()
- 현재 로그인 유저 확인
- Firestore users/{uid} 로딩
- 실패 시 localStorage fallback 사용

applyReward(xp, coins, gems)
- Firestore에 보상 저장
- 실패 시 localStorage에 임시 저장
- 레벨업 여부 반환

getLevelProgress(profile)
- 현재 레벨 XP 진행률 계산
```

## 오프라인 fallback

Firestore 읽기/쓰기가 실패해도 게임 흐름이 끊기지 않도록 localStorage fallback을 둡니다.

```txt
cardville.userProfile.v1.{uid}
```

주의: localStorage fallback은 편의 기능입니다. 경쟁 랭킹이나 유료 보상 검증에는 사용할 수 없습니다.

## 메인 로비 표시 항목

```txt
상단바
- 코인
- 보석
- 레벨

히어로 패널
- 닉네임
- 계정 상태
- 레벨
- XP 진행바
- 다음 레벨 안내
```

## RewardScene 표시 항목

```txt
경험치 +N
코인 +N
Firestore 저장 완료 / 오프라인 임시 저장
레벨업 시 LEVEL UP 토스트
```

## 다음 개선 후보

```txt
v0.7
- 스테이지 잠금/해금이 유저 progress를 기준으로 동작
- 꿈의 서고 책별 진행률 표시
- 모드별 별 개수 / 최고 점수 표시
```
