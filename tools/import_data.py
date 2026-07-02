#!/usr/bin/env python3
"""从 Markdown 或 JSON 批量生成个人网站备份文件，供浏览器导入。"""

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Optional


def parse_markdown(path: Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()

    profile = {"name": "", "bio": "", "email": "", "location": "", "avatar": "", "socials": []}
    pages: dict[str, Any] = {}
    page_metas: list[dict[str, Any]] = []

    current_page: Optional[str] = None
    current_items: list[dict[str, Any]] = []

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        if line.startswith("# "):
            profile["name"] = line[2:].strip()
            i += 1
            continue

        if line.startswith("## "):
            if current_page and current_page != "home":
                pages[current_page]["items"] = current_items
            page_title = line[3:].strip()
            page_id = re.sub(r"[^a-z0-9-]+", "-", page_title.lower()).strip("-") or f"page-{len(pages)}"
            current_page = page_id
            current_items = []
            pages[page_id] = {"id": page_id, "title": page_title, "description": "", "items": []}
            page_metas.append({"id": page_id, "title": page_title, "description": "", "icon": "FolderGit", "order": len(page_metas)})
            i += 1
            continue

        if line.startswith("### "):
            item_title = line[4:].strip()
            content_lines: list[str] = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith(("#", "###", "##")):
                content_lines.append(lines[i])
                i += 1
            content = "\n".join(content_lines).strip()
            current_items.append({
                "id": f"item-{len(current_items)}",
                "title": item_title,
                "content": content,
                "files": [],
                "order": len(current_items),
                "createdAt": 0,
                "updatedAt": 0,
            })
            continue

        if line.startswith("- 邮箱："):
            profile["email"] = line.split("：", 1)[1]
        elif line.startswith("- 地点："):
            profile["location"] = line.split("：", 1)[1]
        elif line.startswith("- [") and "](" in line:
            match = re.match(r"- \[(.+?)\]\((.+?)\)", line)
            if match:
                profile["socials"].append({
                    "id": f"social-{len(profile['socials'])}",
                    "name": match.group(1),
                    "url": match.group(2),
                    "icon": "Globe",
                })
        elif current_page is None and line:
            profile["bio"] = line

        i += 1

    if current_page and current_page != "home":
        pages[current_page]["items"] = current_items

    return {"pages": pages, "pageMetas": page_metas, "profile": profile}


def main() -> int:
    parser = argparse.ArgumentParser(description="从 Markdown 生成网站备份")
    parser.add_argument("input", type=Path, help="输入 Markdown 文件路径")
    parser.add_argument("-o", "--output", type=Path, required=True, help="输出 JSON 路径")
    args = parser.parse_args()

    if not args.input.exists():
        print(f"文件不存在：{args.input}", file=sys.stderr)
        return 1

    data = parse_markdown(args.input)
    args.output.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"已生成备份：{args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
