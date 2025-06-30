---
tags:
  - project
  - carrot-market
  - study
createdAt: 2025-06-30 08:48:51
modifiedAt: 2025-06-30 21:24:49
publish: 프로젝트/당근마켓 클론코딩
related:
  - "[[당근마켓 클론코딩]]"
series: ""
---

# 당근마켓 클론코딩으로 기본적인 Next.js 복습하기

## 앱 라우터 기본 구조

Next.js는 폴더구조를 총해 라우트 경로를 정의한다.
`app`폴더 내에 원하는 경로 이름으로 폴더를 생성하고 해당 폴더 안에 `page.tsx`파일을 만들고 정의하면 된다.

```bash
my-next-app/
├── app/
│   ├── layout.tsx       # 공통 레이아웃
│   ├── page.tsx         # 메인 페이지
│   ├── globals.css      # 전역 CSS
│   └── ...              # 추가 라우트 및 컴포넌트
├── public/
│   ├── favicon.ico      # 파비콘
│   └── vercel.svg       # 이미지 등 정적 파일
├── node_modules/        # 설치된 패키지
├── .next/               # 빌드 결과물
├── .gitignore           # Git 추적 제외 파일 목록
├── next.config.mjs      # Next.js 설정 파일
├── package.json         # 프로젝트 정보 및 의존성 관리
└── tsconfig.json        # 타입스크립트 설정 파일
```

- `app/`: 애플리케이션의 모든 라우트, 컴포넌트, 로직이 위치하는 핵심 디렉토리.

  - `layout.tsx`: 모든 페이지에 공통으로 적용되는 최상위 레이아웃. `<html>`, `<body>` 태그를 포함.
  - `page.tsx`: 특정 경로의 UI를 정의하는 기본 페이지 파일. app/page.tsx는 루트 경로(/)에 해당.
  - `loading.tsx`: 해당 경로의 콘텐츠가 로드되는 동안 보여줄 로딩 UI.
  - `error.tsx`: 해당 경로에서 에러가 발생했을 때 보여줄 에러 UI.
  - `route.ts`: 서버 사이드 API 엔드포인트 (API Routes)를 생성할 때 사용.

- `public/`: 이미지, 폰트 등 정적(Static) 파일들을 저장하는 공간. 이곳의 파일들은 웹사이트의 루트 경로(/)를 통해 직접 접근할 수 있다.

- `next.config.mjs`: Next.js의 고급 설정을 변경할 때 사용하는 파일. 예를 들어, 이미지 최적화 설정, 환경 변수 추가, 리다이렉트 설정 등을 할 수 있다.

`package.json`: 프로젝트의 이름, 버전과 같은 정보와 함께 react, next 등 프로젝트가 사용하는 라이브러리(의존성) 목록을 관리.

### 페이지

`page.tsx` 파일 안에 리엑트 함수 형식으로 정의하면 `page.tsx`가 존재하는 파일 구조에 대한 라우팅이 자동으로 설정된다.
중요한 점은 `export default` 처리를 해주어야 한다는 것이다.

```tsx
export default function Home() {
  return <div>메인 페이지</div>;
}
```

```tsx
const Home = () => {
  return <div>메인 페이지</div>;
};
export default Home;
```

### 레이아웃

Next.js에서 `layout.tsx` 파일은 여러 페이지에 걸쳐 공통된 UI를 정의하는 역할을 한다. 이름 그대로 웹사이트의 '뼈대'나 '틀'을 만드는 파일이라고 생각하면 쉽다.

app 디렉토리 안에 layout.tsx를 만들면 그 안에 포함된 모든 페이지(하위 폴더 포함)에 해당 레이아웃이 자동으로 적용됩니다.

## API Route Handler

- Next.js의 서버 라우트를 활용하기 위해서는 원하는 주소 안에 `route.ts` 파일을 만들고 정의해주면 된다.
- 대체로 `api/`폴더를 만들고 그 안에 원하는 경로 대로 폴더를 만든 이후 `route.ts`파일을 생성한다.
- Express.js와 유사하게 요청(request)과 응답(response) 객체를 다루며, 다양한 HTTP 메서드(GET, POST, PUT, DELETE 등)를 자유롭게 처리할 수 있다.

