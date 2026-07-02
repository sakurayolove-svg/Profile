#!/usr/bin/env python3
"""校验个人网站备份 JSON 格式是否正确。"""

import argparse
import json
import sys
from pathlib import Path
from typing import Any


def validate(data: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    if not isinstance(data, dict):
        errors.append("备份数据必须是对象")
        return errors

    if "pages" not in data:
        errors.append("缺少 pages 字段")
    elif not isinstance(data["pages"], dict):
        errors.append("pages 必须是对象")
    else:
        for page_id, page in data["pages"].items():
            for key in ("id", "title", "description", "items"):
                if key not in page:
                    errors.append(f"页面 {page_id} 缺少 {key}")
            if "items" in page and isinstance(page["items"], list):
                for idx, item in enumerate(page["items"]):
                    for key in ("id", "title", "content", "files", "order", "createdAt", "updatedAt"):
                        if key not in item:
                            errors.append(f"页面 {page_id} 条目 {idx} 缺少 {key}")

    if "pageMetas" in data and isinstance(data["pageMetas"], list):
        for idx, meta in enumerate(data["pageMetas"]):
            for key in ("id", "title", "description", "icon", "order"):
                if key not in meta:
                    errors.append(f"pageMetas[{idx}] 缺少 {key}")

    if "profile" in data and isinstance(data["profile"], dict):
        profile = data["profile"]
        for key in ("name", "bio", "email", "location", "avatar", "socials"):
            if key not in profile:
                errors.append(f"profile 缺少 {key}")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="校验网站备份格式")
    parser.add_argument("backup", type=Path, help="备份 JSON 文件路径")
    args = parser.parse_args()

    if not args.backup.exists():
        print(f"文件不存在：{args.backup}", file=sys.stderr)
        return 1

    try:
        data = json.loads(args.backup.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"JSON 解析失败：{e}", file=sys.stderr)
        return 1

    errors = validate(data)
    if errors:
        print("校验失败：")
        for err in errors:
            print(f"  - {err}")
        return 1

    print("备份格式正确")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
