---
tags:
  - windows
  - wsl
  - neovim
createdAt: 2025-06-07 15:43:20
modifiedAt: 2025-06-07 17:50:53
publish: 자원/Wsl
related: ""
series: ""
---

# Wsl에서 im-select.nvim 사용하기

- [im-select.nvim](https://github.com/keaising/im-select.nvim)
- [im-select](https://github.com/daipeihust/im-select)
- [im-select-imm](https://github.com/PEMessage/im-select-imm)

Neovim을 주력 IDE로 사용하다 보면 모드 전환 시 한글과 영어 입력 변경이 매우 번거로울 때가 있다. 이런 문제를 해결해주는 훌륭한 플러그인이 바로 `im-select.nvim`이다.

## im-select.nvim의 장점

`im-select.nvim`이 매우 편리한 이유는 단순히 ESC를 누를 때마다 언어를 영어로 바꾸는 것이 아니라, 버퍼 이동이나 모드 변경 등 다양한 트리거에 반응하여 동작하기 때문이다. 특히 Insert 모드에서 사용하던 언어를 기억하고 해당 언어를 복구하는 기능이 매우 유용하다.

## 플랫폼별 설정

### Linux (fcitx 사용자)

Linux에서 한글을 사용하는 사용자라면 대부분 `fcitx`를 사용하는 경우가 많고, 이 경우 특별한 설정 없이 기본 설정만으로 동작한다.

```lua
{
    "keaising/im-select.nvim",
    config = function()
        require("im_select").setup({})
    end,
}
```

### macOS

macOS의 경우 `macism` 패키지만 설치하면 별다른 설정 없이 바로 동작한다.

### Windows의 입력기 문제

문제는 Windows에서 발생한다. 과거 Windows는 영어 입력기와 한글 입력기를 별개로 사용했기 때문에 게임 실행 시 한영키가 동작하지 않는 문제가 자주 발생했다. 하지만 최근 Windows 11에서는 한국어 입력기만으로도 영어와 한글 사용에 문제가 없다.

기존에는 `im-select.exe` 실행파일을 다운받아 사용하는 것이 일반적인 방법이었다. 이 프로그램은 현재 언어 입력기의 코드를 확인할 수 있고, `im-select 1033`을 입력하면 간단하게 영어 입력기로 변경할 수 있었다.

하지만 현재 한국어 입력기만으로도 충분한 상황에서 이 기능 하나 때문에 별도로 영어 입력기를 설치하는 것은 깔끔하지 못한 해결책이다.

## im-select-imm 소개

이 문제를 해결하기 위해 찾은 것이 바로 `im-select-imm`이다. 이는 `im-select`의 포크 버전으로, 기존 기능에 더해 특정 언어 입력기의 모드를 변경하는 것이 가능하다.

```bash
im-select-imm 1042 0  # 한글 입력기를 영어 모드로 변경
im-select-imm 1042 1  # 한글 입력기를 한글 모드로 변경
```

## WSL 환경에서의 설정

WSL 환경에서 `im-select-imm`을 활용한 `im-select.nvim` 설정은 다음과 같다:

```lua
{
    "keaising/im-select.nvim",
    config = function()
        require("im_select").setup({
            -- 기본 입력기를 한글 입력기의 영어 모드로 설정
            default_im_select = "im-select-imm.exe 1042 0",
            default_command = "im-select-imm.exe",

            -- 다음 이벤트 발생 시 기본 입력기로 변경
            set_default_events = {
                "VimEnter",
                "FocusGained",
                "InsertLeave",
                "CmdlineLeave"
            },

            -- Insert 모드 진입 시 이전 입력기 상태 복원
            set_previous_events = { "InsertEnter" },

            -- 실행 파일이 없을 때 알림 표시
            keep_quiet_on_no_binary = false,

            -- 입력기 변경을 비동기로 실행
            async_switch_im = true,
        })
    end,
}
```

## 설치 및 설정

참고:[[Windows에 환경변수 설정하기|Windows에 실행파일을 설치하고 설정하는법]]

1. [im-select-imm 릴리즈 페이지](https://github.com/PEMessage/im-select-imm)에서 `im-select-imm.exe`를 다운로드한다.
2. Windows의 PATH 환경변수에 실행 파일 경로를 추가한다.
3. 위의 Neovim 설정을 적용한다.

이제 WSL 환경에서도 별도의 영어 입력기 설치 없이 편리하게 한영 전환을 자동화할 수 있다.
