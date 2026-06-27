# Firebase 설정

## 적용된 Firebase 구성

`src/firebase/firebaseApp.ts`에 다음 Firebase 프로젝트가 연결되어 있다.

```ts
const firebaseConfig = {
  apiKey: 'AIzaSyD9hJzRf_I4t9LjS7EjO9K8ZcUX39wgecE',
  authDomain: 'cardville.firebaseapp.com',
  projectId: 'cardville',
  storageBucket: 'cardville.firebasestorage.app',
  messagingSenderId: '285520270113',
  appId: '1:285520270113:web:ef33aedeaf08f4ef806460',
  measurementId: 'G-8QTT1QSPVL',
};
```

## Authentication

Firebase Console에서 다음 로그인 방식을 활성화한다.

- Anonymous
- Email/Password
- Google

현재 스타터는 익명 로그인을 자동 실행한다.

이메일/구글 로그인 함수는 `src/firebase/auth.ts`에 준비되어 있고, 다음 단계에서 UI에 연결하면 된다.

## Firestore Rules

`firebase/firestore.rules` 파일 내용을 Firebase Console > Firestore Database > Rules에 붙여넣는다.

초기 규칙 `allow read, write: if false;` 상태에서는 유저 저장이 되지 않는다.

## Analytics

Analytics는 브라우저 지원 여부를 `isSupported()`로 확인한 뒤 초기화한다.

카카오 브라우저, 일부 인앱 브라우저, 쿠키 제한 환경에서 Analytics가 실패해도 게임 실행은 계속되어야 한다.
