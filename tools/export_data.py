#!/usr/bin/env python3
"""将个人网站备份 JSON 导出为 Markdown 或整理后的 JSON。"""

import argparse
import json
import sys
from pathlib import Path
from typing import Any


def load_backup(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def to_markdown(data: dict[str, Any]) -> str:
    lines: list[str] = []
    profile = data.get("profile", {})

    lines.append(f"# {profile.get('name') or '个人网站'}")
    lines.append("")
    if profile.get("bio"):
        lines.append(profile["bio"])
        lines.append("")
    if profile.get("email"):
        lines.append(f"- 邮箱：{profile['email']}")
    if profile.get("location"):
        lines.append(f"- 地点：{profile['location']}")
    lines.append("")

    for social in profile.get("socials", []):
        lines.append(f"- [{social.get('name')}]({social.get('url')})")
    lines.append("")

    pages = data.get("pages", {})
    page_metas = {p["id"]: p for p in data.get("pageMetas", [])}

    for page_id, page_data in pages.items():
        if page_id == "home":
            continue
        meta = page_metas.get(page_id, {})
        title = page_data.get("title") or meta.get("title") or page_id
        lines.append(f"## {title}")
        if page_data.get("description"):
            lines.append(page_data["description"])
        lines.append("")

        for item in page_data.get("items", []):
            lines.append(f"### {item.get('title', '无标题')}")
            if item.get("content"):
                lines.append(item["content"])
            if item.get("files"):
                file_names = [f"{f.get('name')} ({f.get('type')})" for f in item["files"]]
                lines.append(f"附件：{', '.join(file_names)}")
            lines.append("")

    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="导出网站备份为可读格式")
    parser.add_argument("backup", type=Path, help="备份 JSON 文件路径")
    parser.add_argument("-o", "--output", type=Path, help="输出文件路径")
    parser.add_argument("-f", "--format", choices=["md", "json"], default="md", help="输出格式")
    args = parser.parse_args()

    if not args.backup.exists():
        print(f"文件不存在：{args.backup}", file=sys.stderr)
        return 1

    data = load_backup(args.backup)

    if args.format == "md":
        output = to_markdown(data)
        suffix = ".md"
    else:
        output = json.dumps(data, ensure_ascii=False, indent=2)
        suffix = ".formatted.json"

    if args.output:
        out_path = args.output
    else:
        out_path = args.backup.with_suffix(suffix)

    out_path.write_text(output, encoding="utf-8")
    print(f"已导出：{out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
