---
tags:
  - project
  - goedamjip
  - prisma
createdAt: 2025-07-08 08:24:57
modifiedAt: 2025-07-08 14:14:37
publish: 프로젝트/괴담집
related:
  - "[[괴담집]]"
  - "[[괴담집 프로젝트에 Prisma와 Supabase 설정하기]]"
series: ""
---

# 괴담집 프로젝트에서 Prisma 사용하기

![prisma-landing](_assets/attachments/괴담집/prisma-landing.png)

prisma는 Server Side에서 사용되아 하며 현제 프로젝트에서는 api호출을 통한 사용방법과 Server client를 활용한 방법 두가지가 존재한다.

## Prisma의 기본 사용 예시

```tsx
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getAmbienceAssets() {
  const assets = await prisma.assets.findMany({
    where: {
      category_name: ASSET_CATEGORIES.AMBIENCE,
      tag_name: {
        in: ["CREEPY_DRONE", "EMPTY_HALLWAY_ECHO", "TENSION_MUSIC"],
      },
    },
  });
  return assets;
}
```

PrismaClient를 선언하여 인스턴스를 생성하고 해당 인스턴스를 변수에 담아 사용하게 된다.
앞서 정의한 `schema`와 `bunx prisma generate`을 통해 생성된 타입이 자동적으로 적용되어 개발하기 편하다.

## 싱글톤 패턴 사용하기

prisma를 사용할 때마다 인스턴스를 생성하게 되면 불필요한 리소스를 낭비하게되고 데이터베이스에 연결할 수 있는 연결 한계도 초과할수 있다.
따라서 싱글톤 패턴을 활용하여 하나의 인스턴스만 사용해야 한다.

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

`lib > prisma.ts` 파일을 생성하고 위의 내용을 작성하여 싱글톤 패턴을 사용하였다.

이제 해당 파일에서 정의된 프리스마를 가져와 사용하면 된다.
