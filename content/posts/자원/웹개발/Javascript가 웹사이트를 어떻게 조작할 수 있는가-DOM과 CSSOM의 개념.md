---
tags:
  - resource
  - web
  - javascript
createdAt: 2025-04-14 09:46:13
modifiedAt: 2025-04-16 19:08:41
publish: 자원/웹개발
related: ""
series: ""
---

# Javascript가 웹사이트를 어떻게 조작할 수 있는가-DOM과 CSSOM의 개념

웹사이트는 [[HTML]] 과 [[CSS]] 를 통해 기본적인 구조와 형태가 정해진다. 그리고 Javascript로 이 웹사이트를 조작할 수 있는데 그렇다고 해서 파일 자체를 수정할 순 없다.

[[웹사이트는 어떻게 보여지는가-브라우저의 렌더링|렌더링]]이 필요한 이유가 어겨기에 있다고 생각해도 될것같다. 브라우져가 HTML과 CSS를 이해하고 프로그램화 하는 과정이 렌더링 과정이라고 생각된다.

이 브라우저의 렌더링 과정중 브라우저가 Javascript를 통해 조작이 가능하도록 이해하고 인터페이스를 만드는 과정이 있는데 그것이 바로 파싱을 통해 [[DOM(Document Object Model)]]과 [[CSSOM(CSS Object Model)]]을 생성하는 과정이다.

## DOM(Document Object Model)의 파싱

DOM은 HTML 문서를 트리 구조로 표현한 것이다. 이 트리의 각 노드는 문서의 일부(요소, 속성, 텍스트 등)를 나타낸다. **DOM은 Javascript가 페이지상의 콘텐츠와 구저에 접근하고 조작할 수 있게 해주는 인터페이스 이다**.

HTML이 파서를 통해 DOM의 트리를 구축 하는 과정은 다음과 같다.

1. 바이트를 문자로 변환
   HTML의 원시 데이터는 바이트로 이것을 문자로 변환하는 과정을 거친다.
2. 토큰화
   문자열이 HTML 명세에 따라 토큰(`<html>`, `<body>` 등)으로 변환된다.
3. 노드 생성
   각 토큰이 **속성과 규칙을 가진 객체(노드)로 변환**된다.
4. DOM 트리 구축
   노드들이 트리 구조로 연결되며 **부모-자식 간의 관계가 설정**되고 요소간의 계층 구조가 형성된다. 이는 루트(`document`)부터 모든 요소, 속성, 텍스트 노드까지 포함한다.

## CSSOM(CSS Object Model)의 파싱

CSSOM은 HTML 대신 **CSS를 트리 구조로 표현하고 조작하는 API 집합**이다. CSS 스타일 시트를 표현하는 객체 모델로 DOM과 유사하게 트리구조로 되어 있다.

CSS가 파싱되어 CSSOM트리가 구축되는 과정은 다음과 같다.

1. CSS로드
   외부 스타일시트,`<style>`태그, 인라인 스타일 등에서 CSS 규칙을 로드한다.
2. 토큰화
   CSS 규칙을 토큰으로 변환한다.
3. 노드 생성
   각 CSS 규칙을 나타내는 노드를 생성한다.
4. CSSOM 트리 구축
   CSS 규칙이 계층적 트리 구조로 구성되고 **스타일 상속이 적용**된다(부모 요소의 스타일이 자식 요소에 상속). 명시성과 우선순위에 따라 스타일이 계산된다.

## DOM에 접근하기

DOM 은 여러가지의 object를 포함한다. `window`,`document`,`element`,`nodeList` 등이 대표적이며 각각의 object를 위한 인터페이스가 존재한다.

대표적인 인터페이스는 다음과 같다.

> [!example]
>
> - `document.getElementById(id)`
> - `document.getElementsByTagName(name)`
> - `document.createElement(name)`
> - `parentNode.appendChild(node)`
> - `element.innerHTML`
> - `element.style.left`
> - `element.setAttribute`
> - `element.getAttribute`
> - `element.addEventListener`
> - `window.content`
> - `window.onload`
> - `window.dump`
> - `window.scrollTo`

## 예시

```js DOM 인터페이스 예시
var table = document.getElementById("table");
var tableAttrs = table.attributes; // Node/Element interface
for (var i = 0; i < tableAttrs.length; i++) {
  // HTMLTableElement interface: border attribute
  if (tableAttrs[i].nodeName.toLowerCase() == "border") table.border = "1";
}
// HTMLTableElement interface: summary attribute
table.summary = "note: increased border";
```

```js CSSOM 인터페이스 예시
const element = document.getElementById("myElement");
element.style.color = "blue";
element.style.backgroundColor = "#f0f0f0";
element.style.fontSize = "16px";

// 여러 속성을 한 번에 변경
Object.assign(element.style, {
  margin: "10px",
  padding: "5px",
  borderRadius: "3px",
  transition: "all 0.3s ease",
});

// CSS 변수(CSS Custom Properties) 설정
element.style.setProperty("--main-color", "purple");
```
