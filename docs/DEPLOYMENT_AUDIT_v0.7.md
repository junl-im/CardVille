# 라니팡! v0.7 — 실서비스/미리보기 접속 진단 (2026-10-14)

## 실행한 실제 자동검사
- [GitHub Pages 품질/배포 성공](https://github.com/junl-im/CardVille/actions/runs/38439283860).
- [Firebase preview 배포 성공](https://github.com/junl-im/CardVille/actions/runs/38439414971). 프로젝트: `cardville`, 임시 채널: `cardville-match3-preview`, live에 배포하지 않음.
- [4개 호스팅 주소 GET 비교](https://github.com/junl-im/CardVille/actions/runs/38439661823) (읽기만 수행).

## 실제 응답
| 위치 | HTTP | HTML <title> | 라니팡 표기 | 예전 How to Play CardVille |
|---|---|---|---|---|
| `https://cardville.web.app/` | **404** | Site Not Found | 없음 | 없음 |
| `https://cardville.firebaseapp.com/` | **404** | Site Not Found | 없음 | 없음 |
| `https://junl-im.github.io/CardVille/` | **200** | 라니팡! — 사탕마을 퍼즐 여행 | 있음 | 없음 |
| `https://cardville--cardville-match3-preview-ikhmalki.web.app/` | **200** | 라니팡! — 사탕마을 퍼즐 여행 | 있음 | 없음 |

## 검증/잔여 확인 사항
- 화면·시스템 레벨에서는 개발 서버 격리 Chromium으로 PC 1366×768, 모바일 390×844에서 타이틀/도움말/게임진입/뒤로가기/종료확인/드래그 점수를 검증. Firebase/GitHub Pages 원격 주소에서 Android의 실제 물리 뒤로가기 키까지 검증한 것은 아님.
- 이전 영어 화면이 계속 보이는 경우 위 2개의 **정확한 새 게임 주소**를 직접 열어 확인. 별도 도메인, 기존 즐겨찾기, 브라우저 탭 및 오프라인 SW 캐시로 과거 버전이 나올 수 있음. 현재 플레이 기록 보호를 위해 사이트 데이터 전체 삭제는 금지/비권장.
- Firebase 기본 live 주소는 404이며, 기존 live에 새 게임을 덮어쓴 적이 없다. 이 주소를 정식 런칭 주소로 사용하려면 Firebase Hosting의 기본 사이트 ID와 도메인 매핑을 먼저 확인하고 신중하게 운영 배포해야 한다.
- 구현된 '나가기'는 일반 웹브라우저 탭을 강제 종료하지 않으며, **첫 화면으로 복귀**하는 동작. 모바일 WebView별 뒤로가기·fullscreen 미지원 가능.
- 미리보기 채널은 14일 만료 설정. 테스트 버전으로서 진단 경로를 분리해 유지.
