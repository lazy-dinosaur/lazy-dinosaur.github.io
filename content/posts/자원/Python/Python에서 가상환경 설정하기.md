---
tags:
  - python
createdAt: 2025-06-06 17:31:12
modifiedAt: 2025-06-16 19:54:31
publish: 자원/Python
related: ""
series: ""
---

# Python에서 가상환경 설정하기

> [!info] 가상환경이란?
> 독립적인 실행 환경을 만드는 기능
> 프로젝트마다 사용해야하는 의존성 버전이 다를 수 있기 때문에 후에 문제가 되지 않도록 할 수 있다.
> Node.js 의 경우 의존성 관리가 `node_modues`라는 폴더 별로 관리가 되기 때문에 가상환경을 사용하지 않아도 프로젝트를 독립적으로 구성할 수 있다.

1. 가상환경 설정

```bash
python -m venv ./env #원하는 경로
```

2. 가상환경 활성화

```bash
# 생성한 가상환경 경로 안의 bin 폴더 안을 확인해서 적절한 파일을 선택해야 한다.
source ./env/bin/activate
# fish 쉘
source ./env/bin/activate.fish
```

3. 가상환경 비활성화

```bash
deactivate
```

가상환경을 활용하여 프로젝트마다의 의존성을 보존할 수 있다
