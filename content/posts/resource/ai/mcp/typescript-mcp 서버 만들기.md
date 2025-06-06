---
tags:
  - ai
  - mcp
  - quickstart
createdAt: 2025-05-28 10:08:43
modifiedAt: 2025-05-29 16:16:52
publish: resource/ai/mcp
related: ""
series: ""
---

# typescript-mcp 서버 만들기

mcp 서버를 쉽고 빠르게 만들기 위해 SDK 를 사용하는것이 좋다.

> [!info]
> SDK 를 지원하는 언어는 다음과 같다.
>
> 1.  Typescript SDK
> 2.  Python SDK
> 3.  Java SDK
> 4.  Kotlin SDK
> 5.  C# SDK
>
> 위의 리스트에 포함되어 있지 않은 경우에도 커뮤니티에서 다른 언어를 위한 프레임워크들을 만든 경우가 있기 때문에 검토해보는 것이 좋다.
>
> 출처: [Model Context Protocol](https://github.com/modelcontextprotocol)

## SDK 설치

- `Typescript`

  ```bash
  bun install @modelcontextprotocol/sdk
  ```

## MCP 서버 개발의 기본 구조

- MCP 서버 인스턴스 생성

  ```typescript
  import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

  // MCP 서버 인스턴스 생성
  const server = new McpServer({
    name: "My Server",
    version: "1.0.0",
  });
  // 이 아래에 도구, 리소스, 프롬트 등 서버 설정을 하면 된다.
  ```

- MCP 서버의 툴 등록

  ```typescript
  // 간단한 계산 도구
  server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }],
  }));

  // 비동기 작업 도구
  server.tool("fetch-weather", { city: z.string() }, async ({ city }) => {
    const response = await fetch(`https://api.weather.com/${city}`);
    const data = await response.text();
    return {
      content: [{ type: "text", text: data }],
    };
  });
  ```

- MCP 서버의 리소스 등록

  ```typescript
  server.resource("config", "config://app", async (uri) => ({
    contents: [
      {
        uri: uri.href,
        text: "앱 설정 정보",
      },
    ],
  }));
  // 동적 리소스 (매개변수 사용)
  server.resource(
    "user-profile",
    new ResourceTemplate("users://{userId}/profile", { list: undefined }),
    async (uri, { userId }) => ({
      contents: [
        {
          uri: uri.href,
          text: `${userId} 사용자의 프로필 데이터`,
        },
      ],
    }),
  );
  ```

- Prompt 정의

  ```typescript
  server.prompt("review-code", { code: z.string() }, ({ code }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `다음 코드를 검토해주세요:\n\n${code}`,
        },
      },
    ],
  }));
  ```

> [!info]
> tool 의 경우 ai 모델이 자동적으로 사용하게 되며 리소스 혹은 프롬프트의 경우 첨부 파일의 형태로 사용하게 된다.
> ![mcp-prompt](../_assets/attachments/mcp-prompt.png)

- MCP 서버 시작

  ```typescript
  import {
    McpServer,
    ResourceTemplate,
  } from "@modelcontextprotocol/sdk/server/mcp.js";
  import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
  import { z } from "zod";

  //여기에 도구 등록 및 리소스 등록

  // 표준 입출력 전송 방식으로 연결
  const transport = new StdioServerTransport();
  await server.connect(transport);
  ```

## MCP 개발 빠르게 시작하기

```typescript
import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Demo",
  version: "1.0.0",
});

// Add an addition tool
server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
  content: [{ type: "text", text: String(a + b) }],
}));

// Add a dynamic greeting resource
server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Hello, ${name}!`,
      },
    ],
  }),
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
```
