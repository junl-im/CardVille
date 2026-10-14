# 라니팡 IP 원본 아트 시트 보관 기록 · 2026-10-14

## 작업물 구분
- 실제 게임 v1.1에 사용된 WebP 최적화 이미지 38개: `web/assets/polish/`, [manifest](IP_ASSETS_V11.json). SHA-256은 각 이미지별로 기록.
- 채팅에서 생성·검수한 **원본 콘셉트 시트 7개**는 재가공 전의 고해상도 PNG 그대로 별도 보관. 동물 표정 시트, UI 버튼 시트, 캐릭터·배경 콘셉트 원화 등을 포함.
- 원본 소스 ZIP: https://drive.google.com/file/d/1S-_6ARroRRC1Yfj11pfzzNJj5ACJgeF0/view
- 원본 각 파일 SHA-256, 크기, 픽셀 크기 메타데이터: https://drive.google.com/file/d/1kMKePcSEov5GOiUO-yo28XZTzPAjGflo/view
- 소스 ZIP SHA-256: `59a1275695d00f86bc9a8ab1bdb2143a1ea555fcc80bb4f98c6aaf225e124601`.
- 실제 게임 에셋 배포본 ZIP: https://drive.google.com/file/d/1qGFryRrLj4UOF8ZJJA0bYRD_GsW-bgWo/view
- v1.1 정식 버전 전체 소스: https://drive.google.com/file/d/1QYA6YApSVxjfj8U-qeRVa2Pk9h48-29k/view

## 배포 검증
- Firebase 정식 `live` 성공 [Actions 38498380720](https://github.com/junl-im/CardVille/actions/runs/38498380720) 및 HTTP/아트 검사 `PASS`. 게임: https://cardville.web.app/?v=1.1.0.
- GitHub Pages 마지막 성공 [Actions 38498703266](https://github.com/junl-im/CardVille/actions/runs/38498703266). 게임: https://junl-im.github.io/CardVille/?v=1.1.0.
- 게임 내 표정·젤리 버튼·팝업은 CSS/JS로 실제 동작. 실제 Samsung Internet/기기별 물리 조작은 별도 수동 확인 필요.

## 재활용·보호 원칙
- 아트 소스 파일은 기준본으로 보존하고, 게임 런타임에는 승인된 최적화 WebP만 사용.
- 별도 이름표 또는 캐릭터 머리 위 텍스트 표시는 적용하지 않음.
- 새로운 캐릭터/표정 업데이트 시 원본→추출→사용 파일의 연결과 SHA 기록.
- 해당 자료는 프로젝트 출처·버전 보존용. 지식재산권 등록 또는 독점성 판정을 뜻하지는 않음.
