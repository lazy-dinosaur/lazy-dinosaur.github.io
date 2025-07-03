---
tags:
  - project
  - carrot-market
  - study
  - zod
createdAt: 2025-06-30 21:21:49
modifiedAt: 2025-07-03 13:39:02
publish: 프로젝트/당근마켓 클론코딩
related:
  - "[[당근마켓 클론코딩]]"
series: ""
---

# 당근마켓 클론코딩으로 Zod 배우기

![zod landing](_assets/attachments/당근마켓%20클론코딩/zod-landing.png)

zod는 타입스크립트로 설정된 스키마의 유효성을 검증하는 인터페이스이다.

> [!warning] 아무것도 없이 javascript로만 유효성을 검증하려고 한다면?
>
> 검증해야하는 요소마다 if문을 만들고 조건들을 만들어주어야 하며 코드가 매우 길고 작성하기 불편햐진다.

zod를 사용하면 zod에게 데이터의 형태와 제한을 설명하고 해당 데이터를 zod에게 보내주면 zod가 내부적으로 모든 검사를 수행하고 결과를 알려준다.

## 설치

```bash
npm i zod
```

```bash
bun add zod
```

## 기본 사용법

```tsx
import { z } from "zod";

const exampleData = "abcdefge";
const exampleSchema = z.string().min(5);
exampleSchema.parse(exampleData);
```

zod 모듈을 불러 온뒤 모듈을 통해 원하는 데이터 형태를 선언하고 선언된 인터페이스에 데이터를넣어 선언된 인터페이스와 맞는지 검사하는 방식이다.
즉 사용 이전에 찰흙 처럼 전용 틀을 만들고 해당 틀에 맞는지 이후에 넣어보면서 확인하는 형태이다.

### 직접 구현해보기

`zod`의 예시 `z.string().min(5)...`와 같은 문법을 보면 **[[메서드 체이닝(Method Chaining)]]** 프로그래밍 기법을 사용한것을 알 수 있다.

#### Zod의 동작 원리

1. 스키마 객체 생성
   z.string()를 호출하면, Zod는 문자열 타입에 대한 규칙을 담을 수 있는 **새로운 스키마 객체(instance)**를 생성하여 반환한다. 이 객체는 내부에 자신이 어떤 타입인지(문자열), 그리고 어떤 검증 규칙(check)들이 추가되었는지를 저장하고 있다.

2. 스키마 객체에 규칙 추가 (메서드 체이닝)
   z.string()이 반환한 객체에 .min(5)를 호출한다.

.min(5) 메서드는 "최소 5글자 이상이어야 한다"는 검증 규칙을 스키마 객체 내부에 추가한다.

그리고 가장 중요한 부분: .min(5) 메서드는 이 규칙이 추가된 스키마 객체 자기 자신(this)을 다시 반환한다.

이 때문에 .min(5) 뒤에 .max(10), .email() 과 같은 다른 메서드를 계속해서 연결(chain)할 수 있는 것. 각 메서드는 규칙을 하나 추가하고, 자기 자신을 다시 반환하는 과정을 반복한다.

3. 최종 검증 실행
   이렇게 체이닝을 통해 만들어진 스키마 객체를 사용하여 .parse()나 .safeParse() 같은 메서드를 호출하면, Zod는 그 객체 내부에 축적된 모든 규칙(문자열 타입인지, 길이는 5 이상인지 등)을 가지고 입력된 데이터를 검증한다.

### 간단 구현

```js
class MyZodString {
  // 검증 규칙들을 저장할 배열
  constructor() {
    this.checks = [];
  }

  // '최소 길이' 규칙을 추가하는 메서드
  min(length) {
    // "길이가 length보다 커야 한다"는 규칙(함수)을 checks 배열에 추가
    this.checks.push((input) => input.length >= length);

    // ✨ 핵심: 규칙이 추가된 객체 자기 자신을 반환!
    return this;
  }

  // '최대 길이' 규칙을 추가하는 메서드
  max(length) {
    this.checks.push((input) => input.length <= length);
    // ✨ 핵심: 마찬가지로 자기 자신을 반환!
    return this;
  }

  // 최종적으로 데이터를 검증하는 메서드
  parse(input) {
    // 저장된 모든 규칙을 순회하며 데이터 검증
    for (const check of this.checks) {
      if (!check(input)) {
        throw new Error("검증 실패!");
      }
    }
    console.log("검증 성공!");
    return true;
  }
}

// Zod의 'z'와 비슷한 역할을 하는 객체
const z = {
  string: () => new MyZodString(),
};

// Zod를 사용하는 것과 동일한 방식으로 사용 가능!
const mySchema = z.string().min(5).max(10);

mySchema.parse("hello"); // 검증 성공!
mySchema.parse("hello world"); // 에러 발생 (10자 초과)
mySchema.parse("hi"); // 에러 발생 (5자 미만)
```

