#!/usr/bin/env python3
import os
import shutil
import tempfile
import re
import subprocess
import yaml
import json
from pathlib import Path
from typing import List, Optional


# 프로젝트 루트 경로 계산
SCRIPT_DIR = Path(__file__).parent  # 스크립트가 있는 디렉토리
PROJECT_ROOT = SCRIPT_DIR.parent  # 프로젝트 루트 디렉토리


# 환경 변수 설정 - 항상 프로젝트 루트의 .env 파일 사용
def load_env():
    env_file = PROJECT_ROOT / ".env"
    if env_file.exists():
        with open(env_file, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    key, value = line.split("=", 1)
                    os.environ[key] = value


# 설정 - 모든 상대 경로를 프로젝트 루트 기준으로 변경
def get_config():
    source_dir = os.environ.get(
        "NOTES_SOURCE_DIR", os.path.expanduser("~/vaults/notes")
    )
    return {
        "source_dir": source_dir,
        "post_base": str(PROJECT_ROOT / "content/posts"),  # 절대 경로로 변경
        "img_base": str(PROJECT_ROOT / "public/postImg"),  # 절대 경로로 변경
        "link_map": str(PROJECT_ROOT / "public/link-map.json"),  # 절대 경로로 변경
        "meta_data": str(PROJECT_ROOT / "public/meta-data.json"),  # 절대 경로로 변경
        "ignore_dirs": [".obsidian"] + os.environ.get("IGNORED_DIRS", "").split(","),
    }


# 프론트매터 유효성 검사
def validate_frontmatter(file_path: Path) -> Optional[dict]:
    content = file_path.read_text(encoding="utf-8")
    if not content.startswith("---"):
        print(f"❌ 유효하지 않은 프론트매터: {file_path.name}")
        return None

    # 프론트매터 추출
    match = re.search(r"^---\n(.*?)\n---", content, re.DOTALL)
    if not match:
        print(f"❌ 유효하지 않은 프론트매터: {file_path.name}")
        return None

    try:
        frontmatter = yaml.safe_load(match.group(1))
        return frontmatter
    except yaml.YAMLError:
        print(f"❌ YAML 문법 오류: {file_path.name}")
        return None


# 링크된 파일 추출
def extract_linked_files(content: str) -> List[str]:
    return re.findall(r"\[\[([^|\]]+\.md)(?:\|[^\]]+)?\]\]", content)


# 메인 함수
def sync_notes():
    load_env()
    config = get_config()

    # 임시 디렉토리 생성
    with (
        tempfile.TemporaryDirectory() as tmp_post_dir,
        tempfile.TemporaryDirectory() as tmp_img_dir,
    ):
        processed_files = {}
        publish_map = {}

        # 노트 처리 함수
        def process_note(md_file: Path, relative_path: Optional[str] = None):
            if relative_path is None:
                relative_path = str(md_file.relative_to(Path(config["source_dir"])))

            if relative_path in processed_files:
                return

            processed_files[relative_path] = True

            # 파일 내용 읽기
            try:
                content = md_file.read_text(encoding="utf-8")
            except Exception as e:
                print(f"❌ 파일 읽기 오류: {md_file.name} - {e}")
                return

            frontmatter = validate_frontmatter(md_file)
            if not frontmatter:
                return

            publish = frontmatter.get("publish")
            if not publish:
                print(f"⏸️ 건너뜀: {md_file.name} (publish 필드 없음)")
                return

            # 안전한 경로 생성
            safe_publish = re.sub(r"[^a-zA-Z0-9/._-]", "", publish)
            post_dir = Path(tmp_post_dir) / safe_publish
            img_dir = Path(tmp_img_dir) / safe_publish
            post_dir.mkdir(parents=True, exist_ok=True)
            img_dir.mkdir(parents=True, exist_ok=True)

            # 파일 복사
            shutil.copy(md_file, post_dir / md_file.name)
            print(f"✅ 게시됨: {safe_publish}/{md_file.name}")

            # 매핑 추가
            publish_map[relative_path] = f"{safe_publish}/{md_file.stem}"
            print(f"매핑 추가: {relative_path} -> {publish_map[relative_path]}")

            # 이미지 처리
            for img_path in re.findall(r"!\[.*?\]\(([^)]+)\)", content):
                if img_path.startswith(("http://", "https://")):
                    continue

                img_name = os.path.basename(img_path)
                # 이미지 파일 찾기 및 복사
                found = False
                for root, _, files in os.walk(config["source_dir"]):
                    if ".obsidian" in root:
                        continue
                    if img_name in files:
                        shutil.copy(os.path.join(root, img_name), img_dir / img_name)
                        found = True
                        break

                if not found:
                    print(
                        f"⚠️ 이미지 파일을 찾을 수 없음: {img_name} (from {md_file.name})"
                    )

            # 링크된 파일 처리
            for linked_file in extract_linked_files(content):
                if linked_file.startswith("/"):
                    linked_abs_path = Path(config["source_dir"]) / linked_file.lstrip(
                        "/"
                    )
                else:
                    linked_abs_path = md_file.parent / linked_file

                if linked_abs_path.exists():
                    process_note(linked_abs_path)
                else:
                    print(
                        f"⚠️ 링크된 파일을 찾을 수 없음: {linked_file} (from {md_file.name})"
                    )

        # 게시 가능한 노트 검색
        print("📄 게시 가능한 노트 검색 중...")
        source_path = Path(config["source_dir"])
        for md_file in source_path.glob("**/*.md"):
            # 무시 디렉토리 확인
            if any(
                ignore in str(md_file) for ignore in config["ignore_dirs"] if ignore
            ):
                continue
            relative_path = str(md_file.relative_to(source_path))
            process_note(md_file, relative_path)

        # 링크 매핑 파일 생성
        print("📝 링크 매핑 및 메타데이터 파일 생성 중...")
        link_map_path = Path(tmp_post_dir) / "link-map.json"
        meta_data_path = Path(tmp_post_dir) / "meta-data.json"

        # 링크 맵 생성
        with open(link_map_path, "w", encoding="utf-8") as f:
            f.write("{\n")
            if not publish_map:
                f.write('  "_empty": "true"\n')
            else:
                for i, (orig_path, publish_path) in enumerate(publish_map.items()):
                    f.write(f'  "{orig_path}": "{publish_path}"')
                    if i < len(publish_map) - 1:
                        f.write(",\n")
                    else:
                        f.write("\n")
            f.write("}\n")

        # 메타데이터 생성
        with open(meta_data_path, "w", encoding="utf-8") as f:
            f.write("[\n")
            for i, (orig_path, publish_path) in enumerate(publish_map.items()):
                md_file = Path(config["source_dir"]) / orig_path
                if md_file.exists():
                    frontmatter = validate_frontmatter(md_file)
                    if frontmatter:
                        title = md_file.stem
                        summary = frontmatter.get("summary", "")
                        image = frontmatter.get("image", "")
                        tags_raw = frontmatter.get("tags", [])
                        tags = tags_raw if isinstance(tags_raw, list) else [tags_raw]
                        created_at = frontmatter.get("createdAt", "")
                        modified_at = frontmatter.get("modifiedAt", "")
                        series = frontmatter.get("series", "")

                        f.write(f'''  {{
                            "urlPath": "{publish_path}",
                            "title": "{title}",
                            "summary": "{summary}",
                            "image": "{image}",
                            "tags": {json.dumps(tags)},
                            "series": "{series}",
                            "createdAt": "{created_at}",
                            "modifiedAt": "{modified_at}"
                        }}''')
                        if i < len(publish_map) - 1:
                            f.write(",\n")
                        else:
                            f.write("\n")
            f.write("]\n")

        # 콘텐츠 동기화
        print("🔄 콘텐츠 동기화 중...")
        os.makedirs(config["post_base"], exist_ok=True)
        os.makedirs(config["img_base"], exist_ok=True)
        os.makedirs(os.path.dirname(config["link_map"]), exist_ok=True)

        # rsync 명령어 실행
        subprocess.run(
            [
                "rsync",
                "-a",
                "--delete",
                "--exclude=link-map.json",
                "--exclude=meta-data.json",
                f"{tmp_post_dir}/",
                config["post_base"],
            ]
        )
        subprocess.run(
            ["rsync", "-a", "--delete", f"{tmp_img_dir}/", config["img_base"]]
        )

        # 매핑 파일 복사
        shutil.copy(link_map_path, config["link_map"])
        shutil.copy(meta_data_path, config["meta_data"])

        # 결과 출력
        post_count = len(list(Path(config["post_base"]).glob("**/*.md")))
        print(f"🚀 동기화 완료! 게시된 포스트: {post_count}개")


if __name__ == "__main__":
    sync_notes()
