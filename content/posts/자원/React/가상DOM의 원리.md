---
tags:
  - resource
  - react
createdAt: 2025-04-21 18:45:51
modifiedAt: 2025-04-23 14:15:23
publish: 자원/React
related: ""
series: ""
---

# 가상DOM의 원리

가상DOM은 실제 DOM의 가벼운 복사본이다. 실제 브라우저의 DOM을 직접 조작하는 대신, 메모리 상에 가상의 DOM 트리를 만들어 작업산 후 필요한 변경사항만 실제 DOM에 적용하는 방식이다.

## 작동 원리

1. 초기 렌더링:
   - 애플리케이션이 처음 로드될때 실제 DOM의 가상 표현이 메모리에 생성된다.
   - 이 가상 DOM은 실제 DOM 요소에 대응하는 JavaScript 객체 트리 구조이다.
2. 상태 변경 감지:
   - 데이터가 변경되면(예: 사용자 상호작용) 전체 UI를 다시 렌더링하는 새로운 가상 DOM 트리가 생성된다.
3. 가상 DOM 비교(Diffing):
   - 이전 DOM과 새로운 가상 DOM을 비교하는 "diffing"알고리즘이 실행된다.
   - React의 경우 이 과정을 "reconciliation(재조정)"이라고 부른다.
4. 변경사항 계산 (Patch):
   - 알고리즘은 두 가상 DOM 트리 간의 차이점을 찾아 최소한의 변경사항 집합을 계산한다.
5. 배치 업데이트(Batching):
   - 모든 변경사항만 실제 DOM에 적용한다. 이 과정을 "커밋 단계"라고 한다.

## Diffing 알고리즘의 최적화 원칙

1. 트리 비교:
   - 두 트리를 루트 노드부터 비교하기 시작힌다.
   - 루트 요소의 타입이 다르면 전체 트리를 새로 구성한다.
2. 요소 타입 비교:
   - 같은 위치에 있는 요소의 타입이 같으면 속성만 업데이트하고, 다르면 해당 노드와 그 하위 트리를 모두 재생성한다.
3. 키(Key)사용:
   - 리스트 항목에 고유 키를 할당하면 알고리즘이 요소의 이동을 효율적으로 추적할 수 있다.
   - 예: `<li key="todo-1">항목 1</li>`
4. 레벨별 비교:
   - 알고리즘은 같은 레벨의 노드들만 비교하며, 자식 노드들 간에는 재귀적으로 비교한다.

## 성능 이점

1. DOM 조작 최소화:
   - 실제 DOM 조작은 비용이 큰 작업이다. 가상 DOM은 필요한 변경사항만 적용해 이를 최소화한다.
2. 일괄 처리:
   - 여러 변경사항을 하나의 업데이트로 배치 처리한다.
3. 이벤트 시스템 최적화:
   - [[이벤트 위임(event delegation)]]을 통해 이벤트 핸들러 수를 줄인다.

## 간단한 가상 DOM 구현 예시(의사 코드)

```js
// 1. 가상 DOM 노드 생성
function createVirtualNode(type, props, ...children) {
  return { type, props, children };
}
// 2. 가상 DOM을 실제 DOM으로 변환
function createRealDOM(virtualNode) {
  //텍스트 노드 처리
  if (typeof virtualNode === "string") {
    return document.createTextNode(virtualNode);
  }

  // 요소 노드 생성
  const element = document.createElement(virtualNode.type);
  //속성 설정
  for (const [key, value] of Object.entries(virtualNode.props || {})) {
    element.setAttribute(key, value);
  }
  // 자식 노드 재귀적 처리
  for (const child of virtualNode.children) {
    element.appendChild(createRealDOM(child));
  }
  return element;
}
// 3.DOM 비교 (단순화된 버전)
function updateDOM(oldNode, newNode, parentElement) {
  // 노드가 없거나 변경된 여우
  if (!oldNode) {
    parentElement.appendChild(createRealDOM(newNode));
  } else if (!newNode) {
    parentElement.removeChild(oldNode);
  } else if (hasChanged(oldNode, newNode)) {
    parentElement.replaceChild(createRealDOM(newNode), oldNode);
  } else if (newNode.type) {
    // 자식 노드들 비교
    const oldChildren = Array.from(oldNode.childNodes);
    const newChildren = newNode.children;

    // 최대 자식 길이 계산
    const maxLength = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < maxLength; i++) {
      updateDOM(oldChildren[i], newChildren[i], oldNode);
    }
  }
}

// 노드 변경 여부 확인

function hasChanged(a, b) {
  return (
    typeof a !== typeof b ||
    (typeof a === "string" && a !== b) ||
    a.type !== b.type
  );
}
```
