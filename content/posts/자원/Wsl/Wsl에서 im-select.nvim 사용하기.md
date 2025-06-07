---
tags:
  - windows
  - wsl
  - neovim
createdAt: 2025-06-07 15:43:20
modifiedAt: 2025-06-07 17:40:38
publish: 자원/Wsl
related: ""
series: ""
---

# Wsl에서 im-select.nvim 사용하기

- neovim 플러그인 링크:[im-select.nvim](https://github.com/keaising/im-select.nvim)
- 원래의 im-select 링크:[im-select](https://github.com/daipeihust/im-select)
- 새로운 윈도우를 위한 im-select-imm 링크:[im-select-imm.exe](https://github.com/PEMessage/im-select-imm)

neovim을 주력 ide로 사용하다 보면 모드에 따른 한글과 영어의 변경이 매우 번거로울 때가 있다. 이때를 위한 아주 좋은 플러그인이 있는데 바로 `im-select.nvim`이다. 이 `im-select.nvim` 을 사용하기 위해서는 단순하게 사용하는 OS의언어를 cli를 통해 영어로 바꿀 수 있는 명령어만 가지고 있다면 바로 사용 가능하다.

`im-select.nvim`이 매우 편리한 이유는 esc를 누를때마다 언어를 영어로 바뀌는것이 아니라. 버퍼의 이동 모드의 변경 등 다양한 트리거에 의해 동작하며 insert 모드에서 사용하던 언어를 기억하고 해당 언어를 복구한다.

Linux에서 한글을 사용하는 사용자라면 대부분 `fcitx`를 사용하는 경우가 많고 이 경우엔 특별히 다른 설정이 필요하지 않고 단순하게 기본 설정을 불러오기만 하면 동작한다.

>[!example] im-select.nvim 의 기본 설정
>
>```lua
>{
>    "keaising/im-select.nvim",
>    config = function()
>        require("im_select").setup({})
>    end,
>}
>```

MacOS의 경우에도 `macism`이라는 패키지만 설정해준다면 별 셋업 없이 바로 동작 한다.

하지만 문제는 윈도우를 사용하면서 나타난다.

## Windows의 입력기 문제

과거 Windows는 영어 입력기와 한글 입력기를 별개로 사용하여 게임을 켰을때 값자기 한영키가 동작하지 않고 영어만 나오는 상황을 자주 경험했었다. 하지만 최근 윈도우11을 개발머신으로 세팅하면서 더이상 영어 입력기를 별도로 사용하지 않아도 아무 문제 없이 사용 가능하다는 것을 알았다.

윈도우의 경우 `im-select.nvim` 을 사용하기 위해선 `im-select.exe`실행파일을 다운받아 사용하는 것이 가장 편한 방법이었다. 그리고 이 `im-select.exe`는 현제 언어 입력기의 코드를 확인할 수 있고 `im-select 1033` 을 입력하면 간단하게 영어 입력기로 바꿀 수 있다.

하지만 현재 한국어 입력기만으로도 영어와 한글 사용에 아무 문제가 없는 상황에서 이 기능 하나 때문에 영어 입력기를 설치하는것은 깔끔하지 못하다.

## `im-select-imm`

문제 해결을 위해 구글링을 하여 발견한 레포지토리로 `im-select`의 포크이다.

`im-select`의 기능에 더해 특정 언어 입력기의 모드를 변경하는것이 가능하다.

```bash
im-select-imm 1043 0 # 한글 입력기의 영어로 변경
im-select-imm 1043 1 # 한글 입력기의 한글로 변경
```

참고:[[Windows에 환경변수 설정하기|Window에 실행 프로그램 설치하고 설정하기]]

## `im-select-imm`을 활용한 `im-select.nvim` 설정

```lua
{
    "keaising/im-select.nvim",
    config = function()
      require("im_select").setup({
        default_im_select = "im-select-imm.exe 1042 0",
        default_command = "im-select-imm.exe",
        set_default_events = { "VimEnter", "FocusGained", "InsertLeave", "CmdlineLeave" },

        -- Restore the previous used input method state when the following events
        -- are triggered, if you don't want to restore previous used im in Insert mode,
        -- e.g. deprecated `disable_auto_restore = 1`, just let it empty
        -- as `set_previous_events = {}`
        set_previous_events = { "InsertEnter" },

        -- Show notification about how to install executable binary when binary missed
        keep_quiet_on_no_binary = false,

        -- Async run `default_command` to switch IM or not
        async_switch_im = true,
      })
    end,
  }
```