```tsx
import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json({ message: "Hello, World!" });
}
```

## ServerAction

- React18에 도입된 기능으로 클라이언트 컴포넌트나 서버 겈모넌트 내에서 서버 코드를 직접 시행할 수 있게 해준다.
- 함수에 `'use server'`지시어를 추가하여 정의하며, 주로 폼(form) 제출이나 데이터 변경(mutaion) 작업에 사용된다.

```tsx
export default function MyComponent() {
  async function createInvoice(formData) {
    "use server";

    const rawFormData = {
      customerId: formData.get("customerId"),
      amount: formData.get("amount"),
      status: formData.get("status"),
    };

    // 데이터베이스에 데이터 저장 로직
    // ...

    revalidatePath("/dashboard/invoices"); // 관련 페이지 캐시 갱신
  }

  return (
    <form action={createInvoice}>
      {/* 폼 입력 필드들 */}
      <button type="submit">Create Invoice</button>
    </form>
  );
}
```

- ServerAction은 Server component 안에서만 정의되고 사용될 수 있다. 따라서 client component를 사용할 때에는 다른 파일로 빼서 주입시켜 주어야 한다.

### 주요 특징

- 컴포넌트와 결합된 로직: UI와 관련된 서버 로직(예: 폼 데이터 처리, 데이터베이스 업데이트)을 해당 컴포넌트 파일 내에 함께 작성하여 개발 경험을 간소화한다.

- 별도의 API 엔드포인트 불필요: API 라우트를 따로 만들 필요 없이 함수 호출만으로 서버 로직을 실행할 수 있다.

- 데이터 변경에 최적화: revalidatePath, revalidateTag와 같은 기능을 통해 데이터 변경 후 관련된 페이지나 데이터 캐시를 손쉽게 갱신할 수 있다.

- 보안: 내장된 CSRF 보호 기능을 제공한다. 기본적으로 POST 요청으로 처리된다.

### useFormStatus hook

React에서 기본적으로 제공하는 훅 중에 `useFormStatus`라는 훅이 존재한다.
ServerAction 자체가 formData를 전송하는것에 주로 사용되다 보니 궁합이 잘맞는 훅이다.
client component 에서 사용이 가능하며 form 태그 안에 존재해야 한다.(해당 hook은 부모 컴포넌트들을 찾아보고 가장 가까운 form을 찾는다.)

> [!info]
>
> `'use client'`는 컴포넌트가 동적이어야 할때 작성해 주어야 한다.
> `'use client'`를 사용하면 `inline server action`을 사용할 수 없다.

해당 훅은 다음과 같은 상태를 알려준다.

- action: 현제 실행중인 서버액션 함수
- pending: 실행중인지 여부
- method: http메소드
- data: 제출된 formData

```tsx
"use client";

import { useFormStatus } from "react-dom";

export default function FormBtn({ text }: FormBtnProps) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="primary-btn
      h-10
      disabled:bg-neutral-500
      disabled:text-neutral-300
      disabled:cursor-not-allowed
      "
    >
      {pending ? "로딩 중..." : text}
    </button>
  );
}
```

### useFormState hook

결과를 ui로 전달하는 역할
서버액션의 결과 특히 오류 등을 가져올 수 있는 역할을 한다.

useFormState 훅은 인자로 action함수와 초기값을 받으며 클라이언트 컴포넌트에서 사용 가능하다.

ServerAction 의 경우 서버 컴포넌트에서 사용 가능하기 때문에 다른 파일로 따로 분리한 이후 불러와 사용해야 한다.

```tsx
"use client";
import FormBtn from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { handleForm } from "./actions";

export default function Login() {
  const [state, action] = useFormState(handleForm, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={[]}
        />

        <FormBtn text="Log In" />
      </form>
      <SocialLogin />
    </div>
  );
}
```

## API Route Handler vs ServerAction
