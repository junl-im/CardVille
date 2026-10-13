# Firebase CardVille IAM 원인 확인 — 2026-10-14

## 실제 로그로 확인한 현재 상황

- [실패 실행 38419409796, 재시도 3회차](https://github.com/junl-im/CardVille/actions/runs/38419409796): IAM 역할을 추가했다고 알려준 후에도 다시 동일하게 403 `USER_PROJECT_DENIED`, `serviceusage.services.use` 부족.
- `node tools/check-release.cjs`, Firebase 배포 안전 검사, GitHub 서비스 계정 키 JSON 구조 검사는 **통과**. Firestore, Authentication, Hosting live 문제는 아님.
- 진단 포인트는 **역할을 부여받은 Google Cloud IAM 서비스 계정과 GitHub Actions Secret `FIREBASE_SERVICE_ACCOUNT_CARDVILLE` 내의 `client_email`이 같은지**이다. 이전에 사용자 계정 또는 다른 서비스 계정에 권한을 부여했을 가능성이 있다. 또한 전파 지연 또는 다른 프로젝트 선택도 가능하다. 원인은 아직 이 중 하나로 확정되지 않았다.

## 자동 신원 확인 — 노출 없이

- GitHub Actions의 **CardVille IAM Identity Check (no deploy)** workflow는 Secret JSON을 읽고 `project_id`, 이메일의 SHA-256 앞 16자리만 출력한다. `client_email` 원문과 개인키는 공개 GitHub 로그에 출력되지 않는다.
- [진단 Actions](https://github.com/junl-im/CardVille/actions/workflows/cardville-iam-diagnostic.yml)에서 1회 자동 실행/수동 실행 결과 보기.
- 로컬 PC에서 원래 다운로드한 서비스 계정 JSON에 대해 아래를 실행하면 **그 PC에서만** 전체 이메일과 동일한 16자리 지문이 표시된다.

```powershell
node tools/check-iam-identity.cjs --file "C:\경로\내-서비스계정키.json"
```

- GitHub Actions 결과의 이메일 지문과 로컬 지문이 같아야 같은 계정이다. Google Cloud IAM에서 그 **정확한 이메일**의 역할을 확인한다. 개인 키 원문은 절대 공유하지 않는다.

## Google Cloud 콘솔 (한국어)

1. [cardville IAM 바로가기](https://console.cloud.google.com/iam-admin/iam?project=cardville) → 상단 **프로젝트 선택: cardville** 확인.
2. **IAM 및 관리자 → IAM**, 로컬 검사 결과의 서비스 계정 이메일로 **주 구성원** 검색.
3. 정확히 그 계정 우측 **주 구성원 수정(연필)** → **다른 역할 추가** → **서비스 사용량 소비자** (`roles/serviceusage.serviceUsageConsumer`) → **저장**.
4. 같은 계정에 **Firebase 호스팅 관리자** (`roles/firebasehosting.admin`) 있는지 확인. 부족할 때만 추가.
5. 프로젝트가 여러 개인 경우, 서비스 계정 키의 `project_id`가 다르더라도 `cardville`에서 해당 계정에 권한이 별도로 있을 수 있다. 이메일로 대조한다.
6. 저장 후 권한 전파를 고려해 배포 다시 실행. [미리보기 배포 Actions](https://github.com/junl-im/CardVille/actions/workflows/firebase-hosting.yml) → **워크플로 실행** (main).
7. 성공하면 미리보기 URL 확인. 운영 `live`에는 배포하지 않는다.

## 개발 상태

- 서비스 계정 권한 변경은 Google Cloud IAM 관리 권한이 필요하며 현재 연결된 도구에서는 실행 불가.
- 이번 작업은 **개발 도구로 할 수 있는 신원 진단 자동화**를 완료했으며 IAM 실제 부여나 배포 성공을 주장하지 않는다.
- 기존 Firebase 운영 사이트와 DB 변경 없음.
