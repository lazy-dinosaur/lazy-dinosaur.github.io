---
tags:
  - python
  - jupyter
createdAt: 2025-06-08 12:12:00
modifiedAt: 2025-06-16 19:54:11
publish: 자원/Python
related: ""
series: ""
---

# Python의 가상환경을 Jupyter에서 사용하는법

Python 프로젝트를 위해서 [[python에서 가상환경 설정하기|가상환경]]을 설정하고 난 뒤 같은 환경을 Jupyter에서 사용하는것이 가능하다.

Python의 가상환경을 활성화 하고 Jupyter의 커널 관리 패키지를 설치한 이후 활성화시킨 가상환경을 커널로 등록해 주면 된다.

## 커널 등록하기

1. 가상환경 활성화

   ```bash
   source your_venv/bin/activate
   ```

2. ipykernel 설치

   ```bash
   pip install ipykernel
   ```

3. Jupyter 커널로 등록하기

   ```bash
   # 가상 환경 이름과 커널 이름은 자유로이 설정하면 된다.
   python -m ipykernel install -user --name=가상환경 이름 --display-name 커널 이름
   ```

이후 Jupyterlab 안에 새로운 커널이 등록된것을 확인할 수 있고 해당 커널로 설정하면 동일한 환경에서 개발해 나갈 수 있다.

## 커널 삭제하기

1. 등록된 커널 목록 확인

   ```bash
   jupyter kernelspec list
   ```

2. 커널 삭제

   ```bash
   jupyter kernelspec uninstall your_venv_name
   ```
