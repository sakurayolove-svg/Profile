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
    # 原代码开始
    # if text.startswith("---"):
    #     _, frontmatter, body = text.split("---", 2)
    #     meta = yaml.safe_load(frontmatter) or {}
    # else:
    #     meta = {}
    #     body = text
    # return meta, body.strip()
    # 原代码结束
    # 插入开始
    if not text.startswith("---"):
        return {}, text.strip()
    parts = text.split("---", 2)
    if len(parts) >= 3:
        frontmatter, body = parts[1], parts[2]
    else:
        rest = parts[1] if len(parts) > 1 else ""
        lines = rest.splitlines()
        cut = next((i for i, ln in enumerate(lines) if ln.startswith("## ") and not ln.startswith("## date:")), len(lines))
        frontmatter = "\n".join(lines[:cut])
        body = "\n".join(lines[cut:])
    fm = "\n".join(
        (ln[3:].lstrip() if ln.startswith("## date:") else ln) for ln in frontmatter.splitlines()
    )
    meta = yaml.safe_load(fm) or {}
    return meta, body.strip()
    # 插入结束


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


# 插入开始
def discover_projects() -> list[dict[str, Any]]:
    """从 content/projects/<slug>/index.md 加载项目详情。"""
    projects_dir = CONTENT_DIR / "projects"
    updates: list[dict[str, Any]] = []
    if not projects_dir.exists():
        return updates
    for folder in projects_dir.iterdir():
        if not folder.is_dir():
            continue
        md_file = folder / "index.md"
        if not md_file.exists():
            continue
        meta, body = load_markdown(md_file)
        raw_body = body or meta.get("content", "") or ""
        updates.append({
            "slug": folder.name,
            "date": meta.get("date", ""),
            "title": meta.get("title", folder.name),
            "image": meta.get("image", ""),
            "content": meta.get("content", ""),
            "tags": meta.get("tags") or [],
            "body": raw_body,
            "body_html": markdown.markdown(raw_body, extensions=["extra"]),
            "excerpt": clip(raw_body or meta.get("content", "") or ""),
            # 插入开始
            "action": meta.get("action") or "完成项目",
            "kind": "projects",
            # 插入结束
        })
    updates.sort(key=lambda u: u.get("date", ""), reverse=True)
    return updates
# 插入结束


# 插入开始
def discover_knowledge() -> list[dict[str, Any]]:
    """从 content/knowledge/<slug>/index.md 加载课程笔记。"""
    knowledge_dir = CONTENT_DIR / "knowledge"
    updates: list[dict[str, Any]] = []
    if not knowledge_dir.exists():
        return updates
    for folder in knowledge_dir.iterdir():
        if not folder.is_dir():
            continue
        md_file = folder / "index.md"
        if not md_file.exists():
            continue
        meta, body = load_markdown(md_file)
        raw_body = body or meta.get("content", "") or ""
        updates.append({
            "slug": folder.name,
            "date": meta.get("date", ""),
            "title": meta.get("title", folder.name),
            "image": meta.get("image", "") or "",
            "content": meta.get("content", "") or "",
            "tags": meta.get("tags") or [],
            "body": raw_body,
            "body_html": markdown.markdown(raw_body, extensions=["extra"]),
            "excerpt": clip(raw_body or meta.get("content", "") or ""),
            "action": meta.get("action") or "发布知识",
            "kind": "knowledge",
        })
    updates.sort(key=lambda u: u.get("date", ""), reverse=True)
    return updates
# 插入结束


def clip(text: str, n: int = 48) -> str:
    # 原代码开始
    # t = (text or "").strip()
    # return t if len(t) <= n else t[:n].rstrip() + "…"
    # 原代码结束
    # 插入开始
    raw = text or ""
    if "## 项目内容" in raw:
        after = raw.split("## 项目内容", 1)[1]
        if "## 负责工作" in after:
            after = after.split("## 负责工作", 1)[0]
        elif "## " in after:
            after = after.split("## ", 1)[0]
        para = next(
            (ln.strip() for ln in after.replace("![", "\n![").splitlines()
             if ln.strip() and not ln.strip().startswith(("!", "#"))),
            "",
        )
        raw = para or raw
    # 插入开始
    raw = " ".join(tok for tok in (raw or "").split() if not tok.startswith("!["))
    # 插入结束
    t = " ".join(raw.split())
    return t if len(t) <= n else t[:n].rstrip() + "…"
    # 插入结束


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
            # 插入开始
            "updates": [],
            # 插入结束
        }
    meta, _ = load_markdown(md_file)
    # 插入开始
    projects = discover_projects()
    knowledge = discover_knowledge()
    # 插入结束
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
        # 插入开始
        # 原代码开始
        # "updates": meta.get("updates") or [],
        # "updates": [
        #     {**u, "body": (u.get("body") or u.get("content", "")),
        #      "body_html": markdown.markdown(u.get("body") or u.get("content", ""), extensions=["extra"]),
        #      "excerpt": clip(" ".join((u.get("body") or u.get("content", "")).split()))}
        #     for u in (meta.get("updates") or [])
        # ],
        # 原代码结束
        # 原代码开始
        # "updates": discover_projects(),
        # 原代码结束
        "projects": projects,
        "knowledge": knowledge,
        "updates": sorted(projects + knowledge, key=lambda u: u.get("date", ""), reverse=True),
        # 插入结束
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

    # 插入开始：项目子目录配图 → dist/projects/<slug>/
    projects_dir = CONTENT_DIR / "projects"
    if projects_dir.exists():
        for folder in projects_dir.iterdir():
            if not folder.is_dir():
                continue
            dst = OUTPUT_DIR / "projects" / folder.name
            dst.mkdir(parents=True, exist_ok=True)
            for f in folder.iterdir():
                if f.name == "index.md" or not f.is_file():
                    continue
                shutil.copy2(f, dst / f.name)
    # 插入结束

    # 插入开始：知识子目录配图 → dist/knowledge/<slug>/
    knowledge_dir = CONTENT_DIR / "knowledge"
    if knowledge_dir.exists():
        for folder in knowledge_dir.iterdir():
            if not folder.is_dir():
                continue
            dst = OUTPUT_DIR / "knowledge" / folder.name
            dst.mkdir(parents=True, exist_ok=True)
            for f in folder.iterdir():
                if f.name == "index.md" or not f.is_file():
                    continue
                shutil.copy2(f, dst / f.name)
    # 插入结束


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

    # 插入开始
    update_template = env.get_template("update.html")
    # 原代码开始
    # for u in home.get("updates") or []:
    #     if not u.get("slug"):
    #         continue
    #     out_dir = OUTPUT_DIR / "projects" / u["slug"]
    #     out_dir.mkdir(parents=True, exist_ok=True)
    #     (out_dir / "index.html").write_text(
    #         update_template.render(home=home, pages=pages, update=u), encoding="utf-8"
    #     )
    # 原代码结束
    for u in home.get("updates") or []:
        if not u.get("slug"):
            continue
        out_dir = OUTPUT_DIR / (u.get("kind") or "projects") / u["slug"]
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / "index.html").write_text(
            update_template.render(home=home, pages=pages, update=u), encoding="utf-8"
        )
    # 插入结束

    # Build home
    html = home_template.render(home=home, pages=pages)
    (OUTPUT_DIR / "index.html").write_text(html, encoding="utf-8")

    print(f"Built {len(pages) + 1} pages to {OUTPUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(build())