### ServerAction과 사용해보기

```tsx
"use server";

import { z } from "zod";

const usernameSchema = z.string().min(5).max(18);

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    conformPassword: formData.get("conformPassword"),
  };
  usernameSchema.parse(data.username);
  console.log(data);
}
```

해당 구조에 일부러 이름을 길게 적어 테스트 해보았다.

![zod test](_assets/attachments/당근마켓%20클론코딩/zod-test.png)

새로운 error을 throw 하거나 명시하지 않아도 자동적으로 에러와 메시지들이 생성된다.
할일이 매우 줄어든다.

#### zod 객체

요소마다 `z.string()`이런식으로 각각 정의하면 복잡하다 이럴땐 `object`로 묶어줄 수 있다.

```typescript
"use server";

import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(3).max(10),
  email: z.string().email(),
  password: z.string().min(10),
  confirmPassword: z.string().min(10),
});

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    conformPassword: formData.get("conformPassword"),
  };
  try {
    formSchema.parse(data);
  } catch (e) {
    console.log(e);
  }
}
```

#### safeParse 메소드

`parse` 메소드의 경우 에러가 발생하면 에러를 `throw`하기 때문에 사용하기 위해서 `try...catch`가 필수 적이다.
`safeParse`를 사용한다면 에러를 `throw`하지 않고 결과를 변수에 할당하는것이 가능 하기 때문에 코드가 더 간결해질 수 있다.

```typescript
"use server";

import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(3).max(10),
  email: z.string().email(),
  password: z.string().min(10),
  confirmPassword: z.string().min(10),
});

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    conformPassword: formData.get("conformPassword"),
  };
  const res = formSchema.safeParse(data);
  if (!res.success) {
    console.log(res.error);
  }
}
```

#### flatten 메소드

res의 결과를 `console.log`를 활용하여 확인해보면 오브젝트 안에 많은 키값을 확인할 수 있다. 불필요한 데이터도 있을 수 있고 값을 가져다 사용하기 수월하지 않다. 이때 `flatten`메소드를 활용하면 결과값이 매우 간결해진다.

- `console.log(res.error)`

  ```json
  Error [ZodError]: [
    {
      "code": "too_small",
      "minimum": 10,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "String must contain at least 10 character(s)",
      "path": [
        "password"
      ]
    },
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": [
        "confirmPassword"
      ],
      "message": "Required"
    }
  ]

  ```

- `console.log(res.error.parse)`

  ```json
  {
    "formErrors": [],
    "fieldErrors": {
      "password": ["String must contain at least 10 character(s)"],
      "confirmPassword": ["Required"]
    }
  }
  ```

#### custom message

유효성 검사 실패시 메시지를 커스텀화 하는것도 가능하다. 예를 들자면 한국서비스를 위해 한국어로 바꿔야 하는데 기본적인것들로만 이루어져 있다면 불필요하게 코드를 더 작성해야 할 수 있다.

zod 의 유효성 겁사 조건 메소드들의 타입을 보면 조건 뒤에 `message` 값이 들어갈 수 있는것을 확인할 수 있다.
헤당 메시지들은 조건에 부합하지 않을때 보여질 메시지로 사용된다.

```typescript
z.string({
  invalid_type_error: "문자열이어야함",
  required_error: "왜 아무것도 안넣음?",
})
  .min(3, "너무 짧아!")
  .max(10, "너무 길어!");
```

#### refine 메소드

유효성 검사의 조건을 만들어 낼 수 있는 메소드이다.

```typescript
const check = (arg) => {
  if (!arg) {
    return false;
  }
};

z.string().refine(check, message);
```

`refine`메소드는 `check`함수와 에러 메시지를 변수로 받고 `check` 함수는 zod가 유효성 검사로 넘겨 받는 값을 변수로 받는다.

