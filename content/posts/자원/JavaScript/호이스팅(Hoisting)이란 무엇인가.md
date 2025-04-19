---
tags:
  - resource
  - javascript
createdAt: 2025-04-17 14:08:12
modifiedAt: 2025-04-19 17:42:08
publish: 자원/JavaScript
related: ""
series: ""
---

# 호이스팅(Hoisting)이란 무엇인가

호이스팅은 자바스크립트 엔진이 코드를 실행하기 전에 변수, 함수, 클래스의 **선언** 부분을 해당 스코프의 최상단으로 끌어올리는 것처럼 동작하는 현상을 말한다.

엔진이 코드를 해석할 때 선언부를 먼저 처리하기 때문에 마치 끌어올려진 것처럼 보인다.

## `var`,`let`,`const`의 호이스팅의 차이

- `var`
  변수 선언(`var myVar;`)이 스코프 최상단으로 끌어올려지고, 동시에 `undefined`로 **초기화**된다. 따라서 선언문 이전에 변수에 접근해도 에러가 발생하지 않고 `undefined` 값을 가진다.

  ```js
  //`var` 의 경우 선언 전에 호출하게 되면 `undefined`로 에러가 나지 않는다.

  console.log(myVar); //undefined (var은 호이스팅되고 undefined로 초기화된다)
  var myVar = 5;
  ```

- `let`,`const`
  변수 선언이 스코프 최상단으로 끌어올려지지만, **초기화 되지는 않는다.** 선언문 이전에 해당 변수에 접근하려고 하면 초기화되기 전까지 접근할 수 없다는 `referenceError`가 발생한다. 이 구간을 **시간적 사각지대(Temporal Dead One, TDZ)**라고 한다.

  ```js
  //`let`과 `const`의 경우 선언 전에 호출하게 되면 `ReferenceError`가 발생한다.

  console.log(myLet); // ReferenceError: Cannot access 'myLet' before initialization (TDZ)
  let myLet = 5;
  ```

- 함수 선언식
  함수 선언식(`function myFunction(){}`)은 함수 전체가 호이스팅되어 선언 전에 호출할 수 있다. 함수 표현식(`function myFunction(){}`)은 변수 호이스팅 규칙(여기서는 `const`)을 따른다.

  ```js
  //함수 선언식은 선언 전에 호출을 해도 정상적으로 작동 한다. 선언은 전체 호이스팅 되기 때문이다.

  myFunction(); // "Hello" (함수 선언식은 호이스팅됨)
  function myFunction() {
    console.log("Hello");
  }
  ```

> [!tip]
>
> - [[var,let,const의 주요 차이점은 무엇인가]]

호이스팅은 특히`var`을 사용할 때 코드의 실행 순서와 변수 값 예측을 어렵게 만들 수 있다.`let`과 `const`의 도입 및 TDZ는 이러한 혼란을 줄이고 더 예측 가능한 코드를 작성하는 데 도움을 준다.

## 관련 정보

- [[변수의 선언,초기화,할당의 차이점은 무엇인가]]
