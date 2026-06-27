# CardVille v0.9.0 Patch Notes

## 핵심 목표

v0.9.0은 디자인 불만, 게스트 로그인 실패, 로딩 인트로, 에셋 부족 문제를 한 번에 해결하는 대규모 품질 패치다.

## 적용 내용

### 1. 게스트 접속 안정화

- Firebase Anonymous Auth 실패 시에도 게임이 막히지 않도록 로컬 게스트 fallback 추가
- Firestore 프로필 동기화 실패가 로그인 실패로 보이지 않도록 AuthSystem 분리
- Firebase 게스트 / 로컬 게스트 상태 표시 추가
- 로컬 게스트 UID 저장 및 재접속 복구 추가
- 이메일/Google 로그인 성공 시 로컬 게스트 UID 정리

### 2. 인트로 영상 적용

- 업로드된 `인트로.mp4`를 3.3초 로딩용 영상으로 압축/가속
- `public/assets/video/cardville_intro_loading.mp4` 추가
- LoadingScene에서 로딩 중에만 영상 표시
- autoplay/muted/playsinline/loop 처리
- 로딩 완료 후 자동으로 로그인 화면 이동

### 3. 디자인 대대 개선

- LoginScene 리디자인
- MainLobbyScene 리디자인
- GlassPanel 질감 개선
- GameButton 광택/그림자/입체감 개선
- VisualSystem 배경 디테일 개선
- 꿈의 서고 책장 질감 강화
- 메인 로비 하단 버전/스타일 표기 정리

### 4. 이미지 카드 파이프라인 시작

- 카드가 더 이상 이모지만 쓰지 않도록 WebP 카드 이미지 로더 추가
- `src/game/assets/preloadImages.ts` 추가
- CardView에서 frontImageKey가 있으면 실제 WebP 이미지 표시
- CollectionScene에서 보유 카드 이미지 표시
- RewardScene 카드팩 결과에서 실제 이미지 표시
- 이미지 없을 때는 기존 이모지 fallback 유지

### 5. 에셋 시드팩 추가

- PNG/WebP 기반 시드 에셋 329개 생성
- SVG 없음
- 배경, 카드 프레임, 카드 뒷면, 아이콘, 버튼, 팝업, 파티클, 효과, 카드팩, 배지, UI, 숫자 폰트, 카드 이미지 포함
- 최종 AI 에셋으로 교체 가능한 동일 경로 구조 유지

### 6. 검증 유지

- import 누락 검사 통과
- JSON 검사 통과
- SVG 금지 검사 통과
- TypeScript/Vite 빌드 통과
- 번들 예산 검사 통과

## 참고

로컬 게스트 fallback은 Firebase 설정이 잘못되어도 사용자가 게임에 들어갈 수 있게 해주는 안전장치다. 실제 Firebase Anonymous Auth 자체를 대체하는 것은 아니며, Firebase Console에서 Anonymous 로그인과 승인 도메인은 계속 확인해야 한다.
