# 라니팡 v1.4 — 설치 가능한 PWA와 통일 대표 아이콘

## 사용자 경험
- 브라우저 탭 파비콘: `web/assets/lanypang-brand.svg` / PNG 32×32 폴백.
- 설치 후 Android / PC 앱 런처: 같은 캐릭터 브랜드에서 생성한 192/512 PNG.
- Android 마스크형 런처: `lanypang-maskable.svg`에서 생성한 192/512 PNG.
- iPhone 홈 화면: 180×180 Apple Touch PNG / `apple-mobile-web-app-title=라니팡`.
- PWA 이름과 범위: manifest `name`, `short_name`, `id`, `scope`, `display=standalone`.
- 홈 타이틀의 「라니팡 앱 설치하기」 버튼: `beforeinstallprompt` 이벤트가 제공되면 실제 브라우저 설치 창 호출.
- 미지원 브라우저: 플랫폼별 메뉴 설치 방법만 표시. 사용자가 설치된 것처럼 오인하지 않도록 함.
- 이미 PWA에서 실행 중이거나 `appinstalled` 이벤트를 수신하면 설치 버튼 숨김.
- 게임 이용 기록: 현재 `localStorage` 키 유지. 설치형으로 실행 시 동일 오리진에 대한 브라우저/설치 앱 데이터 공유 정책은 플랫폼마다 차이가 있을 수 있음.

## 플랫폼별 안내
- Android Chrome: 설치 버튼 또는 브라우저 메뉴 「앱 설치」/「홈 화면에 추가」.
- Windows / PC Chrome·Edge: 주소창 설치 아이콘 또는 메뉴의 「설치」 기능.
- iOS Safari: 공유 버튼 → 「홈 화면에 추가」 → 「추가」. Safari에서 앱 설치 JS 프롬프트를 직접 띄울 수 없음.
- 사내 브라우저, 인앱 브라우저 등의 정책에 따라 앱 설치 메뉴가 없을 수 있음.

## 아이콘 빌드
- SVG 원본: `web/assets/lanypang-brand.svg` + `lanypang-maskable.svg`.
- 명령: `python -m pip install CairoSVG==2.7.1 && python tools/build-pwa-icons.py`.
- 생성: 16 / 32 / 48 / 180 / 192 / 512 PX, maskable 192 / 512 PX PNG.
- GitHub Pages, Firebase preview, Firebase live 배포 직전에 해당 빌드를 실행하고, 포맷 및 크기를 검증. GIF/JPG는 필요하지 않음.
- SVG/JS/CSS/PNG 모두 같은 출처에서 Service Worker가 오프라인 캐시.
- 오프라인 페이지 재진입 시 `?v=1.4.0`과 같은 URL 검색 쿼리를 무시해 동일 버전 JS/CSS를 캐시에서 찾음.

## 테스트
- `node tools/check-pwa-v14.cjs`: HTML, manifest, SW, 설치 이벤트, favicon, maskable 선언 및 스크립트 검사.
- `node tools/check-pwa-v14.cjs --raster`: 빌드 후 8개 PNG의 실제 PNG 서명·가로세로 크기 검증.
- `python tests/verify-pwa-v14.py`: Playwright Chromium Android / iPhone UA / PC에서 안내 모달·설치 이벤트·설치 완료 버튼 처리와 오프라인 버전 URL 재진입 검사.
- 실제 iOS Safari의 설치 동작은 Apple 디바이스에서 수동 확인 필요. 자동 테스트의 iPhone 부분은 iPhone UA를 에뮬레이트한 Chromium 테스트이며 Safari 엔진을 직접 검증한 것은 아님.

## 출시 주의
이 기능은 기존 HTTPS 웹사이트에 PWA 설치 경험을 추가하는 것이며 APK/IPA 생성이나 앱스토어 등록이 아니다. 각 사용자 OS와 브라우저가 설치를 허용해야 실제 앱으로 추가된다.
