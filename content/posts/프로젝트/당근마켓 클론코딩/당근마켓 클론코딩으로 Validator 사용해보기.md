---
tags:
  - project
  - carrot-market
  - validator
  - zod
createdAt: 2025-07-03 13:12:42
modifiedAt: 2025-07-03 21:22:03
publish: 프로젝트/당근마켓 클론코딩
related:
  - 당근마켓 클론코딩
  - 당근마켓 클론코딩으로 Zod 배우기
series: ""
---

# 당근마켓 클론코딩으로 Validator 사용해보기

![validator-landing](_assets/attachments/당근마켓%20클론코딩/validator-landing.png)

## Validator과 함께 사용해보기

Validator라이브러리는 간편하게 유효성 검사를 할 수 있는 프리셋 개념의 함수들을 많이 가지고 있다.

### 설치

`Validator`는 javascript모듈이기 때문에 설치시 추가로 타입 설치를 해주어야 `typescript`에서 불편함 없이 사용할 수 있다

```bash
bun add Validator
bun i -D @types/Validator
```

### 기본 사용법

사용 방식도 매우 간단하다. Validator 모듈 안의 `isMobilePhone`, `isJWT` 등등 값을 넣으면 boolean 값으로 바로 알려준다.

```typescript
import { isMobilePhone } from "Validator";

const phone = "010-1234-1234";

isMobilePhone(phone);
```

### Zod와 함께 사용하기

[[당근마켓 클론코딩으로 Zod 배우기#refine 메소드|zod의 refine 메소드]]를 활용하면 매우 간편하게 추가적인 유효성 검증을 실행할 수 있다.

```typescript
import { z } from "zod";
import validator from "validator";

const phoneSchema = z.string().trim().refine(validator.isMobilePhone);
```
