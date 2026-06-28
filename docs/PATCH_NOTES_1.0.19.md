# CardVille 1.0.19 Patch Notes

1.0.19는 1.0.18의 full-bleed 화면 구조를 유지하면서 실제 플레이 화면을 더 넓게 쓰고, 카드 선택감/정답 연출/콘텐츠/검증을 강화한 업데이트입니다.

## 적용 내용

- 플레이 화면을 반응형 playArea 기반으로 재배치
- 넓은 화면에서 카드 보드가 좌우 공간을 더 적극적으로 사용
- 좌측 스텝/힌트/셔플 패널은 safe area 기준으로 이동
- 목표 카드 영역도 보드 폭에 맞게 확장
- 카드 스택 재정렬 시 짧은 낙하/settle 애니메이션 추가
- 정답 시 미니 sparkle 효과 추가
- 카드 프레임/shine 투명도 완화로 눈 피로 감소
- 말 카드 스테이지 12개에서 16개로 확장
- 보상 카드풀 확장
- Firebase npm 의존성을 제거하고 Google/Email 버튼 클릭 시 CDN에서만 지연 로딩
- npm install 및 GitHub Actions install 부담 감소
- UI/레이아웃 검증 스크립트가 16스테이지와 responsive playfield를 확인하도록 강화

## 유지 정책

- 게스트 시작은 서버 없이 즉시 localStorage 기반으로 진행
- SVG 사용 금지
- Service Worker/PWA 캐시 비활성 유지
- 대형 카드 이미지 5000장 전체 강제 preload 금지
- 현재 정상 작동 중인 인트로, 뒤로가기 팝업, 카드팩 보상 흐름 유지
