# CardVille Firebase 프로젝트 연결 기준 v0.4.1

## 사용자 확인

- Firebase 프로젝트 **ID**: `cardville` (2026-10-13 사용자 직접 제공)
- GitHub 저장소: `junl-im/CardVille`
- `.firebaserc` `projects.default=cardville`
- `.github/workflows/firebase-hosting.yml` `projectId: cardville`
- Firebase Hosting의 정적 콘텐츠 디렉터리: `web/`

## 현재 확인 범위

- GitHub 파일 구성만 확정됨. 이 세션에서는 Firebase 프로젝트의 실제 존재, 접근 권한, Hosting 사이트 ID, 서비스 계정 시크릿 여부를 Firebase API로 확인하지 못함.
- Firebase 실제 인증 연결, Firestore 연결, 실시간 랭킹, Firebase Hosting 배포 **아직 미완료**.
- 사용자 제공 프로젝트 ID `cardville`이 공개 정보이므로 `.firebaserc`/GitHub 워크플로에 저장해도 API 비밀키 노출은 아님.
- 기존 `cardville` 프로젝트의 Firestore/Authentication/Storage/Cloud Functions는 절대 삭제·덮어쓰기하지 않음.

## GitHub Actions — 미리보기 배포 방식

- workflow `CardVille Firebase Hosting (manual preview)`는 `workflow_dispatch` 수동 실행만 허용.
- `channelId: cardville-match3-preview`를 사용하며 **기존 Hosting `live` 배포를 덮어쓰지 않음**.
- 미리보기 채널 만료기간은 14일. 실제 preview URL은 Actions 성공 로그로 확인.
- GitHub Secrets and variables → Actions → **Secrets**에 `FIREBASE_SERVICE_ACCOUNT_CARDVILLE`을 유효한 최소권한 서비스 계정 JSON으로 저장해야 함. 이 비밀 JSON을 채팅, GitHub 소스코드, 노션, 구글드라이브에 붙여넣지 말 것.
- 프로젝트 ID용 변수 `FIREBASE_PROJECT_ID_CARDVILLE`는 더 이상 필요하지 않음.
- 다중 Hosting 사이트가 있으면 정확한 사이트 대상(`target`)을 조회한 뒤 추가 지정해야 함. 지금 workflow는 기본 Hosting 사이트를 대상으로 가정하며, 다른 사이트로의 배포를 보증하지 않음.

## 운영 검증

1. Firebase 콘솔에서 프로젝트 `cardville` 확인, Hosting 사이트/기존 live 서비스 확인.
2. GitHub repository secrets에 서비스 계정이 설정돼 있는지 확인. 비밀키 원문을 공유하지 말 것.
3. GitHub Actions → `CardVille Firebase Hosting (manual preview)` → `Run workflow`.
4. 로그에서 preview URL 확인 후 PC/모바일 플레이 및 기존 Backend 데이터 접근 영향 확인.
5. 사용자가 preview 결과를 확인하고 live 배포에 명시적으로 동의한 경우에만 별도 live workflow 검토.

> 주의: Firebase **preview URL 자체는 공개 URL**이며 실제 동일 프로젝트 백엔드를 이용하므로, Firestore를 연동할 경우 규칙 및 접근 제한도 반드시 검사할 것.
