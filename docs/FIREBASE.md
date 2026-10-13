# Firebase — 기존 CardVille 프로젝트 재사용(연결 대기)

- Firebase 프로젝트 표시 이름 `CardVille`은 프로젝트 ID가 아닙니다. GitHub URL도 Firebase ID를 증명하지 않습니다.
- 현재 연결된 작업 도구로 기존 Firebase 프로젝트 목록·Hosting 사이트·인증 시크릿을 검증할 수 없어, 임의 배포 금지.
- `firebase.json`은 Hosting의 public을 `web/`로 설정. `.github/workflows/firebase-hosting.yml`은 수동 호출 전용이며 기존 데이터 삭제 기능 없음.
- 향후 Firebase 콘솔에서 **정확한 프로젝트 ID**, **Hosting 사이트 ID**, **서비스 계정 최소권한**, 기존 배포가 덮어써도 되는 대상인지 확인.
- GitHub Actions 환경 변수 `FIREBASE_PROJECT_ID_CARDVILLE`과 Secret `FIREBASE_SERVICE_ACCOUNT_CARDVILLE`은 사용자의 보호된 GitHub 환경에서 설정. 비밀 JSON을 채팅, 노션, 드라이브, 소스코드에 저장하지 않음.
- 상용 계정·Firestore 저장/랭킹은 인증, 권한 규칙, 치트 검증 설계 후 단계적 적용.
