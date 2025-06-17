---
tags:
  - resource
  - windows
createdAt: 2025-06-12 08:26:36
modifiedAt: 2025-06-12 16:41:31
publish: 자원/Windows
related: ""
series: ""
---

# Windows에서 AutoHotkey를 활용해 esc를 눌러 영문으로 전환하기

이전에 [[Wsl에서 im-select.nvim 사용하기]]를 활용하여 neovim 자체에서 자동적으로 입력 모드에 따라 한영을 전환하는 방법을 찾아서 사용해왔다.

사용하다 보니 한영 전환이 실행될 때마다 딜레이가 발생하고 neovim이 순간적으로 멈추는 현상이 발생했다. 그래서 AutoHotkey를 활용하여 한영 전환을 시도해보았고 멈추는 현상이 사라졌다.

## AutoHotkey 설치

```powershell
choco install autohotkey
```

## AutoHotkey 스크립트 작성

스크립트는 기본적으로 전에 사용했던 [[Wsl에서 im-select.nvim 사용하기|im-select-imm]]의 명령어를 그대로 사용하였다.

```ahk
~Esc::
    Run, im-select-imm 1042 0,,Hide
Return
```
