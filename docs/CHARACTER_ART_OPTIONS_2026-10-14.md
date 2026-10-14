# 라니팡 동물 친구 — 선택 가능한 2가지 아트 방향 (2026-10-14)

## 현재 적용된 v1.0 에셋
- 실제 게임 버전 `1.0.0-beta`, [GitHub 완료 커밋](https://github.com/junl-im/CardVille/commit/0494feb4765a3b1021b88d1d71695bad0997e61a) 기반.
- 몸통이 아닌 **동물 얼굴 30종**, 기본 7종은 실제 3매치 블록 이미지, 나머지 23종은 도감에 표시. [현재 작업 문서](CHARACTER_DESIGN_v1.0.md).
- Android/PC 대응 팝업 검사, [Firebase 미리보기 배포 성공](https://github.com/junl-im/CardVille/actions/runs/38489964770). [게임 주소](https://cardville--cardville-match3-preview-ikhmalki.web.app/?v=1.0.0).

## 추가로 만든 15종 얼굴 아트 변형 (별도 선택지, 본편 교체 아님)
- 첫 타이틀 배경의 원형·홍조·큰 눈을 기준으로 새 원화에서 고해상도 얼굴 15종을 256×256 WebP 아이콘으로 분리. 이름은 사용자 UI에서 한글로 처리.
- 구성: 토끼, 곰, 병아리, 강아지, 여우, 늑대, 고양이, 판다, 햄스터, 돼지, 개구리, 사슴, 부엉이, 얼룩고양이, 리본강아지.
- [동물 얼굴 15종 시트](https://drive.google.com/file/d/1hTAOesHxf7FMWHYH65Lz-1xHrqSnEJi7/view) / [WebP 15종 개별 파일 ZIP](https://drive.google.com/file/d/1UpcwiUiqwb3y9VLoqMkbunbvv0t9YNhY/view).
- 15종 시안에는 **선택한 동물을 지도·단계 준비창·승리창에 표시**하는 프로토타입과 **모바일 높이 최적화 CSS**를 별도 개발·검증. [별도 전체 프로토타입 ZIP](https://drive.google.com/file/d/1zquTF0G4RA8SCVATrt8Yc0LtEQ84PuKr/view).
- **주의:** 본 15종 프로토타입은 이전 v0.9.1 코드를 기반으로 독립 제작되었음. 현재 main의 v1.0 30종 에셋·퍼즐 타일·모바일 개선 코드를 덮어쓰면 손실 위험이 있으므로 자동 병합하지 않았음. 차후 사용자 디자인 승인 시 v1.0에 선택적으로 선별 이식할 것.

## 독립 테스트 (15종 프로토타입)
- Chromium 320×568, 360×780, 390×844, 768×1024, 1366×768: 얼굴 15종 로딩, 선택·저장, 지도·단계 준비·게임, 안내/일시정지, 오류 0.
- 추가 팝업: 320×568/360×780/390×844에서 일일 도전·단계 편집기·난이도·대전 4종 화면 경계 검사 통과.
- 실제 휴대전화 삼성 인터넷/인앱 브라우저 수동 검증은 별개.
