# 라니팡 공식 주소 단일화 — 배포 원칙 (2026-10-15)

## 확정된 대표 주소

https://cardville.web.app/

위 주소가 유일한 게임 플레이 및 PWA 설치 공식 주소다. 사용자에게 다른 URL을 정식 게임 주소로 안내하지 않는다.

## 기존 주소 (이관 대상)

- https://junl-im.github.io/CardVille/ — GitHub Pages 기존 게임 주소
- https://cardville--cardville-match3-preview-ikhmalki.web.app/ — Firebase Hosting 미리보기 채널

2곳은 정식 LIVE를 동일 최신 v2.3.0-beta로 배포 및 HTTP/실기 검증한 **다음에** 공식 URL로 자동 이동시킨다. 배포 시점 어긋남, 버튼·퍼즐 캐시 퇴화를 방지하기 위한 순서다.

## 데이터·진행 기록

기존 게임은 브라우저 origin마다 localStorage sc_best, sc_unlocked, sc_stars, cv_last_level 에 별도 저장한다. 서버 계정 기반 동기화는 없다. 자동 리다이렉트 적용 시 사용자의 기존 진행 상태가 갑자기 1단계로 돌아가지 않도록, 기존 주소에서 **기록을 지우지 않고** 안전한 이전 설계를 적용한다. 이전 대상 데이터는 선택적으로 검증·병합(더 높은 단계/별/점수 우선)하고, 민감한 데이터 또는 인증 상태는 이동시키지 않는다. 실기 기기에서 이미 설치된 오래된 PWA는 새 오리진에서 별도로 설치해야 한다. GitHub/Firebase의 앱 설치 바로가기는 자동으로 변경되지 않을 수 있다.

## 정식 사이트 배포 원칙

1. main 버전·모바일/PC QA 통과.
2. 명시적 firebase-live-release.json 요청과 main의 동일 버전 확인.
3. Firebase LIVE만 동일 원본 웹 파일 배포. Firestore/Auth/Storage 변경 금지.
4. 실제 정식 사이트 version.json 및 WebP 원본·서비스워커 확인.
5. 이후 GitHub Pages/Firebase 미리보기에서 해당 공식 URL로 자동 이동.
6. 별도 dev/QA 검사는 CI 아티팩트로 유지. 다른 공개 주소에서 게임을 중복 운영하지 않는다.

## 이행 상태

- 1차 작업: Firebase LIVE v2.3.0-beta 선행 배포
- 2차 작업: 대체 주소 자동 전환·데이터 보존

## 자동 이동 실제 구성

- `redirect-site/index.html` / `404.html`: GitHub Pages와 Firebase 미리보기에서 실행되는 단일 공식 게임 이동 브리지.
- `redirect-site/sw.js`: 이전 Pages/미리보기 PWA의 낡은 화면 캐시 제거(게임 기록 LocalStorage는 건드리지 않음).
- `redirect-site/firebase.json`: Firebase `cardville-match3-preview` 채널만 HTML 브리지로 배포, 와일드카드 URL 처리.
- `tools/check-canonical-redirect.cjs`: 두 주소 자동 이동, 해금/최고 점수/별 데이터 전달, 악성 데이터 삭제 금지 QA.
- GitHub Pages는 redirect-site 정적 아티팩트만 게시하며 더 이상 보조 게임 서버가 아니다.
- Firebase preview 채널의 30일 만료를 막기 위해 매월 1일·15일에 리다이렉트 배포를 갱신한다.
- 브라우저 저장 데이터는 공식 주소의 `lany-origin-migration.js`가 수신·안전하게 병합한다.
- 이전 URL에서 설치한 PWA 홈 화면 아이콘은 실행 URL이 자동 변경되지 않을 수 있다. 정식 주소를 다시 설치한다.
