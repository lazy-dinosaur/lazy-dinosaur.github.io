---
tags:
  - project
  - goedamjip
createdAt: 2025-07-06 12:55:16
modifiedAt: 2025-07-07 16:36:36
publish: 프로젝트/괴담집
related:
  - "[[괴담집]]"
series: ""
---

# 괴담집 프로젝트에 Prisma와 Supabase 설정하기

```bash
bun add prisma
bunx prisma init
```

먼저 Prisma를 설치하고 실행한다. 이후 생성된 `.env`파일과 `prisma/schema.prisma` 파일의 내용을 수정해주면 연결이 완료 된다.

## .env와 schema.prisma 파일 수정

![prisma supabase 설정](_assets/attachments/괴담집/prisma-supabase-setting.png)

supabase의 `dashboard > 상단의 connect > ORMs`를 클릭하면 Prisma에 필요한 설정을 확인할 수 있으며 매우 간편하게 `.env`와 `schema.prisma` 파일의 설정을 그냥 복사 붙혀넣기하면 된다.

## Prisma와 Strapi간의 호환성 문제

호기롭게 `bunx prisma db pull`을 입력하니 에러들이 발생 제대로 호환되지 않는것으로 보인다.

보니까 이름들만 수정하면 임시적으로 해결이 될것같아 `claude code`를 통해 파일을 수정하였고 에러는 사라졌다. 하지만 이제 발생될 문제들에 대한 고민들이 생긴다.

### Migration 문제에 대한 생각

이름이 충돌이 난다는 이야기는 일시적으로 수정을 하더라도 prisma를 통해 schema를 정의하여 Migration할때 충돌이 날 수 있다는 것이다.
충돌이 나면 테이블이 새로써지는 경우가 있을 수 있기 때문에 db가 사라질수도 있다.

### 해결방안

Strapi와 Prisma의 역활을 완전히 분리하여 충돌이 없도록 하는것이 좋을것이라고 생각된다.
Strapi는 웹사이트에 필요한 자원들만을 관리하는 역할을 하기 때문에 Strai에서 저장된 내용들은 Prisma를 통해 수정될 경우가 없다.

#### sql view 사용하기

Claude는 SQL의 View를 활용하여 Strapi로 관리되는 테이블중 필요한 객체만 조회할 수 있도록 설정하는것을 추천했다.
이때 `Supabase-mcp`가 아주 큰 도움이 되었다. 실제로 mcp를 통해 설정된 테이블들의 형태와 관계를 파악하고 내가 원하는 형태의 데이터로 가공해서 가져올 수 있도록 하였다.

##### SQL 문을통해 View 생성하기

![sql view 생성](_assets/attachments/괴담집/sql-view-create.png)
Claude의 도움을 받아 필요한 객체의 형태를 가져올 수 있도록 View를 생성할 수 있는 SQL 문을 만들었고 해당 문을 Supabase의 SQL Editor에 붙혀넣고 실행하여 View를 생성하였다.

- 에셋을 가져오기 위한 SQL 문

  ```sql
  CREATE VIEW nextjs_stories AS
  SELECT
    s.id,
    s.document_id,
    s.title,
    s.author,
    s.story_summary,
    s.tags,
    s.converted_json,
    s.created_at
  FROM stories s;
  ```

- 컨버팅된 이야기를 가져오기 위한 SQL 문

  ```sql
  CREATE VIEW nextjs_assets AS
  SELECT
    a.id,
    a.document_id,
    a.tag_name,
    a.display_name,
    a.description,
    a.usage_guide,
    a.keywords,
    a.implementation_type,
    a.is_active,
    a.sustain,
    ac.name as category_name,
    ac.id as category_id,
    ac.description as category_description,
    sub.name as subcategory_name,
    sub.id as subcategory_id,
    sub.description as subcategory_description,
    f.name as file_name,
    f.url as file_url,
    f.mime as file_mime,
    f.size as file_size,
    f.id as file_id
  FROM assets a
  LEFT JOIN assets_category_lnk acl ON a.id =
  acl.asset_id
  LEFT JOIN asset_categories ac ON
  acl.asset_category_id = ac.id
  LEFT JOIN assets_subcategory_lnk ascl ON a.id =
  ascl.asset_id
  LEFT JOIN asset_subcategories sub ON
  ascl.asset_subcategory_id = sub.id
  LEFT JOIN files_related_mph frm ON a.id =
  frm.related_id AND frm.related_type =
  'api::asset.asset'
  LEFT JOIN files f ON frm.file_id = f.id
  WHERE a.is_active = true;
  ```

