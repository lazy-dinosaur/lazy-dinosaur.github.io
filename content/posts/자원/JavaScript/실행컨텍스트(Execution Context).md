---
tags:
  - resource
  - javascript
createdAt: 2025-04-19 10:37:27
modifiedAt: 2025-04-19 13:12:42
publish: 자원/JavaScript
related: ""
series: ""
---

# 실행컨텍스트(Execution Context)

실행 컨텍스트는 **Javascript 코드가 실행되는 환경**에 대한 추상적인 개념이다. **코드가실행될 때마다 자바스크립트 엔진은 해당 코드의 실행 환경을 나타내는 실행 컨텍스트를 생성하고 관리**한다. 실행 컨텍스트는 **코드가 실행되는 데 필요한 모든 정보**(변수, 함수 선언, 스코프 체인, `this`값 등)을 담고있다.

실행 컨텍스트는 자바스크립트 엔진이 코드를 어떻게 해석하고 실행하는지 이해하는 데 핵심적인 개념이다. 스코프, 호이스팅, 클로저, `this` 바인딩 등 중요한 언어적 틍징드이 모두 실행 컨텍스트의 생서 및 관리 메커니즘과 관련되어 있다.

## 종류

1. 전역 실행 컨텍스트(Global Execution Context, GEC)

   - 코드를 실행하면 가장 먼저 생성되는 컨텍스트
   - 브라우저에서는 `window`객체, Node.js에서는 `global`객체를 생성
   - 프로그램에 하나만 존재

2. 함수 실행 컨텍스트(Function Execution Context, FEC)
   - 함수가 호출될 때 생성
   - 각 함수는 자신만의 실행 컨텍스트를 가짐

- Eval 실행 컨텍스트(Eval Execution Context, EXC)
  - `eval()`함수 내에서 실행되는 코드를 위한 컨텍스트
  - 보안 문제로 잘 사용하지 않음

## 구성 요소 (논리적)

1. 변수 환경(Variable Environment)

   - 변수 선언(`var`)과 함수 산언문이 저장됨
   - 호이스팅이 일어나는 공간

2. 렉시컬 환경(Lexical Environment)

   - 변수 환경의 확장된 개념
   - `let`,`const`로 선언된 변수가 저장됨
   - 블록 스코프를 지원
   - 외부 환경에 대한 참조(Outer Environment Reference)를 포함
     변수 참조시 현제 환경에서 찾지 못하면[[스코프(Scope)란 무엇인가|스코프 체인]]이 발생함

3. `this`바인딩

   - 현재 컨텍스트에서 `this`가 가리키는 대상

## 실행 컨텍스트의 생성 및 실행 과정

1. 생성 단계(Creation Phase)

   - 변수와 함수 선언을 메모리에 저장(호이스팅)
   - `var`로 선언된 변수는 `undefined`로 초기화
   - `let`, `const`로 선언된 변수는 초기화되지 않고 TDZ(Temporal Dead Zone)에 들어감
   - `this` 바인딩이 결정됨

2. 실행 단계(Execution Phase)

   - 코드를 한줄 씩 실행
   - 변수에 실제 값 할당
   - 함수 호출시 새로운 실행 컨텍스트 생성
