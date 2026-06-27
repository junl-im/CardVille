CardVille Patch v0.4 -> v0.5

적용 방법:
1. 기존 CardVille_Project 폴더 위에 이 패치 ZIP의 CardVille_Project 폴더 내용을 덮어씁니다.
2. npm ci 를 실행합니다.
3. npm run build 로 빌드를 확인합니다.
4. Firebase Console에서 Authentication의 Anonymous, Email/Password, Google 로그인을 활성화합니다.
5. Authorized domains에 junl-im.github.io를 추가합니다.
6. firebase/firestore.rules 내용을 Firestore Rules에 반영합니다.

주의:
- 이 패치 ZIP에는 변경/추가 파일만 포함되어 있습니다.
- 전체 프로젝트를 새로 받으려면 CardVille_Project_Starter_v0.5.zip을 사용하세요.
