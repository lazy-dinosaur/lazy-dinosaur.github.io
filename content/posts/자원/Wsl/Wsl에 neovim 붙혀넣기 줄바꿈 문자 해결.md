---
tags:
  - windows
  - linux
  - wsl
createdAt: 2025-06-07 11:53:51
modifiedAt: 2025-06-07 12:50:23
publish: 자원/Wsl
related: ""
series: ""
---

# Wsl에 neovim 붙혀넣기 줄바꿈 문자 해결

- Ctrl + V 문제 해결

  ```bash
  # WSL에서 실행
  echo 'set completion-ignore-case on' >> ~/.inputrc
  echo 'set completion-map-case on' >> ~/.inputrc

  ```

- Neovim 의 yank.nvim 플러그인 설정 수정

  ```lua
  require("yanky").setup({
    ring = {
      permanent_wrapper = require("yanky.wrappers").remove_carriage_return,
    },
  })
  ```

  lazyvim 으로 관리하는 경우 ring 을 그냥 opts 안에 넣어주면 된다.

  ```lua
  {
    "gbprod/yanky.nvim",
    recommended = true,
    desc = "Better Yank/Paste",
    event = "LazyFile",
    opts = {
      highlight = { timer = 150 },
      ring = {
        permanent_wrapper = require("yanky.wrappers").remove_carriage_return,
      },
    },
    keys = {
      {
        "<leader>p",
        function()
          if LazyVim.pick.picker.name == "telescope" then
            require("telescope").extensions.yank_history.yank_history({})
          else
            vim.cmd([[YankyRingHistory]])
          end
        end,
        mode = { "n", "x" },
        desc = "Open Yank History",
      },
          -- stylua: ignore
      { "y", "<Plug>(YankyYank)", mode = { "n", "x" }, desc = "Yank Text" },
      { "p", "<Plug>(YankyPutAfter)", mode = { "n", "x" }, desc = "Put Text After Cursor" },
      { "P", "<Plug>(YankyPutBefore)", mode = { "n", "x" }, desc = "Put Text Before Cursor" },
      { "gp", "<Plug>(YankyGPutAfter)", mode = { "n", "x" }, desc = "Put Text After Selection" },
      { "gP", "<Plug>(YankyGPutBefore)", mode = { "n", "x" }, desc = "Put Text Before Selection" },
      { "[y", "<Plug>(YankyCycleForward)", desc = "Cycle Forward Through Yank History" },
      { "]y", "<Plug>(YankyCycleBackward)", desc = "Cycle Backward Through Yank History" },
      { "]p", "<Plug>(YankyPutIndentAfterLinewise)", desc = "Put Indented After Cursor (Linewise)" },
      { "[p", "<Plug>(YankyPutIndentBeforeLinewise)", desc = "Put Indented Before Cursor (Linewise)" },
      { "]P", "<Plug>(YankyPutIndentAfterLinewise)", desc = "Put Indented After Cursor (Linewise)" },
      { "[P", "<Plug>(YankyPutIndentBeforeLinewise)", desc = "Put Indented Before Cursor (Linewise)" },
      { ">p", "<Plug>(YankyPutIndentAfterShiftRight)", desc = "Put and Indent Right" },
      { "<p", "<Plug>(YankyPutIndentAfterShiftLeft)", desc = "Put and Indent Left" },
      { ">P", "<Plug>(YankyPutIndentBeforeShiftRight)", desc = "Put Before and Indent Right" },
      { "<P", "<Plug>(YankyPutIndentBeforeShiftLeft)", desc = "Put Before and Indent Left" },
      { "=p", "<Plug>(YankyPutAfterFilter)", desc = "Put After Applying a Filter" },
      { "=P", "<Plug>(YankyPutBeforeFilter)", desc = "Put Before Applying a Filter" },
    },
  }
  ```
