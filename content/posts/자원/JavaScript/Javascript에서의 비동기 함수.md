---
tags:
  - resource
  - javascript
createdAt: 2025-04-19 20:47:13
modifiedAt: 2025-04-19 21:35:38
publish: 자원/JavaScript
related: ""
series: ""
---

# Javascript에서의 비동기 함수

자바스크립트는 기본적으로 '단일 스레드'언어이다. 이는 한 번에 하나의 작업만 수행할 수 있다는 의미이다. 그러나 웹 애플리케이션에서는 데이터 가져오기, 파일 읽기/쓰기 등 시간이 오래 걸리는 작업이 많이 있다. 이러한 **작업을 동기적으로 처리한다면, 작업이 완료될 때까지 다른 모든 코드의 실행이 중단**된다.

비동기 프로그래밍은 이런 문제를 해결한다. 비동기 작업은 메인 실행 스레드를 차단하지 않고 백그라운드에서 실행되며, 작업이 완료되면 결과를 반환한다.

> [!caution]
> "단일 스레드" 라는것은 어디까지나 코드를 읽고 해석하고 실행시키는 작업만 해당된다. 자바스크립트 엔진은 실행 자체는 Node.js 나 브라우저에 업무를 위임하게 되는데 Node.js 나 브라우저는 멀티 스레드로 컴퓨팅하여 작업을 처리한다.

## 비동기 처리 방식의 발전

### 콜백 함수(Callbacks)

초기 자바스크립트에서는 비동기 처리를 위해 콜백 함수를 사용했다. **콜백 함수는 다른 함수에 인수로 전달되어, 그 함수 내부에서 나중에 호출**되는 함수를 의미한다. 비동기 처리에서는 특정 작업(예: 타이머 완료, 데이터 로딩 완료, 이벤트 발생)이 끝났을 때 실행될 로직을 콜백 함수 형태로 전달하는 방식으로 주로 사용된다. 비동기 작업을 시작하는 함수는 즉시 반환되고, 작업이 완료되면 미리 등록된 콜백 함수가 호출되어 결과를 처리하거나 다음 단계를 진행한다.

```js
function fetchData(callback) {
  setTimeout(() => {
    const data = "데이터가 도착했습니다";
    callback(data);
  }, 2000);
}

fetchData((data) => {
  console.log(data); // 2초 후 "데이터가 도착했습니다" 출력
});
```

#### 콜백 지옥(Callback Hell)

여러 개의 비동기 작업을 순차적으로 처리해야 할 때 콜백 함수가 계속해서 중첩되어 코드의 들여쓰기 수준이 깊어지고 가독성이 극도로 나빠지는 상황을 말한다.

콜백 지옥은 콜백 패턴의 한계를 보여주는 대표적인 예시이며 이러한 문제를 해결하기 위해 `promise`와 `async/await`같은 더 나은 비동기 처리 패턴이 등장하게 되었다.

##### 문제점

1. 가독성 저하: 코드가 오른쪽으로 계속 길어져 전체 로직을 파악하기 어렵다.
2. 에러 처리의 어려움: 각 콜백 단계마다 에러 처리를 별도로 해주어야 하며, 에러가 발생했을 때 어디서 문제가 생겼는지 추적하기 어렵다.
3. 유지보수 어려움: 코드 수정이나 기능 추가 시 복잡한 중첩 구조 때문에 실수를 유발하기 쉽다.

```js
asyncTask1(
  function (result1) {
    asyncTask2(
      result1,
      function (result2) {
        asyncTask3(
          result2,
          function (result3) {
            //... 계속 중첩...
            asyncTaskN(
              resultN_1,
              function (resultN) {
                // 최종 결과 처리
              },
              function (errorN) {
                // 에러 처리 N
              },
            );
          },
          function (error3) {
            // 에러 처리 3
          },
        );
      },
      function (error2) {
        // 에러 처리 2
      },
    );
  },
  function (error1) {
    // 에러 처리 1
  },
);
```

### 프로미스(Promise)

프로미스는 비동기 작업의 최종 완료(또는 실패)와 그 결과 값을 나타내는 **객체** 이다.

프로미스는 다음 세 가지 상태중 하나를 갖는다.

- 대기(Pending): 초기 상태, 비동기 작업이 아직 완료되지 않음
- 이행(Fullfilled): 비동기 작업이 성공적으로 완료됨. 결과 값을 가짐
- 거부(Rejected): 비동기 작업이 실패함. 실패 이유(에러)를 가짐. 프로미스는 한번 상태가 결정되면(이행 또는 거부) 더 이상 변하지 않는(settled) 특징을 갖는다.

```js
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = "데이터가 도착했습니다";
      resolve(data); // 성공 시 resolve 호출
      // 실패했다면: reject(new Error("데이터 로딩 실패"));
    }, 2000);
  });
}

fetchData()
  .then((data) => {
    console.log(data); // "데이터가 도착했습니다"
    return "다음 작업을 위한 데이터";
  })
  .then((nextData) => {
    console.log(nextData); // "다음 작업을 위한 데이터"
  })
  .catch((error) => {
    console.error(error); // 오류 처리
  });
```

