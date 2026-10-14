# 라니팡 v1.1 정식 게임 배포 지시 및 롤백 지침

- 사용자 명시 요청: 미리보기 이미지가 아니라 실제 게임 전체 반영.
- 기준 커밋: cc9e4ef5373da68cd1d0752f79e10db7f9c2b863 (게임 소스/에셋 55개 파일).
- GitHub Pages 실제 플레이 게임은 main 자동 배포 및 검증 후 별도로 공개.
- Firebase cardville 프로젝트의 기본 Hosting 정식 live 채널은 v1.1에서 처음으로 배포할 예정. 별도 14일 미리보기 채널은 별개.
- Hosting 정적 파일만 업로드. Firestore/Authentication/Storage/Cloud Functions와 기존 사용자 데이터는 변경하지 않음.
- 11종 품질 게이트, GitHub Secret 서비스 계정 프로젝트 확인, 정식 웹게임 HTML/CSS/JS/WebP HTTP 검사 이후 배포 성공 표시.
- 혹시 기능 문제가 생기면 GitHub Actions의 Firebase Hosting 이전 릴리스로 복구하거나 해당 배포 커밋을 revert한 뒤 재배포; 서비스워커 저장소 삭제는 플레이 기록을 지울 수 있어 금지.