##### Prisma에 View 적용하기

```prisma
generator client {
  provider        = "prisma-client-js"
previewFeatures = ["views"]
}
```

먼저 view를 사용하기 위해 client 설정 부분에 `previewFeatures`를 통해 `views`를 추가해야 한다.

그리고 `schema.prisma` 파일에 `supabase-mcp`를 통해 view의 내용에 맞게 prisma에서 읽어올 수 있는 view를 정의했다.

```prisma
// ===== Strapi Views (읽기 전용) =====
// 이것들은 데이터베이스 뷰입니다. CREATE/UPDATE/DELETE 불가능

view NextjsStories {
  id             Int       @id
  document_id    String?   @db.VarChar(255)
  title          String?   @db.VarChar(255)
  author         String?   @db.VarChar(255)
  story_summary  String?
  tags           String?
  converted_json Json?     @db.Json
  created_at     DateTime? @db.Timestamp(6)

  @@map("nextjs_stories")
}

view NextjsAssets {
  id                      Int      @id
  document_id             String?  @db.VarChar(255)
  tag_name                String?  @db.VarChar(255)
  display_name            String?  @db.VarChar(255)
  description             String?
  usage_guide             String?
  keywords                String?
  implementation_type     String?  @db.VarChar(255)
  is_active               Boolean?
  sustain                 Boolean?
  category_name           String?  @db.VarChar(255)
  category_id             Int?
  category_description    String?
  subcategory_name        String?  @db.VarChar(255)
  subcategory_id          Int?
  subcategory_description String?
  file_name               String?  @db.VarChar(255)
  file_url                String?
  file_mime               String?  @db.VarChar(255)
  file_size               Float?
  file_id                 Int?

  @@map("nextjs_assets")
}
```

view를 사용하기 위해서는 `view` 라는 이름으로 객체를 정의해 주어야 하고 `supabase`에서 생성했던 `view`의 이름에 맞춰 `@@map("뷰 이름")`을 작성해 주어야 한다.

#### Prisma multischema 사용하기

Strapi와 nextjs에서 사용될 DB를 서로 분리하는것이 안전하고 Prisma를 사용하기 위해서도 분리가 필요하였다. ai의 생성 프로세스와 strapi를 통한 구축은 이미 완료가 되어 있는 상황이라 supabase가 실제로 사용되고 있는 중이었고 이때문에 `prisma migrate dev`명령어를 통해 모델을 변경하고자 할때 충돌이나 에러가 생겼다.

따라서 기본적으로 `strapi`가 사용하고 있는 `public` 스키마 이외에 `app`이라는 스키마를 만들고 해당 스키마 내부에서 웹앱을 위한 데이터를 정의하고 개발해 나가기로 하였다.

![supabase create new schema](_assets/attachments/괴담집/supabase-new-schema.png)

Supabase에서 `Dashboard > schema` 를 클릭하면 리스트 아래 새로운 스키마를 생성할 수 있는 버튼이 있다. 해당 버튼을 클릭하고 Nextjs에서 관리할 `app`이라는 새로운 스키마를 만들어 준다.

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["views", "multiSchema"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
  schemas   = ["app", "public"]
}
```

`multischema`를 사용하기 위해선 `client`설정의 `previewFeatures`에 `multischema`를 추가해주고 `db`설정에 `schemas`와 사용할 스키마를 추가해 준다. 나의 경우 nextjs에서 사용할 `app`과 `strapi`가 사용하는 `public`스키마 두개를 설정해 주었다.

```prisma
// ===== NextJS에서 관리할 새로운 테이블들 =====

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  nickname  String
  avatarUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@schema("app")
}