이 `refine`은 유저 이름에 특정 단어를 사용하지 못하게 하거나 비밀번호와 비밀번호 확인이 서로 일치하는지 등 여러가지로 사용될 수 있다.

- 특정 단어 금지

  ```typescript
  const formSchema = z.object({
    username: z
      .string()
      .min(3)
      .max(10)
      .refine(
        (username) => (username.includes("potato") ? false : true),
        "potato는 이름으로 사용할 수 없음",
      ),
    email: z.string().email(),
    password: z.string().min(10),
    confirmPassword: z.string().min(10),
  });
  ```

- `z.object({})` 안의 `password`와 `confirmPassword`의 일치 비교

  ```typescript
  const formSchema = z
    .object({
      username: z.string().min(3).max(10),
      email: z.string().email(),
      password: z.string().min(10),
      confirmPassword: z.string().min(10),
    })
    .refine(
      (form) => form.password == form.conformPassword,
      "비밀번호가 일치하지 않음",
    );
  ```

##### refine 메소드의 에러 표시

앞선 예시처럼 formSchema자체에 `refine`메소드를 사용할 경우 에러가 발생하면 에러 오브젝트의 `formErrors`라는 키의 리스트에 추가되어 나오게 된다.

```json
{
  formErrors: ["비밀번호가 일치하지 않음"]
  fieldErrors:{...다른 필드 에러}
}
```

이때 message를 텍스트가 아닌 오브젝트로 넘겨주면서 `path`라는 키값에 특정 필드이름을 명시해 주면 해당 에러가 발생할때 해당 필드에 추가되어 결과가 나타난다

```typescript
const formSchema = z
  .object({
    username: z.string().min(3).max(10),
    email: z.string().email(),
    password: z.string().min(10),
    confirmPassword: z.string().min(10),
  })
  .refine((form) => form.password == form.conformPassword, {
    message: "비밀번호가 일치하지 않음",
    path: ["confirmPassword"], // 특정 필드에 에러 전가
  });
```

#### regex 검증

regex를 활용해 검증할수도 있다.

```typescript
const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[$?!@$%^&*-]).+$/,
);

const formSchema = z.object({
  username: z.string().min(3).max(10),
  email: z.string().email(),
  password: z
    .string()
    .min(10)
    .regex(
      passwordRegex,
      "비밀번호는 소문자, 대문자, 숫자, 특수문자를 포함해야한다.",
    ),
  confirmPassword: z.string().min(10),
});
```

#### 데이터 변환

입력받은 데이터를 검증하는 기능 외에도 변환하는 기능도 존재한다.

```typescript
const formSchema = z.object({
  username: z.string().min(3).max(10).trim().toLowerCase(),
  email: z.string().email(),
  password: z.string().min(10),
  confirmPassword: z.string().min(10),
});
```

- `toLowerCase`메소드: 입력받은 데이터를 소문자로 변환
- `trim`메소드: 입력받은 데이터의 시작과 끝의 빈 문자열을 삭제해줌

##### transform 메소드

refine과 마찬가지로 함수를 변수로받아 유효성 검사 뒤에 데이터를 변환한다.

```typescript
const formSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(10)
    .trim()
    .toLowerCase()
    .transform((username) => `안녕 ${username}`),
  email: z.string().email(),
  password: z.string().min(10),
  confirmPassword: z.string().min(10),
});
```

#### coerce 메소드

토큰이나 번호를 넘겨받다 보면 데이터가 숫자인 경오도 혹은 숫자가 문자열 형태로 받아지기도 한다. 특히 ServerAction을 사용하여 숫자들을 넘겨받게 된다면 html에서 타입을 숫자로 지정하더라도 문자열 형태로 받게 된다. 이때 zod 의 coerce가 유용하게 사용된다.

![zod-coerce](_assets/attachments/당근마켓%20클론코딩/zod-coerce.png)

`z.coerce`의 타입을 확인하면 뒤에 몇가지 타입을 지정할수 있는것을 확인할 수 있다.
이 타입들의 역할은 입력받은 데이터를 먼저 해당 타입으로 변환을 시도하는 것을 한다.

```typescript
z.coerce.number().parse("1234");
```

##### 토큰 유효성 검사 예시

```typescript

```

## 참고

- [[당근마켓 클론코딩으로 Validator 사용해보기]]
