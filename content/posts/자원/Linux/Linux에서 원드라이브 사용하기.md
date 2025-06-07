---
tags:
  - linux
  - onedrive
  - wsl
createdAt: 2025-06-07 13:01:39
modifiedAt: 2025-06-07 17:53:47
publish: 자원/Linux
related: ""
series: ""
---

# Linux에서 원드라이브 사용하기

출처:[linux를 위한 onedrive](https://github.com/abraunegg/onedrive)

1. onedrive 패키지 설치

  ```bash
  sudo dnf install onedrive
  ```

2. 인증하기
  onedrive를 한번 실행시키면 링크가 나타나며 해당 링크를 타고 들어가 로그인과 인증을 마친 이후 해당 페이지의 주소 창의 내용을 복사하여 붙혀넣는다.

  ```bash
  onedrive
  ```

3. 설정하기

  설정 확인

  ```bash
  onedrive --display-config
  ```
