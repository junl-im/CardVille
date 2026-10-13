# 카드빌 — 250단계 한국어 드래그 퍼즐 (v0.5)

기존 CardVille의 PC·모바일 웹용 3매치 퍼즐 프로젝트입니다. 상용 게임의 재미 요소를 분석하되, 저작권이 있는 그래픽이나 소스는 무단 복제하지 않습니다.

## 현재 구현

- 기본 게임 언어 **한국어**: 타이틀·버튼·HUD·튜토리얼·10개 지역·250개 스테이지 이름·결과·난이도·일일/편집 메뉴 문구.
- **게임 블록은 PC 왼쪽 드래그 / 모바일 손가락 스와이프로만 교환.** 기존 일반 클릭 2번 교환은 제거. 키보드 방향키+Enter 대체 지원.
- 우클릭 메뉴·우클릭 드래그·브라우저 기본 HTML 드래그·선택 동작은 게임 사이트 화면에서 차단. 입력칸 문자 선택은 허용.
- 클릭 이동과 달리 블록을 누르고 미는 동안 시각 피드백이 따라 움직이며, 인접한 잠금되지 않은 칸으로만 교환.
- 기존 250단계/10개 지역/10개 보스·임시 점수 밸런스 유지. 게임 진행 및 최고점 저장은 여전히 같은 로컬 저장 키 사용.
- 실험 단계: 난이도 변경·일일 도전·레벨 편집·P2P 원격 대전. UI는 한국어로 바뀌었으나 완성된 온라인 서비스라고 주장하지 않음.

## 실행·검증

```bash
python -m http.server 8000 --directory web
node tools/check-release.cjs
node tools/check-korean-ui.cjs
```

Chrome 기반 PC 1366×768 및 모바일 390×844의 별도 자동 렌더링 검사: 유효 드래그 시 점수·이동수 변화, 일반 클릭 2번 교환 금지, 우클릭 컨텍스트 메뉴 차단, 한국어 지도/난이도, 오류 0건. 브라우저는 로컬 HTTP 원본 대신 인라인 테스트 자원을 사용하는 격리된 검증 방식이므로 실제 Firebase 배포 주소에서 플레이 검증은 별개입니다.

## 배포

- GitHub Pages: `.github/workflows/pages.yml` — `node` 검증 후 `web` 배포.
- Firebase 프로젝트: `cardville`, 미리보기 Hosting 채널: `cardville-match3-preview`, 14일 만료. 실제 운영 `live` 채널은 변경하지 않음.
- Firebase 배포 트리거는 `ops/firebase-preview-trigger.json` 수정 시 실행됩니다. 새 릴리스를 미리보기로 확인한 다음 운영 반영 여부를 결정합니다.

## 소스 및 에셋 라이선스

- 원본 게임 코드: [Shaista Shabbir / Sweet Crush](https://github.com/ShaistaShabbir-prog/candy-crush-match3), MIT (원 저작권 표시와 `web/LICENSE` 유지).
- 라이선스가 확인된 활용 후보: Kenney Starter Kit(MIT 코드+CC0 에셋), Kenney Puzzle Pack 2 / UI Pack / Interface Sounds(CC0), MIT match3-board(타 엔진 설계 참고).
- **v0.5에는 새 그래픽·음원 팩의 실제 리소스 파일을 아직 도입하지 않았습니다.** 검증된 후보와 우선순위는 `docs/COMMERCIAL_OPEN_SOURCE_RESEARCH_v0.5.md`에 기록했습니다.
- 타 프로젝트의 소스코드 라이선스가 MIT여도 이미지와 음원이 다른 조건일 수 있으므로 출처별로 확인합니다.

## 개발 문서

- `docs/KOREAN_DRAG_v0.5.md`: 한글화와 새 조작 규칙.
- `docs/COMMERCIAL_OPEN_SOURCE_RESEARCH_v0.5.md`: 상용게임 벤치마크, 오픈소스/CC0 이식 후보, 로드맵.
- `docs/BROWSER_V05.json`: PC·모바일 격리 브라우저 자동검사 결과.

GitHub 저장소의 과거 CardVille 커밋 기록은 유지됩니다.

## v0.6 — 누락 영문 전수 재점검

- 기존 한국어화 누락: 원본 250개 단계명과 10개 지역 theme 값은 여전히 영문으로 저장됐고, 2인 대전의 연결 상태와 참가자 이름 일부가 영어로 표시됨.
- 250개 단계 데이터 name/theme를 원본에서 한국어로 전환하고 엔진 후처리 덮어쓰기를 제거.
- 2인 대전 연결·실패·차례·참가자 대체 이름·온라인 시험 기능 표시를 한국어로 수정.
- 저장 키, PeerJS 네트워크 메시지 타입, HTML/CSS/JS 내부 속성 등은 기존 기록 호환성을 위해 영문 유지.
- 오프라인 서비스워커 캐시 이름 변경으로 구버전 잔류 완화.
- 게임 타이틀 **카드빌은 아직 유지**: 라니팡은 사용자 제안 단계로, 최종 확정 후 전체 브랜드 변경.

