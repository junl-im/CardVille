# CardVille v0.5.1 Patch Notes

## 목적

GitHub Actions 빌드 중 `npm ci` 단계에서 발생한 npm CLI 비정상 종료 문제를 수정한다.

## 원인

기존 워크플로는 `npm ci`와 `cache: npm`을 사용했다. 일부 GitHub Actions 환경에서 npm CLI가 `Exit handler never called!` 오류로 중단될 수 있으며, 로컬/생성 환경에서 만들어진 `package-lock.json`의 registry 정보가 배포 환경과 맞지 않으면 설치 단계가 불안정해질 수 있다.

## 수정 내용

- `.github/workflows/deploy.yml`에서 `cache: npm` 제거
- `npm ci` 제거
- GitHub Actions 안에서 `package-lock.json`을 제거한 뒤 설치
- npm registry를 `https://registry.npmjs.org/`로 명시
- `npm install --no-audit --no-fund --no-package-lock` 사용
- workflow timeout 15분 추가
- Node/npm 버전 출력 단계 추가

## 적용 방법

패치 ZIP을 기존 프로젝트 루트에 덮어쓴다. 기존 저장소에 `package-lock.json`이 남아 있어도 새 workflow가 빌드 중 자동으로 제거한다.

로컬에서도 같은 방식으로 초기화하고 싶다면 아래 명령을 사용할 수 있다.

```bash
rm -f package-lock.json
rm -rf node_modules
npm install --no-audit --no-fund --no-package-lock
npm run build
```
