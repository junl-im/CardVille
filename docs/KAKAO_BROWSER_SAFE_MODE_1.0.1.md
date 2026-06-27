# Kakao Browser Safe Mode 1.0.1

카카오 인앱 브라우저는 일반 Chrome/Safari와 다르게 Service Worker, 캐시, DOM video, 히스토리 제어, 터치 이벤트가 불안정할 수 있습니다.

## 1.0.1 안정화 정책

- 카카오 브라우저에서는 Service Worker 등록을 건너뜁니다.
- 카카오 브라우저에서는 cache migration을 기다리지 않습니다.
- 카카오 브라우저에서는 로딩 인트로 mp4 대신 정적 로딩 배지를 표시합니다.
- 카카오 브라우저에서는 초기 preload 이미지를 필수 UI/프레임 중심으로 줄입니다.
- 히스토리 뒤로가기 guard는 실패해도 부팅을 막지 않습니다.
- 게스트 로그인은 서버를 기다리지 않는 local guest입니다.

## 게스트 저장 정책

- localStorage에 uid, 프로필, 진행도, 컬렉션을 저장합니다.
- Google/이메일 계정 로그인 시에만 Firebase 인증/Firestore가 사용됩니다.
- 추후 계정 연결 시 로컬 데이터를 서버 계정으로 이전하는 마이그레이션을 추가합니다.