#### 프로미스 체이닝(Promise Chaining)

프로미스 체이닝은 프로미스의 `.then()` 또는 `.catch()` 메서드가 항상 새로운 프로미스를 반환하는 특성을 이용하여 여러 비동기 작업을 순차적으로 연결하는 기법이다. `.then()` 핸들러는 이전 프로미스가 이행(fullfill)되면 호출되며, 그 결과 값을 받아 다음 작업을 수행하고, 또 다른 값이나 새로운 프로미스를 반환하여 체인을 이어갈 수 있다.

```js
fetch("user.json") // 1. 사용자 정보 요청 (프로미스 반환)
  .then((response) => response.json()) // 2. 응답을 JSON으로 파싱 (프로미스 반환)
  .then((user) => fetch(`https://api.github.com/users/${user.name}`)) // 3. GitHub API 요청 (프로미스 반환)
  .then((githubResponse) => githubResponse.json()) // 4. GitHub 응답 파싱 (프로미스 반환)
  .then((githubUser) => {
    // 5. 최종 결과 처리
    console.log(githubUser.name);
    return githubUser; // 다음.then으로 값을 전달할 수 있음
  })
  .catch((error) => {
    // 에러 처리
    console.error("오류 발생:", error);
  });
```

프로미스 체이닝은 비동기 코드의 흐름을 논리적이고 읽기 쉽게 만들어 콜백 지옥 문제를 해결하는 핵심적인 방법이다.

#### 프로미스 메서드

- `Promise.all()`: 여러 프로미스를 동시에 실행하고 모두 완료될 때까지 기다린다.
- `Promise.race()`: 가장 먼저 완료되는 프로미스의 결과를 반환한다.
- `Promise.allSettled()`: 모든 프로미스가 처리될 때까지 기다리고, 각 프로미스의 상태와 값을 반환한다.
- `Promise.any()`: 가장 먼저 성공적으로 완료된 프로미스의 결과를 반환한다.

### Async/Await

`async`/`await` 는 프로미스를 기반으로 동작하는 비동기 처리 문법으로, 비동기 코드를 마치 동기 코드처럼 더 읽기 쉽고 간결하게 작성할 수 있도록 도와주는 문법이다.

- `async`함수:
  함수 선언 앞에 `async` 키워드를 붙여 정의한다. `async` 함수는 항상 프로미스를 반환한다. 함수 본문에서 명시적으로 프로미스를 반환하지 않더라고, 반환 값은 자동으로 `Promise.resolve()`로 감싸져 프로미스로 반환된다.

- `await` 연산자:
  `async` 함수 내부에서만 사용할 수 있다. `await` 뒤에는 주로 프로미스가 오며, 해당 프로미스가 처리될 때까지 `async`함수의 실행을 일시 중지시킨다.. 프로미스가 이행되면 `await` 표현식은 그 결과 값을 반환하고, 프로미스가 거부되면 에러를 던진다(`throw`)

#### `async`/`await`에서의 에러 핸들링

`try...catch`문을 사용하여 처리한다.

- `try`블록 안에 `await`를 포함한 비동기 코드를 작성한다.
- 만약 `await`한 프로미스가 거부되면, 에러가 발생(throw)하고 제어 흐름은 즉시 해당 `catch`블록으로 이동한다.
- `catch`블록에서는 발생한 에러 객체를 받아 로깅, 사용자 알림, 대체 로직 수행 등 필요한 에러 처리를 수행할 수 있다.

```js
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`); // 명시적 에러 발생
    }
    const userData = await response.json();
    console.log("사용자 데이터:", userData);
    return userData;
  } catch (error) {
    console.error("사용자 데이터 로딩 중 오류 발생:", error);
    // 에러 처리 로직 (예: 기본값 반환, 에러 로깅 등)
    return null; // 또는 에러를 다시 던질 수도 있음: throw error;
  }
}

// async 함수는 항상 프로미스를 반환합니다
getUserData(123).then((result) => {
  console.log("최종 결과:", result);
});
```

#### 병렬처리를 위한 성능 향상

`async`/`await`는 코드를 간결하게 만들지만 `await`는 코드 실행을 멈추기 때문에, 서로 의존성이 없는 여러 개의 비동기 작업을 순차적으로 `await`하면 불필요하게 실행 시간이 길어질 수 있다.

```js
// 비효율적인 순차 실행
async function fetchSequential() {
  const result1 = await fetch("/api/data1"); // data1 완료 후 data2 시작
  const result2 = await fetch("/api/data2");
  //...
}

// 효율적인 병렬 실행
async function fetchParallel() {
  const [result1, result2] = await Promise.all([
    fetch("/api/data1"),
    fetch("/api/data2"),
  ]); // data1과 data2를 동시에 요청하고 모두 완료될 때까지 기다림
  //...
}
```
