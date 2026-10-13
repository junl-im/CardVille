"""v0.8 통합 브라우저 회귀 테스트: 지도·준비·조작·종료 흐름."
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name('verify-world-map.py')), run_name='__main__')
