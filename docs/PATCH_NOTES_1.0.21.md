# CardVille 1.0.21 Patch Notes

## 목표

1. 첫 실행 시 HTML fallback의 가짜 시작 UI가 보이는 현상 제거
2. 오프닝 영상이 실제 재생되기 전 모바일 브라우저 기본 플레이 마크가 보이는 현상 방지
3. 휴대폰 뒤로가기 팝업 신뢰도 강화
4. 로그인 화면 버튼 사이 공백/라인 느낌 완화
5. 카드 디자인 가독성/불투명감 개선
6. 연상 카테고리 오분류 추가 수정
7. 보안/검증 스크립트 보강

## 변경 사항

- `index.html`
  - `data-cardville-no-prestart-cta` 정책 토큰 추가
  - 첫 화면 전 가짜 버튼 금지 정책 명시
  - 버전 1.0.21 반영
- `LoginScene`
  - 버튼 그룹을 더 촘촘하게 배치
  - 하단 로그인 패널을 하나의 컴팩트 플레이트로 정리
  - 버튼 사이 공백/라인 느낌 완화
- `IntroLoadingScene`
  - video DOM을 실제 `playing` 이벤트 전까지 `opacity: 0`으로 유지
  - autoplay 실패 시 video DOM을 제거하고 로딩 화면만 유지
  - 모바일 기본 플레이 아이콘/플레이 마크 노출 방지
- `BackButtonSystem`
  - DOM overlay 우선 표시
  - `popstate`, `hashchange`, `Escape`, 최초 사용자 제스처에서 히스토리 가드 재무장
  - overlay z-index를 최상위로 보강
  - 첫 화면가기/계속하기/나가기 동작 재정리
- `PlayScene`
  - 카드 앞면을 더 단단한 불투명 카드로 보정
  - 프레임/shine 투명도 추가 감소
  - 분류칩/태그 가독성 개선
- `wordStages`
  - 공방 스테이지의 `정육면체`, `블록`을 `모양/도형` 계열로 정리
- 검증
  - `check:ui`, `check:layout`, `check:association`, `check:security` 강화

## 검증

```txt
npm run verify
✓ built
check:deploy passed
check:brand passed
check:ui passed
check:layout passed
check:association passed
check:security passed
```
