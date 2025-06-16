---
tags:
  - area
  - blog
createdAt: 2025-06-15 19:53:14
modifiedAt: 2025-06-16 19:50:57
publish: 영역/블로그
related: ""
series: ""
---

# Archive로 이동시킨 노트들을 블로그에 포스팅할때 문제

이미 완료된 프로젝트들을 archive로 이동시키고 나서 깨달았다. publish 값에 이미 수동으로 노트 하나하나씩 설정해 뒀는데 archive로 옮기면 모든 노트를 수동으로 전부 고쳐야하네?

그냥 `claude code`를 사용해서 `python` 스크립트를 고치기로 했다.

## archive 폴더의 파일인 경우 publish 경로 변환 기능 추가

```python
def process_note(md_file: Path, relative_path: Optional[str] = None):
  # 줄 144-151

  if "4.archive" in str(md_file):
    # publish 경로에서 첫 번째 부분을 "저장소"로 변경
    publish_parts = publish.split("/")
    if len(publish_parts) > 0 and publish_parts[0] in ["자원", "프로젝트", "영역"]:
      publish_parts[0] = "저장소"
      publish = "/".join(publish_parts)
      print(f"📦 아카이브 파일 publish 경로 변환: {frontmatter.get('publish')} -> {publish}")
```

## archive 폴더의 파일인 경우 'archive' 태그 추가

```python
# 줄 265-267
if "4.archive" in orig_path:
  if 'archive' not in tags:
    tags.append('archive')
```
