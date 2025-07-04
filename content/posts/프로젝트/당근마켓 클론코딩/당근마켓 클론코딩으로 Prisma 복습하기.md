---
tags:
  - project
  - carrot-market
  - prisma
  - study
createdAt: 2025-07-04 14:44:19
modifiedAt: 2025-07-04 17:18:05
publish: 프로젝트/당근마켓 클론코딩
related:
  - "[[당근마켓 클론코딩]]"
series: ""
---

# 당근마켓 클론코딩으로 Prisma 복습하기

> [!question] ORM 이란?
>
> Object Relatonal Mapping의 약자로 객체 지향 프로그래밍의 객체와 관계형 데이터베이스의 테이블을 매핑하여 개발자가 데이터베이스를 객체처럼 다룰 수 있게 해주는 기술이다.
>
> 쉽게 설명하면 데이터베이스의 테이블을 객체 처럼 다룰 수 있도록 통역해주는 통역사 역할을 한다.
>
> ORM을 사용하면 자동적으로 타입을 알 수 있기에 개발경험이 매우 향상된다.
> Prisma 혹은 Drizzle같은 ORM을 한번 사용하고나면 해어나올 수 없다.

Prisma를 사용하기 위해선 먼저 DB가 어떻게 생겼는지 Prisma가 알 수 있도록 Schema를 작성해야 한다.
이 Schema는 Prisma의 전용 언어에 따라 작성 되어야 한다.

Prisma는 여러가지 DB들과 연동이 가능하지만 해당 학습 프로그램에서는 로컬 DB인 sqlite를 사용하여 설정한다.

## 시작하기

```bash
bun add prisma
bunx prisma init
```

위의 명령어를 통해 Prisma를 설치하면 `prisma/schema.prisma`과 기본 db url 설정을 담은 `.env` 파일이 생성된다.

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
  output   = "../lib/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

해당 파일을 살펴보면 기본적으로 `postgresql`을 사용하도록 설정되어 있으며 해당 부분을 프로젝트에 맞게 `sqlite`로 바꿔주어야 한다.

```prisma

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

```

`env(DATABASE_URL)`의 경우 새로 생성된 `.env`파일 안에 설정되어 있다.

```env
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=eyJkYXRhYmFzZVVybCI6InBvc3RncmVzOi8vcG9zdGdyZXM6cG9zdGdyZXNAbG9jYWxob3N0OjUxMjE0L3RlbXBsYXRlMT9zc2xtb2RlPWRpc2FibGUmY29ubmVjdGlvbl9saW1pdD0xJmNvbm5lY3RfdGltZW91dD0wJm1heF9pZGxlX2Nvbm5lY3Rpb25fbGlmZXRpbWU9MCZwb29sX3RpbWVvdXQ9MCZzaW5nbGVfdXNlX2Nvbm5lY3Rpb25zPXRydWUmc29ja2V0X3RpbWVvdXQ9MCIsIm5hbWUiOiJkZWZhdWx0Iiwic2hhZG93RGF0YWJhc2VVcmwiOiJwb3N0Z3JlczovL3Bvc3RncmVzOnBvc3RncmVzQGxvY2FsaG9zdDo1MTIxNS90ZW1wbGF0ZTE_c3NsbW9kZT1kaXNhYmxlJmNvbm5lY3Rpb25fbGltaXQ9MSZjb25uZWN0X3RpbWVvdXQ9MCZtYXhfaWRsZV9jb25uZWN0aW9uX2xpZmV0aW1lPTAmcG9vbF90aW1lb3V0PTAmc2luZ2xlX3VzZV9jb25uZWN0aW9ucz10cnVlJnNvY2tldF90aW1lb3V0PTAifQ"
```

기본적으로 설정되는 env는 `postgresql`을 위한 주소이므로 사용할 필요가 없다 해당 값을 로컬에서 사용 가능한 `sqlite`로 변경하기 위해 다음과 같이 바꾸자

```env

DATABASE_URL="file:./database.db"
```

![공급자 리스트](_assets/attachments/당근마켓%20클론코딩/prisma-schema-config-provider-lists.png)

다른 `provider`의 경우 `db > provider`값 부분의 `type`을 lsp를 통해 확인해 보면 `cockroachdb`,`mongodb`등 다른 친숙한 db들도 연결 가능한것을 확인할 수 있다.

## Schema 만들어보기

```prisma
model User {
  id        Int     @id @default(autoincrement())
  username  String  @unique
  email     String? @unique
  password  String?
  phone     String? @unique
  github_id String? @unique
  avatar    String?
}
```

`Scheme.prisma` 파일 안에 모델을 정의하며 db의 형태를 만들어갈 수 있다.

### 필드의 형태

각 필드는 필드의 이름, 데이터 타입, 조건들 의 조합으로 이루어 진다.
