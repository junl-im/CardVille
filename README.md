# 카드마을 CardVille

CardVille은 Phaser 3 + TypeScript + Firebase + GitHub Pages 기반의 모바일 세로형 수집 카드 퍼즐 게임 스타터입니다.

공개 주소 기준:

```txt
https://junl-im.github.io/CardVille/
```

## 핵심 방향

- 게임명: 카드마을 CardVille
- 내부 엔진명: Dream Cards Engine
- 목표 품질: 모바일 AAA 캐주얼 게임 감성
- 그래픽 정책: SVG 금지, PNG/WebP/SpriteSheet/Texture Atlas 사용
- 배포: GitHub Actions로 GitHub Pages 자동 배포
- 백엔드: Firebase 무료 플랜 중심
- 인증: 익명, 이메일, 구글 로그인 준비
- 데이터: 모드와 스테이지는 JSON으로 확장
- 저장: 유저 진행도, 재화, 컬렉션은 Firestore

## 설치

```bash
npm install
npm run dev
```

로컬 접속:

```txt
http://localhost:5173/CardVille/
```

## 빌드

```bash
npm run build
npm run preview
```

## GitHub Pages 배포

이 프로젝트는 `.github/workflows/deploy.yml`을 포함합니다.

1. GitHub 저장소 `junl-im/CardVille`에 업로드
2. GitHub 저장소 Settings > Pages 이동
3. Build and deployment Source를 `GitHub Actions`로 설정
4. `main` 브랜치에 push
5. 자동 배포 완료 후 `https://junl-im.github.io/CardVille/` 접속

## Firebase 적용

Firebase 구성은 `src/firebase/firebaseApp.ts`에 반영되어 있습니다.

Firestore 규칙은 `firebase/firestore.rules` 파일을 Firebase Console의 Firestore Rules에 붙여넣어 적용하세요.

현재 지원 구조:

- `/users/{uid}`: 본인만 읽기/쓰기
- `/users/{uid}/progress/{modeId}`: 본인 진행도
- `/users/{uid}/collections/{cardId}`: 본인 카드 컬렉션
- `/users/{uid}/packs/{packId}`: 본인 카드팩 기록
- `/publicConfig/*`: 전체 읽기, 클라이언트 쓰기 금지
- `/publicGameData/*`: 전체 읽기, 클라이언트 쓰기 금지
- `/leaderboards/{modeId}/entries/{uid}`: 공개 읽기, 본인 점수 쓰기

## 현재 포함된 모드

- 낱말 카드
- 기억력 카드
- 연산 카드

모드 데이터는 `public/assets/data/modes/` 아래 JSON 파일로 관리합니다.

## 다음 개발 순서

1. 첫 화면과 홈 화면 디자인 고도화
2. 카드 뒤집기 애니메이션 보강
3. 정답 파티클과 효과음 추가
4. 카드팩 오픈 연출 추가
5. Firestore 컬렉션 화면 실제 데이터 연결
6. 이메일/구글 로그인 UI 추가
7. PWA 아이콘 추가
8. Android APK 변환 준비
