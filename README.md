# CardVille Match-3 — v0.4.2 Beta (Firebase Preview 배포 트리거)

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

## v0.4.2 — Firebase 안전 미리보기 배포 트리거

GitHub Actions Secret 등록 확인을 받은 뒤, 미리보기 채널만 대상으로 자동 **1회 실행 요청**을 푸시합니다. 대상 채널은 `cardville-match3-preview`이고 live는 변경하지 않습니다. 결과 주소와 실제 배포 성공 여부는 GitHub Actions 로그에서 확인해야 합니다.
상세 내용은 `docs/FIREBASE_PREVIEW_v0.4.2.md` 참조.

## v0.4.3 GitHub Actions fix
- [Failed run 38417296378](https://github.com/junl-im/CardVille/actions/runs/38417296378) failed before Firebase deploy, because `require('./.firebaserc')` tried to parse extensionless JSON as JS.
- Fixed by using the existing JSON.parse-based checks, safe credential shape validation, and one isolated preview-only retry.

## Firebase 배포 실패 — 현재 상태

- 실제 [2차 실패 로그](https://github.com/junl-im/CardVille/actions/runs/38419409796): Secret JSON 검증 통과, Firebase 호출에서 403 `USER_PROJECT_DENIED` / `serviceusage.services.use` 부족.
- 원인과 관리자 IAM 조치: [Firebase 권한 수정 가이드](docs/FIREBASE_IAM_FIX_v0.4.3.md).
- IAM 역할이 부여되기 전에는 재배포를 반복해도 해결되지 않습니다. 서비스 계정 권한 수정 후 기존 미리보기 workflow를 수동 실행합니다. `live`는 미변경.

## v0.4.4 Firebase IAM 계정 일치 진단
[3차 재실행도 403 권한 실패](https://github.com/junl-im/CardVille/actions/runs/38419409796). 역할을 부여한 계정과 GitHub Secret 계정이 다른지 확인하도록 비밀키·원문 이메일을 로그에 출력하지 않는 독립 진단 Actions가 추가됐습니다. [진단 가이드](docs/FIREBASE_IAM_IDENTITY_v0.4.4.md). IAM 권한 확인 전 Firebase 배포 자동 재시도는 하지 않습니다.

## v0.4.5 Secret project preflight
Secret 키 생성 프로젝트가 `cardville`과 다를 경우 안전하게 배포를 중단합니다. 기존 CardVille IAM 진단 workflow는 키 프로젝트 식별을 위해 별도로 유지합니다. `FIREBASE_SERVICE_ACCOUNT_CARDVILLE`은 반드시 Firebase 프로젝트 `cardville`에서 발급한 서비스 계정 JSON으로 교체하세요. API 비밀키를 코드나 채팅에 게시하지 마세요.

## Firebase 미리보기 배포 검증 (2026-10-14)

- GitHub Actions 실제 성공: https://github.com/junl-im/CardVille/actions/runs/38428451136
- Firebase 프로젝트: `cardville` — 재등록한 Secret 키의 `project_id` 확인 통과.
- 미리보기 URL: https://cardville--cardville-match3-preview-ikhmalki.web.app
- Hosting 임시 채널: `cardville-match3-preview` (14일 만료 설정). 기존 `live` 채널은 미변경.
- 실행 로그의 `Preview HTTP smoke test: PASS`로 정적 게임 파일의 HTTP 응답 검증. 실제 기기 플레이 수동 확인은 별개.