// ===== Strapi Views (읽기 전용) =====
// 이것들은 데이터베이스 뷰입니다. CREATE/UPDATE/DELETE 불가능

view Stories {
  id             Int       @id
  document_id    String?   @db.VarChar(255)
  title          String?   @db.VarChar(255)
  author         String?   @db.VarChar(255)
  story_summary  String?
  tags           String?
  converted_json Json?     @db.Json
  created_at     DateTime? @db.Timestamp(6)

  @@map("nextjs_stories")
  @@schema("public")
}

view Assets {
  id                      Int      @id
  document_id             String?  @db.VarChar(255)
  tag_name                String?  @db.VarChar(255)
  display_name            String?  @db.VarChar(255)
  description             String?
  usage_guide             String?
  keywords                String?
  implementation_type     String?  @db.VarChar(255)
  is_active               Boolean?
  sustain                 Boolean?
  category_name           String?  @db.VarChar(255)
  category_id             Int?
  category_description    String?
  subcategory_name        String?  @db.VarChar(255)
  subcategory_id          Int?
  subcategory_description String?
  file_name               String?  @db.VarChar(255)
  file_url                String?
  file_mime               String?  @db.VarChar(255)
  file_size               Float?
  file_id                 Int?

  @@map("nextjs_assets")
  @@schema("public")
}
```

이제부터 모델과 뷰를 추가할때 하단에 해당 모델/뷰 가 존재하는 `schema`를 `@@schema(스키마 이름)`의 형태로 추가해 주어야 한다.
지금까지의 세팅이 완료 되면 사용할수는 있다. 다만 개발의 편의성이 많이 떨어진다.

먼저 웹앱을 위한 모델을 정의하고 개발해 나가기 위해서 `bunx prisma migrate dev`를 사용하면 `public` 스키마와 `app`스키마 둘 다 migrate을 시도하게 되는데 `public`에는 이미 데이터가 존재하여 충돌 에러가 나타난다. 그리고 이것을 해결하겠다고 `reset`을 하면? 데이터가 날아가게 된다.
`public`에 있는 데이터는 무조건 적으로 `strapi`와 `n8n`을 통해 관리가 되기 때문에 `migrate`이 필요가 없다.

이 문제를 해결하기 위해서는 `migrate`을 진행할때는 Strapi에 해당하는 뷰들을 지우고 multischema의 스키마부분에서도 public을 삭제하고 진행하고 타입을 위해 generate을 할때에만 다시 추가하여 `bunx prisma generate`을 진행해주어야 한다.

#### Prisma 개발환경을 위한 스크립트 만들기

Claude의 도움을 받아 `migrate dev`를 할때는 불필요한 부분을 삭제하는 스크립트를 만들어서 `package.json`에 실행어로 등록해 주었다.

```javascript
#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, "../prisma/schema.prisma");
const migrationSchemaPath = path.join(
  __dirname,
  "../prisma/schema.migration.prisma",
);

console.log("🔄 Preparing migration schema...");

