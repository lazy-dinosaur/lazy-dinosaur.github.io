---
tags:
  - resource
  - web
createdAt: 2025-04-15 15:05:31
modifiedAt: 2025-04-15 17:54:01
publish: 자원/웹개발
related: ""
series: ""
---

# HTTP(Hypertext Transfer Protocol)

HTTP(Hypertext Transfer Protocol)는 웹에서 데이터를 주고받기 위한 애플리케이션 계층 프로토콜 이다. 클라이언트와 서버 간의 통신을 담당한다.

## 주요 특징

- 무상태성-각 요청은 독립적으로 처리되며, 서버는 이전 요청에대한 정보를 저장하지 않는다.
- 비연결성-요청-응답 후 연결을 끊는다. (HTTP/1.1에서는 연결을 유지할 수 있음)
- 요청/응답구조-클라이언트가 요청을보내면, 서버는 응답을 반환한다.

> [!tip]
> 무상태성 이라는 특성 때문에 서버는 클라이언트와 재 연결이 되도 클라이언트를 식별하지 못한다. 그 문제를 해결하기 위해서 쿠키와 세션이라는 개념이 등장했다.

## HTTP의 요청-응답

HTTP 요청과 응답은 둘 다 각각 세부분으로 구성된다

### HTTP 요청

1. 요청라인
   <!-- TODO: HTTP-Methods 페이지 완성하기-->

   - [[HTTP-Methods|HTTP 메소드]]-수행할 작업 유형(GET,POST 등)
   - URI(Uniform Resource Identifier)-요청하는 리소스의 경로
   - HTTP 버전-사용하는 HTTP 프로토콜 버전

   예) `GET /index.html HTTP/1.1`

2. 헤더-요청에 대한 추가 정보를 제공하는 키-값

   - `Host`-요청을 보내는 서버의 도메인 이름
   - `User-Agent`-클라이언트 프로그래 정보(브라우저 종류 등)
   - `Accept`-클라이언트가 처리할 수 있는 콘텐츠 유형
   - `Content-Type`-요청 본문의 미디어 타입
   - `Cookie`-서버에서 이전에 설정한 쿠키 정보

   ```http 예시
   Host: www.example.com
   User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
   Accept: text/html,application/xhtml+xml
   Content-Type: application/json
   Cookie: session=abc123
   ```

3. 본문- 주로 POST 나 PUT 메소드에서 서버로 보내는 데이터를 포함한다. GET 요청은 일반적으로 본문이 없다.

   ```json 예시
   {
     "username": "user123",
     "password": "securepass"
   }
   ```

### HTTP 응답

1. 상태 라인
   <!-- TODO: 상태코드 페이지 완성하기 -->

   - HTTP 버전-사용된 HTTP 프로토콜 버전
   - [[HTTP-Statuscode|상태코드]]-요청 처리 결과를 나타내는 3자리 숫자
   - 상태 메시지-상태 코드에 대한 간략한 설명

2. 헤더-응답에 대한 추가 정보를 제공하는 키-값 쌍
   - `Content-Type`-응답 본문의 미디어 타입
   - `Content-Length`-응답 본문의 크기
   - `Server`-서버 소프트웨어 정보
   - `Set-Cookie`-클라이언트에 저장할 쿠키 정보
