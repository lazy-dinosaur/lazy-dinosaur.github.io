---
tags:
  - resource
  - linux
  - onedrive
  - wsl
createdAt: 2025-06-07 13:01:39
modifiedAt: 2025-06-30 09:27:08
publish: 자원/Linux
related: ""
series: ""
---

# Linux에서 Onedrive 사용하기

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

## 기본적인 사용

1. 일회성 동기화

   ```bash
   onedrive --sync

   onedrive -s
   ```

2. 주기적으로 동기화

   ```bash
   onedrive --monitor

   onedrive -m
   ```

## 주요 설정

기본적으로 onedrive는 `~/.config/onedrive/config`에 설정파일을 저장한다. 이 파일을 수정하여 다양한 설정을 할 수 있다.

설정 파일 내에서 가장 중요하다고 생각되는 설정은 `monitor_interval` 이다 기본설정은 300초(5분)로 되어있다. 이 값을 변경하면 동기화 주기를 조정할 수 있다. 다만 최소 값이 300 이다.

```config
monitor_interval = "300"
```

그 다음 중요한 설정은 `~/.config/onedrive/sync_list` 이다. 이 설정은 동기화할 디렉토리를 지정한다. 기본값은 `~/OneDrive` 이다. 이 값을 변경하면 다른 디렉토리로 동기화할 수 있다.

```config
앱/remotely-save/notes
```

> [!tip] Obsidian과의 싱크를 위해 사용할 때 필수 옵션
>
> Onedrive를 --monitor 모드로 사용하여 Obsidian 파일들을 지속적으로 수정하게 되면 계속해서 `inotify` 이벤트를 받게되고 이는 지속적인 재업로드를 유발한다. 이 때문에 파일이 충돌이 나는 경우가 생겨 백업파일을 만들거나 파일이 삭제 되기도 한다.
> 이것을 방지하기 위해 아래의 두 옵션을 사용하는것이 좋다.
>
> ```config
> force_session_upload = "true"
> delay_inotify_processing = "true"
> ```

## 지속적으로 동기화하기

다음 명령어를 통해 지속적으로 동기화 할 수 있다.

```bash
sudo systemctl --user enable onedrive
sudo systemctl --user start onedrive
```

이렇게 하면 onedrive --monitor 명령어를 실행한 것과 동일한 효과를 얻을 수 있다. 이 명령어는 onedrive 설정파일에 설정된 주기마다 자동으로 동기화를 수행한다.