try {
  // Read the original schema
  const schemaContent = fs.readFileSync(schemaPath, "utf8");

  // Parse and modify the schema
  let modifiedSchema = schemaContent;

  // 1. Change schemas from ["app", "public"] to ["app"]
  modifiedSchema = modifiedSchema.replace(
    /schemas\s*=\s*\[[^\]]+\]/g,
    'schemas   = ["app"]',
  );

  // 2. Remove views feature from previewFeatures
  modifiedSchema = modifiedSchema.replace(
    /previewFeatures\s*=\s*\[[^\]]+\]/g,
    (match) => {
      const features = match
        .match(/\[([^\]]+)\]/)[1]
        .split(",")
        .map((f) => f.trim())
        .filter((f) => !f.includes("views"))
        .join(", ");
      return features ? `previewFeatures = [${features}]` : "";
    },
  );

  // 3. Remove all view blocks and Strapi comments
  // First, find where Strapi Views section starts
  const strapiCommentStart = modifiedSchema.indexOf("// ===== Strapi Views");

  if (strapiCommentStart !== -1) {
    // Keep everything before the Strapi comment
    modifiedSchema = modifiedSchema.substring(0, strapiCommentStart).trimEnd();
  }

  // Write the modified schema to migration file
  fs.writeFileSync(migrationSchemaPath, modifiedSchema);

  console.log("✅ Migration schema prepared!");

  // Run migration with the migration schema
  const migrationName = process.argv[2];
  const command = migrationName
    ? `bunx prisma migrate dev --schema=${migrationSchemaPath} --name ${migrationName}`
    : `bunx prisma migrate dev --schema=${migrationSchemaPath}`;

  console.log("🔄 Running Prisma migration...");
  execSync(command, { stdio: "inherit" });

  console.log("✅ Migration completed successfully!");

  // Generate client with the full schema (with views)
  console.log("🔄 Generating Prisma client with views...");
  execSync("bunx prisma generate", { stdio: "inherit" });

  console.log("✅ Prisma client generated successfully!");

  // Clean up the temporary migration schema file
  fs.unlinkSync(migrationSchemaPath);
  console.log("🧹 Cleaned up temporary files");
} catch (error) {
  console.error("❌ Error during migration:", error.message);

  // Clean up on error
  if (fs.existsSync(migrationSchemaPath)) {
    fs.unlinkSync(migrationSchemaPath);
  }

  process.exit(1);
}
```

#### 타입 생성이 제대로 동작하지 않는 문제 해결하기

지금까지의 세팅에서 사용하는 `view`와 `multischema`는 `previewFeatures`로서 아직 안정적이지 않은것으로 보인다.
이때문에 해당 기능을 사용하지 않을때 `bunx prisma generate`를 통해 새로운 타입을 생성하면 바로바로 적용이 되어 prisma client에서 lsp를 통해 접근이 가능하지만.

`previewFeatures`을 사용할때에는 제대로 적용이 되지 않았다.

해당 문제를 해결하기 위해선 `node_modules/@prisma/client`폴더를 삭제해 캐시를 삭제하고 다시 생성해주어야 한다.

이 부분도 개발의 편의성을 위해 Claude를 통해 스크립트를 만들었다.

```javascript
#!/usr/bin/env node
const { execSync } = require("child_process");
const { rmSync } = require("fs");
const path = require("path");

console.log("🔄 Generating Prisma client with views...");

try {
  // Clean up existing Prisma client
  const clientPaths = [
    path.join(process.cwd(), "node_modules", ".prisma"),
    path.join(process.cwd(), "node_modules", "@prisma", "client"),
  ];

  console.log("🧹 Cleaning up existing Prisma client...");
  clientPaths.forEach((clientPath) => {
    try {
      rmSync(clientPath, { recursive: true, force: true });
      console.log(`  ✓ Removed ${path.relative(process.cwd(), clientPath)}`);
    } catch (err) {
      // Ignore if doesn't exist
    }
  });

  // Generate client with the full schema (with views)
  execSync("bunx prisma generate", { stdio: "inherit" });

  console.log("✅ Prisma client generated successfully with views!");
} catch (error) {
  console.error("❌ Error during generation:", error.message);

  process.exit(1);
}
```

## Prisma를 통해 뷰 접근하여 테스트하기

에셋들을 불러와 테스트하기 위해 페이지를 만들었다.

```tsx
async function getAudioAssets() {
  const audioAssets = await prisma.assets.findMany({
    where: {
      category_name: ASSET_CATEGORIES.AMBIENCE,
    },
  });
  return audioAssets;
}
```

해당 함수를 통해 SQL View 를 잘 불러올 수 있었는지 확인해 보았고 결과적으로 아주 잘 동작 하였다.

![sql view 연결 테스트](_assets/attachments/괴담집/sqlview-test.png)

이제 프로젝트를 위한 기본적인 DB와의 연결은 완료 되었다.
