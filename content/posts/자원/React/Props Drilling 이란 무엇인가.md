---
tags:
  - resource
  - react
createdAt: 2025-04-20 10:03:21
modifiedAt: 2025-04-20 23:26:54
publish: 자원/React
related: ""
series: ""
---

# Props Drilling 이란 무엇인가

Props Drilling은 React와 같은 컴포넌트 기반 프레임워크에서 발생하는 **패턴**으로,상위 컴포넌트에서 깊이 중첩된 하위 컴포넌트로 데이터(props)를 전달하기 위해 중간에 있는 여러 컴포넌트들을 통과시키는 과정을 말한다.

## 작동 방식

예를 들어 다음과 같은 컴포넌트 구조가 있다고 가정해보자

```xml
App
└── Parent
    └── Child
        └── GrandChild
            └── GreatGrandChild
```

만약 `App`컴포넌트에서 `GreatGrandChild`컴포넌트로 데이터를 전달해야 한다면, 그 데이터는 `Parent`,`Child`,`GrandChild`를 거쳐야 한다. 이때 중간에 이쓴ㄴ 컴포넌트들은 해당 데이터를 실제로 사용하지 않고 단순히 하위 컴포넌트로 전달만 하는 역할을 한다.

```jsx
jsxfunction App() {
  const data = "Hello from App";
  return <Parent data={data} />;
}

function Parent({ data }) {
  return <Child data={data} />;
}

function Child({ data }) {
  return <GrandChild data={data} />;
}

function GrandChild({ data }) {
  return <GreatGrandChild data={data} />;
}

function GreatGrandChild({ data }) {
  return <div>{data}</div>;
}
```

위 예제에서 `Parent`,`Child`,`GrandChild`컴포넌트는 `data` prop을 사용하지 않고 단순히 다음 컴포넌트로 전달만 한다. 이것이 바로 Props Drilling이다.

## 문제점

1. 코드 복잡성 증가: 중간 컴포넌트들이 불필요한 props를 관리해야 하므로 코드가 복잡해진다.
2. 유지보수 어려움: props의 변경이 필요할 때 관련된 모든 컴포넌트를수정해야한다.
3. 컴포넌트 재사용성 저하: 특정 데이터에 의존하게 되어 컴포넌트의 재사용성이 떨어진다.
4. 디버깅 어려움: 데이터 흐름을 추적하기 어려워 문제 발생 시 디버깅이 복잡해진다.

## 해결 방법

1. ContextAPI: React의 Context API를 사용하면 중간 컴포넌트를 거치지 않고 직접 데이터를 전달할 수 있다.

```jsx
const DataContext = React.createContext();

function App() {
  const data = "Hello from App";
  return (
    <DataContext.Provider value={data}>
      <Parent />
    </DataContext.Provider>
  );
}

// 중간 컴포넌트들은 데이터를 전달하지 않아도 됨
function Parent() {
  return <Child />;
}

function Child() {
  return <GrandChild />;
}

function GrandChild() {
  return <GreatGrandChild />;
}

function GreatGrandChild() {
  const data = React.useContext(DataContext);
  return <div>{data}</div>;
}
```

2. 상태 관리 라이브러리: Redux, Recoil, MobX 같은 상태 관리 라이브러리를 사용하여 전역 상태를 관리할 수 있다.

3. Composition(합성): 컴포넌트 합성을 통해 props drilling을 피할 수 있다.

```jsx
function App() {
  const data = "Hello from App";
  return (
    <Parent>
      <GreatGrandChild data={data} />
    </Parent>
  );
}

function Parent({ children }) {
  return <div>{children}</div>;
}

function GreatGrandChild({ data }) {
  return <div>{data}</div>;
}
```
