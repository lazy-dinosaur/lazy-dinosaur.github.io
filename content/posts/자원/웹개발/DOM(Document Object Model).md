---
tags:
  - resource
  - web
createdAt: 2025-04-14 18:08:07
modifiedAt: 2025-04-16 12:47:05
publish: 자원/웹개발
related: ""
series: ""
---

# DOM(Document Object Model)

DOM(Document Object Model)이란 HTML,XML 같은 마크업 문서를 위한 프로그래밍 인터페이스 이다.
DOM은 문서를 노드와 객체로 표현해 웹 페이지의 구조화된 표현을 제공한다.

DOM은 개발자가 Javascript를 통해 웹 페이지의 콘텐츠, 구조, 스타일을 동적으로 변경할 수 있게 해 준다. 이를 통해 사용자와 상호작용하는 웹 애플리케이션을 구축할 수 있다.

## DOM의 핵심 개념

- 트리구조: 문서는 부모-자식 관계를 가진 노드들의 트리로 표현된다.
- 노드: HTML요소, 속성 텍스트등 모든 것이 노드이다.
- 조작기능: Javascript를 사용해 DOM 노드를 추가, 수정, 삭제할 수 있다.
- 이벤트 처리: 사용자 상호작용(클릭, 입력 등)에 반응하는 이벤트를 처리한다.

## DOM의 구성 요소

- Document: DOM 트리의 루트 노드
- Element: HTML 태그에 해당하는 노드(div, p, span 등)
- Attribute: 요소의 속성(id, class, href 등)
- Text: 텍스트 내용을 담고 있는 노드

> [!info] window 오브젝트
> window 객체는 브라우저에서 Javascript의 전역 객체이다. 브라우저 환경에서의 모든 Javascript코드가 실행되는 기본적인 컨테이너 이다.

### 주요 객체들의 부모

- `document`: DOM에 접근할 수 있는 객체
- `location`: 현재 URL 정보와 탐색 기능
- `history`: 브라우저 방문 기록 관리
- `navigator`: 브라우저 정보
- `screen`: 사용자 화면 정보
- `localStorage`,`sessionStorage`:클라이언트 측 데이터 저장소

## DOM 조작 예시

```js
// 요소 선택
const element = document.getElementById("myId");

// 새 요소 생성
const newElement = document.createElement("div");

// 요소에 내용 추가
newElement.textContent = "안녕하세요";

// DOM에 요소 추가
element.appendChild(newElement);
```
