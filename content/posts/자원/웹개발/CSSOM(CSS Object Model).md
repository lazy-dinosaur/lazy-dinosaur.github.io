---
tags:
  - resource
  - web
createdAt: 2025-04-15 14:55:32
modifiedAt: 2025-04-16 12:49:54
publish: 자원/웹개발
related: ""
series: ""
---

# CSSOM(CSS Object Model)

CSSOM(CSS Object Model)은 웹 브라우저가 CSS를 처리하는 방식을 나타내는 API이다. [[DOM(Document Object Model)]]이 HTML문서의 구조를 표현한다면, CSSOM은 CSS 스타일 규칙을 표현한다.

웹페이작 로드될 때 브라우저는 HTML을 파싱하여 DOM을 구성하고, CSS를 파싱하여 CSSOM을 구성한다. 이 두 모델이 결합되어 랜더 트리가 생성되고, 이를 기반으로 브라우저는 화면에 콘텐츠를 그린다.

CSSOM은 웹 페이지의 성틍에도 영향을 미치는데, 복잡한 CSS 선택자나 많은 스타일 규칙은 CSSOM 구성 시간을 증가시켜 페이지 렌더링을 지연시킬 수 있다.

## CSSOM의 주요 특징

1. 스타일 계산: 각 DOM 노드에 적용될 최종 스타일을 계산한다.
2. 상속과 계단식: CSS의 상속 및 우선순위 규칙이 적용된다.
3. 성능 영향: 복잡한 CSS 선택자는 CSSOM 생성 시간을 늘릴 수 있다.

## CSSOM의 작동 방식

1. CSS파싱: 브라우저가 CSS파일과 인라인 스타일을 사이한다.
2. 규칙 매칭: 각 CSS 규칙을 해당하는 DOM 요소에 매핑한다.
3. 계산된 스타일: 상속, 캐스케이딩(우선순위)을 고려해 최종 스타일을 계산한다.

## CSSOM 조작 예시

```js
// 인라인 스타일 변경
element.style.color = "red";

// 계산된 스타일 가져오기
const computedStyle = window.getComputedStyle(element);
console.log(computedStyle.fontSize);

// 스타일시트 조작
document.styleSheets[0].insertRule("body { background-color: lightblue; }", 0);
```
