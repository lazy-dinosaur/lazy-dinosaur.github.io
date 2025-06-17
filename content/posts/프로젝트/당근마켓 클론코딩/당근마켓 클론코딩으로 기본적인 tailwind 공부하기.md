---
tags:
  - project
  - carrot-market
  - study
  - clone
  - tailwind
createdAt: 2025-06-14 15:04:37
modifiedAt: 2025-06-15 18:19:00
publish: 프로젝트/당근마켓 클론코딩
related: ""
series: ""
---

# 당근마켓 클론코딩으로 기본적인 tailwind 공부하기

기본적으로 ide에서 제대로된 tailwind를 사용하기 위해서는 tailwindintellisense를 설치해야 한다.
neovim의 경우 lazyvim을 통해 쉽게 설정이 가능하다. `:LazyExtra` 로 추가 플러그인 설치 창을 열고 `lang.tailwind`를 선택하여 설치하면 손쉽게 설정이 끝난다.

> [!warning] 자동완성 버그
> 어떤 이유에서인지 혹은 다른 개발에서는 정상적으로 동작하는지 모르겠지만.
> 특히 tailwind를 사용하면서 `lazyvim`을 통해 설치한 `coding.mini-snippets` 의 경우 자동완성시 문자열 포멧 오류가 발생하여 이상한 특수문자가 생겨난다.
> 해당 문제를 해결하기 위해서는 `luasnip`으로 대체하여 사용해야 한다.

## Tailwind의 특징

Utility-first CSS 프레임워크로, 클래스 이름을 통해 스타일을 적용하는 방식이다.
Tailwind의 클래스 이름은 매우 직관적이고 명확하다. 이름을 입력하면서 나타나는 자동완성 기능을 통해 CSS 속성을 외우기 위해 노력하지 않아도 된다.
자동 완성과 더불어 LSP를 통해 클래스 이름에 대한 설명을 확인하는 방식으로 개발해 나가면 CSS나 다른 ui프레임워크에 비해 매우 빠르고 쉽게 원하는 방향으로 개발할 수 있다.

특히 외우기 어려운 CSS의 has 속성이나 복잡한 속성의 경우에도 Tailwind에서는 간단한 클래스 이름으로 찾아서 적용할 수 있다.

즉 Tailwind의 장점은 빠른 프로토타이핑과 더불어 기억하기 쉬운 직관적인 클래스 이름으로 CSS의 강력한 기본 기능들을 쉽게 사용할 수 있다는 점이다.

## Tailwind에서의 값의 적용

px 이나 rem 등의 값은 해당 형식의 값이 사용되는 클래스 뒤에 `w-6` 처럼 의미하는 클래스 속성 뒤에 숫자가 붙는 형식으로 적용된다.
만약 % 단위의 값을 사용하고 싶다면 `w-1/2` 처럼 슬래시를 사용하여 적용할 수 있다.

- 음의값의 적용

  음수 값을 적용하고 싶다면 `-`를 접두사로 붙여서 적용할 수 있다. `-mt-4` 처럼 사용하면 된다.

- 커스텀 값의 적용

  수동으로 원하는 값을 적용하고 싶다면 `[]`를 사용하여 적용할 수 있다. 예를 들어 `w-[500px]` 처럼 사용하면 된다.

## Tailwind의 modifier

출처:[tailwind modifiers](https://tailwindcss.com/docs/hover-focus-and-other-states)

modifier는 tailwind에서 클래스 이름에 접두사나 접미사를 붙여서 스타일을 변경하는 기능이다.
이를 통해 hover, focus, active 등의 상태에 따라 스타일을 변경을 직관적이고 편하게 적용할 수 있다.

### 자주 사용하는 modifier

- `hover:` - 마우스 오버 시 적용
- `dark:` - 다크모드에 적용
- `focus:` - 포커스 시 적용

### 기억하면 좋은 modifier

- 미디어 쿼리 modifiers: `md:`,`lg:`, `xl:`, `2xl:` 등등
- form modifiers: `invalid:`,`valid:`,`focus:` 등등
- group modifiers: `group-hover:`,`group-focus:`,`group-active:`,`group-disabled:` 등등 부모의 상태에 따라 자식들의 스타일이 변경됨
- peer modifiers: `peer-focus:`,`peer-checked:`,`peer-disabled:` 형제의 상태에 따라 스타일이 변경됨.

- pseudo-class modifiers: `first:`,`last:`,`odd:`,`even:`,`marker:` 등등
- state modifier: `*:`,`has-:`,`empty:` 등

## Tailwind의 animations

출처:[tailwind animations](https://tailwindcss.com/docs/animation)

Tailwind에는 기본적으로 유용한 에니메이션들이 준비 되어 있다.

- `animate-pulse` -

## Tailwind의 Directive

출처:[tailwind functions and directives](https://tailwindcss.com/docs/functions-and-directives)

## Tailwind 플러그인 설치(v4)

`Tailwind`의 v4 버전부터는 기본적으로 `tailwind.config.js`를 사용하지 않는다. (원한다면 사용할 수 있음)
플러그인을 설치한 이후 `app.css`에 `@plugin` 이라는 directive로 추가해주기만 하면 된다

- 플러그인 설치
  ```bash
  bun add -D daisyui@latest
  ```
- 적용
  ```css
  @import "tailwindcss";
  @plugin "daisyui";
  ```

### tailwind.config.js 사용하는 법

레거시 코드인 `tailwind.config.js` 를 사용하고자 한다면 `@config` 디렉티브를 사용하면 된다.

```css
@config "../../tailwind.config.js";
```
