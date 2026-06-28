# CardVille 1.0.6 Reset Analysis

## 판단

기존 프로젝트는 기능, PWA, 캐시, 대형 에셋, 동적 시스템, 진단 로직이 너무 빠르게 누적되어 첫 부팅 실패 원인을 찾기 어려운 상태가 되었다.

## 정리한 것

- Service Worker 제거
- 캐시 자동 마이그레이션 제거
- 인트로 MP4 제거
- 시작 시 대형 에셋 preload 제거
- 시작 시 Firebase 초기화 제거
- 복잡한 다중 진단 스크립트 제거
- LoginScene 직접 진입 구조로 단순화

## 남긴 것

- Phaser 3 + TypeScript + Vite
- GitHub Actions 배포
- Firebase 설정 및 Google/Email 동적 로그인
- 로컬 게스트 즉시 시작
- 기본 카드 매칭 게임 루프
- 보상과 컬렉션 localStorage 저장

## 다음 단계

1. GitHub Actions로 1.0.6 배포
2. deploy-proof.html 확인
3. 로그인 화면 확인
4. 게스트 시작 확인
5. 게임 1회 클리어 확인
6. 그 다음에 디자인과 에셋을 단계적으로 재적용
