---
tags:
  - resource
  - javascript
createdAt: 2025-04-18 14:59:03
modifiedAt: 2025-04-18 15:14:42
publish: 자원/JavaScript
related: ""
series: ""
---

# null,undefined,undeclared 의 차이점은

이 세가지 상태 전부 변수가 값을가지지 않거나 존재하지 않는 상황을 나타내지만, 의미와 발생 원인이 다르다.

이 세가지 상태를 혼동하면 코드에서 예상치 못한 오류가 발생할 수 있다. 특히 API 응답이나 함수의 반환 값을 다룰 때 `null`과 `undefined`를 변확히 구분하고 처리하는 것이 중요하다.

- `undefined`
  변수가 선언되었지만 아직 값이 할당되지 않은 상태를 의미한다. 또는 함수가 명시적으로 값을 반환하지 않을 때 반환되는 값이기도 하다. `typeof undefined`는 `"undefined`이다.

- `null`
  변수에 값이 없다는 것을 의도엊긍로 명시할 때 사용된다. 즉, 개발자가가 '빈 값'또는 '값이 없음'을 나타내기 위해 할당하는 값이다. `typeof null`은 역사적인 이유로 `"object"`를 반환하지만, 실제로는 원시 타입 중 하나이다.

- `undeclared`(선언되지 않음)
  변수 자체가 아예 선언되지 않은 상태이다. 선언되지 않은 변수에 접근하려고 하면 `ReferenceError`가 발생한다.(단`typeof` 연사자는 선언되지 않은 변수에 사용해도 에러를 발생시키지 않고 `"undefined"`를 반환한다.) 비엄격 모두(non-strict mode)에서 선언 없이 값을 할당하면 예기치 않게 전역 변수가 생성될수 있으므로 피해야 한다.

## 확인 방법

- `undefined` 확인: `myVar === undefined` 또는 `typeof myVar === 'undefined'`

- `null` 확인: `myVar === null`

- `undeclared` 확인: `try...catch` 블록으로 감싸서 `ReferenceError`를 확인하건, `typeof` 사용 (단, `typeof`는 `undefined`와 구분 불가)
