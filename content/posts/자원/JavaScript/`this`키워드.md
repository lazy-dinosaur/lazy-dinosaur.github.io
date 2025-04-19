---
tags:
  - resource
  - javascript
createdAt: 2025-04-19 13:24:41
modifiedAt: 2025-04-19 15:21:13
publish: 자원/JavaScript
related: ""
series: ""
---

# `this`키워드

`this`는 함수가 호출될 때 해당 함수가 속한 [[실행컨텍스트(Execution Context)]]를 가리키는 특별한 키워드 이다.

중요한 점은 `this`의 값은 함수가 어디서 선언되었는지가 아니라, 어떻게 호출되었는지에 따라 동적으로 결정된다는 것이다. 이는 렉시컬 스코프(선언 위치에 따라 결정)와 대조되는 특징이다.

`this`는 자바스크립트에서 가장 혼란스러운 개념 중 하나이며, 객체 지향 프로그래밍과 이벤트 처리 등에서 중요한 역할을 한다.

`this` 키워드를 둘러싼 혼란은 주로 그것의 동적인 성격과 렉시컬 스코프 규칙과의 차이에서 비롯된다. 변수나 함수의 스코프는 코드가 작성된 위치(렉시컬 구조)에 따라 정적으로 결정되지만, 일반 함수의 `this`는 함수가 어떻게 호출되었는지(동적 컨텍스트)에 따라 달라진다. 이 불일치 때문에 특히 콜백 함수나 중첩 함수 내에서 `this`가 예기치 않게 전역 객체나 `undefined`를 가리키는 문제가 자주 발행했다.

과거에는 이를 해결하기 위해 `var self = this;` 트릭이나 `.bind(this)` 메서드를 사용해야 했다. 화살표 함수는 이러한 문제를 해결하기 위한 방안 중 하나로 도입되었다.

화살표 함수는 자체`this`바인딩을 갖지 않고, 대신 변수처럼 렉시컬 스코프 규칙을 따라 상위 스코프의 `this`를 그대로 물려받는다. 이 덕분에 중첩된 컨텍스트에서도 `this`의 동작이 더 예측 가능해지고, 콜백 함수 등에서 `this`관련 코드가 훨씬 간결해졌다. 따라서 화살표 함수가 `this`를 다르게 처리하는 이우(렉시컬 상속)와 해결하는 문제(동적 `this`의 혼란)를 이해하는 것은 단순히 문법적 차이를 아는것 이상으로 중요하다.

## 함수 호출 방식에 따른`this` 바인딩 규칙

1. 일반 함수 호출(Function invocation): 함수가 단독으로 호출될 때(`myFunction()`).

   - 비엄격 모드(Non-strict mode): `this`는 전역 객체 (`window`또는 `global`)를 가리킨다.
   - 엄격 모드(Strict mode): `this`는 `undefined`를 가리킨다. 이는 실수로 전역 객체를 오염시키는 것을 방지한다.

2. 메서드 호출(Method Invocation): 함수가 객체의 속성으로서 호출될 때(`object.myMethod()`).

   - `this`는 해당 메서드를 호출한 객체(점`.` 앞의 객체)를 가리킨다.

3. 생성자 함수 호출(Constructor Invocation):`new` 키워드를 사용하여 함수(생성자)를 호출할 때 (`new MyConstructor()`).

   - `this`는 새로 생성되는 인스턴스 객체를 가리킨다.

4. `call()`,`apply()`,`bind()` 메서드를 이용한 간접 호출 (Indirect Invocation): 이 메서드들은 함수를 호출하면서 `this`값을 명시적으로 지정할 수 있게 해준다.

   - `func.call(thisArg,arg1,arg2,...)`: 함수를 호출하며, 첫 번째 인자로 전달된 `thisArg`가 함수 내부의 `this`가 된다. 나머지 인자들은 함수의 매개변수로 순서대로 전달된다.

   ```js
   function introduce(greeting) {
     console.log(`${greeting}, 저는 ${this.name}입니다.`);
   }
   const person = { name: "다니엘라" };
   introduce.call(person, "안녕하세요"); // "안녕하세요, 저는 다니엘라입니다."
   ```

   - `func.apply(thisArg, [arg1,arg2,...])`: `call`과 유사하지만, 함수의 매개 변수들을 배열 형태로 전달한다.

   ```js
   function introduce(greeting, punctuation) {
     console.log(`${greeting}, 저는 ${this.name}입니다${punctuation}`);
   }
   const person = { name: "다니엘라" };
   introduce.apply(person, ["안녕하세요", "!"]); // "안녕하세요, 저는 다니엘라입니다!"
   ```

   - `func.bind(thisArg)`: 함수를 즉시 호출하지 않고, `this`값이 `thisArg`로 영구히 바인딩된 새로운 함수를 반환한다. 반환된 함수는 나중에 호출해도 `this`값이 고정된다.

   ```js
   function introduce() {
     console.log(`안녕하세요, 저는 ${this.name}입니다`);
   }
   const person = { name: "다니엘라" };
   const boundFunction = introduce.bind(person);
   boundFunction(); // "안녕하세요, 저는 다니엘라입니다"
   ```

## 화살표 함수의 `this` 는 일반 함수와 어떻게 다른가

화살표 함수는 자신만의 `this`를 가지지 않는다. 대신, 화살표 함수 내부의 `this`는 함수가 선언될 당시읠 외부(상위) 스코프의 `this` 값을 그대로 상속받아 사용한다(렉시컬`this`). 즉,함수가 어디서 정의되었는지에 따라 `this`가 결정된다.

이는 `call`,`apply`,`bind`메서드를 사용하여 화살표 함수의 `this` 값을 변경할 수 없음을 의미한다.
