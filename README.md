# CardVille Match-3 — v0.4.1 Beta (Firebase ID 확정)

PC·모바일 웹용 3매치 퍼즐게임. [Sweet Crush](https://github.com/ShaistaShabbir-prog/candy-crush-match3) MIT 소스를 기반으로 변경한 별도 프로젝트입니다. 원본 커밋은 `0ba0fcd4af6c041669ba67dd7f7bb6d9d268e4ec`입니다.

## 현재 구현 및 검사

- 250개 스테이지/10개 월드/10개 보스, 스테이지별 원본 점수 목표 데이터 보존.
- v0.4 임시 난이도 상한: 222개 스테이지 목표 조정, 마지막 250레벨 원본 목표 297,750점 → 현재 3,150점. **플레이 밸런스가 최종 검증된 수치가 아닙니다.**
- 터치/마우스 **스와이프 교환**, 키보드 방향키 이동·Enter 선택, 250레벨 이어하기, PC·모바일 반응형 버튼 정렬.
- 로컬 랭킹 닉네임 HTML 주입 방지, Service Worker 동일 출처 GET 캐싱 제한.
- 브라우저 동작 검증은 개발 환경 별도 브라우저 테스트 결과이며, 공개 URL 실서비스는 별도 검증이 필요합니다.

## 실행

정적 웹호스팅 혹은 로컬 정적 서버에서 `web/index.html`을 서비스합니다.

```bash
python -m http.server 8000 --directory web
# 브라우저에서 http://localhost:8000
node tools/check-release.cjs
```

## 배포

- `.github/workflows/pages.yml`: main 갱신 시 Node.js 정적 품질 검사 후 GitHub Pages 게시 시도.
- `firebase.json`: 기존 Firebase Hosting의 public 디렉터리를 `web`으로 지정.
- `.firebaserc`: 사용자가 확인한 Firebase 프로젝트 ID **`cardville`**로 매핑.
- `.github/workflows/firebase-hosting.yml`: **수동 프리뷰 전용**. `cardville-match3-preview` 채널에만 배포하도록 설정. 기존 live 사이트를 덮어쓰지 않음. GitHub Secret `FIREBASE_SERVICE_ACCOUNT_CARDVILLE`과 실제 사이트 권한 확인 전까지 배포 불가. Firebase 실제 서비스는 아직 변경하지 않았음.
- 작업 중 GitHub 원격 브랜치의 현재 파일만 새 게임으로 교체됐습니다. 과거 CardVille 커밋/배포 기록은 남아 있습니다.

## 외부 저작권 및 제한

- 게임 원형: © 2026 Shaista Shabbir, MIT License, `web/LICENSE` 보존.
- Kenney 공식 Match-3 Starter Kit 에셋(CC0) 통합은 다음 단계 예정이며, **이 릴리스에는 아직 포함되지 않습니다.** `docs/LICENSE_NOTICE.md` 참고.
- 원격 2인 대전·글로벌 랭킹은 실서비스로 제공하지 않습니다. 해당 UI에 실험 기능 또는 로컬 기록 표시.
- 이용자 계정/Firestore/Cloud Functions의 실연동 및 기존 Firebase 배포는 미완료.

## 품질 기록

`docs/VALIDATION.md`와 `docs/BROWSER_VALIDATION.json` 참조. 브라우저 E2E에서 2종 화면·스와이프·키보드·저장·진행을 확인. 공개 사이트 배포 상태는 검증되지 않았음.
