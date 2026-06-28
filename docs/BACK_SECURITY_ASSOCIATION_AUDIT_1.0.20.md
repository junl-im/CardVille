# CardVille 1.0.20 Back/Security/Association Audit

## 뒤로가기 UX

기존에는 Phaser `BackConfirmScene`만 사용했기 때문에 일부 모바일/카카오 브라우저에서 뒤로가기 이벤트가 잡혀도 팝업이 보이지 않을 수 있었다. 1.0.20에서는 `BackButtonSystem`이 DOM overlay를 직접 생성하고, Phaser Scene은 보조 fallback으로 사용한다.

## 첫 실행 fallback

접속 직후 Vite/Phaser가 준비되기 전 `index.html`이 보여주던 가짜 큰 `게임 시작` 버튼을 제거했다. 이제 실제 버튼은 `LoginScene`이 준비된 뒤에만 나온다.

## 연상 카테고리

`정육면체`가 `단단함/강함`으로 분류되어 있던 것을 `모양/도형` 카테고리로 분리했다. `check:association`은 각 스테이지 목표마다 충분한 정답 카드가 존재하는지 검사한다.

## 보안/저장 안정성

`SecuritySystem`을 추가해 localStorage 저장값, 카드 ID, 진행도, 이메일 입력값을 정규화한다. 게스트 플레이는 계속 서버 없이 동작하며, Firebase는 Google/Email 로그인 시에만 CDN 지연 로딩된다.
