#!/usr/bin/env python3
"""静态站点生成器：从 content/ 下的 Markdown + 资源生成 HTML 站点。"""

import argparse
import shutil
import sys
from pathlib import Path
from typing import Any

import markdown
import yaml
from jinja2 import Environment, FileSystemLoader

ROOT = Path(__file__).parent
CONTENT_DIR = ROOT / "content"
TEMPLATE_DIR = ROOT / "templates"
STATIC_DIR = ROOT / "static"
OUTPUT_DIR = ROOT / "dist"


def load_markdown(path: Path) -> tuple[dict[str, Any], str]:
    text = path.read_text(encoding="utf-8")
    if text.startswith("---"):
        _, frontmatter, body = text.split("---", 2)
        meta = yaml.safe_load(frontmatter) or {}
    else:
        meta = {}
        body = text
    return meta, body.strip()


def discover_pages() -> list[dict[str, Any]]:
    pages = []
    for folder in sorted(CONTENT_DIR.iterdir()):
        if not folder.is_dir():
            continue
        md_file = folder / "index.md"
        if not md_file.exists():
            continue
        meta, body = load_markdown(md_file)
        page_id = folder.name
        if page_id == "home":
            continue
        pages.append({
            "id": page_id,
            "title": meta.get("title", page_id),
            "description": meta.get("description", ""),
            "icon": meta.get("icon", "FolderGit"),
            "order": meta.get("order", 999),
            "entries": meta.get("items", []),
            "body_html": markdown.markdown(body, extensions=["extra", "toc"]),
            "folder": folder,
            "images": [f.name for f in folder.iterdir() if f.is_file() and f.suffix.lower() in ('.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg')],
            "pdfs": [f.name for f in folder.iterdir() if f.is_file() and f.suffix.lower() == '.pdf'],
        })
    pages.sort(key=lambda p: p["order"])
    return pages


def load_home() -> dict[str, Any]:
    home_dir = CONTENT_DIR / "home"
    md_file = home_dir / "index.md"
    md = markdown.Markdown(extensions=["extra", "toc"])
    if not md_file.exists():
        return {
            "name": "Your Name",
            "bio": "Your bio...",
            "about": "Write something about yourself...",
            "email": "",
            "location": "",
            "avatar": "",
            "socials": [],
            "siteTitle": "魔术师小站",
            "aboutTitle": "About Me",
        }
    meta, _ = load_markdown(md_file)
    return {
        "name": meta.get("name", "Your Name"),
        "bio": meta.get("bio", "Your bio..."),
        "about": md.convert(meta.get("about", "Write something about yourself...")),
        "email": meta.get("email", ""),
        "location": meta.get("location", ""),
        "avatar": meta.get("avatar", ""),
        "socials": meta.get("socials", []),
        "siteTitle": meta.get("siteTitle", "魔术师小站"),
        "aboutTitle": meta.get("aboutTitle", "About Me"),
    }


def copy_assets(pages: list[dict[str, Any]]) -> None:
    for page in pages:
        src = page["folder"]
        dst = OUTPUT_DIR / page["id"]
        dst.mkdir(parents=True, exist_ok=True)
        for f in src.iterdir():
            if f.name == "index.md":
                continue
            if f.is_file():
                shutil.copy2(f, dst / f.name)

    # Home assets
    home_dir = CONTENT_DIR / "home"
    if home_dir.exists():
        dst = OUTPUT_DIR
        for f in home_dir.iterdir():
            if f.name == "index.md":
                continue
            if f.is_file():
                shutil.copy2(f, dst / f.name)


def build() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="/Profile/", help="Base URL path")
    args = parser.parse_args()

    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir(parents=True)

    if STATIC_DIR.exists():
        shutil.copytree(STATIC_DIR, OUTPUT_DIR / "static")

    env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
    env.globals.update({
        "base": args.base,
        "static": lambda p: f"{args.base}static/{p}",
        "page_url": lambda pid: f"{args.base}{pid}/" if pid != "home" else f"{args.base}",
    })

    pages = discover_pages()
    home = load_home()
    copy_assets(pages)

    page_template = env.get_template("page.html")
    home_template = env.get_template("home.html")

    # Build sub-pages
    for page in pages:
        html = page_template.render(home=home, pages=pages, page=page)
        out_dir = OUTPUT_DIR / page["id"]
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / "index.html").write_text(html, encoding="utf-8")

    # Build home
    html = home_template.render(home=home, pages=pages)
    (OUTPUT_DIR / "index.html").write_text(html, encoding="utf-8")

    print(f"Built {len(pages) + 1} pages to {OUTPUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(build())
