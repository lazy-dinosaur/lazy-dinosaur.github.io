---
tags:
  - resource
  - javascript
createdAt: 2025-04-19 15:21:35
modifiedAt: 2025-06-15 14:38:53
publish: 자원/JavaScript
related: ""
series: ""
---

# 프로토타입(Prototype)과 프로토타입 상속

## 프로토타입

자바스크립트의 모든 객체는 자신의 **원형(Prototype)** 이 되는 다른 객체와 내부적으로 연결되어 있다. 이 연결댄 객체를 '프로토타입 객체'또는 간단히 '프로토타입'이라고 부른다. 객체는 이 프로토타입으로부터 속성(property)과 메서드(method)를 상속받을 수 있다. 객체의 프로토타입은 내부 슬롯 `[[Prototype]]`에 저장되며, 일반적으로 `Object.getPrototypeOf()`메서드나 (비표준이지만 널리 사용되는) `__proto__` 접근자 속성을 통해 접근할 수 있다.

프로토 타입과 프로토 타입 체인은 자바스크립트에서 상속과 코드 재사용을 구현하는 근본적인 메커니즘 이다.

### 프로토타입 체인(Prototype Chain)

어떤 객체의 속성이나 메서드에 접근하려고 할 때, 자바스크립트 엔진은 먼저 해당 객체 자체에서 찾는다. 만약 찾지 못하면, 내부 `[[Prototype]]`링크를 따라 프로토타입 객체로 이동하여 다시 찾는다. 이 과정을 포로토타입 객체의 포로토타입으로 계속 올라가며 반복하게 되는데, 이 연결된 프로토타입들의 연쇄를 프로토타입 체인이라고 한다. 체인의 가장 마지막에는 일반적으로 `Object.prototype`이 있으며, 이 객체의 프로토타입은 `null`이므로 여기서 탐색이 종료된다.

## 프로토타입 기반 상속은 의 동작방식

프로토타입 기반 상속은 객체가 자신의 프로토타입으로부터 속성과 메서드를 물려받는 방식으로 동작한다.

1. 속성/메서드 탐색: 객체의 특정 속성이나 메서드에 접근할 때, 엔진은 먼저 객체 자신에게 해당 속성/메서드가 있는지 확인한다.
2. 체인 탐색: 객체 자신에게 없다면, `[[Prototype]]` 링크를 따라 프로토타입 객체로 이동하여 해당 속성/메서드를 찾는다.
3. 반복: 프로토타입 객체에도 없다면, 다시 그 객체의 프로토타입으로 이동하여 찾는 과정을 프로토타입 체인을 따라 반복한다.
4. 종료: 속성/메서드를 찾으면 그 값을 반환하고 탐색을 종료한다. 체인의 끝(`null`)에 도달할 때까지 찾지 못하면 `undefined`를 반환한다.

```js
let animal = {
  eats: true,
  walk() {
    console.log("동물이 걷고 있습니다.");
  },
};

let rabbit = {
  jumps: true,
  __proto__: animal,
};
rabbit.walk(); // "동물이 걷고 있습니다." - animal 에서 상속받은 메서드
console.log(rabbit.eats); // true - animal 에서 상속받은 속성
```

### 상속 구현

#### 생성자 함수

**생성자 함수**를 사용하여 객체를 생성할 때, 생성자 함수의 `prototype` 속성이 가리키는 객체는 생성된 인스턴스들의 프로토타입이 된다. 따라서 생성자 함수의 `porototype`에 메서드를 추가하면, 모든 인스턴스는 프로토타입 체인을 통해 해당 메서드를 공유하고 사용할 수 있다. `Object.create()`메서드를 사용하면 명시적으로 특정 객체를 프로토타입으로 하는 새로운 객체를 생성하여 상속 관계를 만들 수도 있다.

```js
function Animal(name) {
  this.name = name;
}

//Animal 의 prototype 객체에 speak 메서드 추가
Animal.prototype.speak = function () {
  console.log(`${this.name} make a noise.`);
};

const dog = new Animal("Dog");
dog.speak(); // dog 객체 자체에는 speak가 없지만, 프로토타입 체인을 통해 Animal.prototype.speak을 찾아 실행

console.log(dog.__proto__ === Animal.prototype); //true
console.log(Animal.prototype.isPrototypeOf(dog)); //true
```

#### 다른 방법들

1. `__proto__`사용 (권장되지 않음)

```js
let animal = { eats: true };
let rabbit = { jumps: true };

rabbit.__proto__ = animal; // 상속 설정
```

2. `Object.create()`사용 (권장됨)

```js
let animal = { eats: true };
let rabbit = Object.create(animal); // animal을 프로토타입으로 하는 새 객체 생성
rabbit.jumps = true;
```

3. `Object.setPrototypeOf()`사용

```js
let animal = { eats: true };
let rabbit = { jumps: true };
Object.setPrototypeOf(rabbit, animal); // rabbit의 프로토타입을 animal로 설정
```

### 프로토타입 상속의 핵심 특징

1. 동적 특성: 프로토타입을 변경하면 해당 프로토타입을 상속받은 모든 객체에 영향을 미친다.
2. 메모리 효율성: 모든 인스턴스가 메서드를 복제하지 않고 프로토타입의 메서드를 참조하므로 메모리를 절약한다.
3. 속성 가리기(Property Shadowing): 객체가 프로토타입과 동일한 이름의 속성을 가지면 프로토타입의 속성을 가린다.

## 클래스와 프로토타입

ES6부터 도입된 클래스 문법도 내부적으로는 프로토타입을 사용한다.

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  walk() {
    console.log(`${this.name}이(가) 걷고 있습니다`);
  }
}

class Rabbit extends Animal {
  constructor(name, earLength) {
    super(name);
    this.earLength = earLength;
  }

  jump() {
    console.log(`${this.name}이(가) 점프합니다`);
  }
}

let rabbit = new Rabbit("흰토끼", 10);
rabbit.walk(); // "흰토끼이(가) 걷고 있습니다" - 상위 클래스에서 상속받은 메서드
rabbit.jump(); // "흰토끼이(가) 점프합니다"
```

## 주의점

1. 프로토타입 체인 깊이: 체인이 너무 깊으면 성능에 영향을 미칠 수 있다.
2. 순환 참조: 프로토타입 체인에 순환 참조가 생기지 않도록 주의해야 한다.
3. 내장 프로토타입 수정: 내장 객체(Array Object 등)의 프로토타입을 수정하는 것은 위험할 수 있다.
