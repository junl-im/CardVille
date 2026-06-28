# Login Layout Audit 1.0.18

## 발견한 문제

1.0.17의 시작 버튼 묶음은 모바일 화면에서 지나치게 하단에 붙어 보일 수 있었습니다.

기존 위치:

```txt
게임 시작: y 704
Google 로그인: y 774
이메일/가입: y 824
```

특히 카카오 브라우저처럼 하단 UI/제스처 영역이 겹치는 환경에서는 보이는 위치가 더 낮아 보일 수 있습니다.

## 수정 위치

```txt
게임 시작: y 634
Google 로그인: y 700
이메일/가입: y 754
```

## 보정 원칙

- 배경 키아트의 로고와 캐릭터를 최대한 가리지 않음
- 버튼을 너무 중앙으로 올려 캐릭터 얼굴을 가리지 않음
- 하단 제스처 영역과 겹치지 않도록 여유 확보
- 실제 터치 hitArea는 기존 안정 구조 유지

## 검증

- `npm run build`
- `npm run check:deploy`
- `npm run check:brand`
- `npm run check:ui`
- `npm run check:layout`
